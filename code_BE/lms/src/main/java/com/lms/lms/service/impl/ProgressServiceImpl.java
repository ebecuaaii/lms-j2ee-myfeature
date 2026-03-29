package com.lms.lms.service.impl;

import com.lms.lms.dto.request.WatchProgressRequest;
import com.lms.lms.dto.response.CourseProgressResponse;
import com.lms.lms.dto.response.LessonProgressResponse;
import com.lms.lms.entity.Lesson;
import com.lms.lms.entity.LessonProgress;
import com.lms.lms.exception.AppException;
import com.lms.lms.repository.*;
import com.lms.lms.service.ProgressService;
import com.lms.lms.utils.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressServiceImpl implements ProgressService {

    private final LessonProgressRepository progressRepository;
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public LessonProgressResponse saveWatchProgress(String lessonId, WatchProgressRequest request,
                                                     String studentId) {
        Lesson lesson = findLessonOrThrow(lessonId);
        verifyEnrolled(studentId, lesson.getCourseId());

        // clamp lastWatchedSecond to lesson duration
        int watched = lesson.getDuration() > 0
                ? Math.min(request.getLastWatchedSecond(), lesson.getDuration())
                : request.getLastWatchedSecond();

        LessonProgress progress = findOrCreateProgress(studentId, lesson);
        progress.setLastWatchedSecond(watched);
        return mapToResponse(progressRepository.save(progress));
    }

    @Override
    public LessonProgressResponse markLessonCompleted(String lessonId, String studentId) {
        Lesson lesson = findLessonOrThrow(lessonId);
        verifyEnrolled(studentId, lesson.getCourseId());

        LessonProgress progress = findOrCreateProgress(studentId, lesson);

        // idempotent: only set completedAt on first completion
        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(Instant.now());
        }
        return mapToResponse(progressRepository.save(progress));
    }

    @Override
    public CourseProgressResponse getCourseProgress(String courseId, String studentId,
                                                     String requesterId, String role) {
        // verify course exists
        courseRepository.findByIdAndIsDeletedFalse(courseId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "Course not found"));

        // access control
        if ("STUDENT".equals(role)) {
            // student can only view own progress
            if (!requesterId.equals(studentId)) {
                throw new AppException(ResponseCode.FORBIDDEN, "Access denied");
            }
            verifyEnrolled(studentId, courseId);
        } else if ("INSTRUCTOR".equals(role)) {
            // instructor can only view progress in their own course
            courseRepository.findByIdAndInstructorIdAndIsDeletedFalse(courseId, requesterId)
                    .orElseThrow(() -> new AppException(ResponseCode.FORBIDDEN, "You do not own this course"));
        }
        // ADMIN: no restriction

        // count total active lessons in course
        long totalLessons = lessonRepository.findByCourseIdAndIsDeletedFalse(courseId).size();

        // count completed lessons
        long completedLessons = progressRepository
                .countByStudentIdAndCourseIdAndIsCompletedTrue(studentId, courseId);

        double percentage = totalLessons == 0 ? 0.0
                : Math.round((completedLessons * 100.0 / totalLessons) * 10.0) / 10.0;

        List<LessonProgressResponse> lessonProgresses = progressRepository
                .findByStudentIdAndCourseId(studentId, courseId)
                .stream().map(this::mapToResponse).toList();

        return CourseProgressResponse.builder()
                .courseId(courseId)
                .studentId(studentId)
                .totalLessons((int) totalLessons)
                .completedLessons((int) completedLessons)
                .completionPercentage(percentage)
                .lessonProgresses(lessonProgresses)
                .build();
    }

    // ---- helpers ----

    private Lesson findLessonOrThrow(String lessonId) {
        return lessonRepository.findByIdAndIsDeletedFalse(lessonId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "Lesson not found"));
    }

    private void verifyEnrolled(String studentId, String courseId) {
        if (!enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new AppException(ResponseCode.FORBIDDEN, "You are not enrolled in this course");
        }
    }

    private LessonProgress findOrCreateProgress(String studentId, Lesson lesson) {
        return progressRepository
                .findByStudentIdAndLessonId(studentId, lesson.getId())
                .orElseGet(() -> LessonProgress.builder()
                        .studentId(studentId)
                        .courseId(lesson.getCourseId())
                        .lessonId(lesson.getId())
                        .build());
    }

    private LessonProgressResponse mapToResponse(LessonProgress p) {
        return LessonProgressResponse.builder()
                .lessonId(p.getLessonId())
                .isCompleted(p.isCompleted())
                .lastWatchedSecond(p.getLastWatchedSecond())
                .completedAt(p.getCompletedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}

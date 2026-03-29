package com.lms.lms.service.impl;

import com.lms.lms.dto.request.CreateLessonRequest;
import com.lms.lms.dto.request.UpdateLessonRequest;
import com.lms.lms.dto.response.LessonResponse;
import com.lms.lms.entity.Chapter;
import com.lms.lms.entity.Lesson;
import com.lms.lms.exception.AppException;
import com.lms.lms.repository.ChapterRepository;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.LessonRepository;
import com.lms.lms.service.LessonService;
import com.lms.lms.utils.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final ChapterRepository chapterRepository;
    private final CourseRepository courseRepository;

    @Override
    public LessonResponse createLesson(String chapterId, CreateLessonRequest request,
                                       String requesterId, String role) {
        Chapter chapter = findChapterOrThrow(chapterId);
        verifyInstructorOwnsCourse(chapter.getCourseId(), requesterId, role);

        Lesson lesson = Lesson.builder()
                .chapterId(chapterId)
                .courseId(chapter.getCourseId())
                .title(request.getTitle())
                .description(request.getDescription())
                .videoUrl(request.getVideoUrl())
                .documentUrl(request.getDocumentUrl())
                .duration(request.getDuration())
                .orderIndex(request.getOrderIndex())
                .isPreview(request.isPreview())
                .build();
        return mapToResponse(lessonRepository.save(lesson));
    }

    @Override
    public List<LessonResponse> getLessonsByChapter(String chapterId) {
        return lessonRepository.findByChapterIdAndIsDeletedFalseOrderByOrderIndexAsc(chapterId)
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public LessonResponse updateLesson(String chapterId, String lessonId,
                                       UpdateLessonRequest request, String requesterId, String role) {
        Chapter chapter = findChapterOrThrow(chapterId);
        verifyInstructorOwnsCourse(chapter.getCourseId(), requesterId, role);

        Lesson lesson = findLessonOrThrow(lessonId);
        lesson.setTitle(request.getTitle());
        lesson.setDescription(request.getDescription());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setDocumentUrl(request.getDocumentUrl());
        lesson.setDuration(request.getDuration());
        lesson.setOrderIndex(request.getOrderIndex());
        lesson.setPreview(request.isPreview());
        return mapToResponse(lessonRepository.save(lesson));
    }

    @Override
    public void deleteLesson(String chapterId, String lessonId, String requesterId, String role) {
        Chapter chapter = findChapterOrThrow(chapterId);
        verifyInstructorOwnsCourse(chapter.getCourseId(), requesterId, role);

        Lesson lesson = findLessonOrThrow(lessonId);
        lesson.setDeleted(true);
        lessonRepository.save(lesson);
    }

    private Chapter findChapterOrThrow(String chapterId) {
        return chapterRepository.findByIdAndIsDeletedFalse(chapterId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "Chapter not found"));
    }

    private Lesson findLessonOrThrow(String lessonId) {
        return lessonRepository.findByIdAndIsDeletedFalse(lessonId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "Lesson not found"));
    }

    private void verifyInstructorOwnsCourse(String courseId, String requesterId, String role) {
        if ("ADMIN".equals(role)) return;
        courseRepository.findByIdAndInstructorIdAndIsDeletedFalse(courseId, requesterId)
                .orElseThrow(() -> new AppException(ResponseCode.FORBIDDEN, "You do not own this course"));
    }

    private LessonResponse mapToResponse(Lesson lesson) {
        return LessonResponse.builder()
                .id(lesson.getId())
                .chapterId(lesson.getChapterId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .videoUrl(lesson.getVideoUrl())
                .documentUrl(lesson.getDocumentUrl())
                .duration(lesson.getDuration())
                .orderIndex(lesson.getOrderIndex())
                .isPreview(lesson.isPreview())
                .build();
    }
}

package com.lms.lms.service.impl;

import com.lms.lms.dto.request.CreateCourseRequest;
import com.lms.lms.dto.request.UpdateCourseRequest;
import com.lms.lms.dto.response.CourseResponse;
import com.lms.lms.entity.Chapter;
import com.lms.lms.entity.Course;
import com.lms.lms.entity.enums.CourseStatus;
import com.lms.lms.exception.AppException;
import com.lms.lms.repository.ChapterRepository;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.LessonRepository;
import com.lms.lms.service.CourseService;
import com.lms.lms.utils.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final ChapterRepository chapterRepository;
    private final LessonRepository lessonRepository;

    @Override
    public CourseResponse createCourse(CreateCourseRequest request, String instructorId) {
        Course course = Course.builder()
                .instructorId(instructorId)
                .title(request.getTitle())
                .description(request.getDescription())
                .thumbnailUrl(request.getThumbnailUrl())
                .price(request.getPrice())
                .categoryId(request.getCategoryId())
                .status(CourseStatus.DRAFT)
                .build();
        return mapToResponse(courseRepository.save(course));
    }

    @Override
    public List<CourseResponse> getPublishedCourses() {
        return courseRepository.findByStatusAndIsDeletedFalse(CourseStatus.PUBLISHED)
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public List<CourseResponse> getCoursesByInstructor(String instructorId) {
        return courseRepository.findByInstructorIdAndIsDeletedFalse(instructorId)
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public CourseResponse getCourseById(String courseId, String requesterId, String role) {
        Course course = findCourseOrThrow(courseId);
        if ("STUDENT".equals(role) && course.getStatus() != CourseStatus.PUBLISHED) {
            throw new AppException(ResponseCode.NOT_FOUND, "Course not found");
        }
        return mapToResponse(course);
    }

    @Override
    public CourseResponse updateCourse(String courseId, UpdateCourseRequest request,
                                       String requesterId, String role) {
        Course course = findCourseAndCheckOwnership(courseId, requesterId, role);
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setThumbnailUrl(request.getThumbnailUrl());
        course.setPrice(request.getPrice());
        course.setCategoryId(request.getCategoryId());
        return mapToResponse(courseRepository.save(course));
    }

    @Override
    public void deleteCourse(String courseId, String requesterId, String role) {
        Course course = findCourseAndCheckOwnership(courseId, requesterId, role);

        // soft delete all lessons in this course
        lessonRepository.findByCourseIdAndIsDeletedFalse(courseId)
                .forEach(lesson -> {
                    lesson.setDeleted(true);
                    lessonRepository.save(lesson);
                });

        // soft delete all chapters in this course
        chapterRepository.findByCourseIdAndIsDeletedFalseOrderByOrderIndexAsc(courseId)
                .forEach(chapter -> {
                    chapter.setDeleted(true);
                    chapterRepository.save(chapter);
                });

        // soft delete course
        course.setDeleted(true);
        courseRepository.save(course);
    }

    @Override
    public CourseResponse publishCourse(String courseId, String requesterId, String role) {
        Course course = findCourseAndCheckOwnership(courseId, requesterId, role);
        course.setStatus(CourseStatus.PUBLISHED);
        return mapToResponse(courseRepository.save(course));
    }

    private Course findCourseOrThrow(String courseId) {
        return courseRepository.findByIdAndIsDeletedFalse(courseId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "Course not found"));
    }

    private Course findCourseAndCheckOwnership(String courseId, String requesterId, String role) {
        Course course = findCourseOrThrow(courseId);
        if (!"ADMIN".equals(role) && !course.getInstructorId().equals(requesterId)) {
            throw new AppException(ResponseCode.FORBIDDEN, "You do not own this course");
        }
        return course;
    }

    private CourseResponse mapToResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .instructorId(course.getInstructorId())
                .title(course.getTitle())
                .description(course.getDescription())
                .thumbnailUrl(course.getThumbnailUrl())
                .price(course.getPrice())
                .status(course.getStatus())
                .categoryId(course.getCategoryId())
                .createdAt(course.getCreatedAt())
                .build();
    }
}

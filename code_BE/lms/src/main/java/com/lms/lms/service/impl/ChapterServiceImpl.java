package com.lms.lms.service.impl;

import com.lms.lms.dto.request.CreateChapterRequest;
import com.lms.lms.dto.request.UpdateChapterRequest;
import com.lms.lms.dto.response.ChapterResponse;
import com.lms.lms.entity.Chapter;
import com.lms.lms.exception.AppException;
import com.lms.lms.repository.ChapterRepository;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.LessonRepository;
import com.lms.lms.service.ChapterService;
import com.lms.lms.utils.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChapterServiceImpl implements ChapterService {

    private final ChapterRepository chapterRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    @Override
    public ChapterResponse createChapter(String courseId, CreateChapterRequest request,
                                         String requesterId, String role) {
        verifyInstructorOwnsCourse(courseId, requesterId, role);
        Chapter chapter = Chapter.builder()
                .courseId(courseId)
                .title(request.getTitle())
                .description(request.getDescription())
                .orderIndex(request.getOrderIndex())
                .build();
        return mapToResponse(chapterRepository.save(chapter));
    }

    @Override
    public List<ChapterResponse> getChaptersByCourse(String courseId) {
        return chapterRepository.findByCourseIdAndIsDeletedFalseOrderByOrderIndexAsc(courseId)
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public ChapterResponse updateChapter(String courseId, String chapterId,
                                         UpdateChapterRequest request, String requesterId, String role) {
        verifyInstructorOwnsCourse(courseId, requesterId, role);
        Chapter chapter = findChapterOrThrow(chapterId);
        chapter.setTitle(request.getTitle());
        chapter.setDescription(request.getDescription());
        chapter.setOrderIndex(request.getOrderIndex());
        return mapToResponse(chapterRepository.save(chapter));
    }

    @Override
    public void deleteChapter(String courseId, String chapterId, String requesterId, String role) {
        verifyInstructorOwnsCourse(courseId, requesterId, role);
        Chapter chapter = findChapterOrThrow(chapterId);

        // soft delete all lessons in this chapter
        lessonRepository.findByChapterIdAndIsDeletedFalseOrderByOrderIndexAsc(chapterId)
                .forEach(lesson -> {
                    lesson.setDeleted(true);
                    lessonRepository.save(lesson);
                });

        // soft delete chapter
        chapter.setDeleted(true);
        chapterRepository.save(chapter);
    }

    private Chapter findChapterOrThrow(String chapterId) {
        return chapterRepository.findByIdAndIsDeletedFalse(chapterId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "Chapter not found"));
    }

    private void verifyInstructorOwnsCourse(String courseId, String requesterId, String role) {
        if ("ADMIN".equals(role)) return;
        courseRepository.findByIdAndInstructorIdAndIsDeletedFalse(courseId, requesterId)
                .orElseThrow(() -> new AppException(ResponseCode.FORBIDDEN, "You do not own this course"));
    }

    private ChapterResponse mapToResponse(Chapter chapter) {
        return ChapterResponse.builder()
                .id(chapter.getId())
                .courseId(chapter.getCourseId())
                .title(chapter.getTitle())
                .description(chapter.getDescription())
                .orderIndex(chapter.getOrderIndex())
                .build();
    }
}

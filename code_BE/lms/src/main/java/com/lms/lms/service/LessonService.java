package com.lms.lms.service;

import com.lms.lms.dto.request.CreateLessonRequest;
import com.lms.lms.dto.request.UpdateLessonRequest;
import com.lms.lms.dto.response.LessonResponse;

import java.util.List;

public interface LessonService {
    LessonResponse createLesson(String chapterId, CreateLessonRequest request, String requesterId, String role);
    List<LessonResponse> getLessonsByChapter(String chapterId);
    LessonResponse updateLesson(String chapterId, String lessonId, UpdateLessonRequest request, String requesterId, String role);
    void deleteLesson(String chapterId, String lessonId, String requesterId, String role);
}

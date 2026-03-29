package com.lms.lms.service;

import com.lms.lms.dto.request.CreateChapterRequest;
import com.lms.lms.dto.request.UpdateChapterRequest;
import com.lms.lms.dto.response.ChapterResponse;

import java.util.List;

public interface ChapterService {
    ChapterResponse createChapter(String courseId, CreateChapterRequest request, String requesterId, String role);
    List<ChapterResponse> getChaptersByCourse(String courseId);
    ChapterResponse updateChapter(String courseId, String chapterId, UpdateChapterRequest request, String requesterId, String role);
    void deleteChapter(String courseId, String chapterId, String requesterId, String role);
}

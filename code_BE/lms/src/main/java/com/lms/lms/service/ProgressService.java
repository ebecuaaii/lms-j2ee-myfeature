package com.lms.lms.service;

import com.lms.lms.dto.request.WatchProgressRequest;
import com.lms.lms.dto.response.CourseProgressResponse;
import com.lms.lms.dto.response.LessonProgressResponse;

public interface ProgressService {

    // STUDENT: save watch position
    LessonProgressResponse saveWatchProgress(String lessonId, WatchProgressRequest request, String studentId);

    // STUDENT: mark lesson as completed
    LessonProgressResponse markLessonCompleted(String lessonId, String studentId);

    // get full course progress for a specific student
    CourseProgressResponse getCourseProgress(String courseId, String studentId, String requesterId, String role);
}

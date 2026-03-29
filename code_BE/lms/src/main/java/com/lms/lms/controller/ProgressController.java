package com.lms.lms.controller;

import com.lms.lms.dto.request.WatchProgressRequest;
import com.lms.lms.dto.response.ApiResponse;
import com.lms.lms.dto.response.CourseProgressResponse;
import com.lms.lms.dto.response.LessonProgressResponse;
import com.lms.lms.service.ProgressService;
import com.lms.lms.utils.ApiResponseUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    // STUDENT: save watch position
    @PostMapping("/lessons/{lessonId}/watch")
    public ResponseEntity<ApiResponse<LessonProgressResponse>> saveWatchProgress(
            @PathVariable String lessonId,
            @Valid @RequestBody WatchProgressRequest request,
            Authentication auth) {
        String studentId = (String) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponseUtil.success(
                progressService.saveWatchProgress(lessonId, request, studentId)));
    }

    // STUDENT: mark lesson completed
    @PostMapping("/lessons/{lessonId}/complete")
    public ResponseEntity<ApiResponse<LessonProgressResponse>> markCompleted(
            @PathVariable String lessonId,
            Authentication auth) {
        String studentId = (String) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponseUtil.success(
                progressService.markLessonCompleted(lessonId, studentId)));
    }

    // STUDENT (own) / INSTRUCTOR (own course) / ADMIN: get own progress in a course
    @GetMapping("/courses/{courseId}")
    public ResponseEntity<ApiResponse<CourseProgressResponse>> getMyCourseProgress(
            @PathVariable String courseId,
            Authentication auth) {
        String requesterId = (String) auth.getPrincipal();
        String role = extractRole(auth);
        return ResponseEntity.ok(ApiResponseUtil.success(
                progressService.getCourseProgress(courseId, requesterId, requesterId, role)));
    }

    // INSTRUCTOR / ADMIN: get a specific student's progress in a course
    @GetMapping("/courses/{courseId}/students/{studentId}")
    public ResponseEntity<ApiResponse<CourseProgressResponse>> getStudentCourseProgress(
            @PathVariable String courseId,
            @PathVariable String studentId,
            Authentication auth) {
        String requesterId = (String) auth.getPrincipal();
        String role = extractRole(auth);
        return ResponseEntity.ok(ApiResponseUtil.success(
                progressService.getCourseProgress(courseId, studentId, requesterId, role)));
    }

    private String extractRole(Authentication auth) {
        return auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("STUDENT");
    }
}

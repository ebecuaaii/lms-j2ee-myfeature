package com.lms.lms.controller;

import com.lms.lms.dto.request.CreateCourseRequest;
import com.lms.lms.dto.request.UpdateCourseRequest;
import com.lms.lms.dto.response.ApiResponse;
import com.lms.lms.dto.response.CourseResponse;
import com.lms.lms.service.CourseService;
import com.lms.lms.utils.ApiResponseUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(
            @Valid @RequestBody CreateCourseRequest request,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponseUtil.success(courseService.createCourse(request, userId)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getPublishedCourses() {
        return ResponseEntity.ok(ApiResponseUtil.success(courseService.getPublishedCourses()));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getMyCourses(Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                courseService.getCoursesByInstructor((String) auth.getPrincipal())));
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourse(
            @PathVariable String courseId,
            Authentication auth) {
        String userId = auth != null ? (String) auth.getPrincipal() : null;
        String role = extractRole(auth);
        return ResponseEntity.ok(ApiResponseUtil.success(
                courseService.getCourseById(courseId, userId, role)));
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable String courseId,
            @Valid @RequestBody UpdateCourseRequest request,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                courseService.updateCourse(courseId, request,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(
            @PathVariable String courseId,
            Authentication auth) {
        courseService.deleteCourse(courseId, (String) auth.getPrincipal(), extractRole(auth));
        return ResponseEntity.ok(ApiResponseUtil.success(null));
    }

    @PatchMapping("/{courseId}/publish")
    public ResponseEntity<ApiResponse<CourseResponse>> publishCourse(
            @PathVariable String courseId,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                courseService.publishCourse(courseId,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    private String extractRole(Authentication auth) {
        if (auth == null) return "GUEST";
        return auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("STUDENT");
    }
}

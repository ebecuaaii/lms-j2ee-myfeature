package com.lms.lms.controller;

import com.lms.lms.dto.response.ApiResponse;
import com.lms.lms.dto.response.EnrollCheckResponse;
import com.lms.lms.dto.response.EnrollmentResponse;
import com.lms.lms.service.EnrollmentService;
import com.lms.lms.utils.ApiResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    // FREE course enroll
    @PostMapping("/{courseId}")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> enrollFree(
            @PathVariable String courseId,
            Authentication auth) {
        String studentId = (String) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponseUtil.success(
                enrollmentService.enrollFree(courseId, studentId)));
    }

    // check enrollment status
    @GetMapping("/check")
    public ResponseEntity<ApiResponse<EnrollCheckResponse>> checkEnrollment(
            @RequestParam String courseId,
            Authentication auth) {
        String studentId = (String) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponseUtil.success(
                enrollmentService.checkEnrollment(courseId, studentId)));
    }

    // list my enrolled courses
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<EnrollmentResponse>>> getMyEnrollments(
            Authentication auth) {
        String studentId = (String) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponseUtil.success(
                enrollmentService.getMyEnrollments(studentId)));
    }
}

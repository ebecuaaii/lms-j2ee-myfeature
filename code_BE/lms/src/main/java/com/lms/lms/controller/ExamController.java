package com.lms.lms.controller;

import com.lms.lms.dto.request.CreateExamRequest;
import com.lms.lms.dto.request.UpdateExamRequest;
import com.lms.lms.dto.response.ApiResponse;
import com.lms.lms.dto.response.ExamDetailResponse;
import com.lms.lms.dto.response.ExamResponse;
import com.lms.lms.service.ExamService;
import com.lms.lms.utils.ApiResponseUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @PostMapping("/api/courses/{courseId}/exams")
    public ResponseEntity<ApiResponse<ExamResponse>> createExam(
            @PathVariable String courseId,
            @Valid @RequestBody CreateExamRequest request,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                examService.createExam(courseId, request, (String) auth.getPrincipal())));
    }

    @GetMapping("/api/courses/{courseId}/exams")
    public ResponseEntity<ApiResponse<List<ExamResponse>>> getExams(
            @PathVariable String courseId,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                examService.getExamsByCourse(courseId,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    // student fetches exam to take — no correct answers
    @GetMapping("/api/exams/{examId}/take")
    public ResponseEntity<ApiResponse<ExamDetailResponse>> takeExam(
            @PathVariable String examId,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                examService.getExamForStudent(examId, (String) auth.getPrincipal())));
    }

    // instructor / admin view full exam
    @GetMapping("/api/exams/{examId}")
    public ResponseEntity<ApiResponse<ExamResponse>> getExam(
            @PathVariable String examId,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                examService.getExamForInstructor(examId,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    @PutMapping("/api/exams/{examId}")
    public ResponseEntity<ApiResponse<ExamResponse>> updateExam(
            @PathVariable String examId,
            @Valid @RequestBody UpdateExamRequest request,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                examService.updateExam(examId, request,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    @DeleteMapping("/api/exams/{examId}")
    public ResponseEntity<ApiResponse<Void>> deleteExam(
            @PathVariable String examId,
            Authentication auth) {
        examService.deleteExam(examId, (String) auth.getPrincipal(), extractRole(auth));
        return ResponseEntity.ok(ApiResponseUtil.success(null));
    }

    @PatchMapping("/api/exams/{examId}/publish")
    public ResponseEntity<ApiResponse<ExamResponse>> publishExam(
            @PathVariable String examId,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                examService.publishExam(examId,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    private String extractRole(Authentication auth) {
        return auth.getAuthorities().stream().findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("STUDENT");
    }
}

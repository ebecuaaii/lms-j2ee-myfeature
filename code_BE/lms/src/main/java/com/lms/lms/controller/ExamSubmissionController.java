package com.lms.lms.controller;

import com.lms.lms.dto.request.SubmitExamRequest;
import com.lms.lms.dto.response.ApiResponse;
import com.lms.lms.dto.response.ExamResultResponse;
import com.lms.lms.service.ExamSubmissionService;
import com.lms.lms.utils.ApiResponseUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams/{examId}")
@RequiredArgsConstructor
public class ExamSubmissionController {

    private final ExamSubmissionService submissionService;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<ExamResultResponse>> submit(
            @PathVariable String examId,
            @Valid @RequestBody SubmitExamRequest request,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                submissionService.submitExam(examId, request, (String) auth.getPrincipal())));
    }

    @GetMapping("/my-result")
    public ResponseEntity<ApiResponse<ExamResultResponse>> getMyResult(
            @PathVariable String examId,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                submissionService.getMyResult(examId, (String) auth.getPrincipal())));
    }

    @GetMapping("/submissions")
    public ResponseEntity<ApiResponse<List<ExamResultResponse>>> getAllSubmissions(
            @PathVariable String examId,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                submissionService.getAllSubmissions(examId,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    @GetMapping("/submissions/{submissionId}")
    public ResponseEntity<ApiResponse<ExamResultResponse>> getSubmission(
            @PathVariable String examId,
            @PathVariable String submissionId,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                submissionService.getSubmissionById(submissionId,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    private String extractRole(Authentication auth) {
        return auth.getAuthorities().stream().findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("STUDENT");
    }
}

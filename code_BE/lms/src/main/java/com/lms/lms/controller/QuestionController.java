package com.lms.lms.controller;

import com.lms.lms.dto.request.CreateQuestionRequest;
import com.lms.lms.dto.request.UpdateQuestionRequest;
import com.lms.lms.dto.response.ApiResponse;
import com.lms.lms.dto.response.QuestionResponse;
import com.lms.lms.service.QuestionService;
import com.lms.lms.utils.ApiResponseUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/api/courses/{courseId}/questions")
    public ResponseEntity<ApiResponse<QuestionResponse>> createQuestion(
            @PathVariable String courseId,
            @Valid @RequestBody CreateQuestionRequest request,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                questionService.createQuestion(courseId, request,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    @GetMapping("/api/courses/{courseId}/questions")
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> getQuestions(
            @PathVariable String courseId,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                questionService.getQuestionsByCourse(courseId,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    @GetMapping("/api/questions/{questionId}")
    public ResponseEntity<ApiResponse<QuestionResponse>> getQuestion(
            @PathVariable String questionId,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                questionService.getQuestionById(questionId,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    @PutMapping("/api/questions/{questionId}")
    public ResponseEntity<ApiResponse<QuestionResponse>> updateQuestion(
            @PathVariable String questionId,
            @Valid @RequestBody UpdateQuestionRequest request,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                questionService.updateQuestion(questionId, request,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    @DeleteMapping("/api/questions/{questionId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(
            @PathVariable String questionId,
            Authentication auth) {
        questionService.deleteQuestion(questionId,
                (String) auth.getPrincipal(), extractRole(auth));
        return ResponseEntity.ok(ApiResponseUtil.success(null));
    }

    private String extractRole(Authentication auth) {
        return auth.getAuthorities().stream().findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("STUDENT");
    }
}

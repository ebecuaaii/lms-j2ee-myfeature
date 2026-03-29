package com.lms.lms.controller;

import com.lms.lms.dto.request.CreateLessonRequest;
import com.lms.lms.dto.request.UpdateLessonRequest;
import com.lms.lms.dto.response.ApiResponse;
import com.lms.lms.dto.response.LessonResponse;
import com.lms.lms.service.LessonService;
import com.lms.lms.utils.ApiResponseUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chapters/{chapterId}/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @PostMapping
    public ResponseEntity<ApiResponse<LessonResponse>> createLesson(
            @PathVariable String chapterId,
            @Valid @RequestBody CreateLessonRequest request,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                lessonService.createLesson(chapterId, request,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LessonResponse>>> getLessons(
            @PathVariable String chapterId) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                lessonService.getLessonsByChapter(chapterId)));
    }

    @PutMapping("/{lessonId}")
    public ResponseEntity<ApiResponse<LessonResponse>> updateLesson(
            @PathVariable String chapterId,
            @PathVariable String lessonId,
            @Valid @RequestBody UpdateLessonRequest request,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                lessonService.updateLesson(chapterId, lessonId, request,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    @DeleteMapping("/{lessonId}")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(
            @PathVariable String chapterId,
            @PathVariable String lessonId,
            Authentication auth) {
        lessonService.deleteLesson(chapterId, lessonId,
                (String) auth.getPrincipal(), extractRole(auth));
        return ResponseEntity.ok(ApiResponseUtil.success(null));
    }

    private String extractRole(Authentication auth) {
        return auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("STUDENT");
    }
}

package com.lms.lms.controller;

import com.lms.lms.dto.request.CreateChapterRequest;
import com.lms.lms.dto.request.UpdateChapterRequest;
import com.lms.lms.dto.response.ApiResponse;
import com.lms.lms.dto.response.ChapterResponse;
import com.lms.lms.service.ChapterService;
import com.lms.lms.utils.ApiResponseUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses/{courseId}/chapters")
@RequiredArgsConstructor
public class ChapterController {

    private final ChapterService chapterService;

    @PostMapping
    public ResponseEntity<ApiResponse<ChapterResponse>> createChapter(
            @PathVariable String courseId,
            @Valid @RequestBody CreateChapterRequest request,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                chapterService.createChapter(courseId, request,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ChapterResponse>>> getChapters(
            @PathVariable String courseId) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                chapterService.getChaptersByCourse(courseId)));
    }

    @PutMapping("/{chapterId}")
    public ResponseEntity<ApiResponse<ChapterResponse>> updateChapter(
            @PathVariable String courseId,
            @PathVariable String chapterId,
            @Valid @RequestBody UpdateChapterRequest request,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponseUtil.success(
                chapterService.updateChapter(courseId, chapterId, request,
                        (String) auth.getPrincipal(), extractRole(auth))));
    }

    @DeleteMapping("/{chapterId}")
    public ResponseEntity<ApiResponse<Void>> deleteChapter(
            @PathVariable String courseId,
            @PathVariable String chapterId,
            Authentication auth) {
        chapterService.deleteChapter(courseId, chapterId,
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

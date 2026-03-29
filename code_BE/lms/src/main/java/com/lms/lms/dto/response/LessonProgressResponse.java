package com.lms.lms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class LessonProgressResponse {
    private String lessonId;
    private boolean isCompleted;
    private int lastWatchedSecond;
    private Instant completedAt;
    private Instant updatedAt;
}

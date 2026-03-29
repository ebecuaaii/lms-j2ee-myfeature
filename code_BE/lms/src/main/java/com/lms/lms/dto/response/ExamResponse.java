package com.lms.lms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class ExamResponse {
    private String id;
    private String courseId;
    private String title;
    private String description;
    private int duration;
    private double passingScore;
    private boolean shuffleQuestions;
    private boolean shuffleOptions;
    private boolean showResultAfterSubmit;
    private boolean isPublished;
    private int totalQuestions;
    private Instant createdAt;
}

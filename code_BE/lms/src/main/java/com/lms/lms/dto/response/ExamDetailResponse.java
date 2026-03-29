package com.lms.lms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/** Returned when student fetches exam to take — questions have no correct answers */
@Data
@Builder
public class ExamDetailResponse {
    private String id;
    private String courseId;
    private String title;
    private String description;
    private int duration;
    private boolean shuffleOptions;
    private List<QuestionForExamResponse> questions;
}

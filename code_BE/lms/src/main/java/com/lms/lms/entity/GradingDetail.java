package com.lms.lms.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** Embedded — grading result for one question inside ExamSubmission */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradingDetail {
    private String questionId;
    private List<String> selectedOptions;
    private List<String> correctAnswers;
    private boolean isCorrect;
    private String explanation;
}

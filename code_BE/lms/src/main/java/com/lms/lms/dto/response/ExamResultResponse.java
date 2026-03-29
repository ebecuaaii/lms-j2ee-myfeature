package com.lms.lms.dto.response;

import com.lms.lms.entity.GradingDetail;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

/** Returned after submission — includes score and grading details */
@Data
@Builder
public class ExamResultResponse {
    private String submissionId;
    private String examId;
    private double score;
    private boolean isPassed;
    private int totalQuestions;
    private int correctCount;
    private Instant submittedAt;
    // only populated if exam.showResultAfterSubmit = true
    private List<GradingDetail> gradingDetails;
}

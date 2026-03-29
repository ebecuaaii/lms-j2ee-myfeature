package com.lms.lms.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CreateExamRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @Min(value = 1, message = "Duration must be at least 1 minute")
    private int duration;

    @Min(value = 0, message = "Passing score must be >= 0")
    private double passingScore;

    private boolean shuffleQuestions;
    private boolean shuffleOptions;
    private boolean showResultAfterSubmit = true;

    private List<String> questionIds = new ArrayList<>();
}

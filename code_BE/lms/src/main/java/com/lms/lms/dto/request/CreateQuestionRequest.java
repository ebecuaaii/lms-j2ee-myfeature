package com.lms.lms.dto.request;

import com.lms.lms.entity.QuestionOption;
import com.lms.lms.entity.enums.Difficulty;
import com.lms.lms.entity.enums.QuestionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateQuestionRequest {

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Type is required")
    private QuestionType type;

    @NotEmpty(message = "Options are required")
    private List<QuestionOption> options;

    @NotEmpty(message = "Correct answers are required")
    private List<String> correctAnswers;

    private String explanation;

    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;

    private String topic;
}

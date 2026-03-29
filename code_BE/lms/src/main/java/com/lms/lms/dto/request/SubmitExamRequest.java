package com.lms.lms.dto.request;

import com.lms.lms.entity.StudentAnswer;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SubmitExamRequest {

    @NotNull(message = "Answers are required")
    private List<StudentAnswer> answers;
}

package com.lms.lms.dto.response;

import com.lms.lms.entity.QuestionOption;
import com.lms.lms.entity.enums.Difficulty;
import com.lms.lms.entity.enums.QuestionType;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/** Safe response for STUDENT taking exam — NO correctAnswers, NO explanation */
@Data
@Builder
public class QuestionForExamResponse {
    private String id;
    private String content;
    private QuestionType type;
    private List<QuestionOption> options; // shuffled if exam.shuffleOptions = true
    private Difficulty difficulty;
}

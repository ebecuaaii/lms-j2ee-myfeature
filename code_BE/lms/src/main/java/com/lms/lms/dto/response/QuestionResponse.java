package com.lms.lms.dto.response;

import com.lms.lms.entity.QuestionOption;
import com.lms.lms.entity.enums.Difficulty;
import com.lms.lms.entity.enums.QuestionType;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/** Full response — for INSTRUCTOR / ADMIN only (includes correctAnswers) */
@Data
@Builder
public class QuestionResponse {
    private String id;
    private String courseId;
    private String content;
    private QuestionType type;
    private List<QuestionOption> options;
    private List<String> correctAnswers;
    private String explanation;
    private Difficulty difficulty;
    private String topic;
}

package com.lms.lms.entity;

import com.lms.lms.entity.enums.Difficulty;
import com.lms.lms.entity.enums.QuestionType;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "questions")
public class Question {

    @Id
    private String id;

    private String courseId;
    private String createdBy; // instructorId

    private String content;
    private QuestionType type;

    // all answer options with stable keys (A, B, C, D)
    private List<QuestionOption> options;

    // keys of correct options — never exposed to student before submit
    private List<String> correctAnswers;

    private String explanation;
    private Difficulty difficulty;
    private String topic;

    @Builder.Default
    private boolean isDeleted = false;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}

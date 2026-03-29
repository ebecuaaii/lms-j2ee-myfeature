package com.lms.lms.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "exams")
public class Exam {

    @Id
    private String id;

    private String courseId;
    private String createdBy; // instructorId

    private String title;
    private String description;
    private int duration;       // minutes
    private double passingScore; // 0-100

    @Builder.Default
    private boolean shuffleQuestions = false;

    @Builder.Default
    private boolean shuffleOptions = false;

    @Builder.Default
    private boolean showResultAfterSubmit = true;

    @Builder.Default
    private List<String> questionIds = new ArrayList<>();

    @Builder.Default
    private boolean isPublished = false;

    @Builder.Default
    private boolean isDeleted = false;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}

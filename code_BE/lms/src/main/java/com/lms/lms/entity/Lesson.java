package com.lms.lms.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "lessons")
public class Lesson {

    @Id
    private String id;

    private String chapterId;
    private String courseId;
    private String title;
    private String description;
    private String videoUrl;
    private String documentUrl;
    private int duration; // seconds
    private int orderIndex;
    private boolean isPreview;

    @Builder.Default
    private boolean isDeleted = false;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}

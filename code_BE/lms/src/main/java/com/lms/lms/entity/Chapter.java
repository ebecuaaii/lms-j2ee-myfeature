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
@Document(collection = "chapters")
public class Chapter {

    @Id
    private String id;

    private String courseId;
    private String title;
    private String description;
    private int orderIndex;

    @Builder.Default
    private boolean isDeleted = false;
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}

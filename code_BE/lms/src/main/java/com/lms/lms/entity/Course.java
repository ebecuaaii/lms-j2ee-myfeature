package com.lms.lms.entity;

import com.lms.lms.entity.enums.CourseStatus;
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
@Document(collection = "courses")
public class Course {

    @Id
    private String id;

    // owner of course
    private String instructorId;

    private String title;
    private String description;
    private String thumbnailUrl;

    private double price;

    @Builder.Default
    private CourseStatus status = CourseStatus.DRAFT;

    private String categoryId;

    @Builder.Default
    private boolean isDeleted = false;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
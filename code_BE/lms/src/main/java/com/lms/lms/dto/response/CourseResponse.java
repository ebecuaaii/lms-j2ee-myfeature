package com.lms.lms.dto.response;

import com.lms.lms.entity.enums.CourseStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class CourseResponse {
    private String id;
    private String instructorId;
    private String title;
    private String description;
    private String thumbnailUrl;
    private double price;
    private CourseStatus status;
    private String categoryId;
    private Instant createdAt;
}

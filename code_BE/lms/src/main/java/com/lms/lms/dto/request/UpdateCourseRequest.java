package com.lms.lms.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateCourseRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String thumbnailUrl;

    @Min(value = 0, message = "Price must be >= 0")
    private double price;

    private String categoryId;
}

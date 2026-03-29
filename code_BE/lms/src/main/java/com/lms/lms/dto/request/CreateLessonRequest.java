package com.lms.lms.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateLessonRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String videoUrl;
    private String documentUrl;
    private int duration;
    private int orderIndex;
    private boolean isPreview;
}

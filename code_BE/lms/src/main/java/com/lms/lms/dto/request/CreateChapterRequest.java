package com.lms.lms.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateChapterRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private int orderIndex;
}

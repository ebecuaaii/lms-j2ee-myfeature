package com.lms.lms.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LessonResponse {
    private String id;
    private String chapterId;
    private String title;
    private String description;
    private String videoUrl;
    private String documentUrl;
    private int duration;
    private int orderIndex;
    private boolean isPreview;
}

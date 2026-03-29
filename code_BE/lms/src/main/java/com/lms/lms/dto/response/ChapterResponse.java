package com.lms.lms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ChapterResponse {
    private String id;
    private String courseId;
    private String title;
    private String description;
    private int orderIndex;
    private List<LessonResponse> lessons;
}

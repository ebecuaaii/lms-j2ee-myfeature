package com.lms.lms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CourseProgressResponse {
    private String courseId;
    private String studentId;
    private int totalLessons;
    private int completedLessons;
    private double completionPercentage;
    private List<LessonProgressResponse> lessonProgresses;
}

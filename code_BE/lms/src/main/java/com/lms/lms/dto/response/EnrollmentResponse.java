package com.lms.lms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class EnrollmentResponse {
    private String id;
    private String courseId;
    private String studentId;
    private Instant enrolledAt;
}

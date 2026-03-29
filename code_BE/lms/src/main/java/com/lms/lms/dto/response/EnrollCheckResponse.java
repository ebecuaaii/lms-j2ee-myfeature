package com.lms.lms.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EnrollCheckResponse {
    private boolean enrolled;
    private String courseId;
}

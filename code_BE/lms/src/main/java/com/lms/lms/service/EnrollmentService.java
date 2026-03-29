package com.lms.lms.service;

import com.lms.lms.dto.response.EnrollCheckResponse;
import com.lms.lms.dto.response.EnrollmentResponse;

import java.util.List;

public interface EnrollmentService {
    // FREE course: enroll immediately
    EnrollmentResponse enrollFree(String courseId, String studentId);

    // check if student is enrolled
    EnrollCheckResponse checkEnrollment(String courseId, String studentId);

    // list enrolled courses for student
    List<EnrollmentResponse> getMyEnrollments(String studentId);

    // internal: create enrollment after payment success
    EnrollmentResponse createEnrollment(String courseId, String studentId);
}

package com.lms.lms.service.impl;

import com.lms.lms.dto.response.EnrollCheckResponse;
import com.lms.lms.dto.response.EnrollmentResponse;
import com.lms.lms.entity.Course;
import com.lms.lms.entity.Enrollment;
import com.lms.lms.exception.AppException;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.EnrollmentRepository;
import com.lms.lms.service.EnrollmentService;
import com.lms.lms.utils.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    @Override
    public EnrollmentResponse enrollFree(String courseId, String studentId) {
        Course course = courseRepository.findByIdAndIsDeletedFalse(courseId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "Course not found"));

        // only allow free enroll if price = 0
        if (course.getPrice() > 0) {
            throw new AppException(ResponseCode.ERROR, "This course requires payment");
        }

        // idempotent: already enrolled → return existing
        return enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                .map(this::mapToResponse)
                .orElseGet(() -> createEnrollment(courseId, studentId));
    }

    @Override
    public EnrollCheckResponse checkEnrollment(String courseId, String studentId) {
        boolean enrolled = enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId);
        return EnrollCheckResponse.builder()
                .courseId(courseId)
                .enrolled(enrolled)
                .build();
    }

    @Override
    public List<EnrollmentResponse> getMyEnrollments(String studentId) {
        return enrollmentRepository.findByStudentId(studentId)
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public EnrollmentResponse createEnrollment(String courseId, String studentId) {
        // idempotent
        return enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                .map(this::mapToResponse)
                .orElseGet(() -> {
                    Enrollment enrollment = Enrollment.builder()
                            .studentId(studentId)
                            .courseId(courseId)
                            .build();
                    return mapToResponse(enrollmentRepository.save(enrollment));
                });
    }

    private EnrollmentResponse mapToResponse(Enrollment e) {
        return EnrollmentResponse.builder()
                .id(e.getId())
                .courseId(e.getCourseId())
                .studentId(e.getStudentId())
                .enrolledAt(e.getEnrolledAt())
                .build();
    }
}

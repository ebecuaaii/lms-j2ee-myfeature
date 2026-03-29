package com.lms.lms.repository;

import com.lms.lms.entity.Enrollment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends MongoRepository<Enrollment, String> {
    Optional<Enrollment> findByStudentIdAndCourseId(String studentId, String courseId);
    boolean existsByStudentIdAndCourseId(String studentId, String courseId);
    List<Enrollment> findByStudentId(String studentId);
}

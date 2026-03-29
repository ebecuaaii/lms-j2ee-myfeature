package com.lms.lms.repository;

import com.lms.lms.entity.Course;
import com.lms.lms.entity.enums.CourseStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByStatusAndIsDeletedFalse(CourseStatus status);
    List<Course> findByInstructorIdAndIsDeletedFalse(String instructorId);
    Optional<Course> findByIdAndIsDeletedFalse(String id);
    Optional<Course> findByIdAndInstructorIdAndIsDeletedFalse(String id, String instructorId);
}

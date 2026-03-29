package com.lms.lms.repository;

import com.lms.lms.entity.Exam;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ExamRepository extends MongoRepository<Exam, String> {
    List<Exam> findByCourseIdAndIsDeletedFalse(String courseId);
    List<Exam> findByCourseIdAndIsPublishedTrueAndIsDeletedFalse(String courseId);
    Optional<Exam> findByIdAndIsDeletedFalse(String id);
    Optional<Exam> findByIdAndCreatedByAndIsDeletedFalse(String id, String createdBy);
}

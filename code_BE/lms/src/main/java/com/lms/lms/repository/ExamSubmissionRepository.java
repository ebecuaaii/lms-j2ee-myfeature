package com.lms.lms.repository;

import com.lms.lms.entity.ExamSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ExamSubmissionRepository extends MongoRepository<ExamSubmission, String> {
    Optional<ExamSubmission> findByExamIdAndStudentId(String examId, String studentId);
    boolean existsByExamIdAndStudentId(String examId, String studentId);
    List<ExamSubmission> findByExamId(String examId);
}

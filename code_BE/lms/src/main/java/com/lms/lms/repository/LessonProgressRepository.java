package com.lms.lms.repository;

import com.lms.lms.entity.LessonProgress;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface LessonProgressRepository extends MongoRepository<LessonProgress, String> {

    Optional<LessonProgress> findByStudentIdAndLessonId(String studentId, String lessonId);

    List<LessonProgress> findByStudentIdAndCourseId(String studentId, String courseId);

    // count completed lessons for a student in a course
    long countByStudentIdAndCourseIdAndIsCompletedTrue(String studentId, String courseId);
}

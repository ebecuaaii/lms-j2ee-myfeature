package com.lms.lms.repository;

import com.lms.lms.entity.Lesson;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface LessonRepository extends MongoRepository<Lesson, String> {
    List<Lesson> findByChapterIdAndIsDeletedFalseOrderByOrderIndexAsc(String chapterId);
    List<Lesson> findByCourseIdAndIsDeletedFalse(String courseId);
    Optional<Lesson> findByIdAndIsDeletedFalse(String id);
}

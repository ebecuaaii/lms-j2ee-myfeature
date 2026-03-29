package com.lms.lms.repository;

import com.lms.lms.entity.Question;
import com.lms.lms.entity.enums.Difficulty;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findByCourseIdAndIsDeletedFalse(String courseId);
    List<Question> findByCourseIdAndDifficultyAndIsDeletedFalse(String courseId, Difficulty difficulty);
    List<Question> findByCourseIdAndTopicAndIsDeletedFalse(String courseId, String topic);
    List<Question> findByCourseIdAndDifficultyAndTopicAndIsDeletedFalse(String courseId, Difficulty difficulty, String topic);
    Optional<Question> findByIdAndIsDeletedFalse(String id);
}

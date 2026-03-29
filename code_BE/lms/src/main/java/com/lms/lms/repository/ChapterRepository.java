package com.lms.lms.repository;

import com.lms.lms.entity.Chapter;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ChapterRepository extends MongoRepository<Chapter, String> {
    List<Chapter> findByCourseIdAndIsDeletedFalseOrderByOrderIndexAsc(String courseId);
    Optional<Chapter> findByIdAndIsDeletedFalse(String id);
}

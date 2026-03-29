package com.lms.lms.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "lesson_progress")
@CompoundIndexes({
        // one progress record per student per lesson
        @CompoundIndex(name = "student_lesson_idx", def = "{'studentId': 1, 'lessonId': 1}", unique = true),
        // for querying all progress of a student in a course
        @CompoundIndex(name = "student_course_idx", def = "{'studentId': 1, 'courseId': 1}")
})
public class LessonProgress {

    @Id
    private String id;

    private String studentId;
    private String courseId;
    private String lessonId;

    @Builder.Default
    private boolean isCompleted = false;

    @Builder.Default
    private int lastWatchedSecond = 0;

    private Instant completedAt;

    @LastModifiedDate
    private Instant updatedAt;
}

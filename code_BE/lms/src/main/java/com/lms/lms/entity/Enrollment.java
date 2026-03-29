package com.lms.lms.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "enrollments")
@CompoundIndexes({
        @CompoundIndex(name = "student_course_idx", def = "{'studentId': 1, 'courseId': 1}", unique = true)
})
public class Enrollment {

    @Id
    private String id;

    private String studentId;
    private String courseId;

    @CreatedDate
    private Instant enrolledAt;
}

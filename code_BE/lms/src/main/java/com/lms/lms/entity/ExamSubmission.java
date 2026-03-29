package com.lms.lms.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "exam_submissions")
@CompoundIndexes({
        // one submission per student per exam
        @CompoundIndex(name = "student_exam_idx", def = "{'studentId': 1, 'examId': 1}", unique = true)
})
public class ExamSubmission {

    @Id
    private String id;

    private String examId;
    private String courseId;
    private String studentId;

    private List<StudentAnswer> answers;

    private double score;       // 0-100
    private boolean isPassed;

    // populated after grading — contains correct answers + explanation
    private List<GradingDetail> gradingDetails;

    private Instant submittedAt;
}

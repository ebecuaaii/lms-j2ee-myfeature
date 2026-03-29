package com.lms.lms.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** Embedded — one question's answer inside an ExamSubmission */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentAnswer {
    private String questionId;
    private List<String> selectedOptions; // option keys e.g. ["A", "C"]
}

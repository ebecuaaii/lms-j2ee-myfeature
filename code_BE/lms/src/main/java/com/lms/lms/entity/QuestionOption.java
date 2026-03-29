package com.lms.lms.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embedded object — one answer option inside a Question.
 * key: "A" | "B" | "C" | "D" (stable identifier used for grading)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionOption {
    private String key;     // e.g. "A", "B", "C", "D"
    private String content; // display text
}

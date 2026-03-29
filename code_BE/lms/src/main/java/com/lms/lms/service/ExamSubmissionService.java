package com.lms.lms.service;

import com.lms.lms.dto.request.SubmitExamRequest;
import com.lms.lms.dto.response.ExamResultResponse;

import java.util.List;

public interface ExamSubmissionService {
    ExamResultResponse submitExam(String examId, SubmitExamRequest request, String studentId);
    ExamResultResponse getMyResult(String examId, String studentId);
    List<ExamResultResponse> getAllSubmissions(String examId, String requesterId, String role);
    ExamResultResponse getSubmissionById(String submissionId, String requesterId, String role);
}

package com.lms.lms.service;

import com.lms.lms.dto.request.CreateExamRequest;
import com.lms.lms.dto.request.UpdateExamRequest;
import com.lms.lms.dto.response.ExamDetailResponse;
import com.lms.lms.dto.response.ExamResponse;

import java.util.List;

public interface ExamService {
    ExamResponse createExam(String courseId, CreateExamRequest request, String requesterId);
    List<ExamResponse> getExamsByCourse(String courseId, String requesterId, String role);
    ExamDetailResponse getExamForStudent(String examId, String studentId);
    ExamResponse getExamForInstructor(String examId, String requesterId, String role);
    ExamResponse updateExam(String examId, UpdateExamRequest request, String requesterId, String role);
    void deleteExam(String examId, String requesterId, String role);
    ExamResponse publishExam(String examId, String requesterId, String role);
}

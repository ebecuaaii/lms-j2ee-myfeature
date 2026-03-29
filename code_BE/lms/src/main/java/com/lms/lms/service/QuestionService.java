package com.lms.lms.service;

import com.lms.lms.dto.request.CreateQuestionRequest;
import com.lms.lms.dto.request.UpdateQuestionRequest;
import com.lms.lms.dto.response.QuestionResponse;

import java.util.List;

public interface QuestionService {
    QuestionResponse createQuestion(String courseId, CreateQuestionRequest request, String requesterId, String role);
    List<QuestionResponse> getQuestionsByCourse(String courseId, String requesterId, String role);
    QuestionResponse getQuestionById(String questionId, String requesterId, String role);
    QuestionResponse updateQuestion(String questionId, UpdateQuestionRequest request, String requesterId, String role);
    void deleteQuestion(String questionId, String requesterId, String role);
}

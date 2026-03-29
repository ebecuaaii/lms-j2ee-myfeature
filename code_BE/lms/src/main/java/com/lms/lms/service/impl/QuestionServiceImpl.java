package com.lms.lms.service.impl;

import com.lms.lms.dto.request.CreateQuestionRequest;
import com.lms.lms.dto.request.UpdateQuestionRequest;
import com.lms.lms.dto.response.QuestionResponse;
import com.lms.lms.entity.Question;
import com.lms.lms.exception.AppException;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.QuestionRepository;
import com.lms.lms.service.QuestionService;
import com.lms.lms.utils.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final CourseRepository courseRepository;

    @Override
    public QuestionResponse createQuestion(String courseId, CreateQuestionRequest request,
                                           String requesterId, String role) {
        verifyInstructorOwnsCourse(courseId, requesterId, role);
        Question question = Question.builder()
                .courseId(courseId)
                .createdBy(requesterId)
                .content(request.getContent())
                .type(request.getType())
                .options(request.getOptions())
                .correctAnswers(request.getCorrectAnswers())
                .explanation(request.getExplanation())
                .difficulty(request.getDifficulty())
                .topic(request.getTopic())
                .build();
        return mapToResponse(questionRepository.save(question));
    }

    @Override
    public List<QuestionResponse> getQuestionsByCourse(String courseId, String requesterId, String role) {
        verifyInstructorOwnsCourse(courseId, requesterId, role);
        return questionRepository.findByCourseIdAndIsDeletedFalse(courseId)
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public QuestionResponse getQuestionById(String questionId, String requesterId, String role) {
        Question question = findQuestionOrThrow(questionId);
        verifyInstructorOwnsCourse(question.getCourseId(), requesterId, role);
        return mapToResponse(question);
    }

    @Override
    public QuestionResponse updateQuestion(String questionId, UpdateQuestionRequest request,
                                           String requesterId, String role) {
        Question question = findQuestionOrThrow(questionId);
        verifyInstructorOwnsCourse(question.getCourseId(), requesterId, role);
        question.setContent(request.getContent());
        question.setType(request.getType());
        question.setOptions(request.getOptions());
        question.setCorrectAnswers(request.getCorrectAnswers());
        question.setExplanation(request.getExplanation());
        question.setDifficulty(request.getDifficulty());
        question.setTopic(request.getTopic());
        return mapToResponse(questionRepository.save(question));
    }

    @Override
    public void deleteQuestion(String questionId, String requesterId, String role) {
        Question question = findQuestionOrThrow(questionId);
        verifyInstructorOwnsCourse(question.getCourseId(), requesterId, role);
        question.setDeleted(true);
        questionRepository.save(question);
    }

    private Question findQuestionOrThrow(String questionId) {
        return questionRepository.findByIdAndIsDeletedFalse(questionId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "Question not found"));
    }

    private void verifyInstructorOwnsCourse(String courseId, String requesterId, String role) {
        if ("ADMIN".equals(role)) return;
        courseRepository.findByIdAndInstructorIdAndIsDeletedFalse(courseId, requesterId)
                .orElseThrow(() -> new AppException(ResponseCode.FORBIDDEN, "You do not own this course"));
    }

    private QuestionResponse mapToResponse(Question q) {
        return QuestionResponse.builder()
                .id(q.getId())
                .courseId(q.getCourseId())
                .content(q.getContent())
                .type(q.getType())
                .options(q.getOptions())
                .correctAnswers(q.getCorrectAnswers())
                .explanation(q.getExplanation())
                .difficulty(q.getDifficulty())
                .topic(q.getTopic())
                .build();
    }
}

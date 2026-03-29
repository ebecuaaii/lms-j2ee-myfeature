package com.lms.lms.service.impl;

import com.lms.lms.dto.request.CreateExamRequest;
import com.lms.lms.dto.request.UpdateExamRequest;
import com.lms.lms.dto.response.ExamDetailResponse;
import com.lms.lms.dto.response.ExamResponse;
import com.lms.lms.dto.response.QuestionForExamResponse;
import com.lms.lms.entity.Exam;
import com.lms.lms.entity.Question;
import com.lms.lms.entity.QuestionOption;
import com.lms.lms.exception.AppException;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.EnrollmentRepository;
import com.lms.lms.repository.ExamRepository;
import com.lms.lms.repository.QuestionRepository;
import com.lms.lms.service.ExamService;
import com.lms.lms.utils.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final CourseRepository courseRepository;
    private final QuestionRepository questionRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public ExamResponse createExam(String courseId, CreateExamRequest request, String requesterId) {
        courseRepository.findByIdAndInstructorIdAndIsDeletedFalse(courseId, requesterId)
                .orElseThrow(() -> new AppException(ResponseCode.FORBIDDEN, "You do not own this course"));

        Exam exam = Exam.builder()
                .courseId(courseId)
                .createdBy(requesterId)
                .title(request.getTitle())
                .description(request.getDescription())
                .duration(request.getDuration())
                .passingScore(request.getPassingScore())
                .shuffleQuestions(request.isShuffleQuestions())
                .shuffleOptions(request.isShuffleOptions())
                .showResultAfterSubmit(request.isShowResultAfterSubmit())
                .questionIds(request.getQuestionIds())
                .build();
        return mapToResponse(examRepository.save(exam));
    }

    @Override
    public List<ExamResponse> getExamsByCourse(String courseId, String requesterId, String role) {
        if ("STUDENT".equals(role)) {
            // student only sees published exams
            verifyEnrolled(requesterId, courseId);
            return examRepository.findByCourseIdAndIsPublishedTrueAndIsDeletedFalse(courseId)
                    .stream().map(this::mapToResponse).toList();
        }
        // instructor / admin see all
        verifyInstructorOwnsCourse(courseId, requesterId, role);
        return examRepository.findByCourseIdAndIsDeletedFalse(courseId)
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public ExamDetailResponse getExamForStudent(String examId, String studentId) {
        Exam exam = findExamOrThrow(examId);
        if (!exam.isPublished()) {
            throw new AppException(ResponseCode.NOT_FOUND, "Exam not found");
        }
        verifyEnrolled(studentId, exam.getCourseId());

        List<Question> questions = loadQuestions(exam.getQuestionIds());

        // shuffle questions if configured
        if (exam.isShuffleQuestions()) {
            questions = new ArrayList<>(questions);
            Collections.shuffle(questions);
        }

        List<QuestionForExamResponse> questionResponses = questions.stream()
                .map(q -> mapToSafeQuestion(q, exam.isShuffleOptions()))
                .toList();

        return ExamDetailResponse.builder()
                .id(exam.getId())
                .courseId(exam.getCourseId())
                .title(exam.getTitle())
                .description(exam.getDescription())
                .duration(exam.getDuration())
                .shuffleOptions(exam.isShuffleOptions())
                .questions(questionResponses)
                .build();
    }

    @Override
    public ExamResponse getExamForInstructor(String examId, String requesterId, String role) {
        Exam exam = findExamOrThrow(examId);
        verifyInstructorOwnsCourse(exam.getCourseId(), requesterId, role);
        return mapToResponse(exam);
    }

    @Override
    public ExamResponse updateExam(String examId, UpdateExamRequest request,
                                   String requesterId, String role) {
        Exam exam = findExamOrThrow(examId);
        verifyInstructorOwnsCourse(exam.getCourseId(), requesterId, role);
        exam.setTitle(request.getTitle());
        exam.setDescription(request.getDescription());
        exam.setDuration(request.getDuration());
        exam.setPassingScore(request.getPassingScore());
        exam.setShuffleQuestions(request.isShuffleQuestions());
        exam.setShuffleOptions(request.isShuffleOptions());
        exam.setShowResultAfterSubmit(request.isShowResultAfterSubmit());
        exam.setQuestionIds(request.getQuestionIds());
        return mapToResponse(examRepository.save(exam));
    }

    @Override
    public void deleteExam(String examId, String requesterId, String role) {
        Exam exam = findExamOrThrow(examId);
        verifyInstructorOwnsCourse(exam.getCourseId(), requesterId, role);
        exam.setDeleted(true);
        examRepository.save(exam);
    }

    @Override
    public ExamResponse publishExam(String examId, String requesterId, String role) {
        Exam exam = findExamOrThrow(examId);
        verifyInstructorOwnsCourse(exam.getCourseId(), requesterId, role);
        exam.setPublished(true);
        return mapToResponse(examRepository.save(exam));
    }

    // ---- helpers ----

    private Exam findExamOrThrow(String examId) {
        return examRepository.findByIdAndIsDeletedFalse(examId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "Exam not found"));
    }

    private List<Question> loadQuestions(List<String> questionIds) {
        // load by id — includes soft-deleted questions intentionally (exam snapshot)
        return questionIds.stream()
                .map(id -> questionRepository.findById(id).orElse(null))
                .filter(q -> q != null)
                .toList();
    }

    private QuestionForExamResponse mapToSafeQuestion(Question q, boolean shuffleOptions) {
        List<QuestionOption> options = new ArrayList<>(q.getOptions());
        if (shuffleOptions) {
            Collections.shuffle(options);
        }
        return QuestionForExamResponse.builder()
                .id(q.getId())
                .content(q.getContent())
                .type(q.getType())
                .options(options)
                .difficulty(q.getDifficulty())
                .build();
    }

    private void verifyEnrolled(String studentId, String courseId) {
        if (!enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new AppException(ResponseCode.FORBIDDEN, "You are not enrolled in this course");
        }
    }

    private void verifyInstructorOwnsCourse(String courseId, String requesterId, String role) {
        if ("ADMIN".equals(role)) return;
        courseRepository.findByIdAndInstructorIdAndIsDeletedFalse(courseId, requesterId)
                .orElseThrow(() -> new AppException(ResponseCode.FORBIDDEN, "You do not own this course"));
    }

    private ExamResponse mapToResponse(Exam exam) {
        return ExamResponse.builder()
                .id(exam.getId())
                .courseId(exam.getCourseId())
                .title(exam.getTitle())
                .description(exam.getDescription())
                .duration(exam.getDuration())
                .passingScore(exam.getPassingScore())
                .shuffleQuestions(exam.isShuffleQuestions())
                .shuffleOptions(exam.isShuffleOptions())
                .showResultAfterSubmit(exam.isShowResultAfterSubmit())
                .isPublished(exam.isPublished())
                .totalQuestions(exam.getQuestionIds().size())
                .createdAt(exam.getCreatedAt())
                .build();
    }
}

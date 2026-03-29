package com.lms.lms.service.impl;

import com.lms.lms.dto.request.SubmitExamRequest;
import com.lms.lms.dto.response.ExamResultResponse;
import com.lms.lms.entity.*;
import com.lms.lms.exception.AppException;
import com.lms.lms.repository.*;
import com.lms.lms.service.ExamSubmissionService;
import com.lms.lms.utils.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ExamSubmissionServiceImpl implements ExamSubmissionService {

    private final ExamSubmissionRepository submissionRepository;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public ExamResultResponse submitExam(String examId, SubmitExamRequest request, String studentId) {
        Exam exam = findExamOrThrow(examId);

        if (!exam.isPublished()) {
            throw new AppException(ResponseCode.NOT_FOUND, "Exam not found");
        }

        verifyEnrolled(studentId, exam.getCourseId());

        // prevent duplicate submission
        if (submissionRepository.existsByExamIdAndStudentId(examId, studentId)) {
            throw new AppException(ResponseCode.ERROR, "You have already submitted this exam");
        }

        // build answer map for quick lookup: questionId -> selectedOptions
        Map<String, List<String>> answerMap = new HashMap<>();
        for (StudentAnswer sa : request.getAnswers()) {
            answerMap.put(sa.getQuestionId(), sa.getSelectedOptions());
        }

        // grade each question
        List<GradingDetail> gradingDetails = new ArrayList<>();
        int correctCount = 0;
        int totalQuestions = exam.getQuestionIds().size();

        for (String questionId : exam.getQuestionIds()) {
            // load question — intentionally includes soft-deleted (exam snapshot)
            Optional<Question> optQuestion = questionRepository.findById(questionId);
            if (optQuestion.isEmpty()) continue;

            Question question = optQuestion.get();
            List<String> selected = answerMap.getOrDefault(questionId, Collections.emptyList());
            boolean isCorrect = grade(question, selected);

            if (isCorrect) correctCount++;

            gradingDetails.add(GradingDetail.builder()
                    .questionId(questionId)
                    .selectedOptions(selected)
                    .correctAnswers(question.getCorrectAnswers())
                    .isCorrect(isCorrect)
                    .explanation(question.getExplanation())
                    .build());
        }

        double score = totalQuestions == 0 ? 0.0
                : Math.round((correctCount * 100.0 / totalQuestions) * 10.0) / 10.0;
        boolean isPassed = score >= exam.getPassingScore();

        ExamSubmission submission = ExamSubmission.builder()
                .examId(examId)
                .courseId(exam.getCourseId())
                .studentId(studentId)
                .answers(request.getAnswers())
                .score(score)
                .isPassed(isPassed)
                .gradingDetails(gradingDetails)
                .submittedAt(Instant.now())
                .build();

        ExamSubmission saved = submissionRepository.save(submission);
        return mapToResult(saved, exam.isShowResultAfterSubmit());
    }

    @Override
    public ExamResultResponse getMyResult(String examId, String studentId) {
        Exam exam = findExamOrThrow(examId);
        ExamSubmission submission = submissionRepository.findByExamIdAndStudentId(examId, studentId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "Submission not found"));
        return mapToResult(submission, exam.isShowResultAfterSubmit());
    }

    @Override
    public List<ExamResultResponse> getAllSubmissions(String examId, String requesterId, String role) {
        Exam exam = findExamOrThrow(examId);
        verifyInstructorOwnsCourse(exam.getCourseId(), requesterId, role);
        return submissionRepository.findByExamId(examId)
                .stream().map(s -> mapToResult(s, true)).toList();
    }

    @Override
    public ExamResultResponse getSubmissionById(String submissionId, String requesterId, String role) {
        ExamSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "Submission not found"));
        Exam exam = findExamOrThrow(submission.getExamId());
        verifyInstructorOwnsCourse(exam.getCourseId(), requesterId, role);
        return mapToResult(submission, true);
    }

    // ---- grading logic ----

    /**
     * All-or-nothing grading:
     * - SINGLE_CHOICE: selected set must exactly equal correctAnswers set
     * - MULTIPLE_CHOICE: selected set must exactly equal correctAnswers set
     * Using Set comparison so order doesn't matter.
     */
    private boolean grade(Question question, List<String> selected) {
        Set<String> correct = new HashSet<>(question.getCorrectAnswers());
        Set<String> studentSelected = new HashSet<>(selected);
        return correct.equals(studentSelected);
    }

    // ---- helpers ----

    private Exam findExamOrThrow(String examId) {
        return examRepository.findByIdAndIsDeletedFalse(examId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "Exam not found"));
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

    private ExamResultResponse mapToResult(ExamSubmission s, boolean showDetails) {
        return ExamResultResponse.builder()
                .submissionId(s.getId())
                .examId(s.getExamId())
                .score(s.getScore())
                .isPassed(s.isPassed())
                .totalQuestions(s.getGradingDetails() != null ? s.getGradingDetails().size() : 0)
                .correctCount((int) (s.getGradingDetails() != null
                        ? s.getGradingDetails().stream().filter(GradingDetail::isCorrect).count()
                        : 0))
                .submittedAt(s.getSubmittedAt())
                .gradingDetails(showDetails ? s.getGradingDetails() : null)
                .build();
    }
}

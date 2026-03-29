import api from "@/lib/axios";
import type { ApiResponse, ExamResponse, ExamResultResponse } from "@/types";

interface CreateExamRequest {
    title: string;
    description?: string;
    duration: number;
    passingScore: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showResultAfterSubmit: boolean;
    questionIds: string[];
}

export const examManageService = {
    getByCourse: (courseId: string) =>
        api.get<ApiResponse<ExamResponse[]>>(`/api/courses/${courseId}/exams`)
            .then((r: { data: ApiResponse<ExamResponse[]> }) => r.data.result),

    getById: (examId: string) =>
        api.get<ApiResponse<ExamResponse>>(`/api/exams/${examId}`)
            .then((r: { data: ApiResponse<ExamResponse> }) => r.data.result),

    create: (courseId: string, data: CreateExamRequest) =>
        api.post<ApiResponse<ExamResponse>>(`/api/courses/${courseId}/exams`, data)
            .then((r: { data: ApiResponse<ExamResponse> }) => r.data.result),

    update: (examId: string, data: CreateExamRequest) =>
        api.put<ApiResponse<ExamResponse>>(`/api/exams/${examId}`, data)
            .then((r: { data: ApiResponse<ExamResponse> }) => r.data.result),

    delete: (examId: string) =>
        api.delete(`/api/exams/${examId}`),

    publish: (examId: string) =>
        api.patch<ApiResponse<ExamResponse>>(`/api/exams/${examId}/publish`)
            .then((r: { data: ApiResponse<ExamResponse> }) => r.data.result),

    getSubmissions: (examId: string) =>
        api.get<ApiResponse<ExamResultResponse[]>>(`/api/exams/${examId}/submissions`)
            .then((r: { data: ApiResponse<ExamResultResponse[]> }) => r.data.result),
};

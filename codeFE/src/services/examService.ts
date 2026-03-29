import api from "@/lib/axios";
import type {
    ApiResponse, ExamResponse, ExamDetailResponse, ExamResultResponse,
} from "@/types";

export const examService = {
    getByCourse: (courseId: string) =>
        api.get<ApiResponse<ExamResponse[]>>(`/api/courses/${courseId}/exams`).then((r) => r.data.result),

    getForStudent: (examId: string) =>
        api.get<ApiResponse<ExamDetailResponse>>(`/api/exams/${examId}/take`).then((r) => r.data.result),

    submit: (examId: string, answers: { questionId: string; selectedOptions: string[] }[]) =>
        api.post<ApiResponse<ExamResultResponse>>(`/api/exams/${examId}/submit`, { answers }).then((r) => r.data.result),

    getMyResult: (examId: string) =>
        api.get<ApiResponse<ExamResultResponse>>(`/api/exams/${examId}/my-result`).then((r) => r.data.result),
};

import api from "@/lib/axios";
import type { ApiResponse, QuestionResponse } from "@/types";

interface CreateQuestionRequest {
    courseId: string;
    content: string;
    type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
    options: { key: string; content: string }[];
    correctAnswers: string[];
    explanation?: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    topic?: string;
}

export const questionService = {
    getByCourse: (courseId: string) =>
        api.get<ApiResponse<QuestionResponse[]>>(`/api/courses/${courseId}/questions`)
            .then((r: { data: ApiResponse<QuestionResponse[]> }) => r.data.result),

    create: (courseId: string, data: Omit<CreateQuestionRequest, "courseId">) =>
        api.post<ApiResponse<QuestionResponse>>(`/api/courses/${courseId}/questions`, data)
            .then((r: { data: ApiResponse<QuestionResponse> }) => r.data.result),

    update: (questionId: string, data: Omit<CreateQuestionRequest, "courseId">) =>
        api.put<ApiResponse<QuestionResponse>>(`/api/questions/${questionId}`, data)
            .then((r: { data: ApiResponse<QuestionResponse> }) => r.data.result),

    delete: (questionId: string) =>
        api.delete(`/api/questions/${questionId}`),
};

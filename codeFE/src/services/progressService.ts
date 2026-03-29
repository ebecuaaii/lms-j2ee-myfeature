import api from "@/lib/axios";
import type { ApiResponse, CourseProgressResponse, LessonProgressResponse } from "@/types";

export const progressService = {
    saveWatch: (lessonId: string, lastWatchedSecond: number) =>
        api.post<ApiResponse<LessonProgressResponse>>(`/api/progress/lessons/${lessonId}/watch`, { lastWatchedSecond })
            .then((r: { data: ApiResponse<LessonProgressResponse> }) => r.data.result),

    markCompleted: (lessonId: string) =>
        api.post<ApiResponse<LessonProgressResponse>>(`/api/progress/lessons/${lessonId}/complete`)
            .then((r: { data: ApiResponse<LessonProgressResponse> }) => r.data.result),

    getCourseProgress: (courseId: string) =>
        api.get<ApiResponse<CourseProgressResponse>>(`/api/progress/courses/${courseId}`)
            .then((r: { data: ApiResponse<CourseProgressResponse> }) => r.data.result),
};

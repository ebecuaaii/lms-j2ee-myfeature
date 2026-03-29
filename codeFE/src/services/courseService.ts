import api from "@/lib/axios";
import type {
  ApiResponse, CourseResponse, CreateCourseRequest, UpdateCourseRequest,
  ChapterResponse, CreateChapterRequest, UpdateChapterRequest,
  LessonResponse, CreateLessonRequest, UpdateLessonRequest,
} from "@/types";

export const courseService = {
  getPublished: () =>
    api.get<ApiResponse<CourseResponse[]>>("/api/courses")
      .then((r: { data: ApiResponse<CourseResponse[]> }) => r.data.result),
  getMyCourses: () =>
    api.get<ApiResponse<CourseResponse[]>>("/api/courses/my")
      .then((r: { data: ApiResponse<CourseResponse[]> }) => r.data.result),
  getById: (id: string) =>
    api.get<ApiResponse<CourseResponse>>(`/api/courses/${id}`)
      .then((r: { data: ApiResponse<CourseResponse> }) => r.data.result),
  create: (data: CreateCourseRequest) =>
    api.post<ApiResponse<CourseResponse>>("/api/courses", data)
      .then((r: { data: ApiResponse<CourseResponse> }) => r.data.result),
  update: (id: string, data: UpdateCourseRequest) =>
    api.put<ApiResponse<CourseResponse>>(`/api/courses/${id}`, data)
      .then((r: { data: ApiResponse<CourseResponse> }) => r.data.result),
  delete: (id: string) => api.delete(`/api/courses/${id}`),
  publish: (id: string) =>
    api.patch<ApiResponse<CourseResponse>>(`/api/courses/${id}/publish`)
      .then((r: { data: ApiResponse<CourseResponse> }) => r.data.result),
};

export const chapterService = {
  getByCourse: (courseId: string) =>
    api.get<ApiResponse<ChapterResponse[]>>(`/api/courses/${courseId}/chapters`)
      .then((r: { data: ApiResponse<ChapterResponse[]> }) => r.data.result),
  create: (courseId: string, data: CreateChapterRequest) =>
    api.post<ApiResponse<ChapterResponse>>(`/api/courses/${courseId}/chapters`, data)
      .then((r: { data: ApiResponse<ChapterResponse> }) => r.data.result),
  update: (courseId: string, chapterId: string, data: UpdateChapterRequest) =>
    api.put<ApiResponse<ChapterResponse>>(`/api/courses/${courseId}/chapters/${chapterId}`, data)
      .then((r: { data: ApiResponse<ChapterResponse> }) => r.data.result),
  delete: (courseId: string, chapterId: string) =>
    api.delete(`/api/courses/${courseId}/chapters/${chapterId}`),
};

export const lessonService = {
  getByChapter: (chapterId: string) =>
    api.get<ApiResponse<LessonResponse[]>>(`/api/chapters/${chapterId}/lessons`)
      .then((r: { data: ApiResponse<LessonResponse[]> }) => r.data.result),
  create: (chapterId: string, data: CreateLessonRequest) =>
    api.post<ApiResponse<LessonResponse>>(`/api/chapters/${chapterId}/lessons`, data)
      .then((r: { data: ApiResponse<LessonResponse> }) => r.data.result),
  update: (chapterId: string, lessonId: string, data: UpdateLessonRequest) =>
    api.put<ApiResponse<LessonResponse>>(`/api/chapters/${chapterId}/lessons/${lessonId}`, data)
      .then((r: { data: ApiResponse<LessonResponse> }) => r.data.result),
  delete: (chapterId: string, lessonId: string) =>
    api.delete(`/api/chapters/${chapterId}/lessons/${lessonId}`),
};

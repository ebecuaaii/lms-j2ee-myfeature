// ─── Auth ────────────────────────────────────────────────────────────────────
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
}

export interface AuthUser {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface UserProfile {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
    phoneNumber?: string;
    dateOfBirth?: string;
    address?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
}

// ─── Course ───────────────────────────────────────────────────────────────────
export type CourseStatus = "DRAFT" | "PUBLISHED";

export interface CourseResponse {
    id: string;
    instructorId: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    price: number;
    status: CourseStatus;
    categoryId?: string;
    createdAt: string;
}

export interface CreateCourseRequest {
    title: string;
    description?: string;
    thumbnailUrl?: string;
    price: number;
    categoryId?: string;
}

export interface UpdateCourseRequest extends CreateCourseRequest { }

// ─── Chapter ──────────────────────────────────────────────────────────────────
export interface ChapterResponse {
    id: string;
    courseId: string;
    title: string;
    description?: string;
    orderIndex: number;
    lessons?: LessonResponse[];
}

export interface CreateChapterRequest {
    title: string;
    description?: string;
    orderIndex: number;
}

export interface UpdateChapterRequest extends CreateChapterRequest { }

// ─── Lesson ───────────────────────────────────────────────────────────────────
export interface LessonResponse {
    id: string;
    chapterId: string;
    title: string;
    description?: string;
    videoUrl?: string;
    documentUrl?: string;
    duration: number;
    orderIndex: number;
    isPreview: boolean;
}

export interface CreateLessonRequest {
    title: string;
    description?: string;
    videoUrl?: string;
    documentUrl?: string;
    duration: number;
    orderIndex: number;
    isPreview: boolean;
}

export interface UpdateLessonRequest extends CreateLessonRequest { }

// ─── Progress ─────────────────────────────────────────────────────────────────
export interface LessonProgressResponse {
    lessonId: string;
    isCompleted: boolean;
    lastWatchedSecond: number;
    completedAt?: string;
    updatedAt?: string;
}

export interface CourseProgressResponse {
    courseId: string;
    studentId: string;
    totalLessons: number;
    completedLessons: number;
    completionPercentage: number;
    lessonProgresses: LessonProgressResponse[];
}

// ─── Exam ─────────────────────────────────────────────────────────────────────
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE";

export interface QuestionOption {
    key: string;
    content: string;
}

export interface QuestionResponse {
    id: string;
    courseId: string;
    content: string;
    type: QuestionType;
    options: QuestionOption[];
    correctAnswers: string[];
    explanation?: string;
    difficulty: Difficulty;
    topic?: string;
}

export interface QuestionForExamResponse {
    id: string;
    content: string;
    type: QuestionType;
    options: QuestionOption[];
    difficulty: Difficulty;
}

export interface ExamResponse {
    id: string;
    courseId: string;
    title: string;
    description?: string;
    duration: number;
    passingScore: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showResultAfterSubmit: boolean;
    isPublished: boolean;
    totalQuestions: number;
    createdAt: string;
}

export interface ExamDetailResponse {
    id: string;
    courseId: string;
    title: string;
    description?: string;
    duration: number;
    shuffleOptions: boolean;
    questions: QuestionForExamResponse[];
}

export interface GradingDetail {
    questionId: string;
    selectedOptions: string[];
    correctAnswers: string[];
    isCorrect: boolean;
    explanation?: string;
}

export interface ExamResultResponse {
    submissionId: string;
    examId: string;
    score: number;
    isPassed: boolean;
    totalQuestions: number;
    correctCount: number;
    submittedAt: string;
    gradingDetails?: GradingDetail[];
}

// ─── API Wrapper ──────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}

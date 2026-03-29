import api from "@/lib/axios";
import type { ApiResponse } from "@/types";

export interface EnrollmentResponse {
    id: string;
    courseId: string;
    studentId: string;
    enrolledAt: string;
}

export interface EnrollCheckResponse {
    enrolled: boolean;
    courseId: string;
}

export interface PaymentResponse {
    paymentId: string;
    courseId: string;
    amount: number;
    status: "PENDING" | "SUCCESS" | "FAILED";
    paymentUrl: string;
}

export const enrollmentService = {
    // FREE course
    enrollFree: (courseId: string) =>
        api.post<ApiResponse<EnrollmentResponse>>(`/api/enrollments/${courseId}`)
            .then((r: { data: ApiResponse<EnrollmentResponse> }) => r.data.result),

    // check enrollment
    checkEnrollment: (courseId: string) =>
        api.get<ApiResponse<EnrollCheckResponse>>(`/api/enrollments/check?courseId=${courseId}`)
            .then((r: { data: ApiResponse<EnrollCheckResponse> }) => r.data.result),

    // list my enrollments
    getMyEnrollments: () =>
        api.get<ApiResponse<EnrollmentResponse[]>>("/api/enrollments/my")
            .then((r: { data: ApiResponse<EnrollmentResponse[]> }) => r.data.result),

    // PAID course: create payment → get VNPay URL
    createPayment: (courseId: string) =>
        api.post<ApiResponse<PaymentResponse>>(`/api/payments/create/${courseId}`)
            .then((r: { data: ApiResponse<PaymentResponse> }) => r.data.result),
};

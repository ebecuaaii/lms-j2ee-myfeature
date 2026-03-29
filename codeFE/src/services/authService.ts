import api from "@/lib/axios";
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from "@/types";

export const authService = {
    login: (data: LoginRequest) =>
        api.post<ApiResponse<AuthResponse>>("/api/auth/login", data).then((r) => r.data.result),

    register: (data: RegisterRequest) =>
        api.post<ApiResponse<AuthResponse>>("/api/auth/register", data).then((r) => r.data.result),

    logout: () => api.post("/api/auth/logout"),
};

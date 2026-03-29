import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/types";

interface AuthState {
    accessToken: string | null;
    user: UserProfile | null;
    setAuth: (token: string, user: UserProfile) => void;
    logout: () => void;
}

function setCookie(name: string, value: string, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            user: null,
            setAuth: (accessToken, user) => {
                // set cookies for middleware
                setCookie("lms-token", accessToken);
                setCookie("lms-role", user.role);
                set({ accessToken, user });
            },
            logout: () => {
                deleteCookie("lms-token");
                deleteCookie("lms-role");
                set({ accessToken: null, user: null });
            },
        }),
        { name: "lms-auth" }
    )
);

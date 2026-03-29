import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/learn", "/exams", "/instructor", "/admin"];
const guestRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get("lms-token")?.value;
    const role = request.cookies.get("lms-role")?.value;

    // Not logged in → redirect to login
    const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
    if (isProtected && !token) {
        return NextResponse.redirect(new URL(`/login?next=${pathname}`, request.url));
    }

    // Already logged in → redirect away from login/register
    const isGuest = guestRoutes.some((r) => pathname.startsWith(r));
    if (isGuest && token) {
        if (role === "INSTRUCTOR") return NextResponse.redirect(new URL("/instructor", request.url));
        if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
        return NextResponse.redirect(new URL("/courses", request.url));
    }

    // Block wrong role from instructor/admin routes
    if (token && role) {
        if (pathname.startsWith("/instructor") && role !== "INSTRUCTOR" && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/courses", request.url));
        }
        if (pathname.startsWith("/admin") && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/courses", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};

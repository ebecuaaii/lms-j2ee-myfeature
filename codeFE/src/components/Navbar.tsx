"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/authService";

export default function Navbar() {
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        try { await authService.logout(); } catch { }
        logout();
        router.push("/login");
    };

    const navLinks = () => {
        if (user?.role === "INSTRUCTOR") return (
            <>
                <Link href="/instructor">Dashboard</Link>
                <Link href="/instructor/courses">My Courses</Link>
            </>
        );
        if (user?.role === "ADMIN") return (
            <>
                <Link href="/admin">Dashboard</Link>
            </>
        );
        return (
            <>
                <Link href="/courses">Courses</Link>
            </>
        );
    };

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link href="/" className="navbar-logo">EduPlatform</Link>

                <div className="navbar-links">{navLinks()}</div>

                <div className="navbar-actions">
                    {user ? (
                        <>
                            <span className="navbar-user">{user.fullName || user.email}</span>
                            <button className="btn btn-secondary navbar-logout" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="navbar-signin">Sign in</Link>
                            <Link href="/register" className="btn btn-primary navbar-cta">Get Started</Link>
                        </>
                    )}
                </div>
            </div>

            <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid #f0f0f0;
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .navbar-logo {
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--primary);
        }
        .navbar-links {
          display: flex;
          gap: 2rem;
        }
        .navbar-links a {
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .navbar-links a:hover { color: var(--primary); }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .navbar-user {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .navbar-signin {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        .navbar-cta {
          padding: 0.5rem 1.25rem;
          font-size: 0.9rem;
        }
        .navbar-logout {
          padding: 0.4rem 1rem;
          font-size: 0.875rem;
        }
      `}</style>
        </nav>
    );
}

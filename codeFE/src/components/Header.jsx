'use client';

import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    try { await authService.logout(); } catch { }
    logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'INSTRUCTOR') return '/instructor';
    if (user?.role === 'ADMIN') return '/admin';
    return '/courses';
  };

  return (
    <nav className="header-nav">
      <div className="container header-container">
        <div className="logo">EduPlatform</div>

        <div className="desktop-menu">
          <a href="#features">Features</a>
          <a href="#courses">Courses</a>
          <Link href="/courses">Browse</Link>
          <a href="#testimonials">Reviews</a>
        </div>

        <div className="actions">
          {user ? (
            <>
              <Link href={getDashboardLink()} className="login-link">
                {user.fullName || user.email}
              </Link>
              <button
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="login-link">Log in</Link>
              <Link href="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="mobile-toggle" onClick={toggleMobile}>
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          <a href="#features" onClick={toggleMobile}>Features</a>
          <a href="#courses" onClick={toggleMobile}>Courses</a>
          <Link href="/courses" onClick={toggleMobile}>Browse</Link>
          <a href="#testimonials" onClick={toggleMobile}>Reviews</a>
          {user ? (
            <>
              <Link href={getDashboardLink()} onClick={toggleMobile}>Dashboard</Link>
              <button onClick={() => { toggleMobile(); handleLogout(); }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={toggleMobile}>Log in</Link>
              <Link href="/register" onClick={toggleMobile}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
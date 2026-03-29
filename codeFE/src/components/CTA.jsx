'use client';

import React from 'react';
import { FaFacebook, FaLinkedin, FaTwitter, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

export default function CTA() {
  const user = useAuthStore((s) => s.user);

  return (
    <section className="section cta-section">
      <div className="container cta-container">
        <h2 className="cta-title">Ready to transform your education?</h2>
        <p className="cta-description">
          Join the platform that's powering the next generation of learners and leaders.
        </p>

        <div className="cta-actions">
          <Link href={user ? '/courses' : '/register'} className="btn btn-primary">
            Start Learning Now
          </Link>
          <Link href="/courses" className="btn btn-secondary">
            Browse Courses
          </Link>
        </div>

        <div className="cta-trust">
          <FaCheckCircle className="check-icon" /> No credit card required for 14-day trial
        </div>

        <div className="cta-social">
          <p className="social-text">Follow us</p>
          <div className="social-links">
            <a href="#" className="social-icon"><FaFacebook /></a>
            <a href="#" className="social-icon"><FaLinkedin /></a>
            <a href="#" className="social-icon"><FaTwitter /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
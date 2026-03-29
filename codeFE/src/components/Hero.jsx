'use client';

import React from 'react';
import { FaPlay, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

export default function Hero() {
  const user = useAuthStore((s) => s.user);
  const learnLink = user ? '/courses' : '/register';

  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            The Future of <span className="highlight">Learning</span> Is Here.
          </h1>
          <p className="hero-description">
            Unlock your potential with our all-in-one ecosystem. Whether you're mastering a new skill or managing a university, we have the tools you need.
          </p>

          <div className="hero-actions">
            <Link href={learnLink} className="btn btn-primary">
              Start Learning <FaArrowRight style={{ marginLeft: '8px' }} />
            </Link>
            <Link href="/courses" className="btn btn-secondary">
              <FaPlay style={{ marginRight: '8px', fontSize: '0.8rem' }} /> Browse Courses
            </Link>
          </div>

          <div className="hero-stat">
            <FaCheckCircle className="check-icon" />
            <span>Join 50,000+ learners today</span>
          </div>
        </div>

        <div className="hero-visual">
          {/* Placeholder for a hero image or graphic */}
          <div className="visual-card">
            <div className="card-header">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div className="card-body">
              <div className="stat-row">
                <span className="label">Exam Status</span>
                <span className="value success">Passed 98%</span>
              </div>
              <div className="chart-placeholder">
                <div className="bar" style={{ height: '60%' }}></div>
                <div className="bar" style={{ height: '80%' }}></div>
                <div className="bar active" style={{ height: '100%' }}></div>
                <div className="bar" style={{ height: '70%' }}></div>
              </div>
              <div className="course-card-mini">
                <div className="icon-box">DS</div>
                <div>
                  <div className="course-title">Data Science</div>
                  <div className="course-progress">
                    <div className="progress-bar" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
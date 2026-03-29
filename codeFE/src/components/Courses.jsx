'use client';

import React from 'react';
import { FaStar } from 'react-icons/fa';
import Link from 'next/link';

export default function Courses() {
  const courses = [
    {
      title: "Business Intelligence & Data Analysis",
      description: "Master the most in-demand skills today and get certified.",
      rating: 4.8,
      students: "12k",
      image: "linear-gradient(135deg, #FF6B6B, #556270)",
      duration: "8 Weeks",
    },
    {
      title: "Full-Stack Web Development Bootcamp",
      description: "From HTML to React and Node.js – Become a complete developer.",
      rating: 4.9,
      students: "18k",
      image: "linear-gradient(135deg, #135bec, #4bc0c8)",
      duration: "12 Weeks",
    },
    {
      title: "Digital Marketing Strategy 2026",
      description: "Learn SEO, SEM, and Social Media Marketing from experts.",
      rating: 4.7,
      students: "9k",
      image: "linear-gradient(135deg, #FDB99B, #CF8BF3, #A770EF)",
      duration: "6 Weeks",
    },
  ];

  return (
    <section id="courses" className="section courses-section">
      <div className="container">
        <div className="section-title">
          <h2>Explore Top Courses</h2>
          <p>
            Master the most in-demand skills today.
          </p>
        </div>

        <div className="grid-3">
          {courses.map((course, idx) => (
            <div key={idx} className="course-card">
              <div className="course-thumb" style={{ background: course.image }}>
                <span className="course-badge">Best Seller</span>
              </div>
              <div className="course-content">
                <div className="course-meta">
                  <span className="meta-item"><FaStar className="star-icon" /> {course.rating}</span>
                  <span className="meta-item">{course.students} Students</span>
                </div>
                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">{course.description}</p>
                <div className="course-footer">
                  <span className="duration">{course.duration}</span>
                  <Link href="/courses" className="btn-link">View Details &rarr;</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/courses" className="btn btn-secondary">
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
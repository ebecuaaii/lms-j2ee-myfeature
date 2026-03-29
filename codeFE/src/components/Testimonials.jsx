'use client';

import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Emily R.",
      role: "Computer Science Student",
      quote: "The live exam feature is incredibly smooth. I never have to worry about connection drops, and the UI is so intuitive. EduPlatform changed how I study.",
    },
    {
      name: "Prof. David K.",
      role: "Dean at Tech University",
      quote: "Managing 5,000 students was a nightmare until we switched. The dashboard gives us real-time insights that we just couldn't get anywhere else.",
    },
    {
      name: "Sarah M.",
      role: "Corporate Trainer",
      quote: "We use the marketplace to upskill our entire engineering team. The quality of courses is consistently high and the tracking is superb.",
    },
  ];

  return (
    <section id="testimonials" className="section testimonials-section">
      <div className="container">
        <div className="section-title">
          <h2>Trusted by the best</h2>
          <p>
            Join the platform that's powering the next generation of learners and leaders.
          </p>
        </div>

        <div className="grid-3 testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <FaQuoteLeft className="quote-icon" />
              <p className="quote-text">"{t.quote}"</p>
              <div className="author">
                <div className="avatar">{t.name[0]}</div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
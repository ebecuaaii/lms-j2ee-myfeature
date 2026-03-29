'use client';

import React from 'react';

export default function Footer() {
  const links = {
    platform: ["Overview", "Features", "Pricing", "Releases"],
    resources: ["Blog", "Newsletter", "Events", "Help Centre"],
    company: ["About Us", "Careers", "Contact", "Partners"],
  };

  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>EduPlatform</h4>
            <p className="footer-desc">
              Empowering institutions and students with cutting-edge technology for a better learning future.
            </p>
          </div>
          <div className="footer-col">
            <h5>Platform</h5>
            <ul>{links.platform.map((link) => <li key={link}><a href="#">{link}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <h5>Resources</h5>
            <ul>{links.resources.map((link) => <li key={link}><a href="#">{link}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>{links.company.map((link) => <li key={link}><a href="#">{link}</a></li>)}</ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 EduPlatform Inc. All rights reserved.</p>
          <div className="legal-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
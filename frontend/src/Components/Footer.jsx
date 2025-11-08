// src/Components/Footer.jsx - FINAL CORRECTED VERSION (Added Top Border)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi'; // Icon for the button

const Footer = () => {
  const [user, setUser] = useState(null);

  // This effect checks for a user in localStorage
  useEffect(() => {
    const checkUser = () => {
        try {
            const stored = localStorage.getItem("user");
            setUser(stored ? JSON.parse(stored) : null);
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            setUser(null);
        }
    };

    checkUser(); // Check when component mounts

    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkUser);
    
    // Also re-check on client-side navigation
    const handlePopState = () => checkUser();
    window.addEventListener('popstate', handlePopState);
    
    // A simple interval check as a fallback
    const interval = setInterval(checkUser, 2000); 

    return () => {
        window.removeEventListener('storage', checkUser);
        window.removeEventListener('popstate', handlePopState);
        clearInterval(interval);
    };

  }, []);

  const gridColsClass = 'md:grid-cols-3';

  return (
    // CHANGED: Added border-t border-[var(--color-light-bg)]
    <footer className='bg-[var(--color-dark-bg)] text-[var(--color-text-light)]/70 mt-auto border-t border-[var(--color-light-bg)]'>
      
      {/* Top section (from screenshot) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`grid grid-cols-1 ${gridColsClass} gap-8 text-center md:text-left`}>
          
          {/* Column 1: Logo & Description */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="mb-4">
              <img className="h-20 w-auto" src="/images/white_logo.png" alt="Clean Street Logo" />
            </Link>
            <p className="max-w-xs text-sm">
              Empowering citizens to take an active role in maintaining and improving the cleanliness of their neighborhoods.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-[var(--color-secondary-accent)] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><FooterLink to="/about">About Us</FooterLink></li>
              <li><FooterLink to="/how-it-works">How It Works</FooterLink></li>
              <li><FooterLink to="/services">Services</FooterLink></li>
              <li><FooterLink to="/view-complaints">View Reports</FooterLink></li>
            </ul>
          </div>

          {/* Column 3: Get Started (Conditional Button) */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-[var(--color-secondary-accent)] mb-4">Get Started</h3>
            <p className="mb-4 text-sm">
              Ready to make a difference? Join the community today.
            </p>

            {/* This button only shows if user is NOT logged in */}
            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary-accent)] to-[var(--color-secondary-accent)] text-[var(--color-text-dark)] text-sm font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
              >
                <span>Get Started</span>
                <FiArrowRight size={16} />
              </Link>
            )}
          </div>

        </div>
      </div>
      
      {/* Bottom section (Copyright) */}
      <div className="bg-black/20 py-4 text-center text-sm border-t border-[var(--color-light-bg)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-[var(--color-text-light)]/60">
            <p>&copy; {new Date().getFullYear()} Clean Street Initiative.</p>
            <span className="hidden sm:inline">|</span>
            <p className="flex items-center gap-1.5">
                Made with ❤️ for a cleaner community.
            </p>
          </div> 
        </div>
      </div>
    </footer>
  );
}

// Helper component for footer links
const FooterLink = ({ to, children }) => (
  <Link to={to} className="text-sm text-[var(--color-text-light)]/80 hover:text-[var(--color-primary-accent)] hover:underline transition-colors">
    {children}
  </Link>
);

export default Footer;
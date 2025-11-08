// src/pages/Login.jsx - MODIFIED WITH NEW PALETTE

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const backend_Url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${backend_Url}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful!"); 

      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/AdminDashboard");
        } else if (data.user.role === "volunteer") {
          navigate("/VolunteerDashboard");
        } else {
          navigate("/UserDashboard");
        }
      }, 100);

    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
      toast.error(err.message || 'Login failed. Please check credentials.'); 
    } finally {
      setLoading(false);
    }
  };

  return (
    // === STYLE UPDATE: Use dark-bg for the whole page ===
    <div className="min-h-screen flex bg-[var(--color-dark-bg)]">
      <Toaster position="top-right" reverseOrder={false} /> 

      {/* Left Column - Image and Welcome Text (This is already dark-themed and looks good) */}
      <div className="hidden lg:flex w-1/2 bg-cover bg-center relative group overflow-hidden" style={{ backgroundImage: "url('/images/hero3.jpg')" }}>
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110" style={{ backgroundImage: "url('/images/hero3.jpg')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-16 text-center space-y-6">
          <Link to="/" className="block mb-6 transform transition-transform duration-300 hover:scale-105">
            <img src="/images/white_logo.png" alt="Clean Street Logo" className="w-64 animate-fade-in-down" />
          </Link>
          <h1 className="text-4xl font-bold tracking-tight animate-fade-in-up animation-delay-200">Welcome Back!</h1>
          <p className="text-lg text-gray-200 leading-relaxed animate-fade-in-up animation-delay-300">
            Let's continue making our communities cleaner and better, together.
          </p>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        {/* === STYLE UPDATE: Changed card to dark theme === */}
        <div className="w-full max-w-md bg-[var(--color-medium-bg)] p-8 sm:p-10 rounded-2xl shadow-xl border border-[var(--color-light-bg)] animate-fade-in-up">
          <div className="text-center mb-8">
            {/* CHANGED: text colors */}
            <h2 className="text-3xl font-bold text-[var(--color-secondary-accent)]">Sign In</h2>
            <p className="text-[var(--color-text-light)]/70 mt-2">Access your Clean Street account.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              {/* CHANGED: text color */}
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-light)]/90 mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                {/* CHANGED: icon and focus colors */}
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--color-text-light)]/50 pointer-events-none transition-colors group-focus-within:text-[var(--color-primary-accent)]">
                  <FiMail size={18} />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  // CHANGED: bg, border, ring, text, placeholder colors
                  className="w-full pl-11 pr-3 py-3 bg-[var(--color-dark-bg)] border border-[var(--color-light-bg)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:border-transparent transition duration-200 ease-in-out text-[var(--color-text-light)] placeholder-[var(--color-text-light)]/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              {/* CHANGED: text color */}
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-light)]/90 mb-1.5">
                Password
              </label>
              <div className="relative group">
                 {/* CHANGED: icon and focus colors */}
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--color-text-light)]/50 pointer-events-none transition-colors group-focus-within:text-[var(--color-primary-accent)]">
                  <FiLock size={18} />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                   // CHANGED: bg, border, ring, text, placeholder colors
                  className="w-full pl-11 pr-10 py-3 bg-[var(--color-dark-bg)] border border-[var(--color-light-bg)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:border-transparent transition duration-200 ease-in-out text-[var(--color-text-light)] placeholder-[var(--color-text-light)]/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/* CHANGED: icon and hover colors */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--color-text-light)]/50 hover:text-[var(--color-primary-accent)] focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              // CHANGED: Dark-mode error colors
              <p className="text-red-300 text-sm text-center bg-red-900/50 p-2.5 rounded-md border border-red-700">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              // CHANGED: Button colors to yellow accent
              className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[var(--color-primary-accent)] to-[var(--color-secondary-accent)] text-[var(--color-text-dark)] font-semibold py-3.5 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-accent)]/50 transition-all duration-300 ease-in-out transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed`}
              disabled={loading}
            >
              {loading ? (
                <>
                  {/* CHANGED: text color */}
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[var(--color-text-dark)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                <>
                  <FiLogIn size={18} />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Link to Register */}
          <div className="text-center mt-6">
            {/* CHANGED: text and link colors */}
            <p className="text-sm text-[var(--color-text-light)]/70">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-[var(--color-primary-accent)] hover:text-[var(--color-secondary-accent)] hover:underline transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
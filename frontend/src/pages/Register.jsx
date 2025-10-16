import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiMapPin, FiLock, FiBriefcase } from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    location: "",
    role: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3002/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Registration successful!");
      setTimeout(() => {
        if (data.user.role === "volunteer") {
          navigate("/VolunteerDashboard");
        } else {
          navigate("/UserDashboard");
        }
      }, 500);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes("user already exists")) {
        alert("User already exists!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Column - Image and Welcome Text */}
      <div className="hidden lg:flex w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/hero.png')" }}>
        <div className="absolute inset-0 bg-blue-900/10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
          <Link to="/" className="flex ">
            <img src="/images/white_logo.png" alt="Clean Street Logo" className="w-72 mb-4 animate-fade-in-down" />
          </Link>
          <h1 className="text-4xl font-bold mb-4 animate-fade-in-up">Join the Movement</h1>
          <p className="text-lg animate-fade-in-up animation-delay-300">Create an account to start making a real difference in your community.</p>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10 animate-fade-in-down">
            <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
            <p className="text-gray-500 mt-2">It's quick and easy to get started.</p>
          </div>

          <form className="space-y-5 animate-fade-in-up" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FiUser /></span>
                  <input type="text" name="name" placeholder="John Doe" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" value={form.name} onChange={handleChange} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FiMapPin /></span>
                  <input type="text" name="location" placeholder="Your City" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" value={form.location} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FiBriefcase /></span>
                <select name="role" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none" value={form.role} onChange={handleChange} required>
                  <option value="">Select your Role</option>
                  <option value="user">User</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FiMail /></span>
                <input type="email" name="email" placeholder="you@example.com" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FiLock /></span>
                <input type="password" name="password" placeholder="••••••••" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" value={form.password} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="text-center mt-8 animate-fade-in-up animation-delay-300">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
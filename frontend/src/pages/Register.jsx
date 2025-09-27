import React from "react";

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header className="w-full bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">cleanStreet</h1>
        <div className="space-x-6 flex items-center">
          <a href="/login" className="text-gray-900 font-medium">
            Sign in
          </a>
          <button className="px-5 py-2 bg-[#0a2463] text-white font-medium rounded-md hover:bg-[#081b4a] transition">
            Get Started
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
          {/* Back link */}
          <a href="/" className="text-sm text-gray-500 flex items-center mb-6">
            ← Back to Home
          </a>

          {/* Title */}
          <h2 className="text-center text-2xl font-bold text-[#0a2463] mb-2">
            Join cleanStreet
          </h2>
          <p className="text-center text-gray-600 text-sm mb-8">
            Create your account to start making difference
          </p>

          {/* Register Form */}
          <form className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <span className="text-gray-400 mr-2">👤</span>
                <input
                  type="text"
                  placeholder="Enter your Full Name"
                  className="w-full outline-none text-gray-700 text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <span className="text-gray-400 mr-2">📍</span>
                <input
                  type="text"
                  placeholder="Enter your City or Area"
                  className="w-full outline-none text-gray-700 text-sm"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <span className="text-gray-400 mr-2">💼</span>
                <select className="w-full outline-none text-gray-700 text-sm bg-transparent">
                  <option>Select your Role</option>
                  <option>User</option>
                  <option>Volunteer</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <span className="text-gray-400 mr-2">📧</span>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="w-full outline-none text-gray-700 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <span className="text-gray-400 mr-2">🔒</span>
                <input
                  type="password"
                  placeholder="Enter your Password"
                  className="w-full outline-none text-gray-700 text-sm"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#0a2463] text-white font-medium py-2 rounded-md shadow hover:bg-[#081b4a] transition"
            >
              Sign Up
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">Or With</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Signup */}
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign Up with Google
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
  Already have an account?{" "}
  <a href="/" className="text-[#0a2463] font-medium hover:underline">
    Login
  </a>
</p>

        </div>
      </main>
    </div>
  );
}

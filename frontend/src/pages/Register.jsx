import React,{useState} from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
export default function Register() {
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
      localStorage.setItem("user", JSON.stringify(data.user)); // save user for navbar/avatar
    alert("Registration successful!");
setTimeout(() => {
  window.location.href = "/";
}, 500);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes("user already exists")) {
      alert("User already exists!");
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen  flex flex-col bg-gray-100">
      {/* Navbar */}
      <Navbar/>

      {/* Page Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-24 px-4">
        <div className="w-full max-w-xl bg-white shadow-lg rounded-xl lg:p-16 p-8">
          {/* Back link */}
          <a href="/" className="text-sm text-gray-700 flex items-center mb-6">
            ← Back to Home
          </a>

          {/* Title */}
          <h2 className="text-center text-2xl font-bold text-[#0a2463] mb-2">
            Join cleanStreet
          </h2>
          <p className="text-center text-gray-700 text-sm mb-8">
            Create your account to start making difference
          </p>

          {/* Register Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <span className="text-gray-400 mr-2">👤</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your Full Name"
                  className="w-full outline-none text-gray-700 text-sm"
                    value={form.name}
        onChange={handleChange}
        required
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
                  name="location"
                  placeholder="Enter your City or Area"
                  className="w-full outline-none text-gray-700 text-sm"
                   value={form.location}
        onChange={handleChange}
        required
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
                <select 
                name="role"
                className="w-full outline-none text-gray-700 text-sm bg-transparent" value={form.role}
        onChange={handleChange}
        required
      >
        <option value="">Select your Role</option>
        <option value="user">User</option>
        <option value="volunteer">Volunteer</option>
        <option value="admin">Admin</option>
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
                  name="email"
                  placeholder="Enter your Email"
                  className="w-full outline-none text-gray-700 text-sm"
                  value={form.email}
        onChange={handleChange}
        required
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
                  name="password" 
                  placeholder="Enter your Password"
                  className="w-full outline-none text-gray-700 text-sm"
                  value={form.password}
        onChange={handleChange}
        required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#0a2463] text-white font-medium py-2 rounded-md shadow hover:bg-[#081b4a] transition"
              disabled={loading}
            >
               {loading ? "Signing up..." : "Sign Up"}
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
  <a href="/login" className="text-[#0a2463] font-medium hover:underline">
    Login
  </a>
</p>

        </div>
      </main>
      <Footer/>
    </div>
  );
}

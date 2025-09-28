import React,{useState} from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3002/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
    alert("Login successful!");
setTimeout(() => {
  window.location.href = "/";
}, 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Navbar */}
      <Navbar/>
      {/* Page Content */}

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
          {/* Back link */}
          <a href="/" className="text-sm text-gray-500 flex items-center mb-6">
            ← Back to Home
          </a>

          {/* Welcome Text */}
          <h2 className="text-center text-2xl font-bold text-[#0a2463] mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 text-sm mb-8">
            Sign in to your account to continue reporting issues
          </p>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  value={email}
        onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Enter Your Password"
                  className="w-full outline-none text-gray-700 text-sm"
                   value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
                />
              </div>
            </div>

            {/* Login Button */}
          <button
    type="submit"
    className="w-full bg-[#0a2463] text-white font-medium py-2 rounded-md shadow hover:bg-[#081b4a] transition"
    disabled={loading}
  >
    {loading ? "Logging in..." : "Login"}
  </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">Or With</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Login */}
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Login with Google
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
  Don't have an account?{" "}
  <a href="/register" className="text-[#0a2463] font-medium hover:underline">
    Sign Up
  </a>
</p>

        
            
          
        </div>
      </main>
    <Footer/>

    </div>
  );
}

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import Profilepage from "./pages/Profilepage";
import UserDashboard from "./pages/UserDashboard";
import Navbar from "./Components/Navbar";
export default function App() {
  return (
    <>
   
      <Router>
      <Routes>
         <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<Profilepage />} />   
        <Route path="/UserDashboard" element={<UserDashboard/>}/>
      </Routes>
    </Router>
    
    </>
    
  );
}

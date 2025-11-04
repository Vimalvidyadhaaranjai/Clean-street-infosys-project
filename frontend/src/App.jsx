import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import Profilepage from "./pages/Profilepage";
import UserDashboard from "./pages/UserDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ReportIssue from "./pages/ReportIssue";
import ViewComplaints from "./pages/ViewComplaints";
import Navbar from "./Components/Navbar";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ServicesPage from "./pages/ServicesPage";

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
        <Route path="/VolunteerDashboard" element={<VolunteerDashboard/>}/>
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/ReportIssue" element={<ReportIssue/>}/>
         <Route path="/view-complaints" element={<ViewComplaints />} />
         <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/services" element={<ServicesPage />} />
      </Routes>
    </Router>

    </>
    
  );
}

// src/pages/UserDashboard.jsx

import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar"; // Assuming updated Navbar
import Footer from "../Components/Footer"; // Assuming updated Footer
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaCheckCircle,
  FaSpinner, // Keep for pending/in-progress
  FaUserShield,
  FaArrowLeft,
  FaTrashAlt, // Use Alt version for slightly different look
  FaPlusCircle, // Use Circle version
  FaMapMarkerAlt,
  FaExclamationTriangle, // For Pending status
  FaSyncAlt, // For In Progress status
} from "react-icons/fa"; // Added more specific icons
import {Toaster,  toast } from "react-hot-toast"
const UserDashboard = () => {
  const navigate = useNavigate();
  const [showAllReports, setShowAllReports] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    complaints: [],
    stats: {
      totalReports: 0,
      resolvedReports: 0,
      pendingReports: 0, // Keep this stat for clarity
      inProgressReports: 0, // Keep this stat for clarity
    },
  });
  const [loading, setLoading] = useState(true);

  // --- Fetch user data (Keep original logic) ---
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!user) {
        // Redirect to login if user data is somehow missing
        toast.error("Session expired or unauthorized. Please log in again.");
        navigate("/login");
        return;
    }
    const fetchDashboardData = async () => {
      setLoading(true); // Ensure loading is true at the start
      try {
        const res = await fetch(
          "http://localhost:3002/api/complaints/my-reports", //
          {
            credentials: "include", //
          }
        );
        const data = await res.json(); //
        if (res.ok && data.success) { //
          // Ensure stats calculation matches backend or recalculate if needed
           const complaints = data.data.complaints || [];
           const stats = {
               totalReports: complaints.length,
               resolvedReports: complaints.filter(c => c.status === 'resolved').length,
               pendingReports: complaints.filter(c => c.status === 'received').length,
               inProgressReports: complaints.filter(c => c.status === 'in_review').length,
               // You can add rejected count here if needed
           };
          setDashboardData({ complaints, stats }); //
        } else {
          console.error("Failed to fetch dashboard data:", data.message); //
          if (res.status === 401 || res.status === 403) {
              toast.error("Session expired or unauthorized. Please log in again.");
              navigate("/login");
          } else {
              toast.error(data.message || "Failed to fetch dashboard data.");
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error); //
        toast.error("Could not load dashboard data. Please try refreshing the page.");
      } finally {
        setLoading(false); //
      }
    };
    fetchDashboardData();
  }, [navigate]); // Added navigate to dependency array

  // --- handleDelete (Keep original logic, update state correctly) ---
  const handleDelete = async (complaintId) => {
    if (!window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) { //
      return; //
    }
    try {
      const res = await fetch(
        `http://localhost:3002/api/complaints/${complaintId}`, //
        {
          method: "DELETE", //
          credentials: "include", //
        }
      );
      const data = await res.json(); //
      if (res.ok) { //
        toast.success("Report deleted successfully!"); //
        // Correctly update state after deletion
        setDashboardData((prevData) => {
            const updatedComplaints = prevData.complaints.filter((c) => c._id !== complaintId); //
            const updatedStats = { // Recalculate stats based on the filtered list
               totalReports: updatedComplaints.length,
               resolvedReports: updatedComplaints.filter(c => c.status === 'resolved').length,
               pendingReports: updatedComplaints.filter(c => c.status === 'received').length,
               inProgressReports: updatedComplaints.filter(c => c.status === 'in_review').length,
           };
           return {
             complaints: updatedComplaints,
             stats: updatedStats, //
           };
        });
      } else {
        toast.error(data.message || "Failed to delete report."); //
      }
    } catch (error) {
      console.error("Error deleting report:", error); //
      toast.error("An error occurred while deleting the report."); //
    }
  };

  // --- getStatusBadge (Refined styling) ---
  const getStatusBadge = (status) => {
    const styles = {
      received: "bg-yellow-100 text-yellow-800 border border-yellow-200", //
      in_review: "bg-blue-100 text-blue-800 border border-blue-200", //
      resolved: "bg-green-100 text-green-800 border border-green-200", //
      rejected: "bg-red-100 text-red-800 border border-red-200", //
    };
    const labels = {
      received: "Pending", //
      in_review: "In Review", //
      resolved: "Resolved", //
      rejected: "Rejected", //
    };
    // === STYLE UPDATE: Added subtle border ===
    return (
      <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}> {/* Default style */}
        {labels[status] || status} {/* Show status directly if label is missing */}
      </span>
    );
  };

  // --- formatDate (Keep original) ---
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }); //

  // --- Loading State ---
  if (loading) {
    return (
      <>
        <Navbar />
        <Toaster position="bottom-center" reverseOrder={false} />
        {/* === STYLE UPDATE: Consistent loading spinner === */}
        <div className="min-h-[calc(100vh-theme(space.20))] flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          <div className="text-center">
            <svg className="animate-spin mx-auto h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-600">Loading Your Dashboard...</p>
          </div>
        </div>
        <Footer/>
      </>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex flex-col">
      <Toaster position="bottom-center" reverseOrder={false}
      />
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 flex-grow"> {/* Reduced pt */}

        {/* Conditional Rendering: Dashboard Overview vs All Reports */}
        {!showAllReports ? (
          <div className="animate-fade-in-up">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
              <div>
                {/* === STYLE UPDATE: Larger heading, subtle greeting === */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
                  Welcome, <span className="text-indigo-600">{user?.name || "User"}</span>! {/* Use optional chaining */}
                </h1>
                <p className="text-gray-600 mt-1 text-base">Here's an overview of your reports.</p>
              </div>
              {/* === STYLE UPDATE: Refined button style === */}
              <button
                onClick={() => navigate("/ReportIssue")} //
                className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow hover:shadow-md transition-all duration-300 transform hover:scale-105"
              >
                <FaPlusCircle /> Report New Issue
              </button>
            </header>

            {/* Stats Section */}
            {/* === STYLE UPDATE: Added specific icons for Pending/In Progress === */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard icon={<FaClipboardList className="text-blue-500" />} value={dashboardData.stats.totalReports} label="Total Reports" />
              <StatCard icon={<FaExclamationTriangle className="text-yellow-500" />} value={dashboardData.stats.pendingReports} label="Pending" />
              <StatCard icon={<FaSyncAlt className="text-orange-500" />} value={dashboardData.stats.inProgressReports} label="In Progress" />
              <StatCard icon={<FaCheckCircle className="text-green-500" />} value={dashboardData.stats.resolvedReports} label="Resolved" />
              {/* Removed Role card, as it's less dynamic */}
            </section>

            {/* Recent Activity Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                 {/* === STYLE UPDATE: Refined section title === */}
                <h2 className="text-2xl font-semibold text-gray-700">Recent Reports</h2>
                {dashboardData.complaints.length > 3 && ( // Only show if more than 3 exist
                   <button onClick={() => setShowAllReports(true)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
                    View All ({dashboardData.complaints.length})
                  </button>
                )}
              </div>
              {dashboardData.complaints.length === 0 ? (
                 // === STYLE UPDATE: Cleaner "No Reports" message ===
                <div className="text-center bg-white rounded-xl shadow border border-gray-100 p-12">
                  <FaClipboardList className="mx-auto text-5xl text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4 text-lg font-medium">You haven't reported any issues yet.</p>
                  <button onClick={() => navigate("/ReportIssue")} className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-indigo-200 transition-colors">
                    <FaPlusCircle /> Report Your First Issue
                  </button>
                </div>
              ) : (
                // === STYLE UPDATE: Use 3 columns ===
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.complaints.slice(0, 3).map((c) => (
                      <ReportCard key={c._id} complaint={c} formatDate={formatDate} getStatusBadge={getStatusBadge} handleDelete={handleDelete} />
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          // "All Reports" View
          <div className="animate-fade-in">
             {/* Header for All Reports */}
            <header className="flex items-center gap-4 mb-8">
               {/* === STYLE UPDATE: Consistent back button style === */}
              <button onClick={() => setShowAllReports(false)} className="flex items-center justify-center bg-white shadow hover:shadow-md text-gray-700 hover:text-indigo-600 p-2.5 rounded-full transition-all duration-300" title="Back to Overview">
                <FaArrowLeft className="text-lg" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">All My Reports</h1>
                <p className="text-gray-500 text-base">A complete history of your submissions ({dashboardData.complaints.length}).</p>
              </div>
            </header>
            {dashboardData.complaints.length === 0 ? (
               // Should not happen if button was shown, but good fallback
              <div className="text-center bg-white rounded-xl shadow border border-gray-100 p-12"><p className="text-gray-500 text-lg">No reports found.</p></div>
            ) : (
              // === STYLE UPDATE: Use potentially 4 columns for all reports ===
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dashboardData.complaints.map((c) => (
                    <ReportCard key={c._id} complaint={c} formatDate={formatDate} getStatusBadge={getStatusBadge} handleDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer/>
    </div>
  );
};

// --- StatCard Component ---
// === STYLE UPDATE: Cleaner look, better hover ===
const StatCard = ({ icon, value, label }) => (
  <div className="bg-white p-5 rounded-xl shadow border border-gray-100 flex items-center gap-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:border-indigo-100 transform hover:-translate-y-1">
    {/* === STYLE UPDATE: Icon background === */}
    <div className="p-3 rounded-full bg-gradient-to-br from-gray-100 to-blue-100 text-2xl flex-shrink-0">
      {icon}
    </div>
    <div>
       {/* === STYLE UPDATE: Adjusted text sizes/weights === */}
      <p className="text-2xl font-bold text-gray-800 capitalize">{value}</p>
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  </div>
);

// --- ReportCard Component ---
// === STYLE UPDATE: Enhanced card layout, hover effects, delete button position ===
const ReportCard = ({ complaint, formatDate, getStatusBadge, handleDelete }) => (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1 group flex flex-col">
      {/* Image Section */}
      <div className="relative h-40 bg-gray-100 overflow-hidden">
          {complaint.photo ? (
            <img src={complaint.photo} alt={complaint.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
                <FaMapMarkerAlt size={40}/> {/* Placeholder */}
            </div>
          )}
          {/* Delete Button - Top Right Corner */}
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(complaint._id); }} // Prevent click through
            className="absolute top-2 right-2 p-1.5 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black/50"
            title="Delete Report"
          >
            <FaTrashAlt size={14}/>
          </button>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          {/* Status Badge */}
          {getStatusBadge(complaint.status)}
          {/* Priority (Optional) */}
          {/* {getPriorityBadge(complaint.priority)} */}
        </div>
        {/* Title */}
        <h3 className="font-semibold text-base text-gray-800 mb-2 line-clamp-2 flex-grow group-hover:text-indigo-700 transition-colors">
            {complaint.title}
        </h3>
        {/* Details */}
        <div className="space-y-1 text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
             <p className="line-clamp-1"><span className="font-medium text-gray-600">Type:</span> {complaint.type}</p>
             <p className="line-clamp-1"><span className="font-medium text-gray-600">Reported:</span> {formatDate(complaint.createdAt)}</p>
             <div className="flex items-start pt-1">
                <FaMapMarkerAlt className="mr-1.5 mt-0.5 flex-shrink-0 text-gray-400" size={12}/>
                <span className="line-clamp-2 leading-snug">{complaint.address}</span>
            </div>
        </div>
      </div>
    </div>
)
;

export default UserDashboard;
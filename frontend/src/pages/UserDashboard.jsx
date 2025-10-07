import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaCheckCircle,
  FaThumbsUp,
  FaUserShield,
  FaArrowLeft,
} from "react-icons/fa";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("reports");
  const [showAllReports, setShowAllReports] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    complaints: [],
    stats: {
      totalReports: 0,
      resolvedReports: 0,
      pendingReports: 0,
      inProgressReports: 0
    }
  });
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "reports", label: "My Reports" },
    { id: "profile", label: "Profile" },
  ];

  const user = JSON.parse(localStorage.getItem("user"));
  const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : "U";

  // Fetch user's complaints and stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("http://localhost:3002/api/complaints/my-reports", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setDashboardData(data.data);
        } else {
          console.error("Failed to fetch dashboard data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Get status badge component
  const getStatusBadge = (status) => {
    const statusStyles = {
      received: "bg-gray-200 text-gray-700",
      in_review: "bg-yellow-200 text-yellow-800",
      resolved: "bg-green-200 text-green-800",
      rejected: "bg-red-200 text-red-800"
    };

    const statusLabels = {
      received: "⌛ Pending",
      in_review: "⏳ In Progress",
      resolved: "✅ Resolved",
      rejected: "❌ Rejected"
    };

    return (
      <span className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${statusStyles[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter reports based on status for display
  const filterReportsByStatus = (status) => {
    return dashboardData.complaints.filter(complaint => complaint.status === status);
  };

  // Get reports to display (limited or all)
  const getReportsToDisplay = () => {
    if (showAllReports) {
      return dashboardData.complaints;
    }
    // Show only the 3 most recent reports
    return dashboardData.complaints.slice(0, 3);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="font-inter text-gray-800 p-6 mt-8 flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <Navbar />
      </div>

      <div className="font-inter text-gray-800 p-6 mt-8">
        {/* Header */}
        <div className="flex justify-between items-center my-8">
          <div>
            <h1 className="text-3xl font-bold">{user ? user.name : "Guest"}</h1>
            <p className="text-gray-600">
              Welcome back! Track your reports and community impact
            </p>
          </div>

          <button 
            onClick={() => navigate("/ReportIssue")}
            className="bg-[#14213D] text-white px-5 py-2 rounded-lg shadow hover:bg-blue-900 w-full sm:w-auto text-center"
          >
            + Report Issue
          </button>
        </div>

        {/* Stats Section - Hide when showing all reports */}
        {!showAllReports && (
          <div className="px-6 mt-10">
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {/* Reports Filed */}
              <div className="flex flex-col items-center justify-center bg-gray-100 h-45 p-4 rounded-2xl shadow-lg w-full sm:w-[45%] lg:w-[22%] transition-transform hover:scale-105">
                <FaClipboardList className="text-5xl text-[#14213D] mb-3" />
                <p className="text-3xl font-bold">{dashboardData.stats.totalReports}</p>
                <p className="text-gray-600 text-lg">Reports Filed</p>
              </div>

              {/* Resolved */}
              <div className="flex flex-col items-center justify-center bg-gray-100 h-45 p-4 rounded-2xl shadow-lg w-full sm:w-[45%] lg:w-[22%] transition-transform hover:scale-105">
                <FaCheckCircle className="text-5xl text-green-600 mb-3" />
                <p className="text-3xl font-bold">{dashboardData.stats.resolvedReports}</p>
                <p className="text-gray-600 text-lg">Resolved</p>
              </div>

              {/* In Progress */}
              <div className="flex flex-col items-center justify-center bg-gray-100 h-45 p-4 rounded-2xl shadow-lg w-full sm:w-[45%] lg:w-[22%] transition-transform hover:scale-105">
                <FaThumbsUp className="text-5xl text-blue-500 mb-3" />
                <p className="text-3xl font-bold">{dashboardData.stats.inProgressReports}</p>
                <p className="text-gray-600 text-lg">In Progress</p>
              </div>

              {/* Role */}
              <div className="flex flex-col items-center justify-center bg-gray-100 h-45 p-4 rounded-2xl shadow-lg w-full sm:w-[45%] lg:w-[22%] transition-transform hover:scale-105">
                <FaUserShield className="text-5xl text-yellow-600 mb-3" />
                <p className="text-2xl font-bold">{user.role}</p>
                <p className="text-gray-600 text-lg">Role</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Section - Hide when showing all reports */}
        {!showAllReports && (
          <div className="w-full mt-6 mb-6">
            <div className="w-full h-12 bg-gray-200 p-1 rounded-xl shadow-sm">
              {/* Scrollable Tabs */}
              <div className="flex w-full overflow-x-auto h-full">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 text-center px-4 py-2 font-semibold text-base transition-all duration-200 whitespace-nowrap
                      ${index !== tabs.length - 1 ? "border-r border-gray-300" : ""}
                      ${
                        activeTab === tab.id
                          ? "bg-white text-[#14213D] rounded-md shadow-inner"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-gray-100 p-6 rounded-2xl shadow">
          {/* Show all reports view */}
          {showAllReports ? (
            <div>
              {/* Back button and header for all reports view */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setShowAllReports(false)}
                  className="bg-white shadow-lg hover:shadow-xl text-gray-700 hover:text-blue-600 p-3 rounded-full transition-all duration-300 flex items-center justify-center group"
                  title="Back to Dashboard"
                >
                  <FaArrowLeft className="text-lg group-hover:transform group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold">All My Reports</h2>
                  <p className="text-gray-600">Complete list of your reported issues</p>
                </div>
              </div>

              {/* Status filter buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setShowAllReports(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  All ({dashboardData.complaints.length})
                </button>
                <button
                  onClick={() => {/* You can add filter functionality here */}}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Pending ({filterReportsByStatus('received').length})
                </button>
                <button
                  onClick={() => {/* You can add filter functionality here */}}
                  className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded-lg hover:bg-yellow-300 transition"
                >
                  In Progress ({filterReportsByStatus('in_review').length})
                </button>
                <button
                  onClick={() => {/* You can add filter functionality here */}}
                  className="px-4 py-2 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition"
                >
                  Resolved ({filterReportsByStatus('resolved').length})
                </button>
              </div>

              {/* All reports grid */}
              {dashboardData.complaints.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No reports found</p>
                  <button 
                    onClick={() => navigate("/ReportIssue")}
                    className="bg-[#14213D] text-white px-6 py-2 rounded-lg shadow hover:bg-blue-900"
                  >
                    Report Your First Issue
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {dashboardData.complaints.map((complaint) => (
                    <div key={complaint._id} className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
                      {complaint.photo && (
                        <img
                          src={complaint.photo}
                          alt="issue"
                          className="rounded-lg w-full mb-3 h-32 object-cover"
                        />
                      )}
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{complaint.title}</h3>
                      <div className="space-y-1 text-sm">
                        <p><strong>Type:</strong> {complaint.type}</p>
                        <p><strong>Priority:</strong> 
                          <span className={`ml-1 px-2 py-0.5 rounded text-xs ${
                            complaint.priority === 'High' ? 'bg-red-100 text-red-800' :
                            complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {complaint.priority}
                          </span>
                        </p>
                        <p><strong>Location:</strong> {complaint.address}</p>
                        <p className="text-gray-500"><strong>Reported:</strong> {formatDate(complaint.createdAt)}</p>
                      </div>
                      {getStatusBadge(complaint.status)}
                      
                      {/* Description preview */}
                      {complaint.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                          {complaint.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Regular dashboard view */
            <>
              {activeTab === "reports" && (
                <div>
                  {/* Recent Activity */}
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold">📈 Recent Activity</h2>
                    <button 
                      onClick={() => setShowAllReports(true)}
                      className="bg-[#14213D] text-white px-4 py-1 rounded-lg shadow hover:bg-blue-900"
                    >
                      + see more
                    </button>
                  </div>
                  <p className="text-gray-600 mb-6">Your latest reported issues</p>

                  {dashboardData.complaints.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">No reports found</p>
                      <button 
                        onClick={() => navigate("/ReportIssue")}
                        className="bg-[#14213D] text-white px-6 py-2 rounded-lg shadow hover:bg-blue-900"
                      >
                        Report Your First Issue
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {getReportsToDisplay().map((complaint) => (
                        <div key={complaint._id} className="bg-white rounded-lg shadow p-4">
                          {complaint.photo && (
                            <img
                              src={complaint.photo}
                              alt="issue"
                              className="rounded-lg w-full mb-3 h-32 object-cover"
                            />
                          )}
                          <p>
                            <strong>Issue:</strong> {complaint.title}
                          </p>
                          <p>
                            <strong>Type:</strong> {complaint.type}
                          </p>
                          <p>
                            <strong>Location:</strong> {complaint.address}
                          </p>
                          <p>
                            <strong>Priority:</strong> {complaint.priority}
                          </p>
                          <p className="text-sm text-gray-500">
                            <strong>Reported:</strong> {formatDate(complaint.createdAt)}
                          </p>
                          {getStatusBadge(complaint.status)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "profile" && (
                <div className="mb-8">
                  <div>
                    <p className="text-2xl font-bold">Profile Information</p>
                    <p>Manage your account settings</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-5 mb-6 gap-4">
                    <div className="flex items-center gap-3">
                      {/* Profile circle */}
                      <div className="w-12 h-12 rounded-full bg-[#D9D9D9] text-black font-bold flex items-center justify-center text-sm uppercase cursor-pointer">
                        {initial}
                      </div>

                      {/* User details */}
                      <div>
                        <div className="font-semibold break-all">{user.email}</div>
                        <div className="text-gray-600 text-sm">{user.role}</div>
                      </div>
                    </div>

                    <button
                      className="bg-[#14213D] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-900 flex gap-2 items-center self-start sm:self-auto"
                      onClick={() => navigate("/profile")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;

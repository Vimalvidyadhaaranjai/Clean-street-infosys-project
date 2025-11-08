// src/pages/UserDashboard.jsx - CORRECTED FILE (FiShield)

import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
// Using Fi icons for consistency - CORRECTED IMPORTS
import {
  FiClipboard,
  FiCheckCircle,
  FiLoader,
  FiShield, // <-- CORRECTED: Was FiUserShield
  FiArrowLeft,
  FiTrash2,
  FiPlusCircle,
  FiMapPin, 
  FiAlertTriangle,
  FiRotateCw,
  FiActivity
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [showAllReports, setShowAllReports] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    complaints: [],
    stats: {
      totalReports: 0,
      resolvedReports: 0,
      pendingReports: 0,
      inProgressReports: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const backend_Url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      toast.error("Session expired or unauthorized. Please log in again.");
      navigate("/login");
      return;
    }
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backend_Url}/api/complaints/my-reports`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.success) {
          const complaints = data.data.complaints || [];
          const stats = {
            totalReports: complaints.length,
            resolvedReports: complaints.filter((c) => c.status === "resolved").length,
            pendingReports: complaints.filter((c) => c.status === "received").length,
            inProgressReports: complaints.filter((c) => c.status === "in_review").length,
          };
          setDashboardData({ complaints, stats });
        } else {
          if (res.status === 401 || res.status === 403) {
            toast.error("Session expired or unauthorized. Please log in again.");
            navigate("/login");
          } else {
            toast.error(data.message || "Failed to fetch dashboard data.");
          }
        }

        // === Fetch recent admin logs ===
        try {
          const logsRes = await fetch(`${backend_Url}/api/admin/logs`, { credentials: "include" });
          const logsData = await logsRes.json();
          if (logsRes.ok && logsData.success) {
            setActivities(logsData.data.slice(0, 5));
          }
        } catch (error) {
          console.error("Error fetching admin logs:", error);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Could not load dashboard data. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  const handleDelete = async (complaintId) => {
    if (!window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`${backend_Url}/api/complaints/${complaintId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Report deleted successfully!");
        setDashboardData((prevData) => {
          const updatedComplaints = prevData.complaints.filter((c) => c._id !== complaintId);
          const updatedStats = {
            totalReports: updatedComplaints.length,
            resolvedReports: updatedComplaints.filter((c) => c.status === "resolved").length,
            pendingReports: updatedComplaints.filter((c) => c.status === "received").length,
            inProgressReports: updatedComplaints.filter((c) => c.status === "in_review").length,
          };
          return {
            complaints: updatedComplaints,
            stats: updatedStats,
          };
        });
      } else {
        toast.error(data.message || "Failed to delete report.");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("An error occurred while deleting the report.");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      received: "bg-[var(--color-primary-accent)]/20 text-[var(--color-primary-accent)] border border-[var(--color-primary-accent)]/30",
      in_review: "bg-[var(--color-light-bg)]/50 text-[var(--color-text-light)] border border-[var(--color-light-bg)]",
      resolved: "bg-green-900/50 text-green-300 border border-green-700",
      rejected: "bg-red-900/50 text-red-300 border border-red-700",
    };
    const labels = {
      received: "Pending",
      in_review: "In Review",
      resolved: "Resolved",
      rejected: "Rejected",
    };
    return (
      <span
        className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${
          styles[status] || "bg-gray-700 text-gray-200 border-gray-600"
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  if (loading) {
    return (
      <>
        <Navbar />
        <Toaster position="bottom-center" reverseOrder={false} />
        <div className="min-h-[calc(100vh-theme(space.20))] flex items-center justify-center bg-[var(--color-dark-bg)]">
          <div className="text-center">
            <svg
              className="animate-spin mx-auto h-12 w-12 text-[var(--color-primary-accent)]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-4 text-lg font-medium text-[var(--color-text-light)]/70">Loading Your Dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] flex flex-col">
      <Toaster position="bottom-center" reverseOrder={false} />
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 flex-grow">
        {!showAllReports ? (
          <div className="animate-fade-in-up">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-light)] tracking-tight">
                  Welcome, <span className="text-[var(--color-primary-accent)]">{user?.name || "User"}</span>!
                </h1>
                <p className="text-[var(--color-text-light)]/70 mt-1 text-base">Here's an overview of your reports.</p>
              </div>
              <button
                onClick={() => navigate("/ReportIssue")}
                className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-primary-accent)] to-[var(--color-secondary-accent)] text-[var(--color-text-dark)] font-semibold px-5 py-2.5 rounded-lg shadow hover:shadow-md transition-all duration-300 transform hover:scale-105"
              >
                <FiPlusCircle /> Report New Issue
              </button>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard icon={<FiClipboard className="text-[var(--color-primary-accent)]" />} value={dashboardData.stats.totalReports} label="Total Reports" />
              <StatCard icon={<FiAlertTriangle className="text-[var(--color-secondary-accent)]" />} value={dashboardData.stats.pendingReports} label="Pending" />
              <StatCard icon={<FiRotateCw className="text-[var(--color-primary-accent)]" />} value={dashboardData.stats.inProgressReports} label="In Progress" />
              <StatCard icon={<FiCheckCircle className="text-green-400" />} value={dashboardData.stats.resolvedReports} label="Resolved" />
            </section>

            {/* === Recent Updates Section === */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[var(--color-text-light)] flex items-center gap-2">
                  <FiActivity className="text-[var(--color-primary-accent)]" /> Recent Updates
                </h2>
              </div>
              {activities.length === 0 ? (
                <div className="bg-[var(--color-medium-bg)] rounded-xl shadow border border-[var(--color-light-bg)] p-6 text-center">
                  <p className="text-[var(--color-text-light)]/70 text-sm">No recent updates from admin yet.</p>
                </div>
              ) : (
                <ul className="bg-[var(--color-medium-bg)] rounded-xl shadow border border-[var(--color-light-bg)] divide-y divide-[var(--color-light-bg)]">
                  {activities.map((log) => (
                    <li key={log._id} className="p-4 hover:bg-[var(--color-light-bg)]/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <p className="text-[var(--color-text-light)] text-sm">
                          {log.action}
                        </p>
                        <span className="text-xs text-[var(--color-text-light)]/70">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* === Recent Reports === */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[var(--color-text-light)]">Recent Reports</h2>
                {dashboardData.complaints.length > 3 && (
                  <button
                    onClick={() => setShowAllReports(true)}
                    className="text-sm font-semibold text-[var(--color-primary-accent)] hover:text-[var(--color-secondary-accent)] hover:underline transition-colors"
                  >
                    View All ({dashboardData.complaints.length})
                  </button>
                )}
              </div>
              {dashboardData.complaints.length === 0 ? (
                <div className="text-center bg-[var(--color-medium-bg)] rounded-xl shadow border border-[var(--color-light-bg)] p-12">
                  <FiClipboard className="mx-auto text-5xl text-[var(--color-light-bg)] mb-4" />
                  <p className="text-[var(--color-text-light)]/70 mb-4 text-lg font-medium">You haven't reported any issues yet.</p>
                  <button
                    onClick={() => navigate("/ReportIssue")}
                    className="inline-flex items-center gap-2 bg-[var(--color-primary-accent)] text-[var(--color-text-dark)] font-semibold px-5 py-2.5 rounded-lg hover:bg-[var(--color-secondary-accent)] transition-colors"
                  >
                    <FiPlusCircle /> Report Your First Issue
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.complaints
                    .slice(0, 3)
                    .map((c) => (
                      <ReportCard key={c._id} complaint={c} formatDate={formatDate} getStatusBadge={getStatusBadge} handleDelete={handleDelete} />
                    ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="animate-fade-in">
            <header className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setShowAllReports(false)}
                className="flex items-center justify-center bg-[var(--color-medium-bg)] shadow hover:shadow-md text-[var(--color-text-light)] hover:text-[var(--color-primary-accent)] p-2.5 rounded-full transition-all duration-300"
                title="Back to Overview"
              >
                <FiArrowLeft className="text-lg" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-[var(--color-text-light)]">All My Reports</h1>
                <p className="text-[var(--color-text-light)]/70 text-base">
                  A complete history of your submissions ({dashboardData.complaints.length}).
                </p>
              </div>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dashboardData.complaints.map((c) => (
                <ReportCard key={c._id} complaint={c} formatDate={formatDate} getStatusBadge={getStatusBadge} handleDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

const StatCard = ({ icon, value, label }) => (
  <div className="bg-[var(--color-medium-bg)] p-5 rounded-xl shadow border border-[var(--color-light-bg)] flex items-center gap-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:border-[var(--color-primary-accent)] transform hover:-translate-y-1">
    <div className="p-3 rounded-full bg-gradient-to-br from-[var(--color-light-bg)] to-[var(--color-medium-bg)] text-2xl flex-shrink-0">{icon}</div>
    <div>
      <p className="text-2xl font-bold text-[var(--color-text-light)] capitalize">{value}</p>
      <p className="text-sm font-medium text-[var(--color-text-light)]/70">{label}</p>
    </div>
  </div>
);

const ReportCard = ({ complaint, formatDate, getStatusBadge, handleDelete }) => (
  <div className="bg-[var(--color-medium-bg)] rounded-xl shadow border border-[var(--color-light-bg)] overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1 group flex flex-col hover:border-[var(--color-primary-accent)]/50">
    <div className="relative h-40 bg-[var(--color-dark-bg)] overflow-hidden">
      {complaint.photo ? (
        <img src={complaint.photo} alt={complaint.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[var(--color-light-bg)]">
          <FiMapPin size={40} />
        </div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(complaint._id);
        }}
        className="absolute top-2 right-2 p-1.5 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black/50"
        title="Delete Report"
      >
        <FiTrash2 size={14} />
      </button>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <div className="flex justify-between items-center mb-2">{getStatusBadge(complaint.status)}</div>
      <h3 className="font-semibold text-base text-[var(--color-text-light)] mb-2 line-clamp-2 flex-grow group-hover:text-[var(--color-primary-accent)] transition-colors">
        {complaint.title}
      </h3>
      <div className="space-y-1 text-xs text-[var(--color-text-light)]/70 mt-auto pt-2 border-t border-[var(--color-light-bg)]">
        <p className="line-clamp-1">
          <span className="font-medium text-[var(--color-text-light)]/90">Type:</span> {complaint.type}
        </p>
        <p className="line-clamp-1">
          <span className="font-medium text-[var(--color-text-light)]/90">Reported:</span> {formatDate(complaint.createdAt)}
        </p>
        <div className="flex items-start pt-1">
          <FiMapPin className="mr-1.5 mt-0.5 flex-shrink-0 text-[var(--color-text-light)]/50" size={12} />
          <span className="line-clamp-2 leading-snug">{complaint.address}</span>
        </div>
      </div>
    </div>
  </div>
);

export default UserDashboard
;
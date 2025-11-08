// src/pages/VolunteerDashboard.jsx - MODIFIED WITH NEW PALETTE

import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import {
  FiClipboard,
  FiCheckCircle,
  FiLoader,
  FiMapPin,
  FiTool,
  FiAlertCircle,
  FiClock,
  FiXCircle,
  FiUserPlus,
  FiUserMinus,
  FiRotateCw,
  FiActivity,
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("nearby");
  const [nearbyComplaints, setNearbyComplaints] = useState([]);
  const [myAssignments, setMyAssignments] = useState([]);
  const [stats, setStats] = useState({
    totalAssignments: 0,
    pendingAssignments: 0,
    inProgressAssignments: 0,
    resolvedAssignments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [volunteerLocation, setVolunteerLocation] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [activities, setActivities] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";

  useEffect(() => {
    if (user?.role !== "volunteer") {
      toast.error("Access denied. Volunteers only.");
      navigate("/UserDashboard");
      return;
    }
    fetchData();
  }, [navigate, user?.role]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const nearbyRes = await fetch(`${backendUrl}/api/volunteer/nearby-complaints?maxDistance=50`, {
        credentials: "include",
      });
      const nearbyData = await nearbyRes.json();
      if (nearbyRes.ok && nearbyData.success) {
        setNearbyComplaints(nearbyData.data || []);
        setVolunteerLocation(nearbyData.volunteerLocation || "Your Area");
      } else {
        throw new Error(nearbyData.message || "Failed to fetch nearby complaints.");
      }

      const assignmentsRes = await fetch(`${backendUrl}/api/volunteer/my-assignments`, {
        credentials: "include",
      });
      const assignmentsData = await assignmentsRes.json();
      if (assignmentsRes.ok && assignmentsData.success) {
        setMyAssignments(assignmentsData.data?.assignments || []);
        setStats(
          assignmentsData.data?.stats || {
            totalAssignments: 0,
            pendingAssignments: 0,
            inProgressAssignments: 0,
            resolvedAssignments: 0,
          }
        );
      } else {
        throw new Error(assignmentsData.message || "Failed to fetch assignments.");
      }

     try {
        const logsRes = await fetch(`${backendUrl}/api/admin/logs`, { credentials: "include" });
        const logsData = await logsRes.json();
        if (logsRes.ok && logsData.success) {
          setActivities(logsData.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching admin logs:", error);
      }
    } catch (error) {
      console.error("Error fetching volunteer data:", error);
      setError(error.message || "Could not load dashboard data. Please try again.");
      if (error.message.includes("401") || error.message.includes("403")) {
        toast.error("Session expired or unauthorized. Please log in again.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionType, complaintId, payload = null) => {
    setActionLoading((prev) => ({ ...prev, [complaintId]: true }));
    let url = `${backendUrl}/api/volunteer/${actionType}/${complaintId}`;
    let options = {
      method: "POST",
      credentials: "include",
      headers: {},
    };

    if (actionType === "update-status") {
      url = `${backendUrl}/api/volunteer/update-status/${complaintId}`;
      options.method = "PATCH";
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(payload);
    } else if (actionType === "assign") {
      url = `${backendUrl}/api/volunteer/assign/${complaintId}`;
    } else if (actionType === "unassign") {
      url = `${backendUrl}/api/volunteer/unassign/${complaintId}`;
    }

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (res.ok && data.success !== false) {
        toast.success(data.message || `${actionType.replace("-", " ")} successful!`);
        fetchData();
      } else {
        throw new Error(data.message || `Failed to perform action: ${actionType}`);
      }
    } catch (error) {
      console.error(`Error performing action ${actionType}:`, error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [complaintId]: false }));
    }
  };

  const handleAssignToSelf = (complaintId) => handleAction("assign", complaintId);
  const handleUpdateStatus = (complaintId, newStatus) =>
    handleAction("update-status", complaintId, { status: newStatus });

  const handleUnassign = (complaintId) => {
    toast(
      (t) => (
        <span className="bg-[var(--color-light-bg)] text-[var(--color-text-light)] p-3 rounded-md shadow-lg">
          Are you sure you want to unassign this task?
          <div className="mt-2 flex gap-2">
            <button
              className="px-3 py-1 bg-gray-600 rounded text-white text-xs font-semibold"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-red-600 rounded text-white text-xs font-semibold"
              onClick={() => {
                toast.dismiss(t.id);
                handleAction("unassign", complaintId);
              }}
            >
              Unassign
            </button>
          </div>
        </span>
      ),
      { duration: 6000, style: { background: 'transparent', boxShadow: 'none' } } // Custom style for dark toast
    );
  };

  // CHANGED: Badge colors for dark theme
  const getStatusBadge = (status) => {
    const styles = {
      received: "bg-[var(--color-primary-accent)]/20 text-[var(--color-primary-accent)] border border-[var(--color-primary-accent)]/30",
      in_review: "bg-[var(--color-light-bg)]/50 text-[var(--color-text-light)] border border-[var(--color-light-bg)]",
      resolved: "bg-green-900/50 text-green-300 border border-green-700",
      rejected: "bg-red-900/50 text-red-300 border border-red-700",
    };
    const labels = {
      received: "Pending",
      in_review: "In Progress",
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

  // CHANGED: Badge colors for dark theme
  const getPriorityBadge = (priority) => {
    const styles = {
      Low: "bg-gray-700 text-gray-200 border border-gray-600",
      Medium: "bg-orange-800/50 text-orange-300 border border-orange-700",
      High: "bg-red-900/50 text-red-300 border border-red-700",
    };
    return (
      <span
        className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${
          styles[priority] || styles.Medium
        }`}
      >
        {priority}
      </span>
    );
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // CHANGED: Loading state styling
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-dark-bg)] flex flex-col">
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <svg
              className="animate-spin mx-auto h-12 w-12 text-[var(--color-primary-accent)]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-4 text-lg font-medium text-[var(--color-text-light)]/70">Loading Volunteer Dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // CHANGED: Error state styling
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-dark-bg)] flex flex-col">
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center bg-red-900/50 p-6 rounded-lg shadow border border-red-700 max-w-lg w-full">
            <FiAlertCircle className="mx-auto text-red-300 text-4xl mb-3" />
            <p className="font-semibold text-red-200 text-lg">Error Loading Dashboard</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
            <button
              onClick={() => fetchData()}
              className="mt-5 px-4 py-2 bg-[var(--color-primary-accent)] text-[var(--color-text-dark)] text-sm font-semibold rounded hover:bg-[var(--color-secondary-accent)] transition-colors"
            >
              Retry Loading
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    // CHANGED: Main background
    <div className="min-h-screen bg-[var(--color-dark-bg)] flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 flex-grow">
        <div className="animate-fade-in-up">
          <header className="mb-8">
            {/* CHANGED: Text colors */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-light)] tracking-tight">
              Volunteer Dashboard
            </h1>
            <p className="text-[var(--color-text-light)]/70 mt-1 text-base">
              Manage complaints {volunteerLocation && `in ${volunteerLocation}`}
            </p>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* CHANGED: StatCard icons to use accent colors */}
            <StatCard icon={<FiTool className="text-[var(--color-primary-accent)]" />} value={stats.totalAssignments} label="Total Assignments" />
            <StatCard icon={<FiClock className="text-[var(--color-secondary-accent)]" />} value={stats.pendingAssignments} label="Pending Pickup" />
            <StatCard icon={<FiRotateCw className="text-orange-400" />} value={stats.inProgressAssignments} label="In Progress" />
            <StatCard icon={<FiCheckCircle className="text-green-400" />} value={stats.resolvedAssignments} label="Resolved" />
          </section>

          {/* === Recent Updates Section === */}
          <section className="mb-10">
             {/* CHANGED: Text and icon colors */}
            <h2 className="text-2xl font-semibold text-[var(--color-text-light)] mb-4 flex items-center gap-2">
              <FiActivity className="text-[var(--color-primary-accent)]" /> Recent Updates
            </h2>
            {activities.length === 0 ? (
              // CHANGED: Card and text colors
              <div className="bg-[var(--color-medium-bg)] rounded-xl shadow border border-[var(--color-light-bg)] p-6 text-center">
                <p className="text-[var(--color-text-light)]/70 text-sm">No recent updates from admin yet.</p>
              </div>
            ) : (
              // CHANGED: Card, text, border, and hover colors
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

          {/* === Tabs Section === */}
          {/* CHANGED: Border color */}
          <div className="border-b border-[var(--color-light-bg)] mb-6">
            <nav className="flex -mb-px space-x-6" aria-label="Tabs">
              <TabButton id="nearby" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FiMapPin />}>
                Nearby ({nearbyComplaints.length})
              </TabButton>
              <TabButton id="myAssignments" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FiClipboard />}>
                My Assignments ({myAssignments.length})
              </TabButton>
            </nav>
          </div>

          <div>
            {activeTab === "nearby" ? (
              <section>
                {nearbyComplaints.length === 0 ? (
                  // CHANGED: Card, icon, and text colors
                  <div className="text-center bg-[var(--color-medium-bg)] rounded-xl shadow border border-[var(--color-light-bg)] p-12">
                    <FiMapPin className="mx-auto text-5xl text-[var(--color-light-bg)]/50 mb-4" />
                    <p className="text-[var(--color-text-light)]/70 text-lg font-medium">
                      No unassigned complaints found nearby.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nearbyComplaints.map((complaint) => (
                      <NearbyComplaintCard
                        key={complaint._id}
                        complaint={complaint}
                        formatDate={formatDate}
                        getStatusBadge={getStatusBadge}
                        getPriorityBadge={getPriorityBadge}
                        handleAssignToSelf={handleAssignToSelf}
                        isLoading={actionLoading[complaint._id]}
                      />
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <section>
                {myAssignments.length === 0 ? (
                   // CHANGED: Card, icon, and text colors
                  <div className="text-center bg-[var(--color-medium-bg)] rounded-xl shadow border border-[var(--color-light-bg)] p-12">
                    <FiClipboard className="mx-auto text-5xl text-[var(--color-light-bg)]/50 mb-4" />
                    <p className="text-[var(--color-text-light)]/70 text-lg font-medium">
                      You don't have any assigned complaints currently.
                    </p>
                    <p className="text-sm text-[var(--color-text-light)]/50 mt-2">
                      Check the "Nearby" tab to pick up tasks.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myAssignments.map((complaint) => (
                      <AssignedComplaintCard
                        key={complaint._id}
                        complaint={complaint}
                        formatDate={formatDate}
                        getStatusBadge={getStatusBadge}
                        getPriorityBadge={getPriorityBadge}
                        handleUpdateStatus={handleUpdateStatus}
                        handleUnassign={handleUnassign}
                        isLoading={actionLoading[complaint._id]}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// CHANGED: StatCard component styling
const StatCard = ({ icon, value, label }) => (
  <div className="bg-[var(--color-medium-bg)] p-5 rounded-xl shadow border border-[var(--color-light-bg)] flex items-center gap-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:border-[var(--color-primary-accent)] transform hover:-translate-y-1">
    <div className="p-3 rounded-full bg-gradient-to-br from-[var(--color-light-bg)] to-[var(--color-medium-bg)] text-2xl flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-[var(--color-text-light)] capitalize">{value}</p>
      <p className="text-sm font-medium text-[var(--color-text-light)]/70">{label}</p>
    </div>
  </div>
);

// CHANGED: TabButton component styling
const TabButton = ({ id, activeTab, setActiveTab, icon, children }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none focus-visible:bg-[var(--color-light-bg)]/20 rounded-t whitespace-nowrap ${
      activeTab === id
        ? "border-[var(--color-primary-accent)] text-[var(--color-primary-accent)]"
        : "border-transparent text-[var(--color-text-light)]/60 hover:text-[var(--color-text-light)] hover:border-[var(--color-light-bg)]"
    }`}
  >
    {React.cloneElement(icon, { size: 16 })}
    <span>{children}</span>
  </button>
);

// CHANGED: NearbyComplaintCard component styling
const NearbyComplaintCard = ({
  complaint,
  formatDate,
  getStatusBadge,
  getPriorityBadge,
  handleAssignToSelf,
  isLoading,
}) => (
  <div className="bg-[var(--color-medium-bg)] rounded-xl shadow border border-[var(--color-light-bg)] overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1 group flex flex-col hover:border-[var(--color-primary-accent)]/50">
    {complaint.photo && (
      <div className="h-40 bg-[var(--color-dark-bg)] overflow-hidden">
        <img
          src={complaint.photo}
          alt={complaint.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    )}
    <div className="p-4 flex flex-col flex-grow">
      <div className="flex justify-between items-start gap-2 mb-2">
        {getStatusBadge(complaint.status)}
        {getPriorityBadge(complaint.priority)}
      </div>
      <h3 className="font-semibold text-base text-[var(--color-text-light)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary-accent)] transition-colors">
        {complaint.title}
      </h3>
      <div className="space-y-1 text-xs text-[var(--color-text-light)]/70 mb-3">
        <p>
          <span className="font-medium text-[var(--color-text-light)]/90">Type:</span> {complaint.type}
        </p>
        <p>
          <span className="font-medium text-[var(--color-text-light)]/90">Reported:</span> {formatDate(complaint.createdAt)}
        </p>
        {complaint.distance && (
          <p>
            <span className="font-medium text-[var(--color-text-light)]/90">Distance:</span> ≈{complaint.distance} km
          </p>
        )}
      </div>
      <div className="flex items-start text-xs text-[var(--color-text-light)]/70 mb-4">
        <FiMapPin className="mr-1.5 mt-0.5 flex-shrink-0 text-[var(--color-text-light)]/50" size={12} />
        <span className="line-clamp-2 leading-snug">{complaint.address}</span>
      </div>
      {/* CHANGED: Button colors */}
      <button
        onClick={() => handleAssignToSelf(complaint._id)}
        disabled={complaint.assigned_to || isLoading}
        className={`w-full mt-auto py-2 px-4 rounded-md font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
          complaint.assigned_to
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : isLoading
            ? "bg-[var(--color-primary-accent)]/50 text-[var(--color-text-dark)] cursor-wait"
            : "bg-[var(--color-primary-accent)] text-[var(--color-text-dark)] hover:bg-[var(--color-secondary-accent)]"
        }`}
      >
        {isLoading ? <FiLoader className="animate-spin" /> : <FiUserPlus size={16} />}
        {complaint.assigned_to ? "Assigned" : isLoading ? "Assigning..." : "Assign to Me"}
      </button>
    </div>
  </div>
);

// CHANGED: AssignedComplaintCard component styling
const AssignedComplaintCard = ({
  complaint,
  formatDate,
  getStatusBadge,
  getPriorityBadge,
  handleUpdateStatus,
  handleUnassign,
  isLoading,
}) => (
  <div className="bg-[var(--color-medium-bg)] rounded-xl shadow border border-[var(--color-light-bg)] overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1 group flex flex-col hover:border-[var(--color-primary-accent)]/50">
    {complaint.photo && (
      <div className="h-40 bg-[var(--color-dark-bg)] overflow-hidden">
        <img
          src={complaint.photo}
          alt={complaint.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    )}
    <div className="p-4 flex flex-col flex-grow">
      <div className="flex justify-between items-start gap-2 mb-2">
        {getStatusBadge(complaint.status)}
        {getPriorityBadge(complaint.priority)}
      </div>
      <h3 className="font-semibold text-base text-[var(--color-text-light)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary-accent)] transition-colors">
        {complaint.title}
      </h3>
      <div className="space-y-1 text-xs text-[var(--color-text-light)]/70 mb-3">
        <p>
          <span className="font-medium text-[var(--color-text-light)]/90">Type:</span> {complaint.type}
        </p>
        <p>
          <span className="font-medium text-[var(--color-text-light)]/90">Reported:</span> {formatDate(complaint.createdAt)}
        </p>
      </div>
      <div className="flex items-start text-xs text-[var(--color-text-light)]/70 mb-4">
        <FiMapPin className="mr-1.5 mt-0.5 flex-shrink-0 text-[var(--color-text-light)]/50" size={12} />
        <span className="line-clamp-2 leading-snug">{complaint.address}</span>
      </div>
      <div className="mt-auto space-y-2 pt-3 border-t border-[var(--color-light-bg)]">
        {/* CHANGED: Label text color */}
        <label className="text-xs font-semibold text-[var(--color-text-light)]/70 block mb-1">
          Update Status:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {/* CHANGED: StatusButton colors */}
          {complaint.status !== "in_review" && (
            <StatusButton
              onClick={() => handleUpdateStatus(complaint._id, "in_review")}
              isLoading={isLoading}
              className="bg-[var(--color-light-bg)]/70 text-[var(--color-text-light)] hover:bg-[var(--color-light-bg)]"
            >
              In Progress
            </StatusButton>
          )}
          {complaint.status !== "resolved" && (
            <StatusButton
              onClick={() => handleUpdateStatus(complaint._id, "resolved")}
              isLoading={isLoading}
              className="bg-green-700/70 text-green-200 hover:bg-green-700"
            >
              Resolved
            </StatusButton>
          )}
          {complaint.status !== "rejected" && (
            <StatusButton
              onClick={() => handleUpdateStatus(complaint._id, "rejected")}
              isLoading={isLoading}
              className="bg-red-700/70 text-red-200 hover:bg-red-700"
            >
              Reject
            </StatusButton>
          )}
          <StatusButton
            onClick={() => handleUnassign(complaint._id)}
            isLoading={isLoading}
            className="bg-gray-600 text-gray-200 hover:bg-gray-500"
          >
            <FiUserMinus size={14} className="inline mr-1" /> Unassign
          </StatusButton>
        </div>
      </div>
    </div>
  </div>
);

// CHANGED: StatusButton component styling
const StatusButton = ({ onClick, children, className = "", isLoading = false }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`px-3 py-1.5 text-xs rounded-md font-semibold transition-colors duration-150 w-full flex items-center justify-center gap-1 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
  >
    {isLoading ? <FiLoader className="animate-spin" size={14} /> : children}
  </button>
);

export default VolunteerDashboard
;
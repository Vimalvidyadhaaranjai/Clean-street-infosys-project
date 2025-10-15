import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaCheckCircle,
  FaSpinner,
  FaMapMarkerAlt,
  FaTasks,
  FaExclamationCircle,
} from "react-icons/fa";
import Footer from "../Components/Footer";

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("nearby"); // nearby, myAssignments
  const [nearbyComplaints, setNearbyComplaints] = useState([]);
  const [myAssignments, setMyAssignments] = useState([]);
  const [stats, setStats] = useState({
    totalAssignments: 0,
    pendingAssignments: 0,
    inProgressAssignments: 0,
    resolvedAssignments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [volunteerLocation, setVolunteerLocation] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.role !== "volunteer") {
      alert("Access denied. Volunteers only.");
      navigate("/UserDashboard");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch nearby complaints
      const nearbyRes = await fetch(
        "http://localhost:3002/api/volunteer/nearby-complaints?maxDistance=50",
        { credentials: "include" }
      );
      const nearbyData = await nearbyRes.json();
      if (nearbyRes.ok && nearbyData.success) {
        setNearbyComplaints(nearbyData.data);
        setVolunteerLocation(nearbyData.volunteerLocation);
      }

      // Fetch my assignments
      const assignmentsRes = await fetch(
        "http://localhost:3002/api/volunteer/my-assignments",
        { credentials: "include" }
      );
      const assignmentsData = await assignmentsRes.json();
      if (assignmentsRes.ok && assignmentsData.success) {
        setMyAssignments(assignmentsData.data.assignments);
        setStats(assignmentsData.data.stats);
      }
    } catch (error) {
      console.error("Error fetching volunteer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToSelf = async (complaintId) => {
    try {
      const res = await fetch(
        `http://localhost:3002/api/volunteer/assign/${complaintId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Complaint assigned to you successfully!");
        fetchData(); // Refresh data
      } else {
        alert(data.message || "Failed to assign complaint.");
      }
    } catch (error) {
      console.error("Error assigning complaint:", error);
      alert("An error occurred while assigning the complaint.");
    }
  };

  const handleUpdateStatus = async (complaintId, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:3002/api/volunteer/update-status/${complaintId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert(`Status updated to ${newStatus}!`);
        fetchData(); // Refresh data
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating the status.");
    }
  };

  const handleUnassign = async (complaintId) => {
    if (!window.confirm("Are you sure you want to unassign this complaint?")) {
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:3002/api/volunteer/unassign/${complaintId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Complaint unassigned successfully!");
        fetchData(); // Refresh data
      } else {
        alert(data.message || "Failed to unassign complaint.");
      }
    } catch (error) {
      console.error("Error unassigning complaint:", error);
      alert("An error occurred while unassigning the complaint.");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      received: "bg-yellow-100 text-yellow-800",
      in_review: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const labels = {
      received: "Pending",
      in_review: "In Progress",
      resolved: "Resolved",
      rejected: "Rejected",
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      Low: "bg-gray-100 text-gray-800",
      Medium: "bg-orange-100 text-orange-800",
      High: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[priority]}`}>
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50 flex justify-center items-center min-h-screen">
          <div className="text-center">
            <FaSpinner className="animate-spin text-blue-600 text-5xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading Dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 flex-grow">
        <div className="animate-fade-in-up">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-gray-800">
              Volunteer Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Manage complaints in your area: {volunteerLocation}
            </p>
          </header>

          {/* Stats Section */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              icon={<FaTasks className="text-blue-500" />}
              value={stats.totalAssignments}
              label="Total Assignments"
            />
            <StatCard
              icon={<FaExclamationCircle className="text-yellow-500" />}
              value={stats.pendingAssignments}
              label="Pending"
            />
            <StatCard
              icon={<FaSpinner className="text-orange-500" />}
              value={stats.inProgressAssignments}
              label="In Progress"
            />
            <StatCard
              icon={<FaCheckCircle className="text-green-500" />}
              value={stats.resolvedAssignments}
              label="Resolved"
            />
          </section>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("nearby")}
              className={`pb-3 px-4 font-semibold transition-colors ${
                activeTab === "nearby"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Nearby Complaints ({nearbyComplaints.length})
            </button>
            <button
              onClick={() => setActiveTab("myAssignments")}
              className={`pb-3 px-4 font-semibold transition-colors ${
                activeTab === "myAssignments"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              My Assignments ({myAssignments.length})
            </button>
          </div>

          {/* Content */}
          {activeTab === "nearby" ? (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Complaints Near You
              </h2>
              {nearbyComplaints.length === 0 ? (
                <div className="text-center bg-white rounded-xl shadow-md p-12">
                  <p className="text-gray-500 text-lg">
                    No nearby complaints found.
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
                    />
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                My Assigned Complaints
              </h2>
              {myAssignments.length === 0 ? (
                <div className="text-center bg-white rounded-xl shadow-md p-12">
                  <p className="text-gray-500 text-lg">
                    You haven't been assigned any complaints yet.
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
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const StatCard = ({ icon, value, label }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-5 transition-all duration-300 hover:shadow-xl hover:scale-105">
    <div className="text-4xl">{icon}</div>
    <div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-gray-500">{label}</p>
    </div>
  </div>
);

const NearbyComplaintCard = ({
  complaint,
  formatDate,
  getStatusBadge,
  getPriorityBadge,
  handleAssignToSelf,
}) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
    {complaint.photo && (
      <img
        src={complaint.photo}
        alt={complaint.title}
        className="w-full h-40 object-cover"
      />
    )}
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        {getStatusBadge(complaint.status)}
        {getPriorityBadge(complaint.priority)}
      </div>
      <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
        {complaint.title}
      </h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {complaint.description}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <span className="font-semibold">Type:</span> {complaint.type}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <span className="font-semibold">Reported:</span>{" "}
        {formatDate(complaint.createdAt)}
      </p>
      {complaint.distance && (
        <p className="text-sm text-gray-500 mb-3">
          <span className="font-semibold">Distance:</span> {complaint.distance} km
        </p>
      )}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <FaMapMarkerAlt className="mr-2" />
        <span className="line-clamp-1">{complaint.address}</span>
      </div>
      <button
        onClick={() => handleAssignToSelf(complaint._id)}
        disabled={complaint.assigned_to}
        className={`w-full py-2 rounded-lg font-semibold transition-colors ${
          complaint.assigned_to
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {complaint.assigned_to ? "Already Assigned" : "Assign to Me"}
      </button>
    </div>
  </div>
);

const AssignedComplaintCard = ({
  complaint,
  formatDate,
  getStatusBadge,
  getPriorityBadge,
  handleUpdateStatus,
  handleUnassign,
}) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
    {complaint.photo && (
      <img
        src={complaint.photo}
        alt={complaint.title}
        className="w-full h-40 object-cover"
      />
    )}
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        {getStatusBadge(complaint.status)}
        {getPriorityBadge(complaint.priority)}
      </div>
      <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
        {complaint.title}
      </h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {complaint.description}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <span className="font-semibold">Type:</span> {complaint.type}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <span className="font-semibold">Reported:</span>{" "}
        {formatDate(complaint.createdAt)}
      </p>
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <FaMapMarkerAlt className="mr-2" />
        <span className="line-clamp-1">{complaint.address}</span>
      </div>

      {/* Status Update Buttons */}
      <div className="space-y-2 mt-auto">
        <div className="text-xs font-semibold text-gray-700 mb-2">
          Update Status:
        </div>
        <div className="grid grid-cols-2 gap-2">
          {complaint.status !== "received" && (
            <button
              onClick={() => handleUpdateStatus(complaint._id, "received")}
              className="px-3 py-2 text-xs bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 font-semibold transition-colors"
            >
              Pending
            </button>
          )}
          <button
            onClick={() => handleUnassign(complaint._id)}
            className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-colors"
          >
            Unassign
          </button>
          {complaint.status !== "in_review" && (
            <button
              onClick={() => handleUpdateStatus(complaint._id, "in_review")}
              className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-semibold transition-colors"
            >
              In Progress
            </button>
          )}
          {complaint.status !== "resolved" && (
            <button
              onClick={() => handleUpdateStatus(complaint._id, "resolved")}
              className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-semibold transition-colors"
            >
              Resolved
            </button>
          )}
          {complaint.status !== "rejected" && (
            <button
              onClick={() => handleUpdateStatus(complaint._id, "rejected")}
              className="px-3 py-2 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold transition-colors"
            >
              Reject
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default VolunteerDashboard;

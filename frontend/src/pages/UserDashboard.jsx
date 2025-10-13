import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaCheckCircle,
  FaSpinner,
  FaUserShield,
  FaArrowLeft,
  FaTrash,
  FaPlus,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Footer from "../Components/Footer";

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

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(
          "http://localhost:3002/api/complaints/my-reports",
          {
            credentials: "include",
          }
        );
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

  const handleDelete = async (complaintId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:3002/api/complaints/${complaintId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Report deleted successfully!");
        setDashboardData((prevData) => {
          const deletedComplaint = prevData.complaints.find(
            (c) => c._id === complaintId
          );
          if (!deletedComplaint) return prevData;

          const newStats = { ...prevData.stats };
          newStats.totalReports -= 1;
          if (deletedComplaint.status === "resolved") newStats.resolvedReports -= 1;
          if (deletedComplaint.status === "received") newStats.pendingReports -= 1;
          if (deletedComplaint.status === "in_review") newStats.inProgressReports -= 1;

          return {
            ...prevData,
            complaints: prevData.complaints.filter((c) => c._id !== complaintId),
            stats: newStats,
          };
        });
      } else {
        alert(data.message || "Failed to delete report.");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("An error occurred while deleting the report.");
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
      in_review: "In Review",
      resolved: "Resolved",
      rejected: "Rejected",
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });

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
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {!showAllReports ? (
          <div className="animate-fade-in-up">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Welcome, {user ? user.name : "Guest"}!</h1>
                <p className="text-gray-500 mt-1">Track your reports and community impact.</p>
              </div>
              <button
                onClick={() => navigate("/ReportIssue")}
                className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 mt-4 sm:mt-0"
              >
                <FaPlus /> Report a New Issue
              </button>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard icon={<FaClipboardList className="text-blue-500" />} value={dashboardData.stats.totalReports} label="Total Reports" />
              <StatCard icon={<FaCheckCircle className="text-green-500" />} value={dashboardData.stats.resolvedReports} label="Resolved" />
              <StatCard icon={<FaSpinner className="text-yellow-500" />} value={dashboardData.stats.inProgressReports} label="In Progress" />
              <StatCard icon={<FaUserShield className="text-purple-500" />} value={user.role} label="Your Role" />
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
                {dashboardData.complaints.length > 3 && (
                   <button onClick={() => setShowAllReports(true)} className="font-semibold text-blue-600 hover:underline">
                    View All
                  </button>
                )}
              </div>
              {dashboardData.complaints.length === 0 ? (
                <div className="text-center bg-white rounded-xl shadow-md p-12">
                  <p className="text-gray-500 mb-4 text-lg">You haven't reported any issues yet.</p>
                  <button onClick={() => navigate("/ReportIssue")} className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors">
                    Report Your First Issue
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.complaints.slice(0, 3).map((c) => <ReportCard key={c._id} complaint={c} formatDate={formatDate} getStatusBadge={getStatusBadge} handleDelete={handleDelete} />)}
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <header className="flex items-center gap-4 mb-8">
              <button onClick={() => setShowAllReports(false)} className="bg-white shadow-md hover:shadow-lg text-gray-700 hover:text-blue-600 p-3 rounded-full transition-all duration-300">
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">All My Reports</h1>
                <p className="text-gray-500">A complete history of your submissions.</p>
              </div>
            </header>
            {dashboardData.complaints.length === 0 ? (
              <div className="text-center bg-white rounded-xl shadow-md p-12"><p className="text-gray-500 text-lg">No reports found.</p></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dashboardData.complaints.map((c) => <ReportCard key={c._id} complaint={c} formatDate={formatDate} getStatusBadge={getStatusBadge} handleDelete={handleDelete} />)}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer/>
    </div>
  );
};

const StatCard = ({ icon, value, label }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-5 transition-all duration-300 hover:shadow-xl hover:scale-105">
    <div className="text-4xl">{icon}</div>
    <div>
      <p className="text-3xl font-bold text-gray-800 capitalize">{value}</p>
      <p className="text-gray-500">{label}</p>
    </div>
  </div>
);

const ReportCard = ({ complaint, formatDate, getStatusBadge, handleDelete }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      {complaint.photo && (
        <img src={complaint.photo} alt={complaint.title} className="w-full h-40 object-cover" />
      )}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          {getStatusBadge(complaint.status)}
          <button onClick={() => handleDelete(complaint._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Delete Report">
            <FaTrash />
          </button>
        </div>
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 flex-grow">{complaint.title}</h3>
        <p className="text-sm text-gray-500 mb-1 line-clamp-1"><span className="font-semibold">Type:</span> {complaint.type}</p>
        <p className="text-sm text-gray-500"><span className="font-semibold">Reported:</span> {formatDate(complaint.createdAt)}</p>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <FaMapMarkerAlt className="mr-2" />
          <span>{complaint.address}</span>
        </div>
      </div>
    </div>
  );
  

export default UserDashboard;
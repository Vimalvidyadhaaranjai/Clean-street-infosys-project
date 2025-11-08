// src/pages/AdminDashboard.jsx - MODIFIED WITH NEW PALETTE

import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import AdminStatistics from "../Components/AdminStatistics";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiClipboard, FiAlertCircle, FiCheckCircle, FiEdit, FiSave, FiX, FiLoader, FiActivity, FiUserCheck, FiClock, FiDownload, FiFilter } from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, totalComplaints: 0, pendingComplaints: 0, resolvedComplaints: 0 });
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [editingComplaintId, setEditingComplaintId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [activities, setActivities] = useState([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [complaintLocationFilter, setComplaintLocationFilter] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const backend_Url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";

  useEffect(() => {
    if (currentUser?.role !== "admin") {
      toast.error("Access Denied: Admins only.");
      navigate("/UserDashboard");
      return;
    }
    fetchData();
  }, [navigate, currentUser?.role]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, usersRes, complaintsRes, logsRes] = await Promise.all([
        fetch(`${backend_Url}/api/admin/stats`, { credentials: "include" }),
        fetch(`${backend_Url}/api/admin/users`, { credentials: "include" }),
        fetch(`${backend_Url}/api/admin/complaints`, { credentials: "include" }),
        fetch(`${backend_Url}/api/admin/logs`, { credentials: "include" }),
      ]);

      if (!statsRes.ok || !usersRes.ok || !complaintsRes.ok) {
        const errorData = await (statsRes.ok ? usersRes.ok ? complaintsRes : usersRes : statsRes).json();
        throw new Error(errorData.message || 'Failed to fetch admin data. Ensure you are logged in as admin.');
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const complaintsData = await complaintsRes.json();
      const logsData = await logsRes.json();

      if (statsData.success) setStats(statsData.data);
      if (usersData.success) setUsers(usersData.data);
      if (complaintsData.success) setComplaints(complaintsData.data);
      if (logsData.success) setActivities(logsData.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError(err.message || "Failed to load data. Please try again.");
      if (err.message.includes('403') || err.message.includes('401') || err.message.includes('logged in')) {
        toast.error("Authentication failed or forbidden access. Please log in as an admin.");
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (user) => {
    setEditingUserId(user._id);
    setSelectedRole(user.role);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setSelectedRole("");
  };

  const handleSaveRole = async (userId) => {
    if (!selectedRole || !editingUserId || userId !== editingUserId) return;
    setIsSavingRole(true);
    try {
      const res = await fetch(`${backend_Url}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: selectedRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('User role updated successfully!');
        setEditingUserId(null);
        fetchData();
      } else {
        throw new Error(data.message || 'Failed to update role.');
      }
    } catch (err) {
      console.error("Error updating role:", err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsSavingRole(false);
    }
  };

  const handleEditStatus = (complaint) => {
    setEditingComplaintId(complaint._id);
    setSelectedStatus(complaint.status);
  };

  const handleCancelStatusEdit = () => {
    setEditingComplaintId(null);
    setSelectedStatus("");
  };

  const handleSaveStatus = async (complaintId) => {
    if (!selectedStatus || !editingComplaintId || complaintId !== editingComplaintId) return;
    setIsSavingStatus(true);
    try {
      const res = await fetch(`${backend_Url}/api/admin/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: selectedStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Complaint status updated successfully!');
        setEditingComplaintId(null);
        fetchData();
      } else {
        throw new Error(data.message || 'Failed to update status.');
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsSavingStatus(false);
    }
  };

  // CHANGED: Badge colors for dark theme
  const getStatusBadge = (status) => {
    const styles = {
      received: "bg-[var(--color-primary-accent)]/20 text-[var(--color-primary-accent)] border border-[var(--color-primary-accent)]/30",
      in_review: "bg-[var(--color-light-bg)]/50 text-[var(--color-text-light)] border border-[var(--color-light-bg)]",
      resolved: "bg-green-900/50 text-green-300 border border-green-700",
      rejected: "bg-red-900/50 text-red-300 border border-red-700",
    };
    const labels = { received: "Pending", in_review: "In Review", resolved: "Resolved", rejected: "Rejected" };
    return <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-700 text-gray-200 border-gray-600'}`}>{labels[status] || status}</span>;
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }

  );
  const locationMap = new Map();
  users.forEach(user => {
    if (user.location) 
      {
      const lowerLocation = user.location.toLowerCase();
      if (!locationMap.has(lowerLocation)) 
        {
        locationMap.set(lowerLocation, user.location);
      }
    }
  });
  const uniqueLocations = Array.from(locationMap.values()).sort();

  const filteredUsers = users.filter(user => 
    {
    const matchesLocation = !locationFilter || 
      (user.location && user.location.toLowerCase() === locationFilter.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesLocation && matchesRole;
  }
);  const complaintLocationMap = new Map();
  complaints.forEach(complaint => {
    const location = complaint.user_id?.location;
    if (location) {
      const lowerLocation = location.toLowerCase();
      if (!complaintLocationMap.has(lowerLocation)) {
        complaintLocationMap.set(lowerLocation, location);
      }
    }
  });
  const uniqueComplaintLocations = Array.from(complaintLocationMap.values()).sort();
  const assignedToMap = new Map()
  ;
  complaints.forEach(complaint => 
    {
    if (complaint.assigned_to && complaint.assigned_to._id) {
      assignedToMap.set(complaint.assigned_to._id, {
        id: complaint.assigned_to._id,
        name: complaint.assigned_to.name
      }
    );
    }
  });
  const uniqueAssignedTo = Array.from(assignedToMap.values()).sort((a, b) => a.name.localeCompare(b.name)
);
  const filteredComplaints = complaints.filter(complaint => {
    const matchesLocation = !complaintLocationFilter || 
      (complaint.user_id?.location && complaint.user_id.location.toLowerCase() === complaintLocationFilter.toLowerCase());
    const matchesAssignment = !assignedToFilter || 
      (assignedToFilter === 'unassigned' ? !complaint.assigned_to : complaint.assigned_to?._id === assignedToFilter);
    return matchesLocation && matchesAssignment;
  });

  // (downloadReport functions remain the same logic, not modifying internals)
  const downloadReport = async (format) => {
    try {
      setShowDownloadModal(false);
      toast.loading(`Generating ${format.toUpperCase()} report...`);
      
      const res = await fetch(`${backend_Url}/api/admin/detailed-stats`,
         {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch statistics for report");
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error("Failed to generate report");
      }

      const detailedStats = data.data;

      if (format === 'excel') {
        downloadExcelReport(detailedStats);
      } else if (format === 'pdf') {
        downloadPDFReport(detailedStats);
      }

      toast.dismiss();
      toast.success(`${format.toUpperCase()} report downloaded successfully!`);
    } catch (err) {
      console.error("Error downloading report:", err);
      toast.dismiss();
      toast.error(err.message || "Failed to download report");
    }
  };
  const downloadExcelReport = (detailedStats) =>
     {
    let csvContent = "Clean Street - Admin Statistical Report\n";
   csvContent += `Generated on: ${new Date().toLocaleString()}\n\n`;
    csvContent += "=== SUMMARY STATISTICS ===\n";
    csvContent += `Total Users,${stats.totalUsers}\n`;
    csvContent += `Total Complaints,${stats.totalComplaints}\n`;
    csvContent += `Pending Complaints,${stats.pendingComplaints}\n`;
    csvContent += `Resolved Complaints,${stats.resolvedComplaints}\n\n`;
   csvContent += "=== COMPLAINT STATUS DISTRIBUTION ===\n";
    csvContent += "Status,Count\n";
    detailedStats.complaintsByStatus.forEach(item => {
      const statusLabel = item._id === 'received' ? 'Pending' : 
                        item._id === 'in_review' ? 'In Review' : 
                        item._id === 'resolved' ? 'Resolved' : 
                        item._id === 'rejected' ? 'Rejected' : item._id;
      csvContent += `${statusLabel},${item.count}\n`;
    });
    csvContent += "\n";
   csvContent += "=== COMPLAINT TYPES DISTRIBUTION ===\n";
    csvContent += "Type,Count\n";
    detailedStats.complaintsByType.forEach(item => {
      csvContent += `${item._id || 'Unknown'},${item.count}\n`;
    });
    csvContent += "\n";
  csvContent += "=== USER ROLES DISTRIBUTION ===\n";
    csvContent += "Role,Count\n";
    detailedStats.usersByRole.forEach(item => {
      csvContent += `${item._id.charAt(0).toUpperCase() + item._id.slice(1)},${item.count}\n`;
    });
        csvContent += "\n";
    csvContent += "=== COMPLAINTS OVER TIME (LAST 7 DAYS) ===\n";
    csvContent += "Date,Count\n";
    detailedStats.complaintsOverTime.forEach(item => {
      csvContent += `${item._id},${item.count}\n`;
    });    csvContent += "\n";
    csvContent += "=== MONTHLY COMPLAINT TRENDS (LAST 6 MONTHS) ===\n";
    csvContent += "Month,Count\n";
    detailedStats.monthlyComplaints.forEach(item => {
      csvContent += `${item._id},${item.count}\n`;
    });
   csvContent += "\n";
    csvContent += "=== USER REGISTRATIONS (LAST 30 DAYS) ===\n";
    csvContent += "Date,Count\n";
    detailedStats.userRegistrations.forEach(item => {
      csvContent += `${item._id},${item.count}\n`;
    });    csvContent += "\n";
    csvContent += "=== TOP 5 COMPLAINT TYPES ===\n";
    csvContent += "Type,Count\n";
    detailedStats.topComplaintTypes.forEach(item => {
      csvContent += `${item._id || 'Unknown'},${item.count}\n`;
    });
   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `clean-street-report-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
const downloadPDFReport = (detailedStats) => {
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Clean Street - Statistical Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          h1 { color: #4f46e5; border-bottom: 3px solid #4f46e5; padding-bottom: 10px; }
          h2 { color: #6366f1; margin-top: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
          .header { text-align: center; margin-bottom: 30px; }
          .date { color: #6b7280; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background-color: #f3f4f6; font-weight: 600; color: #374151; }
          tr:hover { background-color: #f9fafb; }
          .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
          .summary-card { background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #4f46e5; }
          .summary-card h3 { margin: 0 0 10px 0; color: #6b7280; font-size: 14px; }
          .summary-card .value { font-size: 32px; font-weight: bold; color: #1f2937; }
          @media print {
            body { margin: 20px; }
            .page-break { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Clean Street - Admin Statistical Report</h1>
          <p class="date">Generated on: ${new Date().toLocaleString()}</p>        </div>
        <h2>Summary Statistics</h2>
        <div class="summary-grid">
          <div class="summary-card">
            <h3>Total Users</h3>
            <div class="value">${stats.totalUsers}</div>
          </div>
          <div class="summary-card">
            <h3>Total Complaints</h3>
            <div class="value">${stats.totalComplaints}</div>
          </div>
          <div class="summary-card">
            <h3>Pending Complaints</h3>
            <div class="value">${stats.pendingComplaints}</div>
          </div>
          <div class="summary-card">
            <h3>Resolved Complaints</h3>
            <div class="value">${stats.resolvedComplaints}</div>
          </div>
      </div>
        <h2>Complaint Status Distribution</h2>
        <table>
          <thead>
            <tr><th>Status</th><th>Count</th></tr>
          </thead>
          <tbody>
            ${detailedStats.complaintsByStatus.map(item => {
              const statusLabel = item._id === 'received' ? 'Pending' : 
                                item._id === 'in_review' ? 'In Review' : 
                                item._id === 'resolved' ? 'Resolved' : 
                                item._id === 'rejected' ? 'Rejected' : item._id;
              return `<tr><td>${statusLabel}</td><td>${item.count}</td></tr>`;
            }).join('')}
          </tbody>
        </table>
      <h2>Complaint Types Distribution</h2>
        <table>
          <thead>
            <tr><th>Type</th><th>Count</th></tr>
          </thead>
          <tbody>
            ${detailedStats.complaintsByType.map(item => 
              `<tr><td>${item._id || 'Unknown'}</td><td>${item.count}</td></tr>`
            ).join('')}
          </tbody>
        </table>
       <div class="page-break"></div>
        <h2>User Roles Distribution</h2>
        <table>
          <thead>
            <tr><th>Role</th><th>Count</th></tr>
          </thead>
          <tbody>
            ${detailedStats.usersByRole.map(item => 
              `<tr><td>${item._id.charAt(0).toUpperCase() + item._id.slice(1)}</td><td>${item.count}</td></tr>`
            ).join('')}
        </tbody>        </table>
        <h2>Complaints Over Time (Last 7 Days)</h2>
        <table>
          <thead>
            <tr><th>Date</th><th>Count</th></tr>
          </thead>
          <tbody>
            ${detailedStats.complaintsOverTime.map(item => 
              `<tr><td>${item._id}</td><td>${item.count}</td></tr>`
            ).join('')}
          </tbody>
        </table>
       <h2>Monthly Complaint Trends (Last 6 Months)</h2>
        <table>
          <thead>
            <tr><th>Month</th><th>Count</th></tr>
          </thead>
          <tbody>
            ${detailedStats.monthlyComplaints.map(item => 
              `<tr><td>${item._id}</td><td>${item.count}</td></tr>`
            ).join('')}
          </tbody>
        </table>
       <h2>User Registrations (Last 30 Days)</h2>
        <table>
          <thead>
            <tr><th>Date</th><th>Count</th></tr>
          </thead>
          <tbody>
            ${detailedStats.userRegistrations.map(item => 
              `<tr><td>${item._id}</td><td>${item.count}</td></tr>`
            ).join('')}
          </tbody>
        </table>
       <h2>Top 5 Complaint Types</h2>
        <table>
          <thead>
            <tr><th>Type</th><th>Count</th></tr>
          </thead>
          <tbody>
            ${detailedStats.topComplaintTypes.map(item => 
              `<tr><td>${item._id || 'Unknown'}</td><td>${item.count}</td></tr>`
            ).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
   const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `clean-street-report-${timestamp}.html`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
   const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 250);
      };
    }
  };

  // CHANGED: Loading state styling
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-dark-bg)] flex flex-col">
        <Toaster position="bottom-center" reverseOrder={false} />
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin mx-auto h-12 w-12 text-[var(--color-primary-accent)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg font-medium text-[var(--color-text-light)]/70">Loading Admin Dashboard...</p>
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
        <Toaster position="bottom-center" reverseOrder={false} />
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center bg-red-900/50 p-6 rounded-lg shadow border border-red-700 max-w-lg w-full">
            <FiAlertCircle className="mx-auto text-red-300 text-4xl mb-3" />
            <p className="font-semibold text-red-200 text-lg">Error Loading Dashboard</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
            <button onClick={() => navigate('/login')} className="mt-5 px-4 py-2 bg-[var(--color-primary-accent)] text-[var(--color-text-dark)] text-sm font-semibold rounded hover:bg-[var(--color-secondary-accent)] transition-colors">
              Go to Login
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
      <Toaster position="bottom-center" reverseOrder={false} />
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 flex-grow">
        <header className="mb-6 sm:mb-8 animate-fade-in-down flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            {/* CHANGED: Text colors */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text-light)] tracking-tight">Admin Dashboard</h1>
            <p className="text-[var(--color-text-light)]/70 mt-1 text-sm sm:text-base">Overview and management tools.</p>
          </div>
          {/* CHANGED: Button colors */}
          <button
            onClick={() => setShowDownloadModal(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[var(--color-primary-accent)] text-[var(--color-text-dark)] text-sm sm:text-base font-semibold rounded-lg shadow hover:bg-[var(--color-secondary-accent)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-dark-bg)] w-full sm:w-auto"
          >
            <FiDownload size={18} />
            <span>Download Report</span>
          </button>
        </header>

        {/* CHANGED: Tab border color */}
        <div className="border-b border-[var(--color-light-bg)] mb-4 sm:mb-6">
          <nav className="flex -mb-px justify-around sm:justify-start sm:space-x-6" aria-label="Tabs">
            <TabButton id="overview" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FiActivity />}>
              <span className="hidden sm:inline">Overview</span>
            </TabButton>
            <TabButton id="users" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FiUsers />}>
              <span className="hidden sm:inline">Manage Users ({stats.totalUsers})</span>
            </TabButton>
            <TabButton id="complaints" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FiClipboard />}>
              <span className="hidden sm:inline">View Complaints ({stats.totalComplaints})</span>
            </TabButton>
            <TabButton id="recent activities" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FiClock />}>
              <span className="hidden sm:inline">Recent Activities</span>
            </TabButton>
          </nav>
        </div>

        <div className="animate-fade-in-up">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* CHANGED: Icon colors */}
                <StatCard icon={<FiUsers className="text-[var(--color-primary-accent)]" />} value={stats.totalUsers} label="Total Users" />
                <StatCard icon={<FiClipboard className="text-[var(--color-secondary-accent)]" />} value={stats.totalComplaints} label="Total Complaints" />
                <StatCard icon={<FiClock className="text-[var(--color-primary-accent)]" />} value={stats.pendingComplaints} label="Pending Complaints" />
                <StatCard icon={<FiCheckCircle className="text-green-400" />} value={stats.resolvedComplaints} label="Resolved Complaints" />
              </section>
              
             <AdminStatistics />
            </div>
          )}

          {activeTab === 'users' && (
            // CHANGED: Card bg and border
            <section className="bg-[var(--color-medium-bg)] p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg border border-[var(--color-light-bg)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
                {/* CHANGED: Text color */}
                <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-text-light)]">User Management</h2>
               
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                  {/* CHANGED: Filter text color */}
                  <div className="flex items-center gap-2 text-[var(--color-text-light)]/70">
                    <FiFilter size={18} />
                    <span className="text-sm font-medium">Filters:</span>
                  </div>
                  
                  {/* CHANGED: Select dropdown colors */}
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-[var(--color-light-bg)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:border-[var(--color-primary-accent)] bg-[var(--color-dark-bg)] text-[var(--color-text-light)] hover:border-[var(--color-primary-accent)]/50 transition-colors"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  
                  {/* CHANGED: Select dropdown colors */}
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-[var(--color-light-bg)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:border-[var(--color-primary-accent)] bg-[var(--color-dark-bg)] text-[var(--color-text-light)] hover:border-[var(--color-primary-accent)]/50 transition-colors"
                  >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="admin">Admin</option>
                  </select>
                  
                  {/* CHANGED: Clear button colors */}
                  {(locationFilter || roleFilter) && (
                    <button
                      onClick={() => {
                        setLocationFilter("");
                        setRoleFilter("");
                      }}
                      className="px-3 py-2 text-sm text-[var(--color-primary-accent)] hover:text-[var(--color-secondary-accent)] hover:bg-[var(--color-light-bg)]/30 rounded-lg transition-colors font-medium"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
              
              {/* CHANGED: Results text color */}
              <p className="text-sm text-[var(--color-text-light)]/70 mb-3">
                Showing {filteredUsers.length} of {users.length} users
              </p>
              
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {filteredUsers.map(user => (
                  // CHANGED: Card colors
                  <div key={user._id} className="border border-[var(--color-light-bg)] rounded-lg p-4 hover:shadow-md transition-shadow bg-[var(--color-dark-bg)]/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--color-text-light)] text-sm truncate">{user.name}</h3>
                        <p className="text-xs text-[var(--color-text-light)]/60 truncate">{user.email}</p>
                      </div>
                      {editingUserId === user._id ? (
                        <div className="flex items-center gap-2 ml-2">
                          <button
                            onClick={() => handleSaveRole(user._id)}
                            className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-800/50 rounded disabled:opacity-50"
                            disabled={isSavingRole}
                            title="Save Role"
                          >
                            {isSavingRole ? <FiLoader className="animate-spin" size={16}/> : <FiSave size={16} />}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-800/50 rounded disabled:opacity-50"
                            disabled={isSavingRole}
                            title="Cancel"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditRole(user)}
                          className="p-1.5 text-[var(--color-primary-accent)] hover:text-[var(--color-secondary-accent)] hover:bg-[var(--color-light-bg)]/50 rounded disabled:opacity-50 disabled:text-gray-600"
                          disabled={currentUser._id === user._id}
                          title={currentUser._id === user._id ? "Cannot edit own role" : "Edit Role"}
                        >
                          <FiEdit size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--color-text-light)]/60">Location:</span>
                        <span className="text-[var(--color-text-light)]/90">{user.location || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--color-text-light)]/60">Role:</span>
                        {editingUserId === user._id ? (
                          <select
                            value={selectedRole}
                            onChange={e => setSelectedRole(e.target.value)}
                            className="border border-[var(--color-light-bg)] rounded px-2 py-1 text-xs focus:ring-1 focus:ring-[var(--color-primary-accent)] bg-[var(--color-dark-bg)] text-[var(--color-text-light)]"
                            disabled={isSavingRole}
                          >
                            <option value="user">User</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-900/50 text-red-300' : user.role === 'volunteer' ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 text-gray-200'}`}>
                            {user.role}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--color-text-light)]/60">Joined:</span>
                        <span className="text-[var(--color-text-light)]/90">{formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--color-light-bg)]">
                  {/* CHANGED: Table header colors */}
                  <thead className="bg-[var(--color-dark-bg)]">
                    <tr>
                      <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-[var(--color-text-light)]/70 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-[var(--color-text-light)]/70 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-[var(--color-text-light)]/70 uppercase tracking-wider">Location</th>
                      <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-[var(--color-text-light)]/70 uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-[var(--color-text-light)]/70 uppercase tracking-wider">Joined</th>
                      <th scope="col" className="px-5 py-3 text-center text-xs font-medium text-[var(--color-text-light)]/70 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  {/* CHANGED: Table body colors */}
                  <tbody className="bg-[var(--color-medium-bg)] divide-y divide-[var(--color-light-bg)]">
                    {filteredUsers.map(user => (
                      <tr key={user._id} className="hover:bg-[var(--color-light-bg)]/30 transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-light)]">{user.name}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-[var(--color-text-light)]/70">{user.email}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-[var(--color-text-light)]/70">{user.location || 'N/A'}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-[var(--color-text-light)]/70">
                          {editingUserId === user._id ? (
                            <select
                              value={selectedRole}
                              onChange={e => setSelectedRole(e.target.value)}
                              className="border border-[var(--color-light-bg)] rounded px-2 py-1 text-sm focus:ring-1 focus:ring-[var(--color-primary-accent)] bg-[var(--color-dark-bg)] text-[var(--color-text-light)]"
                              disabled={isSavingRole}
                            >
                              <option value="user">User</option>
                              <option value="volunteer">Volunteer</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-900/50 text-red-300' : user.role === 'volunteer' ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 text-gray-200'}`}>
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-[var(--color-text-light)]/70">{formatDate(user.createdAt)}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-center text-sm font-medium">
                          {editingUserId === user._id ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleSaveRole(user._id)}
                                className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-800/50 rounded disabled:opacity-50"
                                disabled={isSavingRole}
                                title="Save Role"
                              >
                                {isSavingRole ? <FiLoader className="animate-spin" size={16}/> : <FiSave size={16} />}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-800/50 rounded disabled:opacity-50"
                                disabled={isSavingRole}
                                title="Cancel Edit"
                              >
                                <FiX size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditRole(user)}
                              className="p-1.5 text-[var(--color-primary-accent)] hover:text-[var(--color-secondary-accent)] hover:bg-[var(--color-light-bg)]/50 rounded disabled:opacity-50 disabled:text-gray-600 disabled:hover:bg-transparent"
                              disabled={currentUser._id === user._id}
                              title={currentUser._id === user._id ? "Cannot edit own role" : "Edit Role"}
                            >
                              <FiEdit size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredUsers.length === 0 && (
                <p className="text-center text-[var(--color-text-light)]/60 py-6 text-sm sm:text-base">No users found matching the selected filters.</p>
              )}
            </section>
          )}

          {activeTab === 'complaints' && (
            // CHANGED: Card bg and border
            <section className="bg-[var(--color-medium-bg)] p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg border border-[var(--color-light-bg)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
                <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-text-light)]">All Complaints</h2>
              
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                  <div className="flex items-center gap-2 text-[var(--color-text-light)]/70">
                    <FiFilter size={18} />
                    <span className="text-sm font-medium">Filters:</span>
                  </div>
                  
                  <select
                    value={complaintLocationFilter}
                    onChange={(e) => setComplaintLocationFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-[var(--color-light-bg)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:border-[var(--color-primary-accent)] bg-[var(--color-dark-bg)] text-[var(--color-text-light)] hover:border-[var(--color-primary-accent)]/50 transition-colors"
                  >
                    <option value="">All Locations</option>
                    {uniqueComplaintLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  
                  <select
                    value={assignedToFilter}
                    onChange={(e) => setAssignedToFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-[var(--color-light-bg)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:border-[var(--color-primary-accent)] bg-[var(--color-dark-bg)] text-[var(--color-text-light)] hover:border-[var(--color-primary-accent)]/50 transition-colors"
                  >
                    <option value="">All Assignments</option>
                    <option value="unassigned">Unassigned</option>
                    {uniqueAssignedTo.map(volunteer => (
                      <option key={volunteer.id} value={volunteer.id}>{volunteer.name}</option>
                    ))}
                  </select>
                  
                  {(complaintLocationFilter || assignedToFilter) && (
                    <button
                      onClick={() => {
                        setComplaintLocationFilter("");
                        setAssignedToFilter("");
                      }}
                      className="px-3 py-2 text-sm text-[var(--color-primary-accent)] hover:text-[var(--color-secondary-accent)] hover:bg-[var(--color-light-bg)]/30 rounded-lg transition-colors font-medium"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-[var(--color-text-light)]/70 mb-3">
                Showing {filteredComplaints.length} of {complaints.length} complaints
              </p>
              
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {filteredComplaints.map(complaint => (
                  <div key={complaint._id} className="border border-[var(--color-light-bg)] rounded-lg p-4 hover:shadow-md transition-shadow bg-[var(--color-dark-bg)]/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--color-text-light)] text-sm mb-1">{complaint.title}</h3>
                        <p className="text-xs text-[var(--color-text-light)]/60">by {complaint.user_id?.name || 'Unknown User'}</p>
                      </div>
                      {editingComplaintId === complaint._id ? (
                        <div className="flex items-center gap-2 ml-2">
                          <button
                            onClick={() => handleSaveStatus(complaint._id)}
                            className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-800/50 rounded disabled:opacity-50"
                            disabled={isSavingStatus}
                            title="Save"
                          >
                            {isSavingStatus ? <FiLoader className="animate-spin" size={16}/> : <FiSave size={16} />}
                          </button>
                          <button
                            onClick={handleCancelStatusEdit}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-800/50 rounded disabled:opacity-50"
                            disabled={isSavingStatus}
                            title="Cancel"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditStatus(complaint)}
                          className="p-1.5 text-[var(--color-primary-accent)] hover:text-[var(--color-secondary-accent)] hover:bg-[var(--color-light-bg)]/50 rounded"
                          title="Edit Status"
                        >
                          <FiEdit size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--color-text-light)]/60">Type:</span>
                        <span className="text-[var(--color-text-light)]/90 font-medium">{complaint.type}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--color-text-light)]/60">Location:</span>
                        <span className="text-[var(--color-text-light)]/90">{complaint.user_id?.location || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--color-text-light)]/60">Status:</span>
                        {editingComplaintId === complaint._id ? (
                          <select
                            value={selectedStatus}
                            onChange={e => setSelectedStatus(e.target.value)}
                            className="border border-[var(--color-light-bg)] rounded px-2 py-1 text-xs focus:ring-1 focus:ring-[var(--color-primary-accent)] bg-[var(--color-dark-bg)] text-[var(--color-text-light)]"
                            disabled={isSavingStatus}
                          >
                            <option value="received">Pending</option>
                            <option value="in_review">In Review</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        ) : (
                          getStatusBadge(complaint.status)
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--color-text-light)]/60">Assigned To:</span>
                        <span className="text-[var(--color-text-light)]/90">{complaint.assigned_to?.name || <span className="text-gray-500 italic">Unassigned</span>}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--color-text-light)]/60">Date:</span>
                        <span className="text-[var(--color-text-light)]/90">{formatDate(complaint.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--color-light-bg)]">
                  <thead className="bg-[var(--color-dark-bg)]">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[var(--color-text-light)]/70 uppercase tracking-wider">Title</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[var(--color-text-light)]/70 uppercase tracking-wider">Reported By</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[var(--color-text-light)]/70 uppercase tracking-wider">Location</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[var(--color-text-light)]/70 uppercase tracking-wider">Type</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[var(--color-text-light)]/70 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[var(--color-text-light)]/70 uppercase tracking-wider">Assigned To</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[var(--color-text-light)]/70 uppercase tracking-wider">Date</th>
                      <th className="px-5 py-3 text-center text-xs font-medium text-[var(--color-text-light)]/70 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--color-medium-bg)] divide-y divide-[var(--color-light-bg)]">
                    {filteredComplaints.map(complaint => (
                      <tr key={complaint._id} className="hover:bg-[var(--color-light-bg)]/30 transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-light)]">{complaint.title}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-[var(--color-text-light)]/70">{complaint.user_id?.name || 'Unknown User'}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-[var(--color-text-light)]/70">{complaint.user_id?.location || 'N/A'}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-[var(--color-text-light)]/70">{complaint.type}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm">
                          {editingComplaintId === complaint._id ? (
                            <select
                              value={selectedStatus}
                              onChange={e => setSelectedStatus(e.target.value)}
                              className="border border-[var(--color-light-bg)] rounded px-2 py-1 text-sm focus:ring-1 focus:ring-[var(--color-primary-accent)] bg-[var(--color-dark-bg)] text-[var(--color-text-light)]"
                              disabled={isSavingStatus}
                            >
                              <option value="received">Pending</option>
                              <option value="in_review">In Review</option>
                              <option value="resolved">Resolved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          ) : (
                            getStatusBadge(complaint.status)
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-[var(--color-text-light)]/70">{complaint.assigned_to?.name || <span className="text-gray-500 italic">Unassigned</span>}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-[var(--color-text-light)]/70">{formatDate(complaint.createdAt)}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-center text-sm font-medium">
                          {editingComplaintId === complaint._id ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleSaveStatus(complaint._id)}
                                className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-800/50 rounded disabled:opacity-50"
                                disabled={isSavingStatus}
                                title="Save Status"
                              >
                                {isSavingStatus ? <FiLoader className="animate-spin" size={16}/> : <FiSave size={16} />}
                              </button>
                              <button
                                onClick={handleCancelStatusEdit}
                                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-800/50 rounded disabled:opacity-50"
                                disabled={isSavingStatus}
                                title="Cancel Edit"
                              >
                                <FiX size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditStatus(complaint)}
                              className="p-1.5 text-[var(--color-primary-accent)] hover:text-[var(--color-secondary-accent)] hover:bg-[var(--color-light-bg)]/50 rounded"
                              title="Edit Status"
                            >
                              <FiEdit size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredComplaints.length === 0 && (
                <p className="text-center text-[var(--color-text-light)]/60 py-6 text-sm sm:text-base">
                  {complaints.length === 0 ? "No complaints found." : "No complaints found matching the selected filters."}
                </p>
              )}
            </section>
          )}
          
          {activeTab === 'recent activities' && ( 
            // CHANGED: Card bg, text, border, and hover colors
            <div className="bg-[var(--color-medium-bg)] rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 border border-[var(--color-light-bg)]">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[var(--color-text-light)]">Recent Activities</h2>
              <ul className="space-y-2">
                {activities.map((log) => (
                  <li key={log._id} className="rounded-lg hover:bg-[var(--color-light-bg)]/30 px-3 sm:px-4 py-3 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-[var(--color-secondary-accent)] text-sm sm:text-base">{log.user_id?.name || "Unknown Admin"}</span>
                      <span className="hidden sm:inline text-[var(--color-text-light)]/50">-</span>
                      <span className="text-[var(--color-text-light)]/90 text-xs sm:text-sm">{log.action}</span>
                    </div>
                    <div className="text-xs text-[var(--color-text-light)]/60 mt-1">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
              {activities.length === 0 && (
                <p className="text-center text-[var(--color-text-light)]/60 py-6 text-sm sm:text-base">No recent activities.</p>
              )}
           </div>
          )}
        </div>

      </main>

      {/* Download Format Selection Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {/* CHANGED: Modal bg, border, and text colors */}
          <div className="bg-[var(--color-medium-bg)] rounded-xl shadow-2xl max-w-md w-full p-5 sm:p-6 animate-fade-in-up mx-4 border border-[var(--color-light-bg)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-light)]">Download Report</h3>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <p className="text-[var(--color-text-light)]/80 mb-5 sm:mb-6 text-sm sm:text-base">Choose your preferred format to download the statistical report:</p>
            
            <div className="space-y-3">
              {/* CHANGED: Button bg, border, text, and hover colors */}
              <button
                onClick={() => downloadReport('excel')}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 border-[var(--color-light-bg)] rounded-lg hover:border-[var(--color-primary-accent)] hover:bg-[var(--color-light-bg)]/30 transition-all group"
              >
                <div className="p-2 sm:p-3 bg-green-900/50 rounded-lg group-hover:bg-green-800/50 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path d="M14 2v6h6M9 15h6M9 11h6M9 19h6"/>
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h4 className="font-semibold text-[var(--color-text-light)] group-hover:text-[var(--color-primary-accent)] text-sm sm:text-base">Excel (CSV)</h4>
                  <p className="text-xs sm:text-sm text-[var(--color-text-light)]/70">Download as CSV file for Excel/Sheets</p>
                </div>
              </button>

              <button
                onClick={() => downloadReport('pdf')}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 border-[var(--color-light-bg)] rounded-lg hover:border-[var(--color-primary-accent)] hover:bg-[var(--color-light-bg)]/30 transition-all group"
              >
                <div className="p-2 sm:p-3 bg-red-900/50 rounded-lg group-hover:bg-red-800/50 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path d="M14 2v6h6"/>
                    <text x="7" y="18" fontSize="8" fontWeight="bold" fill="currentColor">PDF</text>
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h4 className="font-semibold text-[var(--color-text-light)] group-hover:text-[var(--color-primary-accent)] text-sm sm:text-base">PDF</h4>
                  <p className="text-xs sm:text-sm text-[var(--color-text-light)]/70">Download as formatted PDF document</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowDownloadModal(false)}
              className="w-full mt-4 px-4 py-2 text-sm sm:text-base text-[var(--color-text-light)]/70 hover:text-[var(--color-text-light)] font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

// CHANGED: StatCard component styling
const StatCard = ({ icon, value, label }) => (
  <div className="bg-[var(--color-medium-bg)] p-4 sm:p-5 rounded-xl shadow-lg border border-[var(--color-light-bg)] flex items-center gap-3 sm:gap-4 transition-all duration-300 ease-in-out hover:shadow-xl hover:border-[var(--color-primary-accent)] transform hover:-translate-y-1">
    <div className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-[var(--color-light-bg)] to-[var(--color-medium-bg)] text-xl sm:text-2xl flex-shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xl sm:text-2xl font-bold text-[var(--color-text-light)] capitalize truncate">{value}</p>
      <p className="text-xs sm:text-sm font-medium text-[var(--color-text-light)]/70">{label}</p>
    </div>
  </div>
);

// CHANGED: TabButton component styling
 const TabButton = ({ id, activeTab, setActiveTab, icon, children }) => (
   <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 focus:outline-none focus-visible:bg-[var(--color-light-bg)]/30 rounded-t flex-1 sm:flex-initial
        ${activeTab === id
          ? "border-[var(--color-primary-accent)] text-[var(--color-primary-accent)]"
          : "border-transparent text-[var(--color-text-light)]/60 hover:text-[var(--color-text-light)] hover:border-[var(--color-light-bg)]"
        }`}
      title={id}
    >
      {React.cloneElement(icon, { size: 20, className: "sm:w-4 sm:h-4" })}
      {children}
   </button>
 );


export default AdminDashboard;
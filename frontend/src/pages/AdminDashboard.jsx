import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaClipboardList, FaCheckCircle, FaSpinner, FaEdit, FaSave, FaTimes, FaToggleOn, FaToggleOff } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, totalComplaints: 0, pendingComplaints: 0, resolvedComplaints: 0 });
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, users, complaints
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Role check
    if (currentUser?.role !== "admin") {
      alert("Access Denied: Admins only.");
      navigate("/UserDashboard"); // Redirect non-admins
      return;
    }
    fetchData();
  }, [navigate, currentUser?.role]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, usersRes, complaintsRes] = await Promise.all([
        fetch("http://localhost:3002/api/admin/stats", { credentials: "include" }),
        fetch("http://localhost:3002/api/admin/users", { credentials: "include" }),
        fetch("http://localhost:3002/api/admin/complaints", { credentials: "include" }),
      ]);

      if (!statsRes.ok || !usersRes.ok || !complaintsRes.ok) {
         throw new Error('Failed to fetch admin data. Ensure you are logged in as admin.');
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const complaintsData = await complaintsRes.json();

      if (statsData.success) setStats(statsData.data);
      if (usersData.success) setUsers(usersData.data);
      if (complaintsData.success) setComplaints(complaintsData.data);

    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError(err.message || "Failed to load data. Please try again.");
       if (err.message.includes('403') || err.message.includes('401')) { // Basic check for auth errors
           alert("Authentication failed or forbidden access. Please log in as an admin.");
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
    if (!selectedRole) return;
    try {
      const res = await fetch(`http://localhost:3002/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: selectedRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('User role updated successfully!');
        setEditingUserId(null);
        fetchData(); // Refresh user list
      } else {
        throw new Error(data.message || 'Failed to update role.');
      }
    } catch (err) {
      console.error("Error updating role:", err);
      alert(`Error: ${err.message}`);
    }
  };

   const getStatusBadge = (status) => {
    const styles = { received: "bg-yellow-100 text-yellow-800", in_review: "bg-blue-100 text-blue-800", resolved: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800" };
    const labels = { received: "Pending", in_review: "In Review", resolved: "Resolved", rejected: "Rejected" };
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{labels[status] || 'Unknown'}</span>;
   };

   const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50 flex justify-center items-center min-h-screen">
          <div className="text-center"><FaSpinner className="animate-spin text-blue-600 text-5xl mx-auto mb-4" /><p className="text-gray-600 text-lg">Loading Admin Dashboard...</p></div>
        </div>
      </>
    );
  }

   if (error) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50 flex justify-center items-center min-h-screen">
           <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg shadow">
               <p className="font-semibold">Error Loading Dashboard:</p>
               <p>{error}</p>
               <button onClick={() => navigate('/login')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go to Login</button>
           </div>
        </div>
      </>
    );
  }


  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 flex-grow">
        <header className="mb-10 animate-fade-in-down">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage users and monitor complaints.</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
           <TabButton id="overview" activeTab={activeTab} setActiveTab={setActiveTab}>Overview</TabButton>
           <TabButton id="users" activeTab={activeTab} setActiveTab={setActiveTab}>Manage Users ({stats.totalUsers})</TabButton>
           <TabButton id="complaints" activeTab={activeTab} setActiveTab={setActiveTab}>View Complaints ({stats.totalComplaints})</TabButton>
         </div>


        {/* Tab Content */}
        <div className="animate-fade-in-up">
          {activeTab === 'overview' && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={<FaUsers className="text-purple-500" />} value={stats.totalUsers} label="Total Users" />
              <StatCard icon={<FaClipboardList className="text-blue-500" />} value={stats.totalComplaints} label="Total Complaints" />
              <StatCard icon={<FaSpinner className="text-yellow-500" />} value={stats.pendingComplaints} label="Pending Complaints" />
              <StatCard icon={<FaCheckCircle className="text-green-500" />} value={stats.resolvedComplaints} label="Resolved Complaints" />
              {/* Add more stats cards as needed */}
            </section>
          )}

          {activeTab === 'users' && (
            <section className="bg-white p-6 rounded-xl shadow-md">
               <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
               <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                       {users.map(user => (
                        <tr key={user._id}>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.location || 'N/A'}</td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {editingUserId === user._id ? (
                              <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="border rounded px-2 py-1">
                                <option value="user">User</option>
                                <option value="volunteer">Volunteer</option>
                                <option value="admin">Admin</option>
                              </select>
                            ) : (
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : user.role === 'volunteer' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {user.role}
                              </span>
                            )}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {editingUserId === user._id ? (
                              <>
                                <button onClick={() => handleSaveRole(user._id)} className="text-green-600 hover:text-green-900 mr-3"><FaSave /></button>
                                <button onClick={handleCancelEdit} className="text-red-600 hover:text-red-900"><FaTimes /></button>
                              </>
                            ) : (
                              <button onClick={() => handleEditRole(user)} className="text-indigo-600 hover:text-indigo-900" disabled={currentUser._id === user._id && user.role === 'admin' /* Optional: Prevent self-edit */} >
                                  <FaEdit />
                              </button>
                            )}
                            {/* Add delete button later if needed */}
                           </td>
                        </tr>
                       ))}
                    </tbody>
                </table>
               </div>
            </section>
          )}

          {activeTab === 'complaints' && (
            <section className="bg-white p-6 rounded-xl shadow-md">
               <h2 className="text-2xl font-bold text-gray-800 mb-6">All Complaints</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                       <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reported By</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            {/* Add Actions column if needed */}
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {complaints.map(complaint => (
                            <tr key={complaint._id}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.title}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.user_id?.name || 'Unknown User'}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.type}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">{getStatusBadge(complaint.status)}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.assigned_to?.name || 'Unassigned'}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(complaint.createdAt)}</td>
                                {/* Add action buttons (e.g., view details, change status, assign) later */}
                            </tr>
                        ))}
                        </tbody>
                    </table>
               </div>
            </section>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
};

// Helper Components (can be moved to separate file later)
const StatCard = ({ icon, value, label }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-5 transition-all duration-300 hover:shadow-xl hover:scale-105">
    <div className="text-4xl">{icon}</div>
    <div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-gray-500">{label}</p>
    </div>
  </div>
);

 const TabButton = ({ id, activeTab, setActiveTab, children }) => (
   <button onClick={() => setActiveTab(id)} className={`pb-3 px-4 font-semibold transition-colors ${ activeTab === id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700" }`}>
     {children}
   </button>
 );


export default AdminDashboard;
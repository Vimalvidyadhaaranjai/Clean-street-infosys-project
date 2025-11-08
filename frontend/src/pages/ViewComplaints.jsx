// src/pages/ViewComplaints.jsx - MODIFIED WITH LOGIN CHECK

import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ComplaintModal from "../Components/ComplaintModal";
import { FiMessageSquare, FiLoader, FiMapPin, FiThumbsUp, FiThumbsDown } from "react-icons/fi";

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [user, setUser] = useState(null); // <-- ADDED: State to check for user
  const backend_Url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";

  useEffect(() => {
    // ADDED: Check for logged-in user
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      setUser(null);
    }

    const fetchComplaints = async () => {
      try {
        const res = await fetch(`${backend_Url}/api/complaints/community`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok && data.success) {
          const complaintsWithComments = data.data.map(c => ({ ...c, comments: Array.isArray(c.comments) ? c.comments : [] }));
          const sortedComplaints = complaintsWithComments.sort((a, b) => {
            const netVotesA = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
            const netVotesB = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
            return netVotesB - netVotesA;
          });
          setComplaints(sortedComplaints);
        } else if (res.status === 401 && !user) { // MODIFIED: Don't show error if user is just logged out
          // This is okay, user is just not logged in
        } else {
          throw new Error(data.message || "Failed to fetch complaints");
        }
      } catch (err) {
        // Only set error if it's not a simple auth error for a logged-out user
        if (err.message !== "You must be logged in to view complaints." || user) {
           setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []); // Run once on mount

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleCloseModal = () => {
    setSelectedComplaint(null);
  };

  const updateCommentCount = (complaintId, newComment) => {
    setComplaints(complaints.map(complaint =>
      complaint._id === complaintId
        ? { ...complaint, comments: [...(Array.isArray(complaint.comments) ? complaint.comments : []), newComment] }
        : complaint
    ));
  };

  const handleUpvote = async (complaintId) => {
    if (!user) return toast.error("Please login to vote."); // ADDED: Check
    try {
      const res = await fetch(`${backend_Url}/api/complaints/${complaintId}/upvote`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        const updatedComplaints = complaints.map(complaint =>
          complaint._id === complaintId
            ? {
                ...complaint,
                upvotes: Array(data.data.upvotes).fill(null),
                downvotes: Array(data.data.downvotes).fill(null)
              }
            : complaint
        );
        const sortedComplaints = updatedComplaints.sort((a, b) => {
          const netVotesA = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
          const netVotesB = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
          return netVotesB - netVotesA;
        });
        setComplaints(sortedComplaints);
      } else { throw new Error(data.message || 'Failed to upvote'); }
    } catch (error) {
      console.error("Error upvoting complaint:", error);
       setError("Could not record vote. Please try again.");
    }
  };

  const handleDownvote = async (complaintId) => {
    if (!user) return toast.error("Please login to vote."); // ADDED: Check
    try {
      const res = await fetch(`${backend_Url}/api/complaints/${complaintId}/downvote`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        const updatedComplaints = complaints.map(complaint =>
          complaint._id === complaintId
            ? {
                ...complaint,
                upvotes: Array(data.data.upvotes).fill(null),
                downvotes: Array(data.data.downvotes).fill(null)
              }
            : complaint
        );
        const sortedComplaints = updatedComplaints.sort((a, b) => {
          const netVotesA = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
          const netVotesB = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
          return netVotesB - netVotesA;
        });
        setComplaints(sortedComplaints);
      } else { throw new Error(data.message || 'Failed to downvote'); }
    } catch (error) {
      console.error("Error downvoting complaint:", error);
      setError("Could not record vote. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-dark-bg)] flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FiLoader className="animate-spin text-[var(--color-primary-accent)] text-5xl mx-auto mb-4" />
          <p className="text-[var(--color-text-light)]/70 text-lg">Loading Community Reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-dark-bg)] min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 flex-grow">
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl font-bold text-[var(--color-secondary-accent)]">Community Reports</h1>
          <p className="text-[var(--color-text-light)]/70 mt-2">Browse issues reported by the community and track their status.</p>
        </div>

        {error ? (
          <div className="text-center bg-red-900/50 text-red-300 rounded-xl shadow-md p-12 border border-red-700">
            <p className="text-lg">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint._id}
                  complaint={complaint}
                  onClick={() => handleComplaintClick(complaint)}
                  onUpvote={handleUpvote}
                  onDownvote={handleDownvote}
                  user={user} // <-- ADDED: Pass user prop
                />
              ))
            ) : (
              <div className="text-center bg-[var(--color-medium-bg)] rounded-xl shadow-md p-12 lg:col-span-3 border border-[var(--color-light-bg)]">
                <p className="text-[var(--color-text-light)]/70 text-lg">No community reports have been filed yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={handleCloseModal}
          onCommentAdded={updateCommentCount}
        />
      )}
    </div>
  );
};

// ADDED: user prop
const ComplaintCard = ({ complaint, onClick, onUpvote, onDownvote, user }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });

  const getStatusBadge = (status) => {
    const styles = {
      received: "bg-[var(--color-primary-accent)]/20 text-[var(--color-primary-accent)] border border-[var(--color-primary-accent)]/30",
      in_review: "bg-[var(--color-light-bg)]/50 text-[var(--color-text-light)] border border-[var(--color-light-bg)]",
      resolved: "bg-green-900/50 text-green-300 border border-green-700",
      rejected: "bg-red-900/50 text-red-300 border border-red-700",
    };
    const labels = {
      received: "Pending", in_review: "In Review", resolved: "Resolved", rejected: "Rejected",
    };
    return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[status]}`}>{labels[status] || 'Unknown'}</span>;
  };

  const getProgressPercentage = (status) => {
    const progressMap = {
      received: 25,
      in_review: 50,
      resolved: 100,
      rejected: 0,
    };
    return progressMap[status] || 0;
  };

  const getProgressColor = (status) => {
    const colorMap = {
      received: "bg-[var(--color-primary-accent)]",
      in_review: "bg-[var(--color-light-bg)]",
      resolved: "bg-green-500",
      rejected: "bg-red-500",
    };
    return colorMap[status] || "bg-gray-500";
  };

  return (
    <div
      className="bg-[var(--color-medium-bg)] rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in-up cursor-pointer flex flex-col border border-[var(--color-light-bg)] hover:border-[var(--color-primary-accent)]/50"
      onClick={onClick}
    >
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-3">
            {getStatusBadge(complaint.status)}
            <div className="flex items-center gap-2">
                <UserAvatar user={complaint.user_id} size="sm" />
                <div className="text-right">
                    <p className="text-sm font-medium text-[var(--color-text-light)] truncate max-w-[120px]">{complaint.user_id?.name || 'Anonymous'}</p>
                    <p className="text-xs text-[var(--color-text-light)]/60">{formatDate(complaint.createdAt)}</p>
                </div>
            </div>
        </div>
        
        {complaint.photo && (
          <img src={complaint.photo} alt={complaint.title} className="w-full h-48 object-cover rounded-lg mb-4 bg-[var(--color-dark-bg)]" />
        )}
        <h2 className="text-xl font-bold text-[var(--color-text-light)] mb-2 group-hover:text-[var(--color-primary-accent)] transition-colors">{complaint.title}</h2>
        <p className="text-[var(--color-text-light)]/80 mb-4 line-clamp-2">{complaint.description}</p>
        <div className="flex items-center text-sm text-[var(--color-text-light)]/70 mb-4">
            <FiMapPin className="mr-2 flex-shrink-0" />
            <span>{complaint.address}</span>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[var(--color-text-light)]/70">Progress</span>
            <span className="text-xs font-semibold text-[var(--color-text-light)]">{getProgressPercentage(complaint.status)}%</span>
          </div>
          <div className="w-full bg-[var(--color-dark-bg)] rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-500 ease-out ${getProgressColor(complaint.status)}`}
              style={{ width: `${getProgressPercentage(complaint.status)}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="mt-auto pt-4 border-t border-[var(--color-light-bg)]">
         {/* --- MODIFIED: Added conditional logic --- */}
        <div className="flex items-center justify-between">
            {user ? (
              // User is LOGGED IN: Show buttons
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpvote(complaint._id);
                  }}
                  className="flex items-center gap-1 text-[var(--color-text-light)]/70 hover:text-green-400 transition-colors"
                  aria-label={`Upvote this complaint currently having ${complaint.upvotes?.length || 0} upvotes`}
                >
                  <FiThumbsUp className="text-sm" />
                  <span className="text-sm font-semibold">{complaint.upvotes?.length || 0}</span>
                  <p className="lg:block hidden text-sm">Upvote</p>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownvote(complaint._id);
                  }}
                  className="flex items-center gap-1 text-[var(--color-text-light)]/70 hover:text-red-400 transition-colors"
                  aria-label={`Downvote this complaint currently having ${complaint.downvotes?.length || 0} downvotes`}
                >
                  <FiThumbsDown className="text-sm" />
                  <span className="text-sm font-semibold">{complaint.downvotes?.length || 0}</span>
                  <p className="lg:block hidden text-sm">Downvote</p>
                </button>
                <div className="flex items-center gap-1.5 text-[var(--color-text-light)]/70 text-sm" aria-label={`${complaint.comments?.length || 0} comments`}>
                  <FiMessageSquare />
                  <span>{complaint.comments?.length || 0}</span>
                </div>
              </div>
            ) : (
              // User is LOGGED OUT: Show message
              <span className="text-sm text-[var(--color-text-light)]/50 italic">
                Login to interact
              </span>
            )}
          <span className="text-[var(--color-primary-accent)] font-semibold text-sm hover:underline flex-shrink-0">View Details</span>
        </div>
        {/* --- END MODIFICATION --- */}
      </div>
    </div>
  );
};

const UserAvatar = ({ user, size = 'sm' }) => {
    const sizeClasses = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
    const apiSize = size === 'sm' ? '32' : '40';
    const userName = user?.name || 'A';
    const userPhoto = user?.profilePhoto;

    return (<img src={userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=003566&color=ffd60a&size=${apiSize}`} alt={userName || 'User'} className={`${sizeClasses} rounded-full object-cover flex-shrink-0 border border-[var(--color-light-bg)]`} />);
};

export default ViewComplaints;
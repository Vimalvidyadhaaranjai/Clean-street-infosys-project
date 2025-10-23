import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ComplaintModal from "../Components/ComplaintModal";
import { FaRegComment, FaSpinner, FaMapMarkerAlt, FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("http://localhost:3002/api/complaints/community", {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok && data.success) {
          // We need to make sure comments is an array
          const complaintsWithComments = data.data.map(c => ({ ...c, comments: c.comments || [] }));
          setComplaints(complaintsWithComments);
        } else if (res.status === 401) {
          throw new Error("You must be logged in to view complaints.");
        } else {
          throw new Error(data.message || "Failed to fetch complaints");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleCloseModal = () => {
    setSelectedComplaint(null);
  };

  // This function will be passed to the modal to update the comment count
  const updateCommentCount = (complaintId, newComment) => {
    setComplaints(complaints.map(complaint =>
      complaint._id === complaintId
        ? { ...complaint, comments: [...complaint.comments, newComment] }
        : complaint
    ));
  };

  // Handle upvote
  const handleUpvote = async (complaintId) => {
    try {
      const res = await fetch(`http://localhost:3002/api/complaints/${complaintId}/upvote`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        // Update the complaint in state
        setComplaints(complaints.map(complaint =>
          complaint._id === complaintId
            ? { 
                ...complaint, 
                upvotes: Array(data.data.upvotes).fill(null),
                downvotes: Array(data.data.downvotes).fill(null)
              }
            : complaint
        ));
      }
    } catch (error) {
      console.error("Error upvoting complaint:", error);
    }
  };

  // Handle downvote
  const handleDownvote = async (complaintId) => {
    try {
      const res = await fetch(`http://localhost:3002/api/complaints/${complaintId}/downvote`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        // Update the complaint in state
        setComplaints(complaints.map(complaint =>
          complaint._id === complaintId
            ? { 
                ...complaint, 
                upvotes: Array(data.data.upvotes).fill(null),
                downvotes: Array(data.data.downvotes).fill(null)
              }
            : complaint
        ));
      }
    } catch (error) {
      console.error("Error downvoting complaint:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-600 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading Community Reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 flex-grow">
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl font-bold text-gray-800">Community Reports</h1>
          <p className="text-gray-500 mt-2">Browse issues reported by the community and track their status.</p>
        </div>
        
        {error ? (
          <div className="text-center bg-red-50 text-red-700 rounded-xl shadow-md p-12">
            <p className="text-lg">{error}</p>
          </div>
        ) : (
          /* CHANGE 1: Side-by-side layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint._id}
                  complaint={complaint}
                  onClick={() => handleComplaintClick(complaint)}
                  onUpvote={handleUpvote}
                  onDownvote={handleDownvote}
                />
              ))
            ) : (
              <div className="text-center bg-white rounded-xl shadow-md p-12 lg:col-span-3">
                <p className="text-gray-500 text-lg">No community reports have been filed yet.</p>
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
          onCommentAdded={updateCommentCount} // Pass the update function
        />
      )}
    </div>
  );
};

const ComplaintCard = ({ complaint, onClick, onUpvote, onDownvote }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  
  const getStatusBadge = (status) => {
    const styles = {
      received: "bg-yellow-100 text-yellow-800",
      in_review: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const labels = {
      received: "Pending", in_review: "In Review", resolved: "Resolved", rejected: "Rejected",
    };
    return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[status]}`}>{labels[status] || 'Unknown'}</span>;
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in-up cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="flex-grow">
        <div className="flex items-center gap-4 mb-3">
            {getStatusBadge(complaint.status)}
            <p className="text-sm text-gray-500 ml-auto">{formatDate(complaint.createdAt)}</p>
        </div>
        {complaint.photo && (
          <img src={complaint.photo} alt={complaint.title} className="w-full h-48 object-cover rounded-lg mb-4" />
        )}
        <h2 className="text-xl font-bold text-gray-800 mb-2">{complaint.title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{complaint.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-4">
            <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
            <span>{complaint.address}</span>
        </div>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
            {/* Vote buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpvote(complaint._id);
                }}
                className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors"
              >
                <FaThumbsUp className="text-sm" />
                <span className="text-sm font-semibold">{complaint.upvotes?.length || 0}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownvote(complaint._id);
                }}
                className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <FaThumbsDown className="text-sm" />
                <span className="text-sm font-semibold">{complaint.downvotes?.length || 0}</span>
              </button>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <FaRegComment />
                <span>{complaint.comments?.length || 0}</span>
              </div>
            </div>
            <span className="text-blue-600 font-semibold text-sm hover:underline">View Details</span>
        </div>
      </div>
    </div>
  );
};

export default ViewComplaints;
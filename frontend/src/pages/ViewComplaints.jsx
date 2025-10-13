import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ComplaintModal from "../Components/ComplaintModal";
import { FaRegComment, FaSpinner, FaMapMarkerAlt } from "react-icons/fa";

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("http://localhost:3002/api/complaints/community");
        const data = await res.json();
        if (res.ok && data.success) {
          setComplaints(data.data);
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

  if (error) {
    return (
      <div className="bg-gray-50 flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl font-bold text-gray-800">Community Reports</h1>
          <p className="text-gray-500 mt-2">Browse issues reported by the community and track their status.</p>
        </div>

        <div className="space-y-6">
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                onClick={() => handleComplaintClick(complaint)}
              />
            ))
          ) : (
            <div className="text-center bg-white rounded-xl shadow-md p-12">
              <p className="text-gray-500 text-lg">No community reports have been filed yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ComplaintModal
        complaint={selectedComplaint}
        onClose={handleCloseModal}
      />
    </div>
  );
};

const ComplaintCard = ({ complaint, onClick }) => {
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
    const labels = {
      received: "Pending", in_review: "In Review", resolved: "Resolved", rejected: "Rejected",
    };
    return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[status]}`}>{labels[status] || 'Unknown'}</span>;
  };

    return (
        <div
        className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in-up cursor-pointer"
        onClick={onClick}
      >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                {complaint.photo && (
                <img src={complaint.photo} alt={complaint.title} className="w-full sm:w-48 h-auto object-cover rounded-lg" />
                )}
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                        {getStatusBadge(complaint.status)}
                        <p className="text-sm text-gray-500">{formatDate(complaint.createdAt)}</p>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{complaint.title}</h2>
                    <p className="text-gray-600 mb-4">{complaint.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{complaint.address}</span>
                    </div>
                </div>
                <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center justify-between mt-4 sm:mt-0">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition-colors">
                        <FaRegComment /> 0 Comments
                    </button>
                    {/* Voting can be added here later */}
                </div>
            </div>
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            {getStatusBadge(complaint.status)}
            <p className="text-sm text-gray-500">{formatDate(complaint.createdAt)}</p>
          </div>
            <div className="flex">
              <div className="flex-col w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{complaint.title}</h2>
          <p className="text-gray-600 mb-4">{complaint.description}</p>
          <p className="text-sm text-gray-500 font-semibold">{complaint.address}</p>
              </div>


            <img className="w-1/2 rounded-lg h-full" src={complaint.photo} alt="" />
          </div>
        </div>
        <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center justify-between mt-4 sm:mt-0">
          {/* <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition-colors">
            <FaRegComment /> 0 Comments
          </button> */}
          {/* Voting can be added here later */}
        </div>
      </div>
    </div>
  );
};

export default ViewComplaints;
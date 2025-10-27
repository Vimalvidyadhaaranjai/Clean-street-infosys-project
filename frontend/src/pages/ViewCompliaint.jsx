import React, { useState, useEffect } from 'react'
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer"

const ViewCompliaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3002/api/complaints/all?limit=1000`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setComplaints(data.data.complaints);
        } else {
          console.error("Failed to fetch complaints:", data.message);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      received: "bg-blue-100 text-blue-800",
      in_review: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    const statusLabels = {
      received: "Received",
      in_review: "In Review",
      resolved: "Resolved",
      rejected: "Rejected"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  // Get priority badge styling
  const getPriorityBadge = (priority) => {
    const priorityStyles = {
      Low: "bg-gray-100 text-gray-800",
      Medium: "bg-orange-100 text-orange-800",
      High: "bg-red-100 text-red-800"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityStyles[priority]}`}>
        {priority}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
            <p className="mt-2 text-gray-600">View and track all your submitted complaints</p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : complaints.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2h-4m6 4h2a2 2 0 002 2v-2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new complaint.</p>
            </div>
          ) : (
            /* Complaints List */
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div key={complaint._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left Side - Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{complaint.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {getStatusBadge(complaint.status)}
                              {getPriorityBadge(complaint.priority)}
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                {complaint.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-sm text-gray-500">Created: {formatDate(complaint.createdAt)}</span>
                        </div>

                        <p className="text-gray-700 mb-4">{complaint.description}</p>

                        <div className="border-t pt-4 mt-4">
                          <div className="grid grid-cols-1 gap-3 text-sm">
                            <div>
                              <span className="font-semibold text-gray-700">Address:</span>
                              <p className="text-gray-600">{complaint.address}</p>
                            </div>
                            {complaint.landmark && (
                              <div>
                                <span className="font-semibold text-gray-700">Landmark:</span>
                                <p className="text-gray-600">{complaint.landmark}</p>
                              </div>
                            )}
                            {complaint.assigned_to && (
                              <div>
                                <span className="font-semibold text-gray-700">Assigned To:</span>
                                <p className="text-gray-600">{complaint.assigned_to.name}</p>
                              </div>
                            )}
                            <div>
                              <span className="font-semibold text-gray-700">Last Updated:</span>
                              <p className="text-gray-600">{formatDate(complaint.updatedAt)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Image */}
                      <div className="lg:w-80 flex-shrink-0">
                        {complaint.photo ? (
                          <div className="relative h-full min-h-[300px] rounded-lg overflow-hidden">
                            <img 
                              src={complaint.photo} 
                              alt={complaint.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="relative h-full min-h-[300px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                            <div className="text-center text-gray-400">
                              <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm">No image available</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total Count */}
          {!loading && complaints.length > 0 && (
            <div className="mt-8 text-center">
              <div className="text-sm text-gray-700">
                Total Complaints: <span className="font-semibold">{complaints.length}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ViewCompliaint
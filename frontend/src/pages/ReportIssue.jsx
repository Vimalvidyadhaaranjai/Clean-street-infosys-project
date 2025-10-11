import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload, FaTimes } from "react-icons/fa"; // Added FaUpload and FaTimes
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

const ReportIssue = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [photo, setPhoto] = useState(null); // State for the image file
  const [form, setForm] = useState({
    title: "",
    type: "",
    priority: "",
    address: "",
    landmark: "",
    description: "",
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error("Location error:", err)
      );
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler for file input change
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!position) {
      alert("Please select a location on the map.");
      return;
    }
    
    // Use FormData to send both form data and the image file
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("type", form.type);
    formData.append("priority", form.priority);
    formData.append("address", form.address);
    formData.append("landmark", form.landmark);
    formData.append("description", form.description);
    formData.append("latitude", position.lat);
    formData.append("longitude", position.lng);
    if (photo) {
      formData.append("photo", photo); // Append the image file if it exists
    }

    try {
      // The browser will automatically set the 'Content-Type' to 'multipart/form-data'
      const res = await fetch("http://localhost:3002/api/complaints/create", {
        method: "POST",
        credentials: "include",
        body: formData, // Send formData instead of JSON
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Report submitted successfully!");
        setForm({
          title: "",
          type: "",
          priority: "",
          address: "",
          landmark: "",
          description: "",
        });
        setPosition(null);
        setPhoto(null); // Clear the photo state
        navigate("/UserDashboard");
      } else {
        alert(data.message || "Failed to submit report.");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting report.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="fixed top-20 left-4 z-50">
        <button
          onClick={() => navigate("/UserDashboard")}
          className="bg-white shadow-lg hover:shadow-xl text-gray-700 hover:text-blue-600 p-3 rounded-full transition-all duration-300 flex items-center justify-center group"
          title="Back to Dashboard"
        >
          <FaArrowLeft className="text-lg group-hover:transform group-hover:-translate-x-1 transition-transform duration-300" />
        </button>
      </div>
      <div className="flex-grow pt-24 px-4 sm:px-8 lg:px-20">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Report a Civic Issue
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Issue Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* ... Your existing input fields for title, type, priority, address ... */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Issue Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Brief description of the issue"
                className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Issue Type
              </label>
              <select
                name="type"
                className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="">Select issue type</option>
                <option value="Garbage">Garbage</option>
                <option value="Road Damage">Road Damage</option>
                <option value="Street Light">Street Light</option>
                <option value="Water Leakage">Water Leakage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Priority Level
              </label>
              <select
                name="priority"
                className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.priority}
                onChange={handleChange}
                required
              >
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Enter street address"
                className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Nearby Landmark (Optional)
            </label>
            <input
              type="text"
              name="landmark"
              placeholder="e.g., Near City Hall"
              className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.landmark}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe the issue in detail..."
              className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* NEW: Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Upload an Image (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {photo ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Preview"
                      className="mx-auto h-40 w-auto rounded-lg object-cover"
                    />
                     <button
                        type="button"
                        onClick={() => setPhoto(null)}
                        className="absolute top-0 right-0 m-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none"
                        title="Remove image"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                  </div>
                ) : (
                  <>
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Location on Map
            </label>
            <div className="h-80 w-full rounded-lg overflow-hidden">
              {position ? (
                <MapContainer
                  center={[position.lat, position.lng]}
                  zoom={13}
                  className="h-full w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  <Marker position={position} icon={markerIcon}></Marker>
                  <LocationMarker setPosition={setPosition} />
                </MapContainer>
              ) : (
                <p className="text-center text-gray-500 py-20">
                  Getting your location...
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Click on the map to mark the exact location.
            </p>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition duration-300"
          >
            Submit Report
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ReportIssue;
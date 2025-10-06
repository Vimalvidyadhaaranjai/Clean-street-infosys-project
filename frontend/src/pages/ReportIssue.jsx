import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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
  const [position, setPosition] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!position) {
      alert("Please select a location on the map.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3002/api/complaints/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({
          ...form,
          latitude: position.lat,
          longitude: position.lng,
        }),
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

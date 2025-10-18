import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload, FaTimes, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Marker icon setup
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
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
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({
    title: "", type: "", priority: "", address: "", landmark: "", description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Location error:", err)
      );
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhotoChange = (e) => e.target.files && e.target.files[0] && setPhoto(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) {
      alert("Please select a location on the map.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    formData.append("latitude", position.lat);
    formData.append("longitude", position.lng);
    if (photo) formData.append("photo", photo);

    try {
      const res = await fetch("http://localhost:3002/api/complaints/create", {
        method: "POST", credentials: "include", body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert("Report submitted successfully!");
        navigate("/UserDashboard");
      } else {
        alert(data.message || "Failed to submit report.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 flex-grow">
        <div className="relative mb-8">
            <button
                onClick={() => navigate("/UserDashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition-colors animate-fade-in-down"
            >
                Back to Dashboard
            </button>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 animate-fade-in-up">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800">Submit an Issue Report</h1>
                <p className="text-gray-500 mt-2">Your detailed reports help us take faster action.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
                {/* Left Column: Form Fields */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><FaInfoCircle className="text-blue-500" /> Issue Details</h2>
                        <div className="space-y-6">
                            <InputField label="Issue Title" name="title" value={form.title} onChange={handleChange} placeholder="e.g., Large pothole on Elm Street" required />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <SelectField label="Issue Type" name="type" value={form.type} onChange={handleChange} required options={["Garbage", "Road Damage", "Street Light", "Water Leakage"]} />
                                <SelectField label="Priority Level" name="priority" value={form.priority} onChange={handleChange} required options={["Low", "Medium", "High"]} />
                            </div>
                            <InputField label="Full Address" name="address" value={form.address} onChange={handleChange} placeholder="123 Main St, Anytown" required />
                            <InputField label="Nearby Landmark (Optional)" name="landmark" value={form.landmark} onChange={handleChange} placeholder="e.g., Across from the central library" />
                            <TextareaField label="Detailed Description" name="description" value={form.description} onChange={handleChange} placeholder="Please provide as much detail as possible..." required />
                        </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><FaUpload className="text-blue-500"/> Attach a Photo</h2>
                      <div className="mt-1 flex justify-center items-center px-6 py-10 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50">
                        {photo ? (
                          <div className="relative group w-full text-center">
                            <img src={URL.createObjectURL(photo)} alt="Preview" className="mx-auto max-h-48 rounded-lg object-contain shadow-md" />
                            <button type="button" onClick={() => setPhoto(null)} className="absolute -top-3 -right-3 p-2 bg-red-600 text-white rounded-full shadow-lg transition-transform transform hover:scale-110" title="Remove image">
                              <FaTimes className="h-4 w-4" />
                            </button>
                            <p className="text-xs text-gray-500 mt-2 font-semibold">{photo.name}</p>
                          </div>
                        ) : (
                          <div onChange={handlePhotoChange} className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-700 p-1">
                                <span className="mx-6">Upload a file</span>
                                <input id="file-upload" name="photo" type="file" className="sr-only" accept="image/*"  />
                              </label>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                </div>

                {/* Right Column: Map */}
                <div className="mt-8 lg:mt-0">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> Pinpoint the Location</h2>
                  <div className="h-[32rem] w-full rounded-2xl overflow-hidden border-4 border-gray-200 shadow-inner">
                    {position ? (
                      <MapContainer center={[position.lat, position.lng]} zoom={15} className="h-full w-full" scrollWheelZoom={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                        <Marker position={position} icon={markerIcon}></Marker>
                        <LocationMarker setPosition={setPosition} />
                      </MapContainer>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500">Loading Map...</div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-3 text-center font-semibold">Click on the map to mark the exact location.</p>
                </div>
                
                {/* Submit Button - Spans across both columns at the bottom */}
                <div className="lg:col-span-2 mt-12 text-center">
                    <button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Your Report"}
                    </button>
                </div>
            </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Reusable Form Field Components
const InputField = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="block text-sm font-semibold text-gray-600 mb-2">{label}</label>
    <input id={props.name} {...props} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" />
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div>
    <label htmlFor={props.name} className="block text-sm font-semibold text-gray-600 mb-2">{label}</label>
    <select id={props.name} {...props} className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm appearance-none">
      <option value="">Select...</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const TextareaField = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="block text-sm font-semibold text-gray-600 mb-2">{label}</label>
    <textarea id={props.name} {...props} rows="4" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"></textarea>
  </div>
);

export default ReportIssue;
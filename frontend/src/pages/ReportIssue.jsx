// src/pages/ReportIssue.jsx - MODIFIED WITH NEW PALETTE

import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUpload, FiXCircle, FiMapPin, FiInfo, FiImage, FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Marker icon setup (Keep original)
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

// === NEW COMPONENT: For displaying form status messages (Dark Theme) ===
const FormStatus = ({ message, type }) => {
    if (!message) return null;
    const isError = type === 'error';
    return (
        // CHANGED: Dark theme error/success messages
        <div className={`mt-4 p-3 rounded-md text-sm flex items-center gap-2 ${isError ? 'bg-red-900/50 text-red-300 border border-red-700' : 'bg-green-900/50 text-green-300 border border-green-700'}`}>
            {isError ? <FiAlertCircle /> : <FiCheckCircle />}
            <span>{message}</span>
        </div>
    );
};


const ReportIssue = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [form, setForm] = useState({
    title: "", type: "", priority: "", address: "", landmark: "", description: "",
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const backend_Url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
            console.error("Geolocation error:", err);
            setStatusMessage({ type: 'error', text: 'Could not get current location. Please select on map.' });
            setPosition({ lat: 11.6643, lng: 78.1460 });
        }
      );
    } else {
        setStatusMessage({ type: 'error', text: 'Geolocation is not supported. Please select on map.' });
        setPosition({ lat: 11.6643, lng: 78.1460 });
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
         setStatusMessage({ type: 'error', text: 'Image size exceeds 10MB limit.' });
         return;
      }
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStatusMessage({ type: '', text: '' });
    }
  };

   const removePhoto = () => {
        setPhoto(null);
        setPreviewUrl(null);
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = '';
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) {
      setStatusMessage({ type: 'error', text: "Please select a location on the map." });
      return;
    }
    setLoading(true);
    setStatusMessage({ type: '', text: '' });
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    formData.append("latitude", position.lat);
    formData.append("longitude", position.lng);
    if (photo) formData.append("photo", photo);

    try {
      const res = await fetch(`${backend_Url}/api/complaints/create`, {
        method: "POST", credentials: "include", body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: "Report submitted successfully! Redirecting..." });
        setTimeout(() => navigate("/UserDashboard"), 1500);
      } else {
         throw new Error(data.message || "Failed to submit report.");
      }
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'error', text: error.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    // === STYLE UPDATE: Main background color ===
    <div className="min-h-screen bg-[var(--color-dark-bg)] flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 flex-grow">

        {/* Back Button */}
        <div className="relative mb-6">
            {/* === STYLE UPDATE: Text and hover colors === */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-light)]/70 hover:text-[var(--color-primary-accent)] transition-colors group"
            >
                <FiArrowLeft className="transform transition-transform group-hover:-translate-x-1" size={16}/>
                Back
            </button>
        </div>

        {/* Main Content Card */}
        {/* === STYLE UPDATE: Card bg, border, shadow === */}
        <div className="bg-[var(--color-medium-bg)] rounded-xl shadow-lg border border-[var(--color-light-bg)] p-6 sm:p-10 animate-fade-in-up">
            {/* Header */}
            <div className="text-center mb-10">
                {/* CHANGED: text colors */}
                <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-secondary-accent)] tracking-tight">Report an Issue</h1>
                <p className="text-[var(--color-text-light)]/70 mt-2 text-base">Help improve our community by reporting problems.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">

                {/* Left Column: Form Fields */}
                <div className="space-y-6">
                    {/* Issue Details Section */}
                    <div>
                        {/* CHANGED: text and icon colors */}
                        <h2 className="text-lg font-semibold text-[var(--color-text-light)] mb-4 flex items-center gap-2"><FiInfo className="text-[var(--color-primary-accent)]" /> Issue Details</h2>
                        <div className="space-y-5">
                            <InputField label="Issue Title" name="title" value={form.title} onChange={handleChange} placeholder="e.g., Overflowing bin on Park Ave" required />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <SelectField label="Issue Type" name="type" value={form.type} onChange={handleChange} required options={["Garbage", "Road Damage", "Street Light", "Water Leakage"]} />
                                <SelectField label="Priority Level" name="priority" value={form.priority} onChange={handleChange} required options={["Low", "Medium", "High"]} />
                            </div>
                            <InputField label="Full Address / Location Description" name="address" value={form.address} onChange={handleChange} placeholder="e.g., 123 Main St, near the bus stop" required />
                            <InputField label="Nearby Landmark (Optional)" name="landmark" value={form.landmark} onChange={handleChange} placeholder="e.g., Opposite the corner shop" />
                            <TextareaField label="Detailed Description" name="description" value={form.description} onChange={handleChange} placeholder="Provide details like time observed, specific damage, etc." required />
                        </div>
                    </div>

                    {/* Photo Upload Section */}
                    <div>
                      {/* CHANGED: text and icon colors */}
                      <h2 className="text-lg font-semibold text-[var(--color-text-light)] mb-4 flex items-center gap-2"><FiImage className="text-[var(--color-primary-accent)]"/> Attach Photo (Optional)</h2>
                      {/* CHANGED: bg, border, text colors */}
                      <div className={`mt-1 flex flex-col justify-center items-center px-6 py-8 border-2 border-[var(--color-light-bg)] border-dashed rounded-lg transition-colors duration-200 ${previewUrl ? 'bg-[var(--color-dark-bg)]' : 'bg-[var(--color-dark-bg)] hover:border-[var(--color-primary-accent)]'}`}>
                        {previewUrl ? (
                          <div className="relative group text-center w-full max-w-xs mx-auto">
                            <img src={previewUrl} alt="Preview" className="mx-auto max-h-40 rounded-md object-contain shadow-sm border border-[var(--color-light-bg)] mb-3" />
                            <button type="button" onClick={removePhoto} className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full shadow transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" title="Remove image">
                              <FiXCircle className="h-4 w-4" />
                            </button>
                            <p className="text-xs text-[var(--color-text-light)]/70 font-medium truncate">{photo?.name || 'Uploaded Image'}</p>
                          </div>
                        ) : (
                          <div className="space-y-1 text-center">
                            <FiUpload className="mx-auto h-10 w-10 text-[var(--color-text-light)]/50" />
                            <div className="flex text-sm text-[var(--color-text-light)]/70">
                              <label htmlFor="file-upload" className="relative cursor-pointer bg-[var(--color-medium-bg)] rounded-md font-medium text-[var(--color-primary-accent)] hover:text-[var(--color-secondary-accent)] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--color-primary-accent)] px-2 py-1">
                                <span>Upload a file</span>
                                <input id="file-upload" name="photo" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-[var(--color-text-light)]/50">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                </div> {/* End Left Column */}

                {/* Right Column: Map */}
                <div className="mt-8 lg:mt-0">
                  {/* CHANGED: text and icon colors */}
                  <h2 className="text-lg font-semibold text-[var(--color-text-light)] mb-4 flex items-center gap-2"><FiMapPin className="text-[var(--color-primary-accent)]" /> Pinpoint Location*</h2>
                  {/* CHANGED: border color */}
                  <div className="h-96 w-full rounded-lg overflow-hidden border border-[var(--color-light-bg)] shadow-sm relative">
                    {position ? (
                      <MapContainer center={[position.lat, position.lng]} zoom={15} className="h-full w-full leaflet-dark" scrollWheelZoom={true}>
                        {/* Added leaflet-dark class to attempt dark mode tiles if available, otherwise it's fine */}
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                        <Marker position={position} icon={markerIcon}></Marker>
                        <LocationMarker setPosition={setPosition} />
                      </MapContainer>
                    ) : (
                      // CHANGED: bg and text colors
                      <div className="h-full w-full flex items-center justify-center bg-[var(--color-dark-bg)] text-[var(--color-text-light)]/70">
                        <FiLoader className="animate-spin text-2xl mr-2"/> Loading Map...
                      </div>
                    )}
                  </div>
                  {/* CHANGED: text color */}
                  <p className="text-xs text-[var(--color-text-light)]/70 mt-2 text-center font-medium">Click on the map to set the exact issue location.</p>
                </div> {/* End Right Column */}

                {/* Submit Area */}
                <div className="lg:col-span-2 mt-8 lg:mt-10 text-center">
                     {/* Display Status Message */}
                    <FormStatus message={statusMessage.text} type={statusMessage.type} />

                    {/* === STYLE UPDATE: Consistent submit button (Yellow) === */}
                    <button type="submit" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-gradient-to-r from-[var(--color-primary-accent)] to-[var(--color-secondary-accent)] hover:shadow-lg text-[var(--color-text-dark)] font-bold px-10 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-70 disabled:cursor-wait" disabled={loading}>
                        {loading ? (
                            <>
                                {/* CHANGED: spinner color */}
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[var(--color-text-dark)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                           "Submit Report"
                        )}
                    </button>
                </div>
            </form> {/* End Form */}
        </div> {/* End Main Content Card */}
      </div> {/* End Container */}
      <Footer />
    </div>
  );
};

// --- Reusable Form Field Components ---
// === STYLE UPDATE: Dark theme input styling ===
const InputField = ({ label, name, required, ...props }) => (
  <div>
    {/* CHANGED: text color */}
    <label htmlFor={name} className="block text-sm font-medium text-[var(--color-text-light)]/90 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
        id={name} name={name} required={required}
        {...props}
        // CHANGED: bg, border, ring, text, placeholder colors
        className="w-full bg-[var(--color-dark-bg)] border border-[var(--color-light-bg)] rounded-md p-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:border-transparent transition duration-200 text-[var(--color-text-light)] placeholder-[var(--color-text-light)]/50"
    />
  </div>
);

const SelectField = ({ label, name, options, required, ...props }) => (
  <div>
    {/* CHANGED: text color */}
    <label htmlFor={name} className="block text-sm font-medium text-[var(--color-text-light)]/90 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
    </label>
    <select
        id={name} name={name} required={required}
        {...props}
         // CHANGED: bg, border, ring, text colors. Added 'appearance-none' for custom arrow
        className="w-full bg-[var(--color-dark-bg)] border border-[var(--color-light-bg)] rounded-md p-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:border-transparent transition duration-200 text-[var(--color-text-light)] appearance-none"
    >
      <option value="">-- Select --</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const TextareaField = ({ label, name, required, ...props }) => (
  <div>
    {/* CHANGED: text color */}
    <label htmlFor={name} className="block text-sm font-medium text-[var(--color-text-light)]/90 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
    </label>
    <textarea
        id={name} name={name} required={required}
        {...props}
        rows="4"
        // CHANGED: bg, border, ring, text, placeholder colors
        className="w-full bg-[var(--color-dark-bg)] border border-[var(--color-light-bg)] rounded-md p-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:border-transparent transition duration-200 text-[var(--color-text-light)] placeholder-[var(--color-text-light)]/50 resize-vertical"
    ></textarea>
  </div>
);


export default ReportIssue;
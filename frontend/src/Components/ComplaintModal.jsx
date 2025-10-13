import React, { useEffect, useState } from "react";
import { FaTimes, FaMapMarkerAlt, FaTag, FaExclamationTriangle, FaCalendarAlt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in React-Leaflet
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ComplaintModal = ({ complaint, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // This triggers the animation when the complaint object is passed in
    if (complaint) {
      // A slight delay to allow the DOM to update before animating
      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    } else {
      setIsOpen(false);
    }
  }, [complaint]);

  // Render nothing if there's no complaint to show
  if (!complaint) return null;

  const position = [
    complaint.location_coords.coordinates[1],
    complaint.location_coords.coordinates[0],
  ];

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

  // Component for displaying info items with icons
  const InfoItem = ({ icon, label, value, valueClassName = "text-slate-700" }) => (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-slate-400">{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className={`text-base font-semibold ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );

  const getPriorityInfo = (priority) => {
    const styles = {
      High: "text-red-600",
      Medium: "text-amber-600",
      Low: "text-green-600",
    };
    return (
      <InfoItem 
        icon={<FaExclamationTriangle />} 
        label="Priority" 
        value={priority} 
        valueClassName={styles[priority] || 'text-slate-700'} 
      />
    );
  };
  
  return (
    // Main overlay with glassmorphism effect
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      // Added backdrop blur for the glass effect
      style={{ backgroundColor: 'rgba(24, 38, 53, 0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      {/* Modal content with entry animation */}
      <div 
        className={`bg-white w-full max-w-4xl max-h-[95vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300 ease-in-out ${isOpen ? 'scale-100' : 'scale-95'}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Modal Header */}
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 truncate pr-4">
            {complaint.title}
          </h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-slate-400 rounded-full p-2 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes size={20} />
          </button>
        </header>

        {/* Modal Body with scroll */}
        <main className="flex-grow p-4 sm:p-6 overflow-y-auto bg-slate-50">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Left/Top Column (takes 3/5 width on desktop) */}
            <div className="lg:col-span-3 space-y-6">
              {complaint.photo && (
                <div className="w-full h-auto overflow-hidden rounded-xl shadow-lg">
                  <img src={complaint.photo} alt={complaint.title} className="w-full object-cover" />
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed bg-white p-4 rounded-lg border border-slate-200">{complaint.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-slate-200">
                <InfoItem icon={<FaTag />} label="Type" value={complaint.type} />
                {getPriorityInfo(complaint.priority)}
                <InfoItem icon={<FaCalendarAlt />} label="Reported On" value={formatDate(complaint.createdAt)} />
              </div>
            </div>

            {/* Right/Bottom Column (takes 2/5 width on desktop) */}
            <div className="lg:col-span-2 space-y-4">
               <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Location</h3>
                  <div className="flex items-start text-slate-600 bg-white p-4 rounded-lg border border-slate-200">
                    <FaMapMarkerAlt className="mr-3 mt-1 flex-shrink-0 text-slate-400" />
                    <span>{complaint.address}</span>
                  </div>
               </div>
              <div className="h-64 sm:h-80 lg:h-full w-full rounded-xl overflow-hidden border-2 border-slate-200 shadow-inner">
                <MapContainer center={position} zoom={16} className="h-full w-full" scrollWheelZoom={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                  <Marker position={position} icon={markerIcon}></Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ComplaintModal;
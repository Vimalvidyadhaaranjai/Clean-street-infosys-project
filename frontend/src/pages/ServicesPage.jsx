import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
// Ensure correct icon names are imported
import { FiGrid, FiMapPin, FiMessageSquare, FiUsers, FiCheckSquare, FiShield, FiEye } from 'react-icons/fi'; // Corrected import list

const ServicesPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex flex-col">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 flex-grow animate-fade-in-up">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-10 max-w-4xl mx-auto">
                    <header className="text-center mb-8 border-b border-gray-200 pb-6">
                         <FiGrid className="mx-auto text-5xl text-indigo-500 mb-4" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
                            Our Services
                        </h1>
                        <p className="text-gray-600 mt-2 text-base">Features designed for community action.</p>
                    </header>

                    <section className="space-y-6 text-gray-700 leading-relaxed">
                        <ServiceItem icon={<FiMapPin className="text-blue-600"/>} title="Issue Reporting with Geolocation">
                            Easily report environmental concerns using an interactive map to pinpoint the exact location. Add details, priority, type, and photos for comprehensive reporting.
                        </ServiceItem>
                         <ServiceItem icon={<FiCheckSquare className="text-green-600"/>} title="Status Tracking Dashboard">
                            Users get a personal dashboard to monitor the real-time status (Pending, In Review, Resolved) of all the issues they have reported.
                        </ServiceItem>
                         {/* Corrected Icon: FiEye */}
                         <ServiceItem icon={<FiEye className="text-purple-600"/>} title="Community Complaint View">
                            Browse and view details of issues reported by other members of the community, fostering transparency and collective awareness. Vote on reports to highlight urgency.
                        </ServiceItem>
                         <ServiceItem icon={<FiMessageSquare className="text-orange-600"/>} title="Discussion & Comments">
                            Engage in conversations directly on complaint reports. Add comments, replies, and even images to provide updates or ask questions.
                        </ServiceItem>
                         <ServiceItem icon={<FiUsers className="text-teal-600"/>} title="Volunteer Coordination">
                            A dedicated dashboard for registered volunteers to find and assign nearby tasks, update statuses, and actively participate in resolving reported issues.
                        </ServiceItem>
                         <ServiceItem icon={<FiShield className="text-red-600"/>} title="Admin Management Panel">
                            Centralized control for administrators to oversee users, manage roles, view all complaints, and monitor overall platform activity.
                        </ServiceItem>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

// Helper component (no changes needed here)
const ServiceItem = ({ icon, title, children }) => (
    <div className="flex items-start gap-4 p-4 bg-gray-50/70 rounded-lg border border-gray-200/60">
        <div className="flex-shrink-0 mt-1 text-2xl">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{children}</p>
        </div>
    </div>
);

export default ServicesPage;
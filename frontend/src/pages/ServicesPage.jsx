// src/pages/ServicesPage.jsx - MODIFIED WITH NEW PALETTE

import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { FiGrid, FiMapPin, FiMessageSquare, FiUsers, FiCheckSquare, FiShield, FiEye } from 'react-icons/fi';

const ServicesPage = () => {
    return (
        // CHANGED: Main background color
        <div className="min-h-screen bg-[var(--color-dark-bg)] flex flex-col">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 flex-grow animate-fade-in-up">
                {/* CHANGED: Card bg and border */}
                <div className="bg-[var(--color-medium-bg)] rounded-xl shadow-lg border border-[var(--color-light-bg)] p-6 sm:p-10 max-w-8xl mx-auto">
                    {/* CHANGED: Header icon, text, and border colors */}
                    <header className="text-center mb-8 border-b border-[var(--color-light-bg)] pb-6">
                         <FiGrid className="mx-auto text-5xl text-[var(--color-primary-accent)] mb-4" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-secondary-accent)] tracking-tight">
                            Our Services
                        </h1>
                        <p className="text-[var(--color-text-light)]/70 mt-2 text-base">Features designed for community action.</p>
                    </header>

                    {/* CHANGED: Text and ServiceItem colors */}
                    <section className="space-y-4 px-4 sm:px-16 text-[var(--color-text-light)]/90 leading-relaxed">
                        <ServiceItem icon={<FiMapPin className="text-[var(--color-secondary-accent)]"/>} title="Issue Reporting with Geolocation">
                            Easily report environmental concerns using an interactive map to pinpoint the exact location. Add details, priority, type, and photos for comprehensive reporting.
                        </ServiceItem>
                         <ServiceItem icon={<FiCheckSquare className="text-green-400"/>} title="Status Tracking Dashboard">
                            Users get a personal dashboard to monitor the real-time status (Pending, In Review, Resolved) of all the issues they have reported.
                        </ServiceItem>
                         <ServiceItem icon={<FiEye className="text-[var(--color-secondary-accent)]"/>} title="Community Complaint View">
                            Browse and view details of issues reported by other members of the community, fostering transparency and collective awareness. Vote on reports to highlight urgency.
                        </ServiceItem>
                         <ServiceItem icon={<FiMessageSquare className="text-orange-400"/>} title="Discussion & Comments">
                            Engage in conversations directly on complaint reports. Add comments, replies, and even images to provide updates or ask questions.
                        </ServiceItem>
                         <ServiceItem icon={<FiUsers className="text-teal-400"/>} title="Volunteer Coordination">
                            A dedicated dashboard for registered volunteers to find and assign nearby tasks, update statuses, and actively participate in resolving reported issues.
                        </ServiceItem>
                         <ServiceItem icon={<FiShield className="text-red-400"/>} title="Admin Management Panel">
                            Centralized control for administrators to oversee users, manage roles, view all complaints, and monitor overall platform activity.
                        </ServiceItem>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

// Helper component
// CHANGED: ServiceItem colors
const ServiceItem = ({ icon, title, children }) => (
    <div className="flex items-start gap-4 p-4 bg-[var(--color-light-bg)]/20 rounded-lg border border-[var(--color-light-bg)]/50">
        <div className="flex-shrink-0 mt-1 text-2xl">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-[var(--color-primary-accent)] mb-1">{title}</h3>
            <p className="text-sm text-[var(--color-text-light)]/80">{children}</p>
        </div>
    </div>
);

export default ServicesPage;
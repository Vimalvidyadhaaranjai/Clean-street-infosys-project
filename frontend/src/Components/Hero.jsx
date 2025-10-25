// src/Components/Hero.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin, FiUsers, FiClock } from 'react-icons/fi'; // Updated icons for relevance

const Hero = () => {
    return (
        // === STYLE UPDATE: Added bg-gradient-to-b, adjusted padding ===
        <div className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden bg-gradient-to-b from-blue-50 via-gray-50 to-white">

            {/* Background Image Container */}
            <div className="absolute inset-0 w-full h-full">
                {/* === IMAGE UPDATE: Changed src to hero4.jpg === */}
                <img
                    src="/images/hero4.jpg" // <<< CHANGED IMAGE SOURCE
                    alt="Clean city street"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                {/* === STYLE UPDATE: Adjusted overlay gradient for better text visibility === */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10 pointer-events-none"></div>
            </div>

            {/* Content Area */}
            {/* === STYLE UPDATE: Adjusted padding, max-width === */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <div className="max-w-4xl mx-auto">
                    {/* === STYLE UPDATE: Enhanced text styling, smoother animation === */}
                    <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-down duration-700 ease-out drop-shadow-lg">
                        Building Cleaner Communities, <span className="text-blue-300">Together</span>.
                    </h1>
                    <p className="mt-4 text-gray-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up duration-700 ease-out delay-200 drop-shadow">
                        Report street issues easily, track their resolution, and collaborate with your community for a better neighborhood. Your action matters.
                    </p>

                     {/* Call to Action Button */}
                     {/* === STYLE UPDATE: Refined button style, hover effect === */}
                     <Link
                        to="/register"
                        className="mt-10 inline-flex items-center gap-2.5 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 animate-fade-in-up duration-700 ease-out delay-400"
                    >
                        Get Started <FiArrowRight className="ml-1 text-blue-200" size={18} />
                    </Link>
                </div>

                {/* Feature Cards Section */}
                {/* === STYLE UPDATE: Increased top margin, adjusted grid gap === */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* Updated icons and potentially text */}
                    <FeatureCard
                        icon={<FiMapPin size={32} className="text-blue-500"/>} // Using icon component
                        title="Precise Reporting"
                        description="Easily report issues using map integration and photo uploads for accurate location and details."
                        delay="300"
                    />
                    <FeatureCard
                        icon={<FiUsers size={32} className="text-green-500"/>} // Using icon component
                        title="Community Driven"
                        description="Engage with fellow citizens, volunteers, and officials on a unified platform for collective action."
                        delay="500"
                    />
                    <FeatureCard
                        icon={<FiClock size={32} className="text-orange-500"/>} // Using icon component
                        title="Track Progress"
                        description="Receive real-time updates and monitor the status of reported issues directly from your dashboard."
                        delay="700"
                    />
                </div>
            </div>
        </div>
    );
};

// Feature Card Component
// === STYLE UPDATE: Refined card styling, added border, hover effect ===
const FeatureCard = ({ icon, title, description, delay }) => (
    <div
        className={`bg-white/80 backdrop-blur-md border border-gray-200/50 text-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-2 hover:shadow-xl hover:border-blue-200 animate-fade-in-up animation-delay-${delay}`}
        style={{ animationDelay: `${parseInt(delay)}ms` }} // Ensure animation delay works
    >
        <div className="flex flex-col items-center text-center">
            {/* Render icon component directly */}
            <div className="mb-4 p-3 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full shadow-inner border border-white/50">
                 {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
    </div>
);


export default Hero;
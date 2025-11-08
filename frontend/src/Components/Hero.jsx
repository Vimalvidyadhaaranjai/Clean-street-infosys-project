// src/Components/Hero.jsx - MODIFIED (Button Removed)

import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin, FiUsers, FiClock } from 'react-icons/fi';

const Hero = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden bg-gradient-to-b from-[var(--color-dark-bg)] via-[var(--color-medium-bg)] to-[var(--color-dark-bg)]">

            <div className="absolute inset-0 w-full h-full">
                <img
                    src="/images/hero4.jpg" 
                    alt="Clean city street"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10 pointer-events-none"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-[var(--color-text-light)] text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-down duration-700 ease-out drop-shadow-lg">
                        Building Cleaner Communities, <span className="text-[var(--color-primary-accent)]">Together</span>.
                    </h1>
                    <p className="mt-4 text-[var(--color-text-light)]/90 text-base sm:text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up duration-700 ease-out delay-200 drop-shadow">
                        Report street issues easily, track their resolution, and collaborate with your community for a better neighborhood. Your action matters.
                    </p>

                     {/* REMOVED THE "GET STARTED" BUTTON AS REQUESTED
                     <Link
                        to="/register"
                        className="mt-10 inline-flex items-center gap-2.5 px-8 py-3 bg-gradient-to-r from-[var(--color-primary-accent)] to-[var(--color-secondary-accent)] text-[var(--color-text-dark)] text-base font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-accent)] focus:ring-opacity-50 animate-fade-in-up delay-400"
                    >
                        Get Started <FiArrowRight className="ml-1 text-[var(--color-text-dark)]/70" size={18} />
                    </Link> 
                    */}
                </div>

                {/* Feature Cards Section */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <FeatureCard
                        icon={<FiMapPin size={32} className="text-[var(--color-primary-accent)]"/>}
                        title="Precise Reporting"
                        description="Easily report issues using map integration and photo uploads for accurate location and details."
                        delay="300"
                    />
                    <FeatureCard
                        icon={<FiUsers size={32} className="text-[var(--color-secondary-accent)]"/>}
                        title="Community Driven"
                        description="Engage with fellow citizens, volunteers, and officials on a unified platform for collective action."
                        delay="500"
                    />
                    <FeatureCard
                        icon={<FiClock size={32} className="text-[var(--color-primary-accent)]"/>}
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
const FeatureCard = ({ icon, title, description, delay }) => (
    <div
        className={`bg-[var(--color-medium-bg)]/80 backdrop-blur-md border border-[var(--color-light-bg)]/50 text-[var(--color-text-light)] p-6 rounded-xl shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-2 hover:shadow-xl hover:border-[var(--color-primary-accent)] animate-fade-in-up animation-delay-${delay}`}
        style={{ animationDelay: `${parseInt(delay)}ms` }}
    >
        <div className="flex flex-col items-center text-center">
            <div className="mb-4 p-3 bg-gradient-to-br from-[var(--color-light-bg)] to-[var(--color-medium-bg)] rounded-full shadow-inner border border-[var(--color-primary-accent)]/30">
                 {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-[var(--color-secondary-accent)]">{title}</h3>
            <p className="text-sm text-[var(--color-text-light)]/80 leading-relaxed">{description}</p>
        </div>
    </div>
)
;

export default Hero;
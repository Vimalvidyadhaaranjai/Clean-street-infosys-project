// src/pages/AboutPage.jsx - MODIFIED WITH NEW PALETTE

import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { FiInfo, FiTarget, FiUsers } from 'react-icons/fi';

const AboutPage = () => {
    return (
        // CHANGED: Main background color
        <div className="min-h-screen bg-[var(--color-dark-bg)] flex flex-col">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 flex-grow animate-fade-in-up">
                {/* CHANGED: Card bg, border */}
                <div className="bg-[var(--color-medium-bg)] rounded-xl shadow-lg border border-[var(--color-light-bg)] p-6 sm:p-10 max-w-8xl mx-auto">
                    {/* CHANGED: Header icon, text, and border colors */}
                    <header className="text-center mb-8 border-b border-[var(--color-light-bg)] pb-6">
                        <FiInfo className="mx-auto text-5xl text-[var(--color-primary-accent)] mb-4" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-secondary-accent)] tracking-tight">
                            About Clean Street
                        </h1>
                        <p className="text-[var(--color-text-light)]/70 mt-2 text-base">Connecting communities for a cleaner tomorrow.</p>
                    </header>

                    {/* CHANGED: Text and icon colors */}
                    <section className="space-y-6 text-[var(--color-text-light)]/90 leading-relaxed">
                        <h2 className="text-xl font-semibold text-[var(--color-primary-accent)] flex items-center gap-2">
                            <FiTarget className="text-[var(--color-secondary-accent)]" /> Our Mission
                        </h2>
                        <p>
                            Clean Street is dedicated to empowering citizens to take an active role in maintaining and improving the cleanliness of their neighborhoods. We believe that by providing an easy-to-use platform for reporting and tracking local environmental issues, we can foster collaboration between residents, volunteers, and local authorities to create cleaner, healthier, and more vibrant communities.
                        </p>

                        <h2 className="text-xl font-semibold text-[var(--color-primary-accent)] flex items-center gap-2">
                            <FiUsers className="text-[var(--color-secondary-accent)]" /> Who We Are
                        </h2>
                        <p>
                            We are a community-focused initiative leveraging technology to address common urban challenges like garbage disposal, road damage, and infrastructure maintenance. Our platform connects people who care about their local environment with the resources and channels needed to make a tangible difference.
                        </p>


                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AboutPage;
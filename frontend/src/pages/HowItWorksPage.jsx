// src/pages/HowItWorksPage.jsx - MODIFIED WITH NEW PALETTE

import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { FiHelpCircle, FiEdit3, FiEye, FiTool, FiUserCheck } from 'react-icons/fi';

const HowItWorksPage = () => {
    return (
        // CHANGED: Main background color
        <div className="min-h-screen bg-[var(--color-dark-bg)] flex flex-col">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 flex-grow animate-fade-in-up">
                {/* CHANGED: Card bg and border */}
                <div className="bg-[var(--color-medium-bg)] rounded-xl shadow-lg border border-[var(--color-light-bg)] p-6 sm:p-10 max-w-8xl mx-auto">
                    {/* CHANGED: Header icon, text, and border colors */}
                    <header className="text-center mb-8 border-b border-[var(--color-light-bg)] pb-6">
                        <FiHelpCircle className="mx-auto text-5xl text-[var(--color-primary-accent)] mb-4" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-secondary-accent)] tracking-tight">
                            How Clean Street Works
                        </h1>
                        <p className="text-[var(--color-text-light)]/70 mt-2 text-base">Simple steps to make a big impact.</p>
                    </header>

                    {/* CHANGED: Text and step-card colors */}
                    <section className="space-y-8 px-4 sm:px-16 text-[var(--color-text-light)]/90 leading-relaxed">
                        <div className='bg-[var(--color-light-bg)]/20 rounded-2xl p-4 border border-[var(--color-light-bg)]/50'>
                            <h2 className="text-xl font-semibold text-[var(--color-primary-accent)] mb-3 flex items-center gap-2">
                                <FiEdit3 className="text-[var(--color-secondary-accent)]" /> 1. Report an Issue
                            </h2>
                            <p>
                                See a problem like overflowing bins, potholes, or broken streetlights? Use our simple reporting form. Pinpoint the location on the map, add a description, select the issue type and priority, and optionally upload a photo. Your detailed report helps volunteers and authorities act faster.
                            </p>
                        </div>
                        <div className='bg-[var(--color-light-bg)]/20 rounded-2xl p-4 border border-[var(--color-light-bg)]/50' >
                            <h2 className="text-xl font-semibold text-[var(--color-primary-accent)] mb-3 flex items-center gap-2">
                                <FiEye className="text-[var(--color-secondary-accent)]" /> 2. Track Progress
                            </h2>
                            <p>
                                Once submitted, you can track the status of your report (Pending, In Review, Resolved) directly from your personalized User Dashboard. You can also view reports submitted by others in the Community Reports section. Engage in discussions by adding comments to reports.
                            </p>
                        </div>
                         <div className='bg-[var(--color-light-bg)]/20 rounded-2xl p-4 border border-[var(--color-light-bg)]/50'>
                            <h2 className="text-xl font-semibold text-[var(--color-primary-accent)] mb-3 flex items-center gap-2">
                                <FiTool className="text-[var(--color-secondary-accent)]" /> 3. Volunteer Action
                            </h2>
                            <p>
                                Registered volunteers can view nearby pending issues on their Volunteer Dashboard. They can assign tasks to themselves, update the status as they work on resolving the issue (e.g., changing it to "In Progress" or "Resolved"), and help keep the community informed.
                            </p>
                        </div>
                         <div className='bg-[var(--color-light-bg)]/20 rounded-2xl p-4 border border-[var(--color-light-bg)]/50'>
                            <h2 className="text-xl font-semibold text-[var(--color-primary-accent)] mb-3 flex items-center gap-2">
                                <FiUserCheck className="text-[var(--color-secondary-accent)]" /> 4. Admin Oversight
                            </h2>
                            <p>
                                Administrators have an overview of all users and complaints. They can manage user roles, monitor the overall progress of issue resolution, and potentially coordinate larger efforts or escalate issues to relevant authorities when necessary.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HowItWorksPage;
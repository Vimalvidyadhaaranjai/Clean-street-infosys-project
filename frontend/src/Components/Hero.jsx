import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for the button
import { FiArrowRight } from 'react-icons/fi'; // Icon for the button

const Hero = () => {
    return (
        // Added overflow-hidden and a unique class for potential background animation
        <div className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden hero-background">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src="images/hero.png" //
                    alt="City Street"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                {/* Enhanced Overlay - Smoother gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>
                 {/* Optional: Subtle pattern overlay */}
                 {/* <div className="absolute inset-0 bg-[url('/path/to/subtle-pattern.png')] opacity-10"></div> */}
            </div>

            {/* Content Area */}
            <div className="relative z-10 px-4 sm:px-8 py-10 text-center">
                <div className="max-w-4xl mx-auto">
                    {/* Enhanced Text Animation */}
                    <h1 className="text-white text-4xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in-down duration-700">
                        Transform Your Streets, Together.
                    </h1>
                    <p className="mt-4 text-white/90 text-base sm:text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up duration-700 delay-200">
                        Join thousands of citizens building better neighborhoods. Report issues, track progress, and collaborate for the change you want to see.
                    </p>

                     {/* Call to Action Button */}
                     <Link
                        to="/register" // Link to registration page
                        className="mt-10 inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg transition-all  ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-black/50 animate-fade-in-up duration-700 delay-400"
                    >
                        Get Started Now <FiArrowRight className="ml-1" />
                    </Link>
                </div>

                {/* Feature Cards - Enhanced Styling & Hover Effect */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Card 1 */}
                    <FeatureCard
                        icon="images/icons/location.png" //
                        title="Smart Reporting"
                        description="Use advanced tools to report issues with precise location tracking and photo evidence."
                        delay="300"
                    />
                     {/* Card 2 */}
                    <FeatureCard
                        icon="images/icons/user.png" //
                        title="Role-Based Access"
                        description="Citizens, Volunteers, and administrators working together using a centralized platform."
                        delay="500"
                    />
                     {/* Card 3 */}
                    <FeatureCard
                        icon="images/icons/restore.png" //
                        title="Real-Time Updates"
                        description="Get instant notifications and track resolution progress in your personalized dashboard."
                        delay="700"
                    />
                </div>
            </div>
        </div>
    );
};

// Feature Card Component - Enhanced Style
const FeatureCard = ({ icon, title, description, delay }) => (
    <div
        className={`bg-white/10 backdrop-blur-xl border border-white/20 text-white p-8 rounded-2xl transition-all duration-300 ease-out transform hover:scale-[1.03] hover:border-white/40 hover:shadow-2xl hover:shadow-blue-500/20 animate-fade-in-up animation-delay-${delay}`}
        // style={{ animationDelay: `${delay}ms` }} // Alternative way to handle delay if Tailwind classes aren't sufficient
    >
        <div className="flex flex-col items-center text-center">
            {/* Make sure icons are visible (e.g., white or use invert) */}
            <img className="h-14 mb-5 filter invert brightness-0" src={icon} alt={`${title} icon`} />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-sm text-white/80 leading-relaxed">{description}</p>
        </div>
    </div>
);


export default Hero;
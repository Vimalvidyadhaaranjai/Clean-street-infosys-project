import React from 'react'

const Hero = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
                <img
                    src="images/hero.png"
                    alt="Hero"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 pointer-events-none"></div>
            </div>

            <div className="relative z-10 px-5 sm:px-10 py-10 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-white text-4xl sm:text-6xl md:text-7xl font-bold leading-tight animate-fade-in-down">
                        Transform Your Streets, Together.
                    </h1>
                    <p className="mt-6 text-white/90 text-base sm:text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up">
                        Join thousands of citizens in building better neighborhoods. Report issues, track progress, and collaborate with local authorities to create the change you want to see.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 text-white p-6 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up animation-delay-300">
                        <div className="flex flex-col items-center text-center">
                            <img className="h-12 invert mb-4" src="images/icons/icon1.png" alt="" />
                            <h3 className="text-xl font-semibold">Smart Reporting</h3>
                            <p className="mt-2 text-sm text-white/80">Use advanced tools to report issues with precise location tracking and photo evidence.</p>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 text-white p-6 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up animation-delay-500">
                        <div className="flex flex-col items-center text-center">
                            <img className="h-12 invert mb-4" src="images/icons/icon2.png" alt="" />
                            <h3 className="text-xl font-semibold">Role-Based Access</h3>
                            <p className="mt-2 text-sm text-white/80">Citizens, Volunteers, and administrators working together using a centralized platform.</p>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 text-white p-6 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up animation-delay-700">
                        <div className="flex flex-col items-center text-center">
                            <img className="h-12 invert  mb-4" src="images/icons/icon3.png" alt="" />
                            <h3 className="text-xl font-semibold">Real-Time Updates</h3>
                            <p className="mt-2 text-sm text-white/80">Get instant notifications and track resolution progress in your personalized dashboard.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero
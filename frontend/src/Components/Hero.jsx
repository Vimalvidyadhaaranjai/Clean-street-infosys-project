import React from 'react'

const Hero = () => {
    return (
        <div className="relative min-h-[100dvh] pt-25">
            <img
                src="images/hero.png"
                alt="Hero"
                className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/50 md:bg-black/40 pointer-events-none"></div>

            <div className="relative z-10 px-5 sm:px-10 py-10">
                <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    <div className="w-full md:w-2/3 lg:w-2/3">
                        <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
                            Transform Your <br /> Streets
                        </h1>
                        <p className="mt-4 text-white text-base sm:text-lg md:text-2xl max-w-5xl">
                            Join thousands of citizens in building better neighborhoods. Report issues, track progress, and collaborate with local authorities to create the change you want to see.
                        </p>
                    </div>

                    <div className="w-full md:w-1/3  lg:w-1/3 grid grid-cols-1 gap-4">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-5 rounded-2xl transform transition-transform duration-300 hover:scale-[1.02]">
                            <div className="flex gap-2 items-center mb-1">
                                <img className="h-6" src="images/icons/icon1.png" alt="" />
                                <h3 className="text-lg sm:text-xl">Smart Reporting</h3>
                            </div>
                            <p className="text-sm sm:text-base">Use advanced tools to report issues with precise location tracking and photo evidence.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-5 rounded-2xl transform transition-transform duration-300 hover:scale-[1.02]">
                            <div className="flex gap-2 items-center mb-1">
                                <img className="h-6" src="images/icons/icon2.png" alt="" />
                                <h3 className="text-lg sm:text-xl">Role Based Access</h3>
                            </div>
                            <p className="text-sm sm:text-base">Citizens, Volunteers and administrators working together using a centralized platform.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-5 rounded-2xl transform transition-transform duration-300 hover:scale-[1.02]">
                            <div className="flex gap-2 items-center mb-1">
                                <img className="h-6" src="images/icons/icon3.png" alt="" />
                                <h3 className="text-lg sm:text-xl">Real-Time Updates</h3>
                            </div>
                            <p className="text-sm sm:text-base">Get instant notifications and track resolution progress in your personalized dashboard.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero
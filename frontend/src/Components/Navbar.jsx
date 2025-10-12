import React, { useEffect, useState, useRef } from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) setUser(JSON.parse(stored));
        } catch { }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsProfileMenuOpen(false);
        navigate('/login');
    };

    const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
            <nav className="bg-white/80 backdrop-blur-md px-4 lg:px-20 w-full h-20 fixed top-0 z-50 shadow-sm flex items-center justify-between gap-5 transition-all duration-300">
                <Link to="/" className="flex items-center h-full">
                    <img className="h-22 w-auto" src="/images/logo.png" alt="logo" />
                </Link>
                <div className={`lg:flex-1 lg:flex lg:items-center lg:justify-end  ${isMenuOpen ? 'block' : 'hidden'} absolute top-20 left-0 w-full bg-white/95 lg:static lg:bg-transparent lg:w-auto z-40 shadow-lg lg:shadow-none rounded-b-lg lg:rounded-none`}>
                    {user ? (
                        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:gap-2 p-4 lg:p-0">
                            <div className="w-full lg:w-auto">
                                <Link to="/UserDashboard" className="block w-full px-6 py-3 lg:px-4 lg:py-2 text-gray-800 hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-blue-600 font-semibold transition-colors duration-300 rounded-md">
                                    Dashboard
                                </Link>
                            </div>
                            <div className="w-full lg:w-auto">
                                <Link to="/ReportIssue" className="block w-full px-6 py-3 lg:px-4 lg:py-2 text-gray-800 hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-blue-600 font-semibold transition-colors duration-300 rounded-md">
                                    Report Issue
                                </Link>
                            </div>
                            <div className="w-full lg:w-auto">
                                <Link to="/view-complaints" className="block w-full px-6 py-3 lg:px-4 lg:py-2 text-gray-800 hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-blue-600 font-semibold transition-colors duration-300 rounded-md">
                                    View Complaints
                                </Link>
                            </div>
                            

                            {/* Mobile profile options */}
                            <div className="lg:hidden w-full pt-4 mt-4 border-t border-gray-200">
                                <div className="w-full">
                                    <Link to="/profile" className="block w-full px-6 py-3 text-gray-800 hover:bg-gray-100 font-semibold transition-colors duration-300 rounded-md">
                                        Profile
                                    </Link>
                                </div>
                                <div className="w-full">
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full px-6 py-3 text-red-500 hover:bg-red-50 font-semibold text-left transition-colors duration-300 rounded-md"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
                <div className="lg:flex items-center gap-4 relative">
                    {/* Hamburger Menu Button */}
                    <button
                        className="lg:hidden p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 flex flex-col justify-center items-center w-10 h-10"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${isMenuOpen ? 'transform rotate-45 translate-y-1.5' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-gray-700 my-1 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${isMenuOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}></span>
                    </button>
                    {user ? (
                        <>
                            <div className="relative hidden lg:block" ref={profileMenuRef}>
                                {user.profilePhoto ? (
                                    <img
                                        src={user.profilePhoto}
                                        alt="avatar"
                                        className="w-12 h-12 rounded-full object-cover cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all duration-300"
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                ) : (
                                    <div
                                        className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg uppercase cursor-pointer font-bold hover:bg-blue-700 transition-colors duration-300"
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    >
                                        {initial}
                                    </div>
                                )}

                                {/* Profile Dropdown Menu */}
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200 animate-fade-in-down">
                                        <div className="px-4 py-2 text-sm font-semibold text-gray-800 border-b border-gray-200 mb-2">
                                            {user.name || 'User Profile'}
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigate('/profile');
                                                setIsProfileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors duration-200"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                            Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors duration-200"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7z" clipRule="evenodd" />
                                                <path d="M8.293 7.293a1 1 0 011.414 0L11 8.586V7a1 1 0 112 0v4a1 1 0 11-2 0V9.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3z" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <button
                                className="border border-blue-600 px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base rounded-full font-semibold text-blue-600 bg-white hover:bg-blue-50 transform transition-transform duration-300 hover:scale-105"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base rounded-full font-semibold hover:bg-blue-700 transform transition-transform duration-300 hover:scale-105"
                                onClick={() => navigate('/register')}
                            >
                                Register
                            </button>
                        </>
                    )}
                </div>
            </nav>
    )
}

export default Navbar
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
            <nav className="bg-gray-200/70 px-4 lg:px-20 w-full h-16 fixed top-0 z-50 backdrop-blur-2xl flex items-center justify-between gap-5">
                <Link to="/" className="flex items-center h-full">
                    <img className="h-18 w-auto" src="/images/logo.png" alt="logo" />
                </Link>
                <div className={`lg:flex-1 lg:flex lg:items-center lg:justify-end  ${isMenuOpen ? 'block' : 'hidden'} absolute top-16 left-0 w-full bg-gray-200/95 lg:static lg:bg-transparent lg:w-auto z-40`}>
                    {user ? (
                        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:gap-2">
                            <div className="w-full lg:w-auto border-b border-gray-300 lg:border-none">
                                <Link to="/UserDashboard" className="block w-full px-6 py-3 lg:px-4 lg:py-2 text-gray-700 hover:bg-gray-300/50 lg:hover:bg-black lg:hover:text-white lg:rounded-md font-medium">
                                    Dashboard
                                </Link>
                            </div>
                            <div className="w-full lg:w-auto border-b border-gray-300 lg:border-none">
                                <Link to="/ReportIssue" className="block w-full px-6 py-3 lg:px-4 lg:py-2 text-gray-700 hover:bg-gray-300/50 lg:hover:bg-black lg:hover:text-white lg:rounded-md font-medium">
                                    Report Issue
                                </Link>
                            </div>

                            {/* Mobile profile options */}
                            <div className="lg:hidden w-full">
                                <div className="w-full border-b border-gray-300">
                                    <Link to="/profile" className="block w-full px-6 py-3 text-gray-700 hover:bg-gray-300/50 font-medium">
                                        Profile
                                    </Link>
                                </div>
                                <div className="w-full">
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full px-6 py-3 text-gray-700 hover:bg-gray-300/50 font-medium text-left"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
                <div className="lg:flex items-center gap-3 relative">
                    {/* Hamburger Menu Button */}
                    <button 
                        className="lg:hidden p-1 hover:bg-gray-300 focus:outline-none flex flex-col justify-center items-center w-8 h-8 mr-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className="w-4 h-0.5 bg-gray-600 mb-1"></div>
                        <div className="w-4 h-0.5 bg-gray-600 mb-1"></div>
                        <div className="w-4 h-0.5 bg-gray-600"></div>
                    </button>
                    {user ? (
                        <>
                            <div className="relative hidden lg:block" ref={profileMenuRef}>
                                {user.profilePhoto ? (
                                    <img
                                        src={user.profilePhoto}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full  object-cover cursor-pointer"
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                ) : (
                                    <div
                                        className="w-10 h-10 rounded-full bg-[#14213D] text-white flex items-center justify-center text-sm uppercase cursor-pointer"
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    >
                                        {initial}
                                    </div>
                                )}
                                
                                {/* Profile Dropdown Menu */}
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                        <div className="px-4 py-2 text-sm font-medium text-gray-500 border-b border-gray-100">
                                            {user.name || 'User Profile'}
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigate('/profile');
                                                setIsProfileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                            Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
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
                                className="border border-gray-400 px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base rounded-xl bg-gradient-to-r from-[#ffffff] to-[#dad4d4] transform transition-transform duration-100 hover:scale-105"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                            <button
                                className="bg-gradient-to-r from-[#14213D] to-[#4d9fe8] text-white px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base rounded-xl transform transition-transform duration-100 hover:scale-105"
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
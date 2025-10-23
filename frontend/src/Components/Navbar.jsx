import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
// --- ICON IMPORTS (Keep existing ones) ---
import { FiGrid, FiFilePlus, FiEye, FiUser, FiLogOut, FiShield, FiMenu, FiX } from "react-icons/fi"; // Added FiMenu, FiX

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const mobileMenuRef = useRef(null); // Ref for mobile menu

    // Get user from localStorage on initial load
    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) setUser(JSON.parse(stored));
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        }
    }, []);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
            // Close mobile menu if clicking outside of it and not on the toggle button
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('#mobile-menu-button')) {
               setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsProfileMenuOpen(false);
        setIsMenuOpen(false);
        navigate('/login');
    };

    const closeMobileMenu = () => {
        setIsMenuOpen(false);
    };

    const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U';

    return (
        <>
            {/* Main Navbar */}
            {/* TRENDY STYLE: Added gradient, slightly increased height, adjusted blur/opacity */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/80 via-white/70 to-blue-50/60 backdrop-blur-xl shadow-md border-b border-gray-200/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* TRENDY STYLE: Increased height h-24 */}
                    <div className="flex items-center justify-between h-24">
                        {/* Logo */}
                        <Link to="/" onClick={closeMobileMenu} className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
                            {/* TRENDY STYLE: Increased logo size h-20 */}
                            <img className="h-30 w-auto" src="/images/logo.png" alt="Clean Street Logo" />
                        </Link>

                        {/* Desktop Navigation Links */}
                        {/* TRENDY STYLE: Increased spacing space-x-4 */}
                        <div className="hidden lg:flex items-center space-x-4">
                            {user && (
                                <>
                                    {/* Using the new NavLink component */}
                                    <NavLink to="/UserDashboard"><FiGrid /><span>Dashboard</span></NavLink>
                                    {user.role === "volunteer" && (
                                        <NavLink to="/VolunteerDashboard"><FiGrid /><span>Volunteer Board</span></NavLink>
                                    )}
                                    {user.role === "admin" && (
                                        <NavLink to="/AdminDashboard"><FiShield /><span>Admin Panel</span></NavLink>
                                    )}
                                    <NavLink to="/ReportIssue"><FiFilePlus /><span>Report Issue</span></NavLink>
                                    <NavLink to="/view-complaints"><FiEye /><span>View Complaints</span></NavLink>
                                </>
                            )}
                        </div>

                        {/* Right side: Auth buttons or User Profile */}
                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="relative" ref={profileMenuRef}>
                                    <button onClick={() => setIsProfileMenuOpen(prev => !prev)} className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform duration-300 hover:scale-110">
                                         {/* TRENDY STYLE: Increased avatar size w-12 h-12 */}
                                        {user.profilePhoto ? (
                                            <img src={user.profilePhoto} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"/>
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl uppercase font-bold shadow-md">
                                                {initial}
                                            </div>
                                        )}
                                    </button>

                                    {/* Profile Dropdown Menu */}
                                    {/* TRENDY STYLE: Added transition classes */}
                                    <div
                                        className={`absolute right-0 mt-4 w-64 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 transition-all duration-300 ease-out origin-top-right ${isProfileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="font-bold text-gray-800 truncate">{user.name}</p>
                                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <ProfileMenuItem to="/profile" icon={<FiUser />} onClick={() => setIsProfileMenuOpen(false)}>My Profile</ProfileMenuItem>
                                            <ProfileMenuItem icon={<FiLogOut />} onClick={handleLogout} isLogout>Logout</ProfileMenuItem>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="hidden lg:flex items-center gap-3">
                                    <AuthButton to="/login" secondary>Login</AuthButton>
                                    <AuthButton to="/register">Register</AuthButton>
                                </div>
                            )}

                            {/* Hamburger Menu Button (visible on mobile) */}
                            {/* TRENDY STYLE: Using FiMenu/FiX icons, styled button */}
                            <button
                                id="mobile-menu-button" // Added ID for click outside logic
                                className="lg:hidden p-3 rounded-full text-gray-700 hover:bg-gray-200/60 focus:outline-none transition-colors duration-200"
                                onClick={() => setIsMenuOpen(prev => !prev)}
                                aria-label="Toggle menu"
                            >
                               {isMenuOpen ? <FiX size={24}/> : <FiMenu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Menu Panel */}
            {/* TRENDY STYLE: Slide in from right, full height, blurred background */}
            <div
                ref={mobileMenuRef} // Add ref here
                className={`fixed top-0 right-0 h-full w-72 bg-white/90 backdrop-blur-lg shadow-xl z-[60] lg:hidden transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 h-24">
                     <span className="font-bold text-lg text-gray-700">Menu</span>
                     <button
                         className="p-2 rounded-full text-gray-500 hover:bg-gray-200/60"
                         onClick={closeMobileMenu}
                         aria-label="Close menu"
                     >
                         <FiX size={22}/>
                     </button>
                 </div>
                <div className="px-2 pt-4 pb-4 space-y-2 sm:px-3">
                    {user ? (
                        <>
                            {/* Using new MobileNavLink component */}
                            <MobileNavLink to="/UserDashboard" onClick={closeMobileMenu}><FiGrid /><span>Dashboard</span></MobileNavLink>
                            {user.role === "volunteer" && (
                                <MobileNavLink to="/VolunteerDashboard" onClick={closeMobileMenu}><FiGrid /><span>Volunteer Board</span></MobileNavLink>
                             )}
                             {user.role === "admin" && (
                                <MobileNavLink to="/AdminDashboard" onClick={closeMobileMenu}><FiShield /><span>Admin Panel</span></MobileNavLink>
                             )}
                            <MobileNavLink to="/ReportIssue" onClick={closeMobileMenu}><FiFilePlus /><span>Report Issue</span></MobileNavLink>
                            <MobileNavLink to="/view-complaints" onClick={closeMobileMenu}><FiEye /><span>View Complaints</span></MobileNavLink>
                            {/* Added Profile link for mobile */}
                            <div className="pt-4 mt-4 border-t border-gray-200">
                                <MobileNavLink to="/profile" onClick={closeMobileMenu}><FiUser /><span>My Profile</span></MobileNavLink>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-3 text-base font-semibold rounded-md text-red-600 hover:bg-red-50 transition-colors duration-200"
                                >
                                    <FiLogOut /><span>Logout</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-4 py-6 px-4">
                           <AuthButton to="/login" onClick={closeMobileMenu} secondary fullWidth>Login</AuthButton>
                           <AuthButton to="/register" onClick={closeMobileMenu} fullWidth>Register</AuthButton>
                        </div>
                    )}
                </div>
            </div>
             {/* TRENDY STYLE: Overlay for mobile menu */}
            {isMenuOpen && <div className="fixed inset-0 bg-black/30 z-50 lg:hidden" onClick={closeMobileMenu}></div>}
        </>
    );
};

// --- Reusable Sub-components ---

// TRENDY STYLE: Updated NavLink styles for better hover/active states
const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-full transition-all duration-300 relative group ${
                isActive
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50'
            }`}
        >
            {children}
            {/* TRENDY STYLE: Animated underline effect on hover */}
            <span
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-indigo-600 transition-all duration-300 ease-out group-hover:w-3/5 ${isActive ? 'w-3/5' : 'w-0'}`}
            ></span>
        </Link>
    );
};

// TRENDY STYLE: Updated MobileNavLink styles
const MobileNavLink = ({ to, children, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg transition-colors duration-200 ${
                isActive
                    ? 'text-indigo-700 bg-indigo-100'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
            {children}
        </Link>
    );
};

// TRENDY STYLE: Updated AuthButton styles
const AuthButton = ({ to, children, secondary = false, onClick, fullWidth = false }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center ${fullWidth ? 'w-full' : ''}
            ${secondary
                ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
            }`
        }
    >
        {children}
    </Link>
);

// TRENDY STYLE: Updated ProfileMenuItem styles
const ProfileMenuItem = ({ to, icon, children, onClick, isLogout = false }) => {
    const baseClasses = `w-full text-left px-5 py-3 flex items-center gap-3 transition-colors duration-200 text-sm rounded-lg mx-1`;
    const normalClasses = `font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900`;
    const logoutClasses = `font-semibold text-red-600 hover:bg-red-50`;

    const className = `${baseClasses} ${isLogout ? logoutClasses : normalClasses}`;

    return to ? (
        <Link to={to} className={className} onClick={onClick}>{icon}{children}</Link>
    ) : (
        <button className={className} onClick={onClick}>{icon}{children}</button>
    );
};

export default Navbar;
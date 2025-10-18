import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
// --- MODIFICATION START ---
import { FiGrid, FiFilePlus, FiEye, FiUser, FiLogOut, FiShield } from "react-icons/fi"; // Added FiShield
// --- MODIFICATION END ---

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);

    // Get user from localStorage on initial load
    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) setUser(JSON.parse(stored));
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        }
    }, []);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
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
        setIsMenuOpen(false); // Close mobile menu on logout
        navigate('/login');
    };

    // Function to close mobile menu
    const closeMobileMenu = () => {
        setIsMenuOpen(false);
    };

    const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U';

    return (
        <>
            {/* Main Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link to="/" onClick={closeMobileMenu} className="flex-shrink-0">
                            <img className="h-16 w-auto" src="/images/logo.png" alt="Clean Street Logo" />
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center space-x-2">
                            {user && (
                                <>
                                    <NavLink to="/UserDashboard"><FiGrid /><span>Dashboard</span></NavLink>
                                    {user.role === "volunteer" && (
                                        <NavLink to="/VolunteerDashboard"><FiGrid /><span>Volunteer Board</span></NavLink>
                                    )}
                                    {/* --- ADDITION START --- */}
                                    {user.role === "admin" && (
                                        <NavLink to="/AdminDashboard"><FiShield /><span>Admin Panel</span></NavLink>
                                    )}
                                    {/* --- ADDITION END --- */}
                                    <NavLink to="/ReportIssue"><FiFilePlus /><span>Report Issue</span></NavLink>
                                    <NavLink to="/view-complaints"><FiEye /><span>View Complaints</span></NavLink>
                                </>
                            )}
                        </div>

                        {/* Right side: Auth buttons or User Profile */}
                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="relative" ref={profileMenuRef}>
                                    <button onClick={() => setIsProfileMenuOpen(prev => !prev)} className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        {user.profilePhoto ? (
                                            <img src={user.profilePhoto} alt="avatar" className="w-11 h-11 rounded-full object-cover"/>
                                        ) : (
                                            <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg uppercase font-bold">
                                                {initial}
                                            </div>
                                        )}
                                    </button>

                                    {/* Profile Dropdown Menu */}
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200 transform transition-all duration-150 ease-out origin-top-right">
                                            <div className="px-4 py-3 border-b border-gray-200">
                                                <p className="font-bold text-gray-800 truncate">{user.name}</p>
                                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <ProfileMenuItem to="/profile" icon={<FiUser />} onClick={() => setIsProfileMenuOpen(false)}>My Profile</ProfileMenuItem>
                                                <ProfileMenuItem icon={<FiLogOut />} onClick={handleLogout} isLogout>Logout</ProfileMenuItem>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden lg:flex items-center gap-2">
                                    <AuthButton to="/login" secondary>Login</AuthButton>
                                    <AuthButton to="/register">Register</AuthButton>
                                </div>
                            )}

                            {/* Hamburger Menu Button (visible on mobile) */}
                            <button
                                className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                                onClick={() => setIsMenuOpen(prev => !prev)}
                                aria-label="Toggle menu"
                            >
                                <div className={`w-6 h-0.5 bg-current transition-transform duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
                                <div className={`w-6 h-0.5 bg-current my-1.5 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                                <div className={`w-6 h-0.5 bg-current transition-transform duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Menu Panel (slides from top) */}
            <div className={`fixed top-20 left-0 right-0 z-40 bg-white shadow-md lg:hidden transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
                    {user ? (
                        <>
                            <MobileNavLink to="/UserDashboard" onClick={closeMobileMenu}><FiGrid /><span>Dashboard</span></MobileNavLink>
                            {user.role === "volunteer" && (
                                <MobileNavLink to="/VolunteerDashboard" onClick={closeMobileMenu}><FiGrid /><span>Volunteer Board</span></MobileNavLink>
                             )}
                             {/* --- ADDITION START --- */}
                             {user.role === "admin" && (
                                <MobileNavLink to="/AdminDashboard" onClick={closeMobileMenu}><FiShield /><span>Admin Panel</span></MobileNavLink>
                             )}
                            {/* --- ADDITION END --- */}
                            <MobileNavLink to="/ReportIssue" onClick={closeMobileMenu}><FiFilePlus /><span>Report Issue</span></MobileNavLink>
                            <MobileNavLink to="/view-complaints" onClick={closeMobileMenu}><FiEye /><span>View Complaints</span></MobileNavLink>
                        </>
                    ) : (
                        <div className="flex items-center justify-center gap-4 py-4">
                           <AuthButton to="/login" onClick={closeMobileMenu} secondary>Login</AuthButton>
                           <AuthButton to="/register" onClick={closeMobileMenu}>Register</AuthButton>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

// --- Reusable Sub-components for a Cleaner and More Maintainable Navbar ---

const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-colors duration-200 relative ${
                isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`}
        >
            {children}
            {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
            )}
        </Link>
    );
};

const MobileNavLink = ({ to, children, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-3 text-base font-semibold rounded-md transition-colors duration-200 relative ${
                isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            }`}
        >
            {children}
            {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
            )}
        </Link>
    );
};

const AuthButton = ({ to, children, secondary = false, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-transform duration-200 transform hover:scale-105
            ${secondary
                ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
            }`
        }
    >
        {children}
    </Link>
);

const ProfileMenuItem = ({ to, icon, children, onClick, isLogout = false }) => {
    const className = `w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors duration-200 text-sm ${
        isLogout ? 'font-semibold text-red-600 hover:bg-red-50' : 'font-medium text-gray-700 hover:bg-gray-100'
    }`;

    return to ? (
        <Link to={to} className={className} onClick={onClick}>{icon}{children}</Link>
    ) : (
        <button className={className} onClick={onClick}>{icon}{children}</button>
    );
};

export default Navbar;
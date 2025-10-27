import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiGrid, FiFilePlus, FiEye, FiUser, FiLogOut, FiShield, FiMenu, FiX, FiChevronDown, FiInfo, FiHelpCircle, FiSettings } from "react-icons/fi"; // Added Info, HelpCircle, Settings

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
    const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const aboutDropdownRef = useRef(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) setUser(JSON.parse(stored));
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target) && !event.target.closest('#profile-menu-button')) {
                setIsProfileMenuOpen(false);
            }
            if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target) && !event.target.closest('#about-dropdown-button')) {
                setIsAboutDropdownOpen(false);
            }
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
        setIsMobileAboutOpen(false);
    };
    const toggleProfileMenu = () => setIsProfileMenuOpen(prev => !prev);
    const toggleMobileMenu = () => setIsMenuOpen(prev => !prev);
    const toggleAboutDropdown = () => setIsAboutDropdownOpen(prev => !prev);
    const toggleMobileAbout = () => setIsMobileAboutOpen(prev => !prev);

    const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U';

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gray/90 backdrop-blur-lg shadow-sm border-b border-gray-200/60">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link to="/" onClick={closeMobileMenu} className="flex-shrink-0 transition-transform duration-300 ease-out hover:scale-105 group">
                            <img className="h-24 w-auto transition-filter duration-300 group-hover:brightness-110" src="/images/logo.png" alt="Clean Street Logo" />
                        </Link>

                        <div className='flex justify-end'>
                            {/* === CONDITIONAL NAVIGATION LINKS === */}
                            <div className="hidden lg:flex items-center space-x-2">
                                {user ? (
                                    // Logged-in Links
                                    <>
                                    
                                        <NavLink to="/UserDashboard"><FiGrid /><span>Complaint Dashboard</span></NavLink>
                                        {user.role === "volunteer" && (
                                            <NavLink to="/VolunteerDashboard"><FiGrid /><span>Volunteer Panel</span></NavLink>
                                        )}
                                        {user.role === "admin" && (
                                            <NavLink to="/AdminDashboard"><FiShield /><span>Admin Panel</span></NavLink>
                                        )}
                                        <NavLink to="/ReportIssue"><FiFilePlus /><span>Report Issue</span></NavLink>
                                        <NavLink to="/view-complaints"><FiEye /><span>View Complaints</span></NavLink>
                                    </>
                                ) : (
                                    // Logged-out Links with About Us Dropdown
                                    <>
                                        <div className="relative" ref={aboutDropdownRef}>
                                            <button
                                                id="about-dropdown-button"
                                                onClick={toggleAboutDropdown}
                                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 group"
                                                aria-label="About Us menu"
                                                aria-haspopup="true"
                                                aria-expanded={isAboutDropdownOpen}
                                            >
                                                <FiInfo />
                                                <span>About Us</span>
                                                <FiChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>

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

                        <div className="w-full lg:w-auto border-b border-gray-300 lg:border-none">
                            <Link to="/ViewComplaints" className="block w-full px-6 py-3 lg:px-4 lg:py-2 text-gray-700 hover:bg-gray-300/50 lg:hover:bg-black lg:hover:text-white lg:rounded-md font-medium">
                                View Complaints
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
                                            <div
                                                className={`absolute left-0 mt-2 w-56 origin-top-left bg-white rounded-lg shadow-xl py-2 border border-gray-200 focus:outline-none transition-all duration-200 ease-out ${isAboutDropdownOpen ? 'opacity-100 scale-100 visible z-[60]' : 'opacity-0 scale-95 invisible'}`}
                                                role="menu"
                                                aria-orientation="vertical"
                                                aria-labelledby="about-dropdown-button"
                                            >
                                                <DropdownLink to="/about" icon={<FiInfo />} onClick={() => setIsAboutDropdownOpen(false)}>About Page</DropdownLink>
                                                <DropdownLink to="/how-it-works" icon={<FiHelpCircle />} onClick={() => setIsAboutDropdownOpen(false)}>How It Works</DropdownLink>
                                                <DropdownLink to="/services" icon={<FiSettings />} onClick={() => setIsAboutDropdownOpen(false)}>Services</DropdownLink>
                                            </div>
                                        </div>
                                    </>
                                )}
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
                            {/* Right side: Auth buttons or User Profile */}
                            <div className="flex items-center gap-4">
                                {user ? (
                                    <div className="relative" ref={profileMenuRef}>
                                        <button
                                            id="profile-menu-button"
                                            onClick={toggleProfileMenu}
                                            className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                                            aria-label="User menu" aria-haspopup="true" aria-expanded={isProfileMenuOpen}
                                        >
                                            {user.profilePhoto ? (
                                                <img src={user.profilePhoto} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 shadow-sm" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg uppercase font-semibold shadow-sm border-2 border-white">
                                                    {initial}
                                                </div>
                                            )}
                                            <span className="hidden sm:inline text-sm font-medium text-gray-700">{user.name}</span>
                                            <FiChevronDown size={16} className={`hidden sm:inline text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        <div
                                            className={`absolute right-0 mt-3 w-60 origin-top-right bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100 focus:outline-none transition-all duration-200 ease-out ${isProfileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                                            role="menu" aria-orientation="vertical" aria-labelledby="profile-menu-button" tabIndex="-1"
                                        >
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="font-semibold text-sm text-gray-800 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <div className="py-1" role="none">
                                                <ProfileMenuItem to="/profile" icon={<FiUser />} onClick={toggleProfileMenu}>My Profile</ProfileMenuItem>
                                                <ProfileMenuItem icon={<FiLogOut />} onClick={handleLogout} isLogout>Logout</ProfileMenuItem>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="hidden lg:flex items-center gap-2">
                                        <AuthButton to="/login" secondary>Login</AuthButton>
                                        <AuthButton to="/register">Register</AuthButton>
                                    </div>
                                )}

                                <button
                                    id="mobile-menu-button"
                                    className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
                                    onClick={toggleMobileMenu}
                                    aria-label="Toggle menu" aria-controls="mobile-menu" aria-expanded={isMenuOpen}
                                >
                                    {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Menu Panel */}
            <div
                ref={mobileMenuRef} id="mobile-menu"
                className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-40 lg:hidden transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog" aria-modal="true"
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 h-20">
                    <span className="font-semibold text-lg text-gray-800">Menu</span>
                    <button
                        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        onClick={closeMobileMenu}
                        aria-label="Close menu"
                    >
                        <FiX size={24} />
                    </button>
                </div>
                <nav className="px-3 pt-4 pb-4 space-y-1">
                    {/* === CONDITIONAL MOBILE LINKS === */}
                    {user ? (
                        // Logged-in Mobile Links
                        <>
                            <MobileNavLink to="/UserDashboard" onClick={closeMobileMenu}><FiGrid /><span>Dashboard</span></MobileNavLink>
                            {user.role === "volunteer" && (
                                <MobileNavLink to="/VolunteerDashboard" onClick={closeMobileMenu}><FiGrid /><span>Volunteer Board</span></MobileNavLink>
                            )}
                            {user.role === "admin" && (
                                <MobileNavLink to="/AdminDashboard" onClick={closeMobileMenu}><FiShield /><span>Admin Panel</span></MobileNavLink>
                            )}
                            <MobileNavLink to="/ReportIssue" onClick={closeMobileMenu}><FiFilePlus /><span>Report Issue</span></MobileNavLink>
                            <MobileNavLink to="/view-complaints" onClick={closeMobileMenu}><FiEye /><span>View Complaints</span></MobileNavLink>

                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <MobileNavLink to="/profile" onClick={closeMobileMenu}><FiUser /><span>My Profile</span></MobileNavLink>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-base font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors duration-200"
                                >
                                    <FiLogOut /><span>Logout</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        // Logged-out Mobile Links with About Us Accordion
                        <>
                            <div>
                                <button
                                    onClick={toggleMobileAbout}
                                    className="w-full flex items-center justify-between px-4 py-2.5 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <FiInfo />
                                        <span>About Us</span>
                                    </div>
                                    <FiChevronDown size={18} className={`transition-transform duration-200 ${isMobileAboutOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileAboutOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="pl-8 py-1 space-y-1">
                                        <MobileNavLink to="/about" onClick={closeMobileMenu}><FiInfo /><span>About Page</span></MobileNavLink>
                                        <MobileNavLink to="/how-it-works" onClick={closeMobileMenu}><FiHelpCircle /><span>How It Works</span></MobileNavLink>
                                        <MobileNavLink to="/services" onClick={closeMobileMenu}><FiSettings /><span>Services</span></MobileNavLink>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <MobileNavLink to="/login" onClick={closeMobileMenu}>Login</MobileNavLink>
                                <MobileNavLink to="/register" onClick={closeMobileMenu}>Register</MobileNavLink>
                            </div>
                        </>
                    )}
                </nav>
            </div>
            {isMenuOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={closeMobileMenu}></div>}
            <div className="h-20" />
        </>
    );
};

// --- Reusable Sub-components (Keep NavLink, MobileNavLink, AuthButton, ProfileMenuItem as they were) ---
const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 group ${isActive
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
        >
            {children}

            <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 transition-all duration-300 ease-out origin-center ${isActive ? 'scale-x-75 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-100'}`}
                aria-hidden="true"
            ></span>
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
            className={`flex items-center gap-3 px-4 py-2.5 text-base font-medium rounded-md transition-colors duration-200 ${isActive
                    ? 'text-indigo-700 bg-indigo-100'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
        >
            {children}
        </Link>
    );
};

const AuthButton = ({ to, children, secondary = false, onClick, fullWidth = false }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`px-5 py-2 rounded-md font-semibold text-sm transition-all duration-200 ease-out transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center ${fullWidth ? 'w-full' : ''}
            ${secondary
                ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200/80 shadow-sm'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md hover:from-blue-700 hover:to-indigo-700'
            }`}
    >
        {children}

    </Link>
);

const ProfileMenuItem = ({ to, icon, children, onClick, isLogout = false }) => {

    const baseClasses = `w-full text-left px-4 py-2 flex items-center gap-2.5 transition-colors duration-150 text-sm`;
    const normalClasses = `font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md mx-1`;
    const logoutClasses = `font-medium text-red-600 hover:bg-red-50 rounded-md mx-1`;

    const className = `${baseClasses} ${isLogout ? logoutClasses : normalClasses}`;

    return to ? (
        <Link to={to} className={className} onClick={onClick} role="menuitem" tabIndex="-1">{icon}{children}</Link>
    ) : (
        <button className={className} onClick={onClick} role="menuitem" tabIndex="-1">{icon}{children}</button>
    );
};

const DropdownLink = ({ to, icon, children, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            onClick={onClick}
            className={`w-full text-left px-4 py-2.5 flex items-center gap-2.5 transition-colors duration-150 text-sm font-medium rounded-md mx-1 ${isActive
                    ? 'text-indigo-700 bg-indigo-50'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
            role="menuitem"
        >
            {icon}
            {children}
        </Link>
    );
};

export default Navbar;
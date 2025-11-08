// src/Components/Navbar.jsx - MODIFIED WITH NEW PALETTE

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
            {/* --- NAVBAR --- */}
            {/* CHANGED: bg, border color */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-medium-bg)] backdrop-blur-xl shadow-lg border-b border-[var(--color-light-bg)]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link to="/" onClick={closeMobileMenu} className="flex-shrink-0 transition-transform duration-300 ease-out hover:scale-105 group">
                             {/* Assuming logo.png has transparency. If not, white_logo.png might be better */}
                            <img className="h-24 w-auto" src="/images/logo.png" alt="Clean Street Logo" />
                        </Link>

                        <div className='flex justify-end'>
                            {/* === CONDITIONAL NAVIGATION LINKS === */}
                            <div className="hidden lg:flex items-center space-x-2 ">
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
                                                // CHANGED: text and hover colors
                                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-[var(--color-text-light)] hover:text-[var(--color-primary-accent)] hover:bg-[var(--color-light-bg)] group"
                                                aria-label="About Us menu"
                                                aria-haspopup="true"
                                                aria-expanded={isAboutDropdownOpen}
                                            >
                                                <FiInfo />
                                                <span>About Us</span>
                                                {/* CHANGED: text color */}
                                                <FiChevronDown size={16} className={`text-[var(--color-text-light)]/70 transition-transform duration-200 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            <div
                                                // CHANGED: bg and border colors
                                                className={`absolute left-0 mt-2 w-56 origin-top-left bg-[var(--color-medium-bg)] rounded-lg shadow-xl py-2 border border-[var(--color-light-bg)] focus:outline-none transition-all duration-200 ease-out ${isAboutDropdownOpen ? 'opacity-100 scale-100 visible z-[60]' : 'opacity-0 scale-95 invisible'}`}
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

                            {/* Right side: Auth buttons or User Profile */}
                            <div className="flex items-center gap-4">
                                {user ? (
                                    <div className="relative" ref={profileMenuRef}>
                                        <button
                                            id="profile-menu-button"
                                            onClick={toggleProfileMenu}
                                            // CHANGED: hover color
                                            className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-[var(--color-light-bg)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-accent)] transition-all duration-200"
                                            aria-label="User menu" aria-haspopup="true" aria-expanded={isProfileMenuOpen}
                                        >
                                            {user.profilePhoto ? (
                                                <img src={user.profilePhoto} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 shadow-sm" />
                                            ) : (
                                                // CHANGED: gradient colors and text color
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary-accent)] to-[var(--color-secondary-accent)] text-[var(--color-text-dark)] flex items-center justify-center text-lg uppercase font-semibold shadow-sm border-2 border-white">
                                                    {initial}
                                                </div>
                                            )}
                                            {/* CHANGED: text color */}
                                            <span className="hidden sm:inline text-sm font-medium text-[var(--color-text-light)]">{user.name}</span>
                                            {/* CHANGED: text color */}
                                            <FiChevronDown size={16} className={`hidden sm:inline text-[var(--color-text-light)]/70 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        <div
                                            // CHANGED: bg and border colors
                                            className={`absolute right-0 mt-3 w-60 origin-top-right bg-[var(--color-medium-bg)] rounded-lg shadow-lg py-2 z-50 border border-[var(--color-light-bg)] focus:outline-none transition-all duration-200 ease-out ${isProfileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                                            role="menu" aria-orientation="vertical" aria-labelledby="profile-menu-button" tabIndex="-1"
                                        >
                                            {/* CHANGED: border and text colors */}
                                            <div className="px-4 py-2 border-b border-[var(--color-light-bg)]">
                                                <p className="font-semibold text-sm text-[var(--color-text-light)] truncate">{user.name}</p>
                                                <p className="text-xs text-[var(--color-text-light)]/70 truncate">{user.email}</p>
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
                                    // CHANGED: text and hover colors
                                    className="lg:hidden p-2 rounded-md text-[var(--color-text-light)] hover:bg-[var(--color-light-bg)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary-accent)] transition-colors"
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
                // CHANGED: bg color
                className={`fixed top-0 right-0 h-full w-72 bg-[var(--color-medium-bg)] shadow-xl z-40 lg:hidden transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog" aria-modal="true"
            >
                {/* CHANGED: border and text colors */}
                <div className="flex justify-between items-center p-4 border-b border-[var(--color-light-bg)] h-20">
                    <span className="font-semibold text-lg text-[var(--color-text-light)]">Menu</span>
                    <button
                        // CHANGED: text and hover colors
                        className="p-2 rounded-md text-[var(--color-text-light)]/70 hover:bg-[var(--color-light-bg)]"
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

                            {/* CHANGED: border color */}
                            <div className="pt-4 mt-4 border-t border-[var(--color-light-bg)]">
                                <MobileNavLink to="/profile" onClick={closeMobileMenu}><FiUser /><span>My Profile</span></MobileNavLink>
                                <button
                                    onClick={handleLogout}
                                    // CHANGED: text and hover colors (using a manual red)
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-base font-medium rounded-md text-[#ff4d4d] hover:bg-[#ff4d4d]/20 transition-colors duration-200"
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
                                    // CHANGED: text and hover colors
                                    className="w-full flex items-center justify-between px-4 py-2.5 text-base font-medium rounded-md text-[var(--color-text-light)] hover:bg-[var(--color-light-bg)] hover:text-[var(--color-primary-accent)] transition-colors duration-200"
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
                             {/* CHANGED: border color */}
                            <div className="pt-4 mt-4 border-t border-[var(--color-light-bg)]">
                                <MobileNavLink to="/login" onClick={closeMobileMenu}>Login</MobileNavLink>
                                <MobileNavLink to="/register" onClick={closeMobileMenu}>Register</MobileNavLink>
                            </div>
                        </>
                    )}
                </nav>
            </div>
            {isMenuOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={closeMobileMenu}></div>}
            <div className="h-20" />
        </>
    );
};

// --- Reusable Sub-components ---
const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            // CHANGED: active and hover colors
            className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 group ${isActive
                    ? 'text-[var(--color-secondary-accent)] bg-[var(--color-light-bg)]'
                    : 'text-[var(--color-text-light)] hover:text-[var(--color-primary-accent)] hover:bg-[var(--color-light-bg)]/70'
                }`}
        >
            {children}

            <span
                // CHANGED: active underline color
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary-accent)] transition-all duration-300 ease-out origin-center ${isActive ? 'scale-x-75 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-100'}`}
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
            // CHANGED: active and hover colors
            className={`flex items-center gap-3 px-4 py-2.5 text-base font-medium rounded-md transition-colors duration-200 ${isActive
                    ? 'text-[var(--color-secondary-accent)] bg-[var(--color-light-bg)]'
                    : 'text-[var(--color-text-light)] hover:bg-[var(--color-light-bg)]/70 hover:text-[var(--color-primary-accent)]'
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
         // CHANGED: primary and secondary button colors
        className={`px-5 py-2 rounded-md font-semibold text-sm transition-all duration-200 ease-out transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-accent)] flex items-center justify-center ${fullWidth ? 'w-full' : ''}
            ${secondary
                ? 'bg-[var(--color-light-bg)] text-[var(--color-text-light)] hover:bg-[var(--color-primary-accent)] hover:text-[var(--color-text-dark)] border border-[var(--color-light-bg)] shadow-sm'
                : 'bg-gradient-to-r from-[var(--color-primary-accent)] to-[var(--color-secondary-accent)] text-[var(--color-text-dark)] shadow hover:shadow-md hover:from-[var(--color-secondary-accent)] hover:to-[var(--color-secondary-accent)]'
            }`}
    >
        {children}

    </Link>
);

const ProfileMenuItem = ({ to, icon, children, onClick, isLogout = false }) => {

    // CHANGED: text, hover, and logout colors
    const baseClasses = `w-full text-left px-4 py-2 flex items-center gap-2.5 transition-colors duration-150 text-sm`;
    const normalClasses = `font-medium text-[var(--color-text-light)] hover:bg-[var(--color-light-bg)] hover:text-[var(--color-primary-accent)] rounded-md mx-1`;
    const logoutClasses = `font-medium text-[#ff4d4d] hover:bg-[#ff4d4d]/20 rounded-md mx-1`; // Using manual red

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
            // CHANGED: active and hover colors
            className={`w-full text-left px-4 py-2.5 flex items-center gap-2.5 transition-colors duration-150 text-sm font-medium rounded-md mx-1 ${isActive
                    ? 'text-[var(--color-secondary-accent)] bg-[var(--color-light-bg)]'
                    : 'text-[var(--color-text-light)] hover:bg-[var(--color-light-bg)]/70 hover:text-[var(--color-primary-accent)]'
                }`}
            role="menuitem"
        >
            {icon}
            {children}
        </Link>
    );
};

export default Navbar;
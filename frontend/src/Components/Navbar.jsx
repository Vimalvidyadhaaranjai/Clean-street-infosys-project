import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

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
        navigate('/login');
    };

    const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U';

    return (
        <nav className='lg:mx-auto bg-gray-200/70 lg:px-20 px-5 w-full h-16 fixed top-0 z-50 backdrop-blur-2xl flex items-center justify-between'>

            <Link to="/" className="logo flex flex-row justify-center items-center">
                <img className="h-20 lg:h-25 w-auto" src="images/logo.png" alt="logo" />
            </Link>

            
            <div className="flex space-x-6">
                <Link to="/dashboard" className="px-4 py-2 rounded-md font-medium text-gray-700 transition-all duration-300 hover:bg-black hover:text-white">
                    Dashboard
                </Link>
                <Link to="/report" className="px-4 py-2 rounded-md font-medium text-gray-700 transition-all duration-300 hover:bg-black hover:text-white">
                    Report Issue
                </Link>
                <Link to="/complaints" className="px-4 py-2 rounded-md font-medium text-gray-700 transition-all duration-300 hover:bg-black hover:text-white">
                    View Complaints
                </Link>
            </div>

            {user ? (
                <div className='flex items-center gap-3'>
                    {user.profilePhoto ? (
                        <img
                            src={user.profilePhoto}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover cursor-pointer"
                            onClick={() => navigate('/profile')}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    ) : null}
                
                    {!user.profilePhoto ? (
                        <div
                            className='w-10 h-10 rounded-full bg-[#14213D] text-white flex items-center justify-center text-sm uppercase cursor-pointer'
                            onClick={() => navigate('/profile')}
                        >
                            {initial}
                        </div>
                    ) : null}
                    <button
                        className='border border-gray-300 px-3 py-2 rounded-xl bg-white hover:bg-gray-100 transform transition-transform duration-100 hover:scale-105'
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-3">
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
                </div>

            )}
        </nav>
    )
}

export default Navbar
import React from 'react'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
    const navigate =useNavigate();
    return (
        <nav className=' mx-auto bg-gray-200/60 px-20 w-full h-18 fixed top-0 z-15 backdrop-blur-2xl flex justify-between '>
            <div className="logo flex flex-row justify-center items-center">
                <img className='w-20  flex ' src="images/logo.png" alt="logo" />
                <p className='uppercase font-bold'>Clean Street</p>
            </div>
            <div className='flex items-center gap-4 '>
                <button className='  border-1 border-white px-4 py-2 rounded-xl bg-gradient-to-r from-[#ffffff] to-[#dad4d4]' onClick={() => navigate('/login')}>Login</button>
                <button className='bg-gradient-to-r from-[#14213D] to-[#4695d9] text-white px-4 py-2 rounded-xl'onClick={() => navigate('/register')}>Register</button>
            </div>
        </nav>
    )
}

export default Navbar
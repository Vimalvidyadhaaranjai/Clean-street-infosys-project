// src/Components/Footer.jsx

import React from 'react';
import { FiHeart } from 'react-icons/fi';

const Footer = () => {
  // === STYLE UPDATE: Reduced vertical padding from py-6 to py-4 ===
  return (
    <footer className='bg-gray-800 text-gray-400 py-4 text-center text-sm mt-auto'> {/* Changed py-6 to py-4 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
            <p>&copy; {new Date().getFullYear()} Clean Street Initiative.</p>
            <span className="hidden sm:inline">|</span>
            <p className="flex items-center gap-1.5">
                Made with ❤️ for a cleaner community.
            </p>
            
        </div> 
      </div>
    </footer>
  );
}

export default Footer;
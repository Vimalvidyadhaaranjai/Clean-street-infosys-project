// src/pages/LandingPage.jsx - NO CHANGES NEEDED

import React from 'react';
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero'; // Will now use the updated Hero
import Footer from '../Components/Footer';

const LandingPage = () => {
    return (
        <div>
            <Navbar />
            <Hero/>   {/* This now renders the restyled Hero component */}
            <Footer/> {/* This now renders the corrected Footer component */}
        </div>
    );
};

export default LandingPage;
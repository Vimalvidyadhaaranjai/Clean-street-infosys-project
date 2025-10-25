// src/pages/LandingPage.jsx

import React from 'react';
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero'; // Will now use the updated Hero
import Footer from '../Components/Footer';

const LandingPage = () => {
    return (
        <div>
            <Navbar /> {/* Assuming you're using the updated Navbar */}
            <Hero/>   {/* This now renders the restyled Hero component */}
            <Footer/> {/* Assuming Footer is fine or updated separately */}
        </div>
    );
};

export default LandingPage;
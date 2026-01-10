import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingActions from './FloatingActions';

export default function Layout() {
    const [emergencyMode, setEmergencyMode] = useState(false);

    // Toggle body class for global overrides if needed, or just scope to this div
    useEffect(() => {
        if (emergencyMode) {
            document.documentElement.classList.add('emergency-active');
        } else {
            document.documentElement.classList.remove('emergency-active');
        }
    }, [emergencyMode]);

    return (
        <div className={`min-h-screen transition-colors duration-500 ${emergencyMode ? 'bg-red-950' : ''}`}>
            <Header emergencyMode={emergencyMode} setEmergencyMode={setEmergencyMode} />
            <main>
                <Outlet context={{ emergencyMode }} />
            </main>
            <Footer />
            <FloatingActions />
        </div>
    );
}

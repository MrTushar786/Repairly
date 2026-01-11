import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingActions from './FloatingActions';

export default function Layout() {
    const [darkMode, setDarkMode] = useState(false);

    // Toggle body class for global overrides if needed, or just scope to this div
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('emergency-active');
        } else {
            document.documentElement.classList.remove('emergency-active');
        }
    }, [darkMode]);

    return (
        <div className={`min-h-screen transition-colors duration-500`}>
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />
            <main>
                <Outlet context={{ darkMode }} />
            </main>
            <Footer />
            <FloatingActions />
        </div>
    );
}

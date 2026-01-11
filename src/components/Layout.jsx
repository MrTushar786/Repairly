import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingActions from './FloatingActions';
import MobileBottomNav from './MobileBottomNav';
import { supabase } from '../supabase';

export default function Layout() {
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    // Toggle body class for global overrides if needed, or just scope to this div
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('emergency-active');
        } else {
            document.documentElement.classList.remove('emergency-active');
        }
    }, [darkMode]);

    return (
        <div className={`min-h-screen transition-colors duration-500 pb-20 md:pb-0`}>
            <Header darkMode={darkMode} setDarkMode={setDarkMode} user={user} />
            <main>
                <Outlet context={{ darkMode }} />
            </main>
            <Footer />
            <Footer />
            <FloatingActions />
            <MobileBottomNav user={user} />
        </div>
    );
}

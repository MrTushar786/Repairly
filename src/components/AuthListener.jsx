import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';

export default function AuthListener() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Listen for auth state changes (sign in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {

            // Auto-logout if session is older than 24 hours (Client-side enforcement)
            if (session?.user?.last_sign_in_at) {
                const lastSignIn = new Date(session.user.last_sign_in_at).getTime();
                const now = new Date().getTime();
                const oneDayMs = 24 * 60 * 60 * 1000; // 24 hours

                if (now - lastSignIn > oneDayMs) {
                    console.log('Session expired (24h limit). Logging out...');
                    await supabase.auth.signOut();
                    navigate('/login');
                    return;
                }
            }

            if (event === 'SIGNED_IN') {
                const currentPath = window.location.pathname;
                // Only redirect if explicitly on auth pages. Allow logged-in users to view Home.
                if (currentPath === '/login' || currentPath === '/signup') {
                    navigate('/client/dashboard');
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    return null;
}

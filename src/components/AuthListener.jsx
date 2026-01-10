import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';

export default function AuthListener() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Listen for auth state changes (sign in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                // If the user lands on the root with an access token (OAuth redirect), go to dashboard
                // The hash is usually consumed by Supabase client by now, but we can check if we are on a login-like page
                if (location.pathname === '/login' || location.pathname === '/signup' || (location.pathname === '/' && session)) {
                   // Optional: Check if we just came from a redirect logic? 
                   // Ideally, we redirect to dashboard on successful login.
                   navigate('/client/dashboard');
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate, location.pathname]);

    return null;
}

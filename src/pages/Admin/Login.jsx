import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check session on mount and after OAuth redirect
    useEffect(() => {
        const checkAdminAccess = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                verifyAdmin(session.user);
            }
        };
        checkAdminAccess();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                verifyAdmin(session.user);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    const verifyAdmin = async (user) => {
        try {
            setLoading(true);
            // Check Allow-List
            const { data: adminRecord, error } = await supabase
                .from('admin_users')
                .select('id')
                .eq('email', user.email)
                .maybeSingle();

            if (error) throw error;

            if (!adminRecord) {
                // Unauthorized: Sign out immediately
                await supabase.auth.signOut();
                toast.error('Access Denied: Your email is not on the Admin Allow-list.');
                return;
            }

            // Authorized
            toast.success('Admin Access Granted');
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Admin verification error:', error);
            toast.error('Verification Failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/admin' // Redirect back to this page to trigger verifyAdmin
                }
            });
            if (error) throw error;
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                <div className="text-center mb-8 mt-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-800 shadow-inner">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Admin Portal</h1>
                    <p className="text-slate-500 font-medium">Restricted Access • Authorized Personnel Only</p>
                </div>

                <div className="space-y-6">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full py-4 bg-white border-2 border-slate-200 hover:border-blue-500 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-3 relative group"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span className="group-hover:text-blue-600">
                            {loading ? 'Verifying Access...' : 'Sign in with Google'}
                        </span>
                    </button>

                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                        <ShieldAlert className="text-blue-600 shrink-0 mt-0.5" size={20} />
                        <p className="text-xs text-blue-800 leading-relaxed font-medium">
                            <strong>Security Notice:</strong> All login attempts are logged. If you do not have an admin account on the allow-list, your access will be automatically rejected.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

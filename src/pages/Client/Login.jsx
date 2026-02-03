import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Smartphone, Mail, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientLogin() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) navigate('/client/dashboard');
        };
        checkUser();
    }, [navigate]);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Strict Check: Verify email exists in our 'users' table first
            const { data: userRecord } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();

            if (!userRecord) {
                // If checking 'users' table returns nothing, we assume they are not registered.
                // Note: accurate depends on 'users' table being in sync with auth.users
                throw new Error("No account found. Please create a new account to continue.");
            }

            // 2. Proceed with Auth
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            toast.success('Welcome back!');
            navigate('/client/dashboard');
        } catch (error) {
            // Handle Supabase "Invalid login credentials" specifically if needed, 
            // but the pre-check above should catch unregistered emails first.
            toast.error(error.message);
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
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (error) {
            alert(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">

            {/* LEFT SIDE: Brand & Aesthetic (Hidden on mobile, visible on lg screens) */}
            <div className="hidden lg:flex w-[45%] bg-slate-900 relative overflow-hidden flex-col justify-between p-16 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20 -mr-20 -mt-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500 rounded-full blur-[120px] opacity-20 -ml-20 -mb-20"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Smartphone size={24} className="text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase">Mr. Fix My Phone</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-8">
                    <h1 className="text-5xl font-black leading-tight tracking-tight">
                        Your Device,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Resurrected.</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                        Track your repair status in real-time, view diagnostic reports, and manage your device portfolio all in one secure hub.
                    </p>

                    <div className="flex gap-4 pt-4">
                        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                            <CheckCircle size={16} className="text-green-400" />
                            <span className="text-sm font-medium text-slate-300">Real-time Updates</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                            <CheckCircle size={16} className="text-green-400" />
                            <span className="text-sm font-medium text-slate-300">Secure Data</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-12">
                    <div className="flex gap-1 text-yellow-400 mb-2">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-slate-300 text-sm font-medium italic">"The transparency of the repair process is unmatched. I knew exactly what was happening with my MacBook every step of the way."</p>
                    <p className="text-slate-500 text-xs font-bold mt-2 uppercase tracking-wider">— Alex M., Enterprise Client</p>
                </div>
            </div>

            {/* RIGHT SIDE: Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
                {/* Mobile Logo (only visible on small screens) */}
                <div className="lg:hidden absolute top-8 left-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Smartphone size={16} className="text-white" />
                    </div>
                    <span className="font-black text-slate-900 tracking-tighter uppercase text-sm">Mr. Fix My Phone</span>
                </div>

                <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-slate-900 mb-3">Welcome Back</h2>
                        <p className="text-slate-500">Please enter your details to sign in.</p>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full py-4 bg-white border border-slate-200 hover:border-blue-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span className="group-hover:text-blue-600 transition-colors">Continue with Google</span>
                    </button>

                    <div className="relative py-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-white px-4 text-slate-400 font-bold">or sign in with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-900 uppercase ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-all"
                                placeholder="name@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-900 uppercase">Password</label>
                                <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot Password?</a>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <p className="text-center text-sm font-medium text-slate-500 mt-8">
                        Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Create free account</Link>
                    </p>
                </div>

                <div className="absolute bottom-6 text-center w-full">
                    <p className="text-xs text-slate-300 font-medium md:text-slate-400">© 2026 Mr. Fix My Phone. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Smartphone, Mail, Lock, User, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientSignup() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });
            if (error) throw error;
            toast.success('Registration Successful! Please check your email to confirm your account.');
            navigate('/login');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) toast.error(error.message);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">

            {/* LEFT SIDE: Brand & Aesthetic */}
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-wider">
                        <Shield size={16} /> Secure Customer Portal
                    </div>
                    <h1 className="text-5xl font-black leading-tight tracking-tight">
                        Join the<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Tech Revolution.</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                        Create an account to unlock priority scheduling, repair history tracking, and exclusive member discounts.
                    </p>

                    <ul className="space-y-4 pt-4">
                        <li className="flex items-center gap-3 text-slate-300">
                            <CheckCircle size={20} className="text-blue-500" />
                            <span>Track repair status 24/7</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-300">
                            <CheckCircle size={20} className="text-blue-500" />
                            <span>View detailed diagnostic reports</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-300">
                            <CheckCircle size={20} className="text-blue-500" />
                            <span>Manage multiple devices easily</span>
                        </li>
                    </ul>
                </div>

                <div className="relative z-10 mt-12">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Trusted by 10,000+ Customers</p>
                </div>
            </div>

            {/* RIGHT SIDE: Signup Form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
                {/* Mobile Logo */}
                <div className="lg:hidden absolute top-8 left-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Smartphone size={16} className="text-white" />
                    </div>
                    <span className="font-black text-slate-900 tracking-tighter uppercase text-sm">Mr. Fix My Phone</span>
                </div>

                <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-slate-900 mb-3">Create Account</h2>
                        <p className="text-slate-500">Get started with your free account today.</p>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-4 bg-white border border-slate-200 hover:border-blue-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span className="group-hover:text-blue-600 transition-colors">Sign up with Google</span>
                    </button>

                    <div className="relative py-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-white px-4 text-slate-400 font-bold">or register with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-900 uppercase ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-all"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                            />
                        </div>

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
                            <label className="text-xs font-bold text-slate-900 uppercase ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-all"
                                placeholder="••••••••"
                                minLength={6}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <p className="text-[10px] text-slate-400 px-1 mt-1">Must be at least 6 characters.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group mt-6"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <p className="text-center text-sm font-medium text-slate-500 mt-8">
                        Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
                    </p>
                </div>

                <div className="absolute bottom-6 text-center w-full">
                    <p className="text-xs text-slate-300 font-medium md:text-slate-400">© 2026 Mr. Fix My Phone. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}


import React, { useState } from 'react';
import { Phone, MessageCircle, Menu, MapPin, X, ChevronDown, LogOut, User } from 'lucide-react';
import { SHOP_DATA } from '../data';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Header({ emergencyMode, setEmergencyMode }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [servicesList, setServicesList] = useState([]);

    // Check login status
    React.useEffect(() => {
        // Initial check
        supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

        // Listen for changes (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fetch Services for Dropdown
    React.useEffect(() => {
        const fetchServices = async () => {
            const { data } = await supabase
                .from('service_menu_items')
                .select('id, label')
                .order('created_at', { ascending: true }) // Manual order usually, but created_at works for now
                .limit(50);
            if (data) setServicesList(data);
        };
        fetchServices();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setMenuOpen(false);
        navigate('/');
    };

    return (
        <header className="fixed w-full top-0 z-50 bg-white shadow-sm transition-all duration-300">

            {/* Top Bar for Desktop */}
            <div className="hidden md:flex bg-secondary text-white text-xs py-2 justify-center gap-6 font-semibold tracking-wide">
                <span>🇺🇸 700+ Locations Nationwide</span>
                <span>•</span>
                <span>Authorized Samsung Service Provider</span>
                <span>•</span>
                <span>Free Diagnostics on All Repairs</span>
            </div>

            <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                <Link to="/" className="flex flex-col leading-none group">
                    <span className="text-2xl font-black text-primary tracking-tighter uppercase group-hover:opacity-90 transition-opacity">MR. <span className="text-secondary">FIX MY PHONE</span></span>
                    <span className="text-[10px] font-bold text-text-muted tracking-[0.2em] uppercase">Tech Triage Unit</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">

                    {/* Services Dropdown */}
                    <div className="relative group">
                        <Link to="/services" className="flex items-center gap-1 text-sm font-bold text-secondary hover:text-primary transition-colors py-4">
                            SERVICES <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                        </Link>
                        <div className="absolute top-full -left-4 w-64 bg-white rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 border border-slate-100 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {servicesList.length > 0 ? (
                                servicesList.map((item) => (
                                    <Link key={item.id} to="/services" className="block px-6 py-3 text-sm font-semibold text-text-muted hover:text-primary hover:bg-slate-50 transition-colors">
                                        {item.label}
                                    </Link>
                                ))
                            ) : (
                                <div className="px-6 py-3 text-sm text-slate-400">Loading...</div>
                            )}
                        </div>
                    </div>

                    {/* Device Repair Dropdown */}
                    <div className="relative group">
                        <Link to="/booking" className="flex items-center gap-1 text-sm font-bold text-secondary hover:text-primary transition-colors py-4">
                            DEVICE REPAIR <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                        </Link>
                        <div className="absolute top-full -left-4 w-64 bg-white rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 border border-slate-100">
                            {[
                                'iPhone Repair', 'Samsung Repair', 'Google Pixel Repair', 'iPad & Tablet Repair',
                                'MacBook Repair', 'Computer & Laptop', 'Game Console Repair'
                            ].map((item) => (
                                <Link key={item} to="/booking" className="block px-6 py-3 text-sm font-semibold text-text-muted hover:text-primary hover:bg-slate-50 transition-colors">
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <Link to="/about" className="text-sm font-bold text-secondary hover:text-primary transition-colors">ABOUT</Link>
                    <Link to="/contact" className="text-sm font-bold text-secondary hover:text-primary transition-colors">CONTACT US</Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/client/dashboard" className="flex items-center gap-2 group">
                                {user.user_metadata?.custom_avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                                    <img
                                        src={user.user_metadata.custom_avatar_url || user.user_metadata.avatar_url || user.user_metadata.picture}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm group-hover:ring-2 group-hover:ring-blue-100 transition-all hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold border border-blue-200 group-hover:ring-2 group-hover:ring-blue-100 transition-all">
                                        <User size={20} />
                                    </div>
                                )}
                            </Link>
                        </div>
                    ) : (
                        <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-secondary transition-colors">SIGN IN</Link>
                    )}
                </nav>

                <div className="flex gap-4 items-center">
                    {/* Emergency Toggle */}
                    <button
                        onClick={() => setEmergencyMode(!emergencyMode)}
                        className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${emergencyMode ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.6)]' : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'}`}
                    >
                        <div className={`w-3 h-3 rounded-full transition-colors ${emergencyMode ? 'bg-white animate-pulse shadow-[0_0_8px_white]' : 'bg-slate-400'}`}></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{emergencyMode ? 'EMERGENCY ACTIVE' : 'EMERGENCY MODE'}</span>
                    </button>

                    <Link to="/booking" className={`hidden md:flex items-center gap-2 px-6 py-2.5 rounded-md font-bold transition-all text-sm shadow-md ${emergencyMode ? 'bg-white text-red-600 hover:bg-slate-200' : 'bg-accent text-white hover:bg-orange-600'}`}>
                        START REPAIR
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button className={`md:hidden ${emergencyMode ? 'text-red-500' : 'text-secondary'}`} onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl">
                    <Link to="/services" className="text-lg font-bold text-secondary" onClick={() => setMenuOpen(false)}>Repairs</Link>
                    <Link to="/about" className="text-lg font-bold text-secondary" onClick={() => setMenuOpen(false)}>Locations</Link>

                    {user ? (
                        <>
                            <Link to="/client/dashboard" className="text-lg font-bold text-primary" onClick={() => setMenuOpen(false)}>My Dashboard</Link>
                            <button onClick={handleLogout} className="text-lg font-bold text-red-500 text-left">Sign Out</button>
                        </>
                    ) : (
                        <Link to="/login" className="text-lg font-bold text-slate-500" onClick={() => setMenuOpen(false)}>Client Login</Link>
                    )}

                    <Link to="/booking" className="bg-accent text-white py-3 text-center rounded-lg font-bold" onClick={() => setMenuOpen(false)}>Start Repair</Link>
                </div>
            )}
        </header>
    );
}

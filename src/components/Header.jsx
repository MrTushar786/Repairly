
import React, { useState } from 'react';
import { Phone, MessageCircle, Menu, MapPin, X, ChevronDown, LogOut, User } from 'lucide-react';
import { SHOP_DATA } from '../data';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Header({ darkMode, setDarkMode }) {
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
                {SHOP_DATA.topFeatures.map((feature, index) => (
                    <React.Fragment key={index}>
                        <span>{feature}</span>
                        {index < SHOP_DATA.topFeatures.length - 1 && <span>•</span>}
                    </React.Fragment>
                ))}
            </div>

            <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                <Link to="/" className="flex flex-col leading-none group">
                    <span className="text-2xl font-black text-primary tracking-tighter uppercase group-hover:opacity-90 transition-opacity">
                        {SHOP_DATA.branding.namePrefix} <span className="text-secondary">{SHOP_DATA.branding.nameHighlight}</span>
                    </span>
                    <span className="text-[10px] font-bold text-text-muted tracking-[0.2em] uppercase">{SHOP_DATA.branding.subDetails}</span>
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
                </nav>

                <div className="flex gap-6 items-center">

                    {/* Dark Mode Toggle */}
                    <div className="hidden lg:flex items-center gap-3">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`}
                            aria-label="Toggle Dark Mode"
                        >
                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-white' : 'text-slate-400'}`}>
                            Dark Mode
                        </span>
                    </div>

                    {/* User Profile / Sign In */}
                    {user ? (
                        <Link to="/client/dashboard" className="hidden md:flex items-center gap-2 group" title="My Dashboard">
                            {user.user_metadata?.custom_avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                                <img
                                    src={user.user_metadata.custom_avatar_url || user.user_metadata.avatar_url || user.user_metadata.picture}
                                    alt="Profile"
                                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm group-hover:ring-2 group-hover:ring-primary/20 transition-all"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 group-hover:bg-primary group-hover:text-white transition-all">
                                    <User size={18} />
                                </div>
                            )}
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
                        >
                            <User size={18} />
                            <span>Sign In</span>
                        </Link>
                    )}

                    {/* Start Repair Button */}
                    <Link to="/booking" className={`hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-gradient-to-r from-orange-400 to-accent text-white`}>
                        <span className="text-lg">🔧</span>
                        START REPAIR
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden text-secondary" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl max-h-[80vh] overflow-y-auto">
                    <Link to="/services" className="text-lg font-bold text-secondary" onClick={() => setMenuOpen(false)}>Services</Link>
                    <Link to="/booking" className="text-lg font-bold text-secondary" onClick={() => setMenuOpen(false)}>Device Repair</Link>
                    <Link to="/about" className="text-lg font-bold text-secondary" onClick={() => setMenuOpen(false)}>About</Link>
                    <Link to="/contact" className="text-lg font-bold text-secondary" onClick={() => setMenuOpen(false)}>Contact Us</Link>

                    {/* Mobile Dark Mode Toggle */}
                    <div className="flex items-center justify-between py-2 border-y border-slate-50/50 my-2">
                        <span className="text-lg font-bold text-secondary">Dark Mode</span>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    {user ? (
                        <>
                            <Link to="/client/dashboard" className="text-lg font-bold text-primary" onClick={() => setMenuOpen(false)}>My Dashboard</Link>
                            <button onClick={handleLogout} className="text-lg font-bold text-red-500 text-left">Sign Out</button>
                        </>
                    ) : (
                        <Link to="/login" className="text-lg font-bold text-slate-500" onClick={() => setMenuOpen(false)}>Sign In</Link>
                    )}

                    <Link to="/booking" className="bg-accent text-white py-3 text-center rounded-full font-bold shadow-lg" onClick={() => setMenuOpen(false)}>Start Repair</Link>
                </div>
            )}
        </header>
    );
}

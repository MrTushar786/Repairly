
import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, ChevronDown, LogOut, User, Clock, Sun, Moon, Wrench } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useShop } from '../context/ShopContext';

export default function Header({ darkMode, setDarkMode }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [servicesList, setServicesList] = useState([]);
    const { shopData } = useShop();

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
        navigate('/');
    };

    return (
        <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300 border-b border-slate-100/50">

            {/* Shop Status Banner - Closed */}
            {shopData.isOpen === false && (
                <div className="bg-red-600 text-white text-xs md:text-sm font-bold py-2 text-center animate-pulse tracking-wide flex items-center justify-center gap-2">
                    <Clock size={16} />
                    <span>WORKSHOP IS CURRENTLY CLOSED</span>
                    <span className="hidden md:inline font-normal opacity-80">- You can still schedule repairs for later!</span>
                </div>
            )}

            {/* Top Bar for Desktop (Only show if Open, or keep stacked?) -> Let's keep it stacked but maybe hide if closed to reduce clutter? No, keep features. */}
            < div className="hidden lg:flex bg-secondary text-white text-xs py-2 justify-center gap-6 font-semibold tracking-wide" >
                {shopData.topFeatures.map((feature, index) => (
                    <React.Fragment key={index}>
                        <span>{feature}</span>
                        {index < shopData.topFeatures.length - 1 && <span>•</span>}
                    </React.Fragment>
                ))}
            </div >

            <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                <Link to="/" className="flex flex-col leading-none group shrink-0">
                    <span className="text-2xl font-black text-primary tracking-tighter uppercase group-hover:opacity-90 transition-opacity whitespace-nowrap">
                        {shopData.branding.namePrefix} <span className="text-secondary">{shopData.branding.nameHighlight}</span>
                    </span>
                    <span className="text-[10px] font-bold text-text-muted tracking-[0.2em] uppercase whitespace-nowrap">{shopData.branding.subDetails}</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8">

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


                    <Link to="/shop" className="text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1">
                        SHOP <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-pulse">NEW</span>
                    </Link>

                    <Link to="/about" className="text-sm font-bold text-secondary hover:text-primary transition-colors">ABOUT</Link>
                    <Link to="/contact" className="text-sm font-bold text-secondary hover:text-primary transition-colors">CONTACT US</Link>
                </nav>

                <div className="flex gap-4 items-center">

                    {/* Dark Mode Toggle (Icon Only now) */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all duration-300 focus:outline-none shadow-sm flex"
                        aria-label="Toggle Dark Mode"
                        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* User Profile / Sign In */}
                    {user ? (
                        <Link to="/client/dashboard" className="hidden lg:flex items-center gap-2 group" title="My Dashboard">
                            {user.user_metadata?.custom_avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                                <img
                                    src={user.user_metadata.custom_avatar_url || user.user_metadata.avatar_url || user.user_metadata.picture}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 shadow-sm group-hover:ring-2 group-hover:ring-primary/20 transition-all"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border-2 border-slate-100 group-hover:bg-primary group-hover:text-white transition-all">
                                    <User size={20} />
                                </div>
                            )}
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="hidden lg:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors px-2"
                        >
                            <User size={18} />
                            <span>Sign In</span>
                        </Link>
                    )}

                    {/* Start Repair Button */}
                    <Link to="/booking" className={`hidden lg:flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm hover:-translate-y-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-none`}>
                        <Wrench size={16} className="text-white/90" />
                        START REPAIR
                    </Link>

                </div>
            </div>
        </header>
    );
}

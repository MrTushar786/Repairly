import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SHOP_DATA, SERVICES, DEVICE_MODELS as STATIC_MODELS } from '../data';
import { Smartphone, Laptop, Gamepad2, Tablet, MapPin, ChevronRight, Search, CheckCircle2, ShieldCheck, Clock, BadgeDollarSign, Star, Menu, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDeviceImageUrl } from '../lib/utils';
import { supabase } from '../supabase';

import { useNavigate } from 'react-router-dom';
import HeroImage from '../assets/hero_repair_tech_1767953586419.png';
import GenericLaptop from '../assets/generic_laptop_transparent_1767953633102.png';
import GenericPhone from '../assets/generic_smartphone_1767953612029.png';

export default function Home() {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState('');
    const [selectedModel, setSelectedModel] = useState({});
    const [searchResults, setSearchResults] = useState([]);
    const [modelImageError, setModelImageError] = useState(false);
    const [deviceModels, setDeviceModels] = useState(STATIC_MODELS);

    // Fetch Dynamic Models
    React.useEffect(() => {
        const fetchModels = async () => {
            const { data: modelData } = await supabase.from('device_models').select('*');
            if (modelData && modelData.length > 0) {
                const merged = structuredClone(STATIC_MODELS);
                modelData.forEach(m => {
                    const { category, brand, model } = m;
                    if (!merged[category]) merged[category] = {};
                    if (!merged[category][brand]) merged[category][brand] = [];
                    if (!merged[category][brand].includes(model)) {
                        merged[category][brand].push(model);
                    }
                });
                setDeviceModels(merged);
            }
        };
        fetchModels();
    }, []);

    // Reset error when model changes
    React.useEffect(() => {
        setModelImageError(false);
    }, [selectedModel.model]);

    const modelImageUrl = useMemo(() => {
        if (!selectedModel.brand || !selectedModel.model) return null;
        return getDeviceImageUrl(selectedModel.brand, selectedModel.model);
    }, [selectedModel.brand, selectedModel.model]);

    const handleStartRepair = () => {
        navigate('/booking', { state: { type: selectedType, model: selectedModel } });
    }

    return (
        <div className="bg-bg-body text-text-main font-sans">

            {/* HERO: The Tech Triage Unit */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={HeroImage} className="w-full h-full object-cover" alt="Tech Repair Workbench" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40"></div>
                </div>
                <div className="container mx-auto px-4 max-w-7xl relative z-10 text-white">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6"
                        >
                            What's broken <span className="text-primary">today?</span>
                        </motion.h1>

                        {/* Speed Search */}
                        <div className="relative max-w-lg mx-auto mb-10 text-left">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input
                                    type="text"
                                    placeholder="Type device (e.g. 'iPhone 13')"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-md text-white placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none text-lg font-bold shadow-lg transition-all"
                                    onChange={(e) => {
                                        const query = e.target.value.toLowerCase();
                                        if (query.length > 1) {
                                            const allModels = Object.values(deviceModels).flatMap(cat => Object.values(cat).flat());
                                            const matched = allModels.filter(m => m.toLowerCase().includes(query)).slice(0, 5);
                                            setSearchResults(matched);
                                        } else {
                                            setSearchResults([]);
                                        }
                                    }}
                                    onBlur={() => setTimeout(() => setSearchResults([]), 200)} // Delay hide to allow click
                                />
                            </div>

                            {searchResults.length > 0 && (
                                <div className="absolute top-full left-0 w-full bg-white rounded-xl shadow-2xl mt-2 overflow-hidden border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2">
                                    <ul>
                                        {searchResults.map((model, i) => (
                                            <li
                                                key={i}
                                                onClick={() => navigate('/booking', { state: { model: model } })}
                                                className="flex justify-between items-center p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-xs">
                                                        <Smartphone size={14} />
                                                    </div>
                                                    <span className="font-bold text-secondary text-sm">{model} Screen Repair</span>
                                                </div>
                                                <span className="text-primary font-bold bg-primary-light px-2 py-1 rounded text-xs">$129+</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="p-3 bg-slate-50 text-center">
                                        <button onClick={() => navigate('/booking')} className="text-secondary text-xs font-bold uppercase tracking-wider hover:underline">
                                            View Full Price List
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => navigate('/booking')}
                                className="w-full sm:w-auto px-8 py-4 bg-accent text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
                            >
                                START A REPAIR
                            </button>
                            <button
                                onClick={() => document.getElementById('store-locator').scrollIntoView({ behavior: 'smooth' })}
                                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg border border-white/20 hover:bg-white hover:text-black hover:border-white transition-colors flex items-center justify-center gap-2"
                            >
                                <MapPin size={18} /> FIND A STORE
                            </button>
                        </div>
                    </div>

                    {/* TRIAGE MENU: Select Your Victim */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {[
                            { icon: Smartphone, label: "Cell Phone", id: 'Phone' },
                            { icon: Laptop, label: "Computer", id: 'Computer' },
                            { icon: Gamepad2, label: "Game Console", id: 'Console' },
                            { icon: Tablet, label: "Tablet", id: 'Tablet' }
                        ].map((item, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ y: -5 }}
                                onClick={() => navigate('/booking', { state: { type: item.id } })}
                                className="flex flex-col items-center justify-center p-8 bg-white/95 backdrop-blur md:bg-white rounded-xl shadow-card border border-slate-100 hover:border-primary/30 hover:shadow-soft transition-all"
                            >
                                <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center text-primary mb-4">
                                    <item.icon size={28} />
                                </div>
                                <span className="font-bold text-secondary">{item.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRUST SIGNALS: The Hall of Fame */}
            <section className="py-12 border-b border-slate-200 bg-white">
                <div className="container mx-auto px-4 max-w-7xl flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Mock Partners - In real site use logos */}
                    <span className="text-xl font-bold flex items-center gap-2 text-secondary"><div className="w-6 h-6 bg-black rounded-full"></div> Apple Independent Provider</span>
                    <span className="text-xl font-bold flex items-center gap-2 text-secondary"><div className="w-6 h-6 bg-blue-600 rounded-full"></div> Samsung Authorized</span>
                    <span className="text-xl font-bold flex items-center gap-2 text-secondary"><div className="w-6 h-6 bg-red-500 rounded-full"></div> Google Authorized</span>
                </div>
            </section>

            {/* FOUR PILLARS: Guarantees */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: CheckCircle2, title: "Free Diagnostics", desc: "We check your tech at no cost." },
                            { icon: BadgeDollarSign, title: "Low Price Guarantee", desc: "We beat any local competitor by $5." },
                            { icon: Clock, title: "Same-Day Service", desc: "Done as soon as the same day." },
                            { icon: ShieldCheck, title: "1-Year Warranty", desc: "Valid at all 700+ locations." }
                        ].map((pillar, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-16 h-16 mx-auto bg-slate-50 text-secondary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <pillar.icon size={32} />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-secondary">{pillar.title}</h3>
                                <p className="text-text-muted text-sm leading-relaxed">{pillar.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* INTAKE FORM: The Start Repair Flow */}
            <section className="py-24 bg-secondary text-white overflow-hidden relative">
                <div className="container mx-auto px-4 max-w-7xl relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                    <div className="flex-1">
                        <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">Rapid Intake</span>
                        <h2 className="text-4xl font-bold text-white mb-6">Start a Repair in Seconds.</h2>
                        <ul className="space-y-4 text-slate-300">
                            {[1, 2, 3].map((n) => (
                                <li key={n} className="flex items-center gap-4">
                                    <span className="w-8 h-8 rounded-full border border-slate-600 flex items-center justify-center font-bold text-sm">{n}</span>
                                    <span>{n === 1 ? 'Select Device' : n === 2 ? 'Identify Model' : 'Get Instant Quote'}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex-1 w-full max-w-md bg-white text-slate-900 rounded-2xl p-8 shadow-2xl">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-4">I need to fix my...</label>

                        {/* Device Type Selection */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {['Phone', 'Laptop', 'Tablet', 'Console'].map(d => (
                                <button
                                    key={d}
                                    onClick={() => { setSelectedType(d); setSelectedModel({ brand: '', model: '' }); }}
                                    className={`py-3 px-4 border rounded-lg text-sm font-bold transition-colors text-left ${selectedType === d ? 'border-primary bg-blue-50 text-primary' : 'border-slate-200 hover:border-primary hover:text-primary hover:bg-blue-50'}`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>

                        {/* Brand Selection (Dynamic for ALL types) */}
                        {selectedType && deviceModels[selectedType] && (
                            <div className="mb-4 animate-in fade-in slide-in-from-top-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select {selectedType} Brand</label>
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {Object.keys(deviceModels[selectedType]).map(brand => (
                                        <button
                                            key={brand}
                                            onClick={() => setSelectedModel({ brand: brand, model: '' })}
                                            className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs font-bold transition-all ${selectedModel.brand === brand ? 'bg-secondary text-white border-secondary' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-primary'}`}
                                        >
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Model Dropdown */}
                        <div className="relative mb-6">
                            <select
                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold focus:outline-none focus:border-primary disabled:opacity-50"
                                value={selectedModel.model || ''}
                                onChange={(e) => setSelectedModel({ ...selectedModel, model: e.target.value })}
                                disabled={!selectedType || !selectedModel.brand}
                            >
                                <option value="">
                                    {!selectedType ? 'Select Device Type First' :
                                        !selectedModel.brand ? 'Select Brand First...' :
                                            'Select Model...'}
                                </option>

                                {selectedType && selectedModel.brand && deviceModels[selectedType][selectedModel.brand] ? (
                                    deviceModels[selectedType][selectedModel.brand].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))
                                ) : null}
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={16} />
                        </div>

                        {selectedModel.model && (
                            <div className="mb-6 bg-slate-50 rounded-xl p-4 flex items-center justify-center border border-slate-100 relative overflow-hidden group h-48">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                                <img
                                    src={!modelImageError ? modelImageUrl : (selectedType === 'Laptop' ? GenericLaptop : GenericPhone)}
                                    alt={selectedModel.model}
                                    className="w-full h-full object-contain relative z-10 transition-transform group-hover:scale-110 duration-500"
                                    onError={(e) => {
                                        setModelImageError(true);
                                        e.target.onerror = null;
                                    }}
                                />

                                <span className="absolute bottom-2 text-[10px] font-bold text-slate-400 bg-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm">{selectedModel.model}</span>
                            </div>
                        )}

                        <button
                            onClick={handleStartRepair}
                            className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!selectedType || !selectedModel.brand || !selectedModel.model}
                        >
                            GET QUOTE & LOCATION
                        </button>
                    </div>
                </div>
            </section>

            {/* RADAR SYSTEM: Store Locator */}
            <section id="store-locator" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="container mx-auto px-4 max-w-7xl relative">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-10">
                        <div className="max-w-2xl">
                            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Visit Us</span>
                            <h2 className="text-4xl font-bold text-secondary mb-4">NYC Tech Hub</h2>
                            <p className="text-text-muted text-lg">Expert repairs in the heart of the city. Walk-ins welcome for all devices.</p>
                        </div>
                        <button className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline transition-all hover:gap-3">
                            View Full Map <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="bg-slate-900 rounded-3xl h-[600px] relative overflow-hidden group shadow-2xl ring-1 ring-slate-900/5">

                        {/* Google Maps Embed */}
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={SHOP_DATA.googleMapEmbed}
                        ></iframe>

                        {/* Scanner Line Overlay (Optional, keeping purely for tech vibe if desired, but might be distracting over a real map. Let's make it very subtle or remove. Keeping subtle.) */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-b from-transparent via-blue-500/5 to-transparent opacity-50"></div>


                        {/* Floating Info Card */}
                        <div className="absolute top-6 right-6 w-full max-w-[320px] bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-secondary text-lg leading-tight mb-1">{SHOP_DATA.name}</h4>
                                    <p className="text-sm text-text-muted font-medium mb-3">{SHOP_DATA.address.street}<br />{SHOP_DATA.address.city}, {SHOP_DATA.address.state} {SHOP_DATA.address.zip}</p>

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                            Open Now
                                        </span>
                                        <span className="text-xs text-text-muted font-bold">• Closes 8 PM</span>
                                    </div>

                                    <button onClick={() => navigate('/booking')} className="w-full py-2.5 bg-secondary text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-primary transition-colors shadow-lg">
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        </div>



                        {/* Mobile View Map Button */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden">
                            <button className="px-6 py-2 bg-slate-800/80 backdrop-blur text-white text-xs font-bold uppercase tracking-wider rounded-full border border-slate-700 shadow-xl">
                                Tap to Interact
                            </button>
                        </div>
                    </div>

                    <div className="md:hidden mt-6 text-center">
                        <button className="flex items-center justify-center gap-2 text-primary font-bold w-full p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                            View Full Map <ChevronRight size={18} />
                        </button>
                    </div>
                </div >
            </section >

        </div >
    );
}

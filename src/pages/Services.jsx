import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Laptop, Gamepad2, Tablet, Search, ShieldCheck, ChevronRight, Droplets, Camera, Volume2, Radio, Disc, Layers, Wrench, Battery, Usb, Cpu, Wifi, Speaker } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const ICON_MAP = {
    Smartphone, Battery, Droplets, Usb, Disc, Wrench, Cpu, Wifi, Camera, Speaker, Laptop, Gamepad2, Tablet, Search, ShieldCheck, Volume2, Radio
};

// For now, we only have one category "General" in the DB unless we add a column. 
// We will show all services or simple filtering.
const CATEGORIES = [
    { id: 'all', label: 'All Services', icon: Layers },
    // We can add more if we update DB schema later
];

export default function Services() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('all');
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Services | Mr. Fix My Phone";
        fetchServices();
    }, []);

    const fetchServices = async () => {
        const { data, error } = await supabase.from('repair_services').select('*').order('created_at', { ascending: true });
        if (data) setServices(data);
        setLoading(false);
    };

    return (
        <div className="pt-32 pb-12 lg:pt-48 bg-white min-h-screen">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold text-secondary mb-4">Our Service Catalog</h1>
                    <p className="text-text-muted text-lg">
                        Expert repairs for every device you own. Backed by our 1-year warranty.
                    </p>
                </div>

                {/* Departments Tabs */}
                {/* 
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${activeCategory === cat.id ? 'bg-secondary text-white shadow-lg' : 'bg-slate-50 text-text-muted hover:bg-slate-100'}`}
                        >
                            <cat.icon size={20} />
                            {cat.label}
                        </button>
                    ))}
                </div>
                */}

                {/* Service List */}
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-12 text-slate-400">Loading catalog...</div>
                    ) : (
                        services.map((s, i) => {
                            const IconComponent = ICON_MAP[s.icon_key] || Wrench;
                            return (
                                <motion.div
                                    key={s.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-float transition-all group overflow-hidden flex flex-col"
                                >
                                    {/* Image Section */}
                                    <div className="h-48 w-full relative overflow-hidden bg-slate-100">
                                        {s.image_url ? (
                                            <img src={s.image_url} alt={s.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <IconComponent size={48} />
                                            </div>
                                        )}
                                        {s.duration && (
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-secondary shadow-sm">
                                                {s.duration}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <IconComponent size={14} />
                                            </div>
                                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Service</span>
                                        </div>

                                        <h3 className="text-lg font-bold text-secondary mb-1">{s.label}</h3>
                                        <p className="text-text-muted text-sm mb-4 line-clamp-2">Professional repair service.</p>

                                        <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                                            <div>
                                                <span className="text-xs text-text-muted block">Starting at</span>
                                                <span className="text-lg font-black text-secondary">{s.price}</span>
                                            </div>
                                            <button onClick={() => navigate('/booking')} className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center group-hover:bg-primary transition-colors">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <p className="text-secondary font-bold mb-4">Don't see your repair?</p>
                    <button
                        onClick={() => navigate('/booking')}
                        className="px-8 py-3 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors"
                    >
                        GET A CUSTOM QUOTE
                    </button>
                </div>
            </div>
        </div>
    );
}

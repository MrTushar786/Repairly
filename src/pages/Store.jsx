import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { ShoppingBag, ChevronRight, Search, Filter, Smartphone, AlertCircle, Phone } from 'lucide-react';

export default function Store() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('device_inventory')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setInventory(data);
            // Extract unique brands
            const uniqueBrands = ['All', ...new Set(data.map(item => item.brand))];
            setBrands(uniqueBrands);
        }
        setLoading(false);
    };

    const filteredInventory = inventory.filter(item => {
        const matchesBrand = filter === 'All' || item.brand === filter;
        const matchesSearch = (item.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (item.brand?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        return matchesBrand && matchesSearch;
    });

    return (
        <div className="bg-bg-body min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header Section */}
                <div className="text-center mb-8">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Certified Pre-Owned</span>
                    <h1 className="text-3xl md:text-4xl font-black text-secondary mb-4">Shop Verified Devices</h1>
                    <p className="text-text-muted text-sm md:text-base max-w-2xl mx-auto">
                        Fully tested, certified, and ready for a new home. All devices come with our 3-month comprehensive warranty.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between sticky top-20 z-30 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-slate-100">

                    {/* Brand Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                        {brands.map(brand => (
                            <button
                                key={brand}
                                onClick={() => setFilter(brand)}
                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === brand
                                    ? 'bg-secondary text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search devices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 font-medium"
                        />
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredInventory.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {filteredInventory.map((item) => (
                            <div key={item.id} className="group bg-white rounded-2xl p-3 border border-slate-100 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">

                                {/* Image Area */}
                                <div className="relative aspect-square bg-slate-50 rounded-xl mb-3 overflow-hidden flex items-center justify-center">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <Smartphone size={48} className="text-slate-300" />
                                    )}

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        {item.condition === 'New' && <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">BRAND NEW</span>}
                                        {item.condition === 'Like New' && <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">MINT</span>}
                                    </div>

                                    {item.status !== 'Available' && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                                            <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full">SOLD OUT</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{item.brand}</span>
                                            <h3 className="font-bold text-secondary text-base leading-tight line-clamp-1" title={item.title}>{item.title}</h3>
                                            {/* Quantity Indicator */}
                                            {item.status === 'Available' && (
                                                <p className="text-xs font-medium text-green-600 mt-1 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                    {item.quantity || 1} available
                                                </p>
                                            )}
                                        </div>
                                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md">{item.storage}</span>
                                    </div>

                                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-50">
                                        <span className="text-lg font-black text-primary">${item.price}</span>
                                        <button
                                            disabled={item.status !== 'Available'}
                                            className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                                        >
                                            <ShoppingBag size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Search className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-secondary mb-2">No Devices Found</h3>
                        <p className="text-slate-500">Try adjusting your filters or check back later!</p>
                        <button onClick={() => { setFilter('All'); setSearchQuery(''); }} className="mt-6 text-primary font-bold text-sm hover:underline">
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Sell CTA */}
                <div className="mt-20 bg-secondary rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20 -mr-16 -mt-16"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-black mb-4">Have an old device?</h2>
                            <p className="text-slate-300 text-lg max-w-md">Trade it in for cash or credit towards your next upgrade. We offer top dollar for used tech.</p>
                        </div>
                        <button className="px-8 py-4 bg-white text-secondary font-bold rounded-xl hover:bg-primary hover:text-white transition-all shadow-lg flex items-center gap-2">
                            <Phone size={18} /> Get a Quote
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

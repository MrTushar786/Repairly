import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useShop } from '../context/ShopContext';
import { Search, Filter, ShoppingBag, Smartphone, Tablet, Tag, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Store() {
    const { shopData } = useShop();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    useEffect(() => {
        document.title = `Shop Devices | ${shopData.name}`;
        fetchProducts();
    }, [shopData.name]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // We'll create this table momentarily
            const { data, error } = await supabase
                .from('device_inventory')
                .select('*')
                .order('created_at', { ascending: false });

            if (error && error.code !== '42P01') { // Ignore "table not found" initially
                console.error('Error fetching products:', error);
            }
            if (data) setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesType = filter === 'All' || p.category === filter;
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.brand.toLowerCase().includes(search.toLowerCase()) ||
            p.model.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    const categories = ['All', 'Phones', 'Tablets', 'Laptops', 'Accessories'];

    return (
        <div className="pt-24 pb-20 bg-slate-50 min-h-screen font-sans text-slate-800">
            {/* Header / Hero */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-16 text-center">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block animate-in fade-in slide-in-from-bottom-2">Certified Pre-Owned</span>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-3 delay-100">
                        Shop <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Premium Tech</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 delay-200">
                        Expertly refurbished devices backed by our rock-solid warranty. Why pay full price when you can get the same performance for less?
                    </p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === cat
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search devices..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 group flex flex-col">
                                {/* Image Area */}
                                <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center p-6">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.title}
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="text-slate-300">
                                            {product.category === 'Phones' ? <Smartphone size={48} /> : <Tablet size={48} />}
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4">
                                        {product.status === 'Available' ? (
                                            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                                <CheckCircle2 size={10} /> AVAILABLE
                                            </span>
                                        ) : (
                                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                                <AlertCircle size={10} /> SOLD OUT
                                            </span>
                                        )}
                                    </div>

                                    {/* Condition Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/80 backdrop-blur text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                            <Tag size={10} /> {product.condition}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="mb-1">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{product.brand}</span>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight">{product.title}</h3>

                                    {/* Specs Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded font-semibold border border-slate-100">{product.storage}</span>
                                        <span className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded font-semibold border border-slate-100">{product.color}</span>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div>
                                            <span className="block text-xs font-bold text-slate-400 uppercase">Price</span>
                                            <span className="text-xl font-black text-slate-900">${product.price}</span>
                                        </div>
                                        <Link
                                            to="/contact"
                                            state={{ subject: `Inquiry about ${product.title}`, message: `Hi, I'm interested in the ${product.title} listed for $${product.price}. Is it still available?` }}
                                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${product.status === 'Available'
                                                    ? 'bg-secondary text-white hover:bg-primary shadow-lg shadow-blue-900/20'
                                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {product.status === 'Available' ? 'Buy Now' : 'Sold'} <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <ShoppingBag size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Devices Found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">We don't have any devices matching your criteria right now. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

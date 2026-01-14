
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, MessageSquare, LogOut, Trash2, Clock, Smartphone, User, TrendingUp, DollarSign, Users, Activity, Mail, Plus, Edit2, Battery, Droplets, Usb, Disc, Wrench, Cpu, Wifi, Camera, Speaker, X, Image as ImageIcon, Database, Laptop, Gamepad2, Tablet, Menu, Layers, Phone, Save, Settings, AlertTriangle, Power, Store, Check, Upload, Loader, Lock, Search as SearchIcon, RefreshCw } from 'lucide-react';

import { useShop } from '../../context/ShopContext';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [bookings, setBookings] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [services, setServices] = useState([]);
    const [menuItems, setMenuItems] = useState([]); // Dynamic Header Menu Items
    const [models, setModels] = useState([]); // Device Models
    const [inventory, setInventory] = useState([]); // Store Inventory
    const [users, setUsers] = useState([]); // Registered Users
    const [editingProduct, setEditingProduct] = useState(null); // For Inventory Edit Modal
    const [uploading, setUploading] = useState(false); // Image Upload State
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingService, setEditingService] = useState(null); // {id, label, price, icon_key}
    const [editingBooking, setEditingBooking] = useState(null); // For Booking Edit Modal
    const [showSqlModal, setShowSqlModal] = useState(false); // Helper for SQL
    const [adminProfile, setAdminProfile] = useState(null); // Admin Credentials State
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, table: '', id: '', position: null }); // Custom Delete Popover State
    const navigate = useNavigate();

    // Shop Context
    const { shopData, updateShopData } = useShop();
    const [settingsForm, setSettingsForm] = useState(shopData);

    useEffect(() => {
        if (shopData) {
            setSettingsForm({ ...shopData, isOpen: shopData.isOpen !== false }); // Default to true if undefined
        }
    }, [shopData]);

    const MENU_ITEMS = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'tickets', label: 'Support Inbox', icon: MessageSquare },
        { id: 'services', label: 'Service Catalog', icon: Wrench },
        { id: 'menu', label: 'Header Menu', icon: Menu },
        { id: 'models', label: 'Device Models', icon: Layers },
        { id: 'inventory', label: 'Shop Inventory', icon: Store },
        { id: 'settings', label: 'Site Settings', icon: Settings },
        { id: 'users', label: 'Admin', icon: Users },
    ];

    useEffect(() => {
        checkUser();
        fetchData();
    }, []);

    const checkUser = async () => {
        // Updated for Decoupled Admin Login:
        // We no longer rely on Supabase Auth session for admins.
        // Instead, we check for our local admin session token.
        const session = localStorage.getItem('repairly_admin_session');
        if (!session) {
            navigate('/admin');
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: bookingData, error: bookingError } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
            if (bookingError) throw bookingError;

            // Fetch Profiles (Users)
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            // Fetch Admin Profile
            // We get the ID from local storage to know WHICH admin (though currently only 1)
            const session = JSON.parse(localStorage.getItem('repairly_admin_session') || '{}');
            if (session.id) {
                const { data: adminData } = await supabase
                    .from('admin_users')
                    .select('*')
                    .eq('id', session.id)
                    .single();
                if (adminData) setAdminProfile(adminData);
            }

            const { data: ticketData, error: ticketError } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
            if (ticketError) throw ticketError;

            const { data: serviceData, error: serviceError } = await supabase.from('repair_services').select('*').order('created_at', { ascending: true });

            const { data: menuData, error: menuError } = await supabase.from('service_menu_items').select('*').order('created_at', { ascending: true });
            if (menuError) throw menuError;

            const { data: modelData, error: modelError } = await supabase.from('device_models').select('*').order('created_at', { ascending: false }).limit(200);
            if (modelError) throw modelError;

            const { data: productData, error: productError } = await supabase.from('device_inventory').select('*').order('created_at', { ascending: false });

            if (bookingData) setBookings(bookingData);
            if (ticketData) setTickets(ticketData);
            if (serviceData) setServices(serviceData);
            if (menuData) setMenuItems(menuData);
            if (modelData) setModels(modelData);
            if (productData) setInventory(productData);
            if (userData) setUsers(userData);
        } catch (error) {
            console.error('Fetch error:', error);
            // alert('Error loading data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (window.confirm("Disconnect from Admin Console?")) {
            localStorage.removeItem('repairly_admin_session');
            await supabase.auth.signOut();
            navigate('/admin');
        }
    };

    const handleDelete = (table, id, e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const scrollY = window.scrollY;
        // Position popover to the left of the button
        setDeleteConfirm({
            show: true,
            table,
            id,
            position: {
                top: rect.top + scrollY - 20,
                right: window.innerWidth - rect.left + 10
            }
        });
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase 'images' bucket
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data } = supabase.storage.from('images').getPublicUrl(filePath);

            // Update the editing product state with new image URL
            setEditingProduct(prev => ({ ...prev, image_url: data.publicUrl }));

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image! \n\nMake sure you have created the "images" storage bucket in Supabase (Public Access).');
        } finally {
            setUploading(false);
        }
    };

    const confirmDelete = async () => {
        const { table, id } = deleteConfirm;
        if (!table || !id) return;

        const { error } = await supabase.from(table).delete().eq('id', id);

        if (error) {
            alert('Error deleting: ' + error.message);
        } else {
            if (table === 'repair_services') setServices(services.filter(s => s.id !== id));
            if (table === 'service_menu_items') setMenuItems(menuItems.filter(m => m.id !== id));
            if (table === 'device_models') setModels(models.filter(m => m.id !== id));
            if (table === 'bookings') setBookings(bookings.filter(b => b.id !== id));
            if (table === 'support_tickets') setTickets(tickets.filter(t => t.id !== id));
        }
        setDeleteConfirm({ show: false, table: '', id: '', position: null });
    };

    const handleSaveService = async () => {
        if (!editingService.label || !editingService.price) return alert('Please fill in all fields');

        // Check for duplicates on create only
        if (!editingService.id) {
            if (services.some(s => s.label.toLowerCase() === editingService.label.toLowerCase())) {
                return alert('A service with this name already exists!');
            }
        }

        const payload = {
            label: editingService.label,
            price: editingService.price,
            duration: editingService.duration,
            image_url: editingService.image_url,
            icon_key: editingService.icon_key
        };

        let result;
        if (editingService.id) {
            // Update
            result = await supabase.from('repair_services').update(payload).eq('id', editingService.id);
        } else {
            // Insert
            result = await supabase.from('repair_services').insert([payload]);
        }

        if (result.error) {
            alert('Error saving service: ' + result.error.message);
        } else {
            setEditingService(null);
            fetchData();
        }
    };

    const handleSaveBooking = async () => {
        if (!editingBooking) return;

        const payload = {
            status: editingBooking.status,
            estimated_cost: editingBooking.estimated_cost,
            tech_notes: editingBooking.tech_notes
        };

        const { error } = await supabase.from('bookings').update(payload).eq('id', editingBooking.id);

        if (error) {
            alert('Error updating booking: ' + error.message);
        } else {
            setEditingBooking(null);
            fetchData();
        }
    };

    const handleAdminUpdate = async (e) => {
        e.preventDefault();
        if (!adminProfile) return;

        const newEmail = e.target.email.value;
        const newPassword = e.target.password.value;

        try {
            const { error } = await supabase
                .from('admin_users')
                .update({ email: newEmail, password: newPassword })
                .eq('id', adminProfile.id);

            if (error) throw error;

            alert('Admin Credentials Updated Successfully! Please log in again.');

            // Logout to force re-auth with new creds
            localStorage.removeItem('repairly_admin_session');
            navigate('/admin');

        } catch (error) {
            alert('Update Failed: ' + error.message);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-bold tracking-widest animate-pulse">LOADING DASHBOARD...</div>;

    // Analytics Helpers
    const totalRevenue = bookings.reduce((sum, b) => sum + (parseInt((b.estimated_cost || '0').replace(/[^0-9]/g, '')) || 0), 0);
    const uniqueCustomers = new Set(bookings.map(b => b.device_model)).size; // rough proxy for distinct customers

    return (
        <div className="min-h-screen bg-[#0F172A] flex font-sans">
            {/* Dark Sidebar */}
            <aside className="w-72 bg-[#020617] text-white fixed h-full hidden md:flex flex-col shadow-2xl z-20">
                <div className="p-8 border-b border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white">M</div>
                        <span className="text-xl font-bold tracking-tight">ADMIN<span className="text-blue-500">PANEL</span></span>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">System Control Center</p>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    <p className="text-xs font-bold text-slate-600 uppercase mb-4 px-2 tracking-wider">Main Menu</p>
                    {MENU_ITEMS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold text-sm group ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={18} className={activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 font-bold text-sm transition-colors">
                        <LogOut size={18} /> Log Out
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Nav - Professional Android Style */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#0F172A]/90 backdrop-blur-xl border-t border-slate-700/50 flex overflow-x-auto items-center px-1 py-3 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.2)] no-scrollbar">
                {MENU_ITEMS.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center justify-center min-w-[72px] flex-shrink-0 gap-1.5 transition-all active:scale-95 ${activeTab === item.id ? 'text-blue-500' : 'text-slate-400'
                            }`}
                    >
                        <div className={`p-1 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-500/10' : 'bg-transparent'}`}>
                            <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-bold truncate w-full text-center leading-tight px-1 ${activeTab === item.id ? 'text-blue-500' : 'text-slate-500'}`}>
                            {item.label === 'Service Catalog' ? 'Services' :
                                item.label === 'Header Menu' ? 'Menu' :
                                    item.label === 'Device Models' ? 'Models' :
                                        item.label === 'Support Inbox' ? 'Support' :
                                            item.label === 'Shop Inventory' ? 'Stock' :
                                                item.label === 'Site Settings' ? 'Settings' :
                                                    item.label}
                        </span>
                    </button>
                ))}
            </nav>

            {/* Main Content */}
            {/* Main Content */}
            <main className="flex-1 md:ml-72 p-5 pb-28 md:p-8 lg:p-12 overflow-y-auto w-full scroll-smooth">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white mb-1 md:mb-2 tracking-tight">
                            {activeTab === 'users' ? 'Admin' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base font-medium">Welcome back, Administrator.</p>
                    </div>

                    {/* Search & Actions Bar - Mobile Optimized */}
                    <div className="flex flex-col md:flex-row items-stretch gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64 group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                <SearchIcon size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-[#1E293B] border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button onClick={fetchData} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
                            <RefreshCw size={18} />
                            <span className="md:inline">Refresh</span>
                        </button>
                    </div>
                </header>

                {/* OVERVIEW STATS */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-[#1E293B] p-6 rounded-2xl shadow-sm border border-slate-700/50">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                        <TrendingUp size={24} />
                                    </div>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                                </div>
                                <div className="text-3xl font-black text-white mb-1">{bookings.length}</div>
                                <div className="text-sm font-medium text-slate-400">Total Bookings</div>
                            </div>

                            <div className="bg-[#1E293B] p-6 rounded-2xl shadow-sm border border-slate-700/50">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                        <Users size={24} />
                                    </div>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+5%</span>
                                </div>
                                <div className="text-3xl font-black text-white mb-1">{tickets.length}</div>
                                <div className="text-sm font-medium text-slate-400">Message Threads</div>
                            </div>

                            <div className="bg-[#1E293B] p-6 rounded-2xl shadow-sm border border-slate-700/50">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                        <DollarSign size={24} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Est.</span>
                                </div>
                                <div className="text-3xl font-black text-white mb-1">${totalRevenue.toLocaleString()}</div>
                                <div className="text-sm font-medium text-slate-400">Realized Revenue</div>
                            </div>

                            <div className="bg-[#1E293B] p-6 rounded-2xl shadow-sm border border-slate-700/50">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                                        <Activity size={24} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-full">Now</span>
                                </div>
                                <div className="text-3xl font-black text-white mb-1">Active</div>
                                <div className="text-sm font-medium text-slate-400">System Status</div>
                            </div>
                        </div>

                        {/* Recent Activity Table */}
                        <div className="bg-[#1E293B] rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden">
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                                <h3 className="font-bold text-white text-lg">Recent Bookings</h3>
                                <button onClick={() => setActiveTab('bookings')} className="text-blue-500 text-sm font-bold hover:underline">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead className="bg-[#0F172A] text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 pl-6">Device</th>
                                            <th className="p-4">Customer</th>
                                            <th className="p-4">Service</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-medium text-slate-300 divide-y divide-slate-800">
                                        {bookings.slice(0, 5).map(b => (
                                            <tr key={b.id} className="hover:bg-slate-800 transition-colors">
                                                <td className="p-4 pl-6 font-bold text-white">{b.device_brand} {b.device_model}</td>
                                                <td className="p-4 text-slate-400">Walk-In Customer</td>
                                                <td className="p-4"><span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-bold uppercase">{services.find(s => s.id === b.service_type)?.label || b.service_type}</span></td>
                                                <td className="p-4">{b.appointment_date}</td>
                                                <td className="p-4 text-right"><span className="text-green-500 font-bold text-xs bg-green-500/10 px-2 py-1 rounded-full">CONFIRMED</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* BOOKINGS TAB */}
                {activeTab === 'bookings' && (
                    <div className="bg-[#1E293B] rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead className="bg-[#0F172A] text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 pl-6">ID</th>
                                        <th className="p-4">Device</th>
                                        <th className="p-4">Status & Price</th>
                                        <th className="p-4">Contact</th>
                                        <th className="p-4">Booked At</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-slate-300 divide-y divide-slate-800">
                                    {bookings.filter(b =>
                                        (b.device_model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        (b.device_brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        (b.customer_name && b.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                        String(b.id).includes(searchTerm)
                                    ).map(b => (
                                        <tr key={b.id} className="hover:bg-slate-800 transition-colors group">
                                            <td className="p-4 pl-6 font-mono text-xs text-slate-400">#{b.id}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-white">{b.device_brand} {b.device_model}</div>
                                                <div className="text-xs text-slate-400 bg-slate-800 inline-block px-1.5 py-0.5 rounded mt-1">{services.find(s => s.id === b.service_type)?.label || b.service_type}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${b.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                                                        b.status === 'Ready for Pickup' ? 'bg-purple-500/10 text-purple-400' :
                                                            b.status === 'Waiting for Parts' ? 'bg-orange-500/10 text-orange-400' :
                                                                b.status === 'Diagnosing' ? 'bg-yellow-500/10 text-yellow-400' :
                                                                    b.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' :
                                                                        'bg-slate-800 text-slate-400'
                                                        }`}>
                                                        {b.status || 'Received'}
                                                    </span>
                                                    <span className="font-bold text-slate-200 text-xs">{b.estimated_cost ? b.estimated_cost : 'No Quote'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-white">{b.customer_name || 'Guest'}</div>
                                                <div className="flex gap-2 mt-1">
                                                    <a href={`https://wa.me/${(b.customer_phone || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="p-1.5 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 transition-colors" title="WhatsApp">
                                                        <MessageSquare size={14} />
                                                    </a>
                                                    <a href={`tel:${b.customer_phone}`} className="p-1.5 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors" title="Call">
                                                        <Phone size={14} />
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs text-slate-400">
                                                {new Date(b.created_at).toLocaleDateString()}
                                                <div className="text-[10px] opacity-60">{b.appointment_date} @ {b.appointment_time}</div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingBooking(b)}
                                                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors border border-transparent hover:border-blue-500/20"
                                                        title="Edit Booking"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete('bookings', b.id, e)}
                                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
                }


                {/* Booking Edit Modal */}
                {
                    editingBooking && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="bg-[#1E293B] rounded-2xl shadow-2xl p-8 w-full max-w-md">
                                <h3 className="text-xl font-bold text-white mb-1">Update Repair #{editingBooking.id}</h3>
                                <p className="text-sm text-slate-400 mb-6">{editingBooking.device_brand} {editingBooking.device_model}</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Repair Status</label>
                                        <select
                                            value={editingBooking.status || 'Received'}
                                            onChange={e => setEditingBooking({ ...editingBooking, status: e.target.value })}
                                            className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white focus:outline-none focus:border-blue-500 appearance-none"
                                        >
                                            <option value="Received">Received / In Queue</option>
                                            <option value="Diagnosing">Diagnosing</option>
                                            <option value="Waiting for Parts">Waiting for Parts</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Ready for Pickup">Ready for Pickup</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Price Quote</label>
                                        <input
                                            type="text"
                                            value={editingBooking.estimated_cost || ''}
                                            onChange={e => setEditingBooking({ ...editingBooking, estimated_cost: e.target.value })}
                                            className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white focus:outline-none focus:border-blue-500"
                                            placeholder="e.g. $120.00"
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1">This will be shown to the customer.</p>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Tech Notes (Internal)</label>
                                        <textarea
                                            value={editingBooking.tech_notes || ''}
                                            onChange={e => setEditingBooking({ ...editingBooking, tech_notes: e.target.value })}
                                            className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-medium text-slate-300 focus:outline-none focus:border-blue-500 min-h-[100px]"
                                            placeholder="Internal notes about the repair, passcode, damage details, etc."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <button
                                        onClick={() => setEditingBooking(null)}
                                        className="flex-1 py-3 text-slate-400 font-bold hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveBooking}
                                        className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} /> Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* TICKETS TAB */}
                {
                    activeTab === 'tickets' && (
                        <div className="bg-[#1E293B] rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead className="bg-[#0F172A] text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 pl-6">Date</th>
                                            <th className="p-4">Sender</th>
                                            <th className="p-4">Subject</th>
                                            <th className="p-4">Message</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-medium text-slate-300 divide-y divide-slate-800">
                                        {tickets.filter(t =>
                                            (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            (t.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            (t.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
                                        ).map((t) => (
                                            <tr key={t.id} className="hover:bg-slate-800 transition-colors group">
                                                <td className="p-4 pl-6 text-xs text-slate-400 whitespace-nowrap">
                                                    {new Date(t.created_at).toLocaleDateString()}
                                                    <div className="text-[10px] opacity-70">{new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-white">{t.name}</div>
                                                    <div className="text-xs text-slate-400">{t.email}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs font-bold uppercase">{t.subject}</span>
                                                </td>
                                                <td className="p-4 max-w-md truncate text-slate-400" title={t.message}>
                                                    {t.message}
                                                </td>
                                                <td className="p-4 text-right flex justify-end gap-2">
                                                    <a
                                                        href={`mailto:${t.email}?subject=Re: ${t.subject} - Support Inquiry`}
                                                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                        title="Reply via Email"
                                                    >
                                                        <Mail size={16} />
                                                    </a>
                                                    <button
                                                        onClick={(e) => handleDelete('support_tickets', t.id, e)}
                                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Delete Ticket"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {tickets.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-slate-400">
                                                    No support tickets found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }

                {/* SERVICES CATALOG TAB */}
                {/* Header Menu Management Tab */}
                {
                    activeTab === 'menu' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-white">Header Menu</h2>
                                    <p className="text-slate-400 text-sm">Manage the "Services" dropdown links in the website header.</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        alert("Ensure you have created the 'service_menu_items' table first!");
                                        const defaults = [
                                            'Screen Repair', 'Battery Replacement', 'Water Damage Repair', 'Charging Port Repair',
                                            'Data Recovery', 'Camera Repair', 'Keyboard Replacement', 'HDMI Port Repair', 'Console Cleaning'
                                        ];
                                        let count = 0;
                                        for (const label of defaults) {
                                            const { error } = await supabase.from('service_menu_items').insert([{ label }]);
                                            if (!error) count++;
                                        }
                                        if (count > 0) {
                                            alert(`Seeded ${count} menu items.`);
                                            fetchData();
                                        } else {
                                            alert("Failed to seed. Check if table 'service_menu_items' exists.");
                                        }
                                    }}
                                    className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg hover:bg-blue-500/20 transition-colors"
                                >
                                    Seed Defaults
                                </button>
                            </div>

                            <div className="bg-[#1E293B] rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden">
                                {/* Toolbar / Add Form */}
                                <div className="p-4 border-b border-slate-700/50 flex gap-4 bg-[#1E293B]">
                                    <input
                                        type="text"
                                        placeholder="New Menu Label (e.g. 'Console Repair')"
                                        className="flex-1 p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white outline-none focus:border-blue-500 placeholder:text-slate-500"
                                        id="newMenuItem"
                                        onKeyDown={async (e) => {
                                            if (e.key === 'Enter') {
                                                const val = e.target.value.trim();
                                                if (!val) return;

                                                if (menuItems.some(item => item.label.toLowerCase() === val.toLowerCase())) {
                                                    return alert('This menu item already exists!');
                                                }

                                                await supabase.from('service_menu_items').insert([{ label: val }]);
                                                e.target.value = '';
                                                fetchData();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={async () => {
                                            const input = document.getElementById('newMenuItem');
                                            const val = input.value.trim();
                                            if (!val) return;

                                            if (menuItems.some(item => item.label.toLowerCase() === val.toLowerCase())) {
                                                return alert('This menu item already exists!');
                                            }

                                            await supabase.from('service_menu_items').insert([{ label: val }]);
                                            input.value = '';
                                            // Trigger refresh
                                            const { data } = await supabase.from('service_menu_items').select('*').order('created_at');
                                            if (data) setMenuItems(data);
                                        }}
                                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        Add Label
                                    </button>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[500px]">
                                        <thead className="bg-[#0F172A] text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <tr>
                                                <th className="p-4 pl-6">Menu Label</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-medium text-slate-300 divide-y divide-slate-800">
                                            {menuItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan="2" className="p-8 text-center text-slate-400">
                                                        No menu items yet. Add one above!
                                                    </td>
                                                </tr>
                                            ) : (
                                                menuItems.filter(item =>
                                                    (item.label || '').toLowerCase().includes(searchTerm.toLowerCase())
                                                ).map(item => (
                                                    <tr key={item.id} className="hover:bg-slate-800 transition-colors group">
                                                        <td className="p-4 pl-6 font-bold text-white">{item.label}</td>
                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={(e) => handleDelete('service_menu_items', item.id, e)}
                                                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Device Models Tab */}
                {
                    activeTab === 'models' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-white">Device Models Database</h2>
                                    <p className="text-slate-400 text-sm">Manage categories, brands, and models for the repair widget.</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowSqlModal(true)}
                                        className="text-xs text-slate-400 underline"
                                    >
                                        Setup Table
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!confirm('This will seed models from data.js. Existing models will be skipped.')) return;

                                            const existingKeys = new Set(models.map(m => `${m.brand}-${m.model}`));
                                            const rows = [];

                                            for (const [cat, brands] of Object.entries(DEVICE_MODELS)) {
                                                for (const [brand, list] of Object.entries(brands)) {
                                                    for (const model of list) {
                                                        if (!existingKeys.has(`${brand}-${model}`)) {
                                                            rows.push({ category: cat, brand, model });
                                                        }
                                                    }
                                                }
                                            }

                                            if (rows.length === 0) return alert('No new models to add!');

                                            // Chunk insert
                                            const chunkSize = 50;
                                            let successCount = 0;
                                            for (let i = 0; i < rows.length; i += chunkSize) {
                                                const chunk = rows.slice(i, i + chunkSize);
                                                const { error } = await supabase.from('device_models').insert(chunk);
                                                if (error) {
                                                    alert('Error: ' + error.message);
                                                    return;
                                                }
                                                successCount += chunk.length;
                                            }

                                            alert(`Seeded ${successCount} new models!`);
                                            fetchData();
                                        }}
                                        className="px-4 py-2 bg-[#0F172A] text-white font-bold rounded-xl hover:bg-slate-800 border border-slate-700/50 transition-colors flex items-center gap-2"
                                    >
                                        <Database size={18} /> Seed from Data
                                    </button>
                                </div>
                            </div>

                            <div className="bg-[#1E293B] rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden">
                                {/* Toolbar / Add Form */}
                                <div className="p-4 border-b border-slate-700/50 grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#1E293B]">
                                    <select id="newModelCat" className="p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white outline-none focus:border-blue-500 appearance-none">
                                        <option value="Phone">Phone</option>
                                        <option value="Tablet">Tablet</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="Console">Console</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <input id="newModelBrand" type="text" placeholder="Brand (e.g. Apple)" className="p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white outline-none focus:border-blue-500 placeholder:text-slate-500" />
                                    <input id="newModelName" type="text" placeholder="Model (e.g. iPhone 15)" className="p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white outline-none focus:border-blue-500 placeholder:text-slate-500" />
                                    <button
                                        onClick={async () => {
                                            const cat = document.getElementById('newModelCat').value;
                                            const brand = document.getElementById('newModelBrand').value;
                                            const model = document.getElementById('newModelName').value;
                                            if (!brand || !model) return alert("Enter brand and model");

                                            if (models.some(m => m.brand === brand && m.model === model)) {
                                                return alert('This model already exists!');
                                            }

                                            const { error } = await supabase.from('device_models').insert([{ category: cat, brand, model }]);
                                            if (!error) {
                                                document.getElementById('newModelName').value = '';
                                                fetchData();
                                            } else {
                                                alert(error.message);
                                            }
                                        }}
                                        className="bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
                                    >
                                        Add Model
                                    </button>
                                </div>

                                {/* Table */}
                                <div className="max-h-[600px] overflow-y-auto custom-scrollbar overflow-x-auto">
                                    <table className="w-full text-left border-collapse relative min-w-[600px]">
                                        <thead className="bg-[#0F172A] text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 z-10">
                                            <tr>
                                                <th className="p-4 pl-6">Category</th>
                                                <th className="p-4">Brand</th>
                                                <th className="p-4">Model</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-medium text-slate-300 divide-y divide-slate-800">
                                            {models.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="p-8 text-center text-slate-400">
                                                        No models found. Try seeding.
                                                    </td>
                                                </tr>
                                            ) : (
                                                models.filter(m =>
                                                    (m.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (m.model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (m.category || '').toLowerCase().includes(searchTerm.toLowerCase())
                                                ).map(m => (
                                                    <tr key={m.id} className="hover:bg-slate-800 transition-colors group">
                                                        <td className="p-4 pl-6">
                                                            <span className="text-xs font-bold uppercase bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700/50">
                                                                {m.category}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-slate-400">{m.brand}</td>
                                                        <td className="p-4 font-bold text-white">{m.model}</td>
                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={(e) => handleDelete('device_models', m.id, e)}
                                                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Service Catalog Tab */}
                {
                    activeTab === 'services' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-white">Service Catalog</h2>
                                    <p className="text-slate-400 text-sm">Manage the list of repair services and prices.</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={async () => {
                                            if (!confirm('This will add default services to the database. Continue?')) return;
                                            const defaults = [
                                                { label: "Screen Repair", price: "$129+", duration: "45 Mins", icon_key: "Smartphone" },
                                                { label: "Battery Replacement", price: "$69+", duration: "30 Mins", icon_key: "Battery" },
                                                { label: "Water Damage Repair", price: "$99+", duration: "24 Hours", icon_key: "Droplets" },
                                                { label: "Charging Port Repair", price: "$79+", duration: "60 Mins", icon_key: "Usb" },
                                                { label: "Data Recovery", price: "$199+", duration: "2-5 Days", icon_key: "Disc" },
                                                { label: "Camera Repair", price: "$89+", duration: "45 Mins", icon_key: "Camera" },
                                                { label: "Speaker Repair", price: "$59+", duration: "45 Mins", icon_key: "Speaker" },
                                                { label: "Laptop Screen Repair", price: "$149+", duration: "2 Hours", icon_key: "Laptop" },
                                                { label: "Console HDMI Repair", price: "$99+", duration: "2 Hours", icon_key: "Gamepad2" },
                                                { label: "iPad Glass Repair", price: "$89+", duration: "1 Hour", icon_key: "Tablet" },
                                            ];

                                            const newDefaults = defaults.filter(d =>
                                                !services.some(s => s.label.toLowerCase() === d.label.toLowerCase())
                                            );

                                            if (newDefaults.length === 0) return alert('Default services already exist!');

                                            let count = 0;
                                            for (const d of newDefaults) {
                                                const { error } = await supabase.from('repair_services').insert([d]);
                                                if (!error) count++;
                                            }
                                            alert(`Added ${count} services!`);
                                            fetchData();
                                        }}
                                        className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2"
                                    >
                                        <Database size={18} /> Seed Defaults
                                    </button>
                                    <button
                                        onClick={() => setEditingService({ id: null, label: '', price: '', icon_key: 'Smartphone' })}
                                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Plus size={18} /> Add New Service
                                    </button>
                                </div>
                            </div>

                            {/* Edit Modal / Form Overlay */}
                            {editingService && (
                                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                                    <div className="bg-[#1E293B] rounded-2xl shadow-2xl p-8 w-full max-w-md">
                                        <h3 className="text-xl font-bold text-white mb-6">{editingService.id ? 'Edit Service' : 'New Service'}</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Service Label</label>
                                                <select
                                                    value={editingService.label}
                                                    onChange={e => setEditingService({ ...editingService, label: e.target.value })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white focus:outline-none focus:border-blue-500 appearance-none"
                                                >
                                                    <option value="">Select Service Label...</option>
                                                    {menuItems.length > 0 ? (
                                                        menuItems.map(item => (
                                                            <option key={item.id} value={item.label}>{item.label}</option>
                                                        ))
                                                    ) : (
                                                        <option disabled>No Menu Items (Add in Header Menu tab)</option>
                                                    )}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Price</label>
                                                <input
                                                    type="text"
                                                    value={editingService.price}
                                                    onChange={e => setEditingService({ ...editingService, price: e.target.value })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white focus:outline-none focus:border-blue-500"
                                                    placeholder="e.g. $129+"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Duration / Time</label>
                                                <input
                                                    type="text"
                                                    value={editingService.duration || ''}
                                                    onChange={e => setEditingService({ ...editingService, duration: e.target.value })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white focus:outline-none focus:border-blue-500"
                                                    placeholder="e.g. 1-2 Hours"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Service Image</label>
                                                <div className="flex items-center gap-4">
                                                    {editingService.image_url ? (
                                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                                                            <img src={editingService.image_url} alt="Service" className="w-full h-full object-cover" />
                                                            <button
                                                                onClick={() => setEditingService({ ...editingService, image_url: null })}
                                                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="w-16 h-16 bg-[#0F172A] rounded-xl border-2 border-dashed border-slate-700/50 flex items-center justify-center text-slate-400">
                                                            <ImageIcon size={24} />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                const file = e.target.files[0];
                                                                if (!file) return;

                                                                const fileExt = file.name.split('.').pop();
                                                                const fileName = `${Date.now()}.${fileExt}`;
                                                                const { error: uploadError } = await supabase.storage.from('services').upload(fileName, file);

                                                                if (uploadError) {
                                                                    if (uploadError.message.includes('Bucket not found')) {
                                                                        alert("Missing Bucket! \nPlease go to Supabase -> Storage, create a new public bucket named 'services'.\n\nOr run the SQL provided in the chat.");
                                                                    } else {
                                                                        alert('Error uploading image: ' + uploadError.message);
                                                                    }
                                                                } else {
                                                                    const { data: { publicUrl } } = supabase.storage.from('services').getPublicUrl(fileName);
                                                                    setEditingService({ ...editingService, image_url: publicUrl });
                                                                }
                                                            }}
                                                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                        />
                                                        <p className="text-[10px] text-slate-400 mt-1">Upload a PNG or JPG (Max 2MB). Overrides icon.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Icon (Fallback)</label>
                                                <div className="grid grid-cols-5 gap-2">
                                                    {['Smartphone', 'Battery', 'Droplets', 'Usb', 'Disc', 'Wrench', 'Cpu', 'Wifi', 'Camera', 'Speaker'].map(iconKey => (
                                                        <button
                                                            key={iconKey}
                                                            onClick={() => setEditingService({ ...editingService, icon_key: iconKey })}
                                                            className={`p-3 rounded-xl flex items-center justify-center border transition-all ${editingService.icon_key === iconKey ? 'bg-blue-600 text-white border-blue-600' : 'bg-[#0F172A] border-slate-700/50 text-slate-400 hover:border-blue-500'}`}
                                                            title={iconKey}
                                                        >
                                                            {iconKey === 'Smartphone' && <Smartphone size={20} />}
                                                            {iconKey === 'Battery' && <Battery size={20} />}
                                                            {iconKey === 'Droplets' && <Droplets size={20} />}
                                                            {iconKey === 'Usb' && <Usb size={20} />}
                                                            {iconKey === 'Disc' && <Disc size={20} />}
                                                            {iconKey === 'Wrench' && <Wrench size={20} />}
                                                            {iconKey === 'Cpu' && <Cpu size={20} />}
                                                            {iconKey === 'Wifi' && <Wifi size={20} />}
                                                            {iconKey === 'Camera' && <Camera size={20} />}
                                                            {iconKey === 'Speaker' && <Speaker size={20} />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mt-8">
                                            <button
                                                onClick={() => setEditingService(null)}
                                                className="flex-1 py-3 text-slate-400 font-bold hover:text-white"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveService}
                                                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
                                            >
                                                {editingService.id ? 'Save Changes' : 'Create Service'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-[#1E293B] rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                        <thead className="bg-[#0F172A] text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <tr>
                                                <th className="p-4 pl-6">Image / Icon</th>
                                                <th className="p-4">Service Name</th>
                                                <th className="p-4">Duration</th>
                                                <th className="p-4">Price</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-medium text-slate-300 divide-y divide-slate-800">
                                            {services.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="p-8 text-center text-slate-400">
                                                        No services found. Add one to get started.
                                                        <div className="text-xs mt-2 text-slate-300">(Ensure 'repair_services' table and 'services' bucket exist)</div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                services.filter(s =>
                                                    (s.label || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (s.price || '').toLowerCase().includes(searchTerm.toLowerCase())
                                                ).map(s => (
                                                    <tr key={s.id} className="hover:bg-slate-800 transition-colors">
                                                        <td className="p-4 pl-6">
                                                            {s.image_url ? (
                                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                                                                    <img src={s.image_url} alt={s.label} className="w-full h-full object-cover" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                                                    {s.icon_key === 'Smartphone' && <Smartphone size={18} />}
                                                                    {s.icon_key === 'Battery' && <Battery size={18} />}
                                                                    {s.icon_key === 'Droplets' && <Droplets size={18} />}
                                                                    {s.icon_key === 'Usb' && <Usb size={18} />}
                                                                    {s.icon_key === 'Disc' && <Disc size={18} />}
                                                                    {s.icon_key === 'Wrench' && <Wrench size={18} />}
                                                                    {s.icon_key === 'Cpu' && <Cpu size={18} />}
                                                                    {s.icon_key === 'Wifi' && <Wifi size={18} />}
                                                                    {s.icon_key === 'Camera' && <Camera size={18} />}
                                                                    {s.icon_key === 'Speaker' && <Speaker size={18} />}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="p-4 font-bold text-white">{s.label}</td>
                                                        <td className="p-4 text-slate-400 text-xs">{s.duration || '-'}</td>
                                                        <td className="p-4 text-white font-bold">{s.price}</td>
                                                        <td className="p-4 text-right flex justify-end gap-2">
                                                            <button
                                                                onClick={() => setEditingService(s)}
                                                                className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDelete('repair_services', s.id, e)}
                                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }
                {/* Shop Inventory Tab */}
                {
                    activeTab === 'inventory' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black text-white">Shop Inventory</h2>
                                    <p className="text-slate-400">Manage device sales and listings.</p>
                                </div>
                                <button
                                    onClick={() => setEditingProduct({})}
                                    className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 flex items-center gap-2"
                                >
                                    <Plus size={18} /> Add Device
                                </button>
                            </div>

                            <div className="bg-[#1E293B] rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                        <thead className="bg-[#0F172A] text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <tr>
                                                <th className="p-4 pl-6">Device</th>
                                                <th className="p-4">Price</th>
                                                <th className="p-4">Condition</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-medium text-slate-300 divide-y divide-slate-800">
                                            {inventory.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="p-8 text-center text-slate-400">
                                                        No devices listed. <button onClick={() => setEditingProduct({})} className="text-blue-500 hover:underline">Add one now</button>.
                                                    </td>
                                                </tr>
                                            ) : (
                                                inventory.map(item => (
                                                    <tr key={item.id} className="hover:bg-slate-800 transition-colors">
                                                        <td className="p-4 pl-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700/50">
                                                                    {item.image_url ? (
                                                                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <Smartphone size={18} className="text-slate-400" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-white">{item.title}</div>
                                                                    <div className="text-xs text-slate-400">{item.brand} • {item.storage}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 font-bold text-white">${item.price}</td>
                                                        <td className="p-4"><span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-bold">{item.condition}</span></td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1 ${item.status === 'Available' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                                                }`}>
                                                                {item.status === 'Available' ? <Check size={12} /> : <X size={12} />}
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right flex justify-end gap-2">
                                                            <button onClick={() => setEditingProduct(item)} className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                                                            <button onClick={(e) => handleDelete('device_inventory', item.id, e)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }
                {/* Users Tab */}
                {
                    activeTab === 'users' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            {/* Admin Account Management Section */}
                            {adminProfile && (
                                <div className="bg-[#1E293B] rounded-2xl shadow-sm border border-slate-700/50 p-6">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                                            <Lock size={20} />
                                        </div>
                                        My Admin Credentials
                                    </h3>
                                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 mb-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-500 uppercase font-bold text-xs mb-1">Current Email</p>
                                                <p className="text-white font-mono">{adminProfile.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 uppercase font-bold text-xs mb-1">Current Password</p>
                                                <p className="text-white font-mono">{adminProfile.password} <span className="text-slate-500 text-xs italic ml-2">(Plain text as requested)</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <form onSubmit={handleAdminUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">New Email</label>
                                            <input
                                                name="email"
                                                type="email"
                                                defaultValue={adminProfile.email}
                                                required
                                                className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white focus:border-red-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">New Password</label>
                                            <input
                                                name="password"
                                                type="text"
                                                defaultValue={adminProfile.password}
                                                required
                                                className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white focus:border-red-500 outline-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full p-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
                                        >
                                            Update Credentials
                                        </button>
                                    </form>
                                </div>
                            )}


                        </div>
                    )
                }
                {/* Site Settings Tab */}
                {
                    activeTab === 'settings' && (
                        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-[#1E293B] rounded-2xl shadow-sm border border-slate-700/50 p-4 md:p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8 border-b border-slate-700/50 pb-6">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-black text-white">Global Site Settings</h2>
                                        <p className="text-sm md:text-base text-slate-400">Update your business information across the entire website.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowSqlModal(true)}
                                            className="px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 flex items-center gap-2"
                                            title="View Database SQL"
                                        >
                                            <Database size={18} /> <span className="hidden md:inline">DB Setup</span>
                                        </button>
                                        <button
                                            onClick={async () => {
                                                // Auto-generate Embed Map URL from Address to ensure it works even if user pastes a shortlink
                                                const addr = settingsForm.address;
                                                const fullAddr = `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`;
                                                const encoded = encodeURIComponent(fullAddr);
                                                const autoEmbed = `https://maps.google.com/maps?q=${encoded}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

                                                const updatedSettings = {
                                                    ...settingsForm,
                                                    name: `${settingsForm.branding.namePrefix || ''} ${settingsForm.branding.nameHighlight || ''}`.trim(),
                                                    googleMapEmbed: autoEmbed
                                                };
                                                try {
                                                    await updateShopData(updatedSettings);
                                                    setSettingsForm(updatedSettings);
                                                    alert('Settings saved successfully!');
                                                } catch (error) {
                                                    if (error.message.includes('Could not find the table') || error.message.includes('relation "public.site_settings" does not exist')) {
                                                        alert("Table Missing! \n\nIt looks like the 'site_settings' table hasn't been created yet. \n\nI will open the Database Setup modal for you. Please copy the SQL and run it in Supabase.");
                                                        setShowSqlModal(true);
                                                    } else {
                                                        alert('Error saving settings: ' + error.message);
                                                    }
                                                }
                                            }}
                                            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
                                        >
                                            <Save size={18} /> Save Changes
                                        </button>
                                    </div>

                                </div>

                                <div className="space-y-6 md:space-y-8">
                                    {/* Shop Operation Status */}
                                    <section className="bg-[#020617] border border-slate-700/50 rounded-xl p-6 relative overflow-hidden">
                                        <div className={`absolute top-0 right-0 p-32 rounded-full -mr-16 -mt-16 transition-colors duration-500 ${settingsForm.isOpen ? 'bg-green-500/10' : 'bg-red-500/10'}`}></div>
                                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                                    <Store size={20} className={settingsForm.isOpen ? 'text-green-500' : 'text-red-500'} />
                                                    Shop Status: <span className={settingsForm.isOpen ? 'text-green-500' : 'text-red-500'}>{settingsForm.isOpen ? 'OPEN FOR BUSINESS' : 'TEMPORARILY CLOSED'}</span>
                                                </h3>
                                                <p className="text-sm text-slate-400 max-w-md">
                                                    {settingsForm.isOpen
                                                        ? "Your shop is currently marked as open. Customers can see you are available."
                                                        : "Your shop is marked as closed. A 'Closed' badge will appear on the website."}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex bg-[#1E293B] rounded-lg p-1 border border-slate-800 shadow-sm">
                                                    <button
                                                        onClick={() => setSettingsForm({ ...settingsForm, isOpen: true })}
                                                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${settingsForm.isOpen ? 'bg-green-500 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                                    >
                                                        OPEN
                                                    </button>
                                                    <button
                                                        onClick={() => setSettingsForm({ ...settingsForm, isOpen: false })}
                                                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${!settingsForm.isOpen ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                                    >
                                                        CLOSED
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                    {/* General Info */}
                                    <section>
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <div className="w-1 h-6 bg-blue-500 rounded-full"></div> General Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Tagline</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.tagline}
                                                    onChange={e => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Contact Details */}
                                    <section>
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <div className="w-1 h-6 bg-green-500 rounded-full"></div> Contact Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Phone (Internal)</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.phone}
                                                    onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Display Phone</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.displayPhone}
                                                    onChange={e => setSettingsForm({ ...settingsForm, displayPhone: e.target.value })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">WhatsApp</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.whatsapp}
                                                    onChange={e => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Email</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.email}
                                                    onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Business Hours */}
                                    <section>
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <div className="w-1 h-6 bg-yellow-500 rounded-full"></div> Business Hours
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Weekdays</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.hours?.weekdays || ''}
                                                    onChange={e => setSettingsForm({ ...settingsForm, hours: { ...settingsForm.hours, weekdays: e.target.value } })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white"
                                                    placeholder="e.g. 8:00 AM - 8:00 PM"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Saturday</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.hours?.saturday || ''}
                                                    onChange={e => setSettingsForm({ ...settingsForm, hours: { ...settingsForm.hours, saturday: e.target.value } })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white"
                                                    placeholder="e.g. 9:00 AM - 6:00 PM"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Sunday</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.hours?.sunday || ''}
                                                    onChange={e => setSettingsForm({ ...settingsForm, hours: { ...settingsForm.hours, sunday: e.target.value } })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white"
                                                    placeholder="e.g. Closed"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Display Summary</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.hours?.display || ''}
                                                    onChange={e => setSettingsForm({ ...settingsForm, hours: { ...settingsForm.hours, display: e.target.value } })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white"
                                                    placeholder="Short summary for home page"
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Social Media */}
                                    <section>
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <div className="w-1 h-6 bg-blue-500 rounded-full"></div> Social Media
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {['facebook', 'twitter', 'instagram', 'linkedin'].map(platform => (
                                                <div key={platform}>
                                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">{platform}</label>
                                                    <input
                                                        type="text"
                                                        value={settingsForm.socials?.[platform] || ''}
                                                        onChange={e => setSettingsForm({
                                                            ...settingsForm,
                                                            socials: { ...settingsForm.socials, [platform]: e.target.value }
                                                        })}
                                                        className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white"
                                                        placeholder={`https://${platform}.com/...`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Branding */}
                                    <section>
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <div className="w-1 h-6 bg-purple-500 rounded-full"></div> Branding
                                        </h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Name Prefix</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.branding.namePrefix}
                                                    onChange={e => setSettingsForm({ ...settingsForm, branding: { ...settingsForm.branding, namePrefix: e.target.value } })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Name Highlight</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.branding.nameHighlight}
                                                    onChange={e => setSettingsForm({ ...settingsForm, branding: { ...settingsForm.branding, nameHighlight: e.target.value } })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Sub Details / Tag</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.branding.subDetails}
                                                    onChange={e => setSettingsForm({ ...settingsForm, branding: { ...settingsForm.branding, subDetails: e.target.value } })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white"
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Location */}
                                    <section>
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <div className="w-1 h-6 bg-orange-500 rounded-full"></div> Location
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Street Address</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.address.street}
                                                    onChange={e => setSettingsForm({ ...settingsForm, address: { ...settingsForm.address, street: e.target.value } })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">City</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.address.city}
                                                    onChange={e => setSettingsForm({ ...settingsForm, address: { ...settingsForm.address, city: e.target.value } })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">State</label>
                                                    <input
                                                        type="text"
                                                        value={settingsForm.address.state}
                                                        onChange={e => setSettingsForm({ ...settingsForm, address: { ...settingsForm.address, state: e.target.value } })}
                                                        className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">ZIP</label>
                                                    <input
                                                        type="text"
                                                        value={settingsForm.address.zip}
                                                        onChange={e => setSettingsForm({ ...settingsForm, address: { ...settingsForm.address, zip: e.target.value } })}
                                                        className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="text-xs font-bold text-slate-400 uppercase">Google Maps Link</label>
                                                    <button
                                                        onClick={() => {
                                                            const addr = settingsForm.address;
                                                            const fullAddr = `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`;
                                                            const encoded = encodeURIComponent(fullAddr);
                                                            setSettingsForm({
                                                                ...settingsForm,
                                                                mapLink: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
                                                                googleMapEmbed: `https://maps.google.com/maps?q=${encoded}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                                                            });
                                                        }}
                                                        className="text-[10px] font-bold text-blue-500 hover:underline uppercase"
                                                    >
                                                        Auto-Generate from Address
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={settingsForm.mapLink}
                                                    onChange={e => setSettingsForm({ ...settingsForm, mapLink: e.target.value })}
                                                    className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white"
                                                />
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    showSqlModal && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="bg-[#1E293B] rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative border border-slate-700/50">
                                <button onClick={() => setShowSqlModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24} /></button>
                                <h3 className="text-xl font-bold text-white mb-4">Database Setup</h3>
                                <p className="text-slate-400 mb-4">Run this SQL in your Supabase SQL Editor to create the necessary tables.</p>

                                <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto mb-6 relative group">
                                    <pre className="text-emerald-400 font-mono text-sm leading-relaxed">
                                        {`-- 1. Device Models
create table if not exists device_models (
  id uuid default gen_random_uuid() primary key,
  category text,
  brand text,
  model text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table device_models enable row level security;
drop policy if exists "Public Read" on device_models;
create policy "Public Read" on device_models for select using (true);
drop policy if exists "Admin Write" on device_models;
create policy "Admin Write" on device_models for all to authenticated using (true);

-- 2. Service Menu Items
create table if not exists service_menu_items (
  id uuid default gen_random_uuid() primary key,
  label text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table service_menu_items enable row level security;
drop policy if exists "Public Read" on service_menu_items;
create policy "Public Read" on service_menu_items for select using (true);
drop policy if exists "Admin Write" on service_menu_items;
create policy "Admin Write" on service_menu_items for all to authenticated using (true);

-- 3. Site Settings (REQUIRED FOR SHOP STATUS)
create table if not exists site_settings (
  key text primary key,
  value jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table site_settings enable row level security;
drop policy if exists "Public Read" on site_settings;
create policy "Public Read" on site_settings for select using (true);
drop policy if exists "Admin Write" on site_settings;
create policy "Admin Write" on site_settings for all to authenticated using (true);

-- 4. Device Inventory (Shop)
create table if not exists device_inventory (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  brand text default 'Apple',
  model text,
  price numeric default 0,
  condition text default 'Refurbished',
  storage text,
  color text,
  status text default 'Available',
  image_url text,
  description text,
  category text default 'Phones',
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table device_inventory enable row level security;
drop policy if exists "Public Read" on device_inventory;
create policy "Public Read" on device_inventory for select using (true);
drop policy if exists "Admin Write" on device_inventory;
create policy "Admin Write" on device_inventory for all to authenticated using (true);

-- 5. Storage (Images)
insert into storage.buckets (id, name, public) 
values ('images', 'images', true) 
on conflict (id) do nothing;

create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'images' );

create policy "Auth Upload" 
on storage.objects for insert 
with check ( bucket_id = 'images' and auth.role() = 'authenticated' );` }
                                    </pre>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`-- 1. Device Models
create table if not exists device_models (
  id uuid default gen_random_uuid() primary key,
  category text,
  brand text,
  model text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table device_models enable row level security;
drop policy if exists "Public Read" on device_models;
create policy "Public Read" on device_models for select using (true);
drop policy if exists "Admin Write" on device_models;
create policy "Admin Write" on device_models for all to authenticated using (true);

-- 2. Service Menu Items
create table if not exists service_menu_items (
  id uuid default gen_random_uuid() primary key,
  label text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table service_menu_items enable row level security;
drop policy if exists "Public Read" on service_menu_items;
create policy "Public Read" on service_menu_items for select using (true);
drop policy if exists "Admin Write" on service_menu_items;
create policy "Admin Write" on service_menu_items for all to authenticated using (true);

-- 3. Site Settings (REQUIRED FOR SHOP STATUS)
create table if not exists site_settings (
  key text primary key,
  value jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table site_settings enable row level security;
drop policy if exists "Public Read" on site_settings;
create policy "Public Read" on site_settings for select using (true);
drop policy if exists "Admin Write" on site_settings;
create policy "Admin Write" on site_settings for all to authenticated using (true);
-- 4. Device Inventory (Shop)
create table if not exists device_inventory (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  brand text default 'Apple',
  model text,
  price numeric default 0,
  condition text default 'Refurbished',
  storage text,
  color text,
  status text default 'Available',
  image_url text,
  description text,
  category text default 'Phones',
  quantity integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
-- Ensure quantity column exists
do $$ 
begin 
    if not exists (select 1 from information_schema.columns where table_name = 'device_inventory' and column_name = 'quantity') then 
        alter table device_inventory add column quantity integer default 1; 
    end if; 
end $$;
alter table device_inventory enable row level security;
drop policy if exists "Public Read" on device_inventory;
create policy "Public Read" on device_inventory for select using (true);
drop policy if exists "Admin Write" on device_inventory;
create policy "Admin Write" on device_inventory for all to authenticated using (true);

-- 5. Storage (Images)
insert into storage.buckets (id, name, public) 
values ('images', 'images', true) 
on conflict (id) do nothing;

create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'images' );

create policy "Auth Upload" 
on storage.objects for insert 
with check ( bucket_id = 'images' and auth.role() = 'authenticated' );`);
                                            alert("Copied to clipboard!");
                                        }}
                                        className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Copy SQL
                                    </button>
                                </div>

                                <div className="flex justify-end">
                                    <button onClick={() => setShowSqlModal(false)} className="px-6 py-2 bg-[#0F172A] border border-slate-700/50 text-slate-400 font-bold rounded-lg hover:text-white hover:border-slate-500">Close</button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </main >

            {/* Inventory Edit Modal */}
            {
                editingProduct && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-[#1E293B] rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">{editingProduct.id ? 'Edit Device' : 'Add New Device'}</h3>
                                <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white"><X size={24} /></button>
                            </div>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const product = Object.fromEntries(formData.entries());
                                try {
                                    if (editingProduct.id) {
                                        const { error } = await supabase.from('device_inventory').update(product).eq('id', editingProduct.id);
                                        if (error) throw error;
                                    } else {
                                        const { error } = await supabase.from('device_inventory').insert([product]);
                                        if (error) throw error;
                                    }
                                    fetchData();
                                    setEditingProduct(null);
                                } catch (err) {
                                    if (err.message.includes('relation "public.device_inventory" does not exist') || err.code === '42P01') {
                                        alert("Table Missing! please run the database setup SQL in the settings tab.");
                                        setShowSqlModal(true);
                                    } else {
                                        alert('Error saving product: ' + err.message);
                                    }
                                }
                            }} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Title (e.g. iPhone 13 Pro)</label>
                                    <input name="title" required defaultValue={editingProduct.title} className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Brand</label>
                                        <select name="brand" defaultValue={editingProduct.brand || ''} className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white">
                                            <option value="" disabled>Select Brand</option>
                                            {[...new Set(models.map(m => m.brand))].sort().map(brand => (
                                                <option key={brand} value={brand}>{brand}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                                        <select name="category" defaultValue={editingProduct.category || ''} className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white">
                                            <option value="" disabled>Select Category</option>
                                            {[...new Set(models.map(m => m.category))].sort().map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Price ($)</label>
                                        <input name="price" type="number" step="0.01" required defaultValue={editingProduct.price} className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Quantity</label>
                                        <input name="quantity" type="number" min="0" required defaultValue={editingProduct.quantity || 1} className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Condition</label>
                                        <select name="condition" defaultValue={editingProduct.condition || 'Refurbished'} className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white">
                                            <option value="New">New</option>
                                            <option value="Refurbished">Refurbished</option>
                                            <option value="Used">Used</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Storage</label>
                                        <input name="storage" defaultValue={editingProduct.storage} placeholder="e.g. 128GB" className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Color</label>
                                        <input name="color" defaultValue={editingProduct.color} placeholder="e.g. Midnight" className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Device Image</label>
                                    <div className="space-y-3">
                                        {editingProduct.image_url && (
                                            <div className="relative w-full h-32 bg-[#0F172A] rounded-xl overflow-hidden border border-slate-700/50 group">
                                                <img src={editingProduct.image_url} alt="Preview" className="w-full h-full object-contain mix-blend-multiply" />
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingProduct(prev => ({ ...prev, image_url: '' }))}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3">
                                            <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-700/50 cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition-all group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                    disabled={uploading}
                                                />
                                                {uploading ? (
                                                    <Loader size={18} className="animate-spin text-blue-500" />
                                                ) : (
                                                    <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                )}
                                                <span className="text-sm font-bold text-slate-400 group-hover:text-blue-400 transition-colors">
                                                    {uploading ? 'Uploading...' : 'Upload New Image'}
                                                </span>
                                            </label>
                                            <input
                                                name="image_url"
                                                value={editingProduct.image_url || ''}
                                                onChange={(e) => setEditingProduct(prev => ({ ...prev, image_url: e.target.value }))}
                                                placeholder="Or paste URL..."
                                                className="flex-1 p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status</label>
                                    <select name="status" defaultValue={editingProduct.status || 'Available'} className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white">
                                        <option value="Available">Available</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                                    <textarea name="description" rows="3" defaultValue={editingProduct.description} className="w-full p-3 bg-[#0F172A] border border-slate-700/50 rounded-xl font-bold text-white"></textarea>
                                </div>
                                <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-blue-200 transition-all">
                                    {editingProduct.id ? 'Save Changes' : 'Add Device'}
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Delete Confirmation Modal */}
            {/* Delete Confirmation Popover */}
            {
                deleteConfirm.show && deleteConfirm.position && (
                    <>
                        {/* Transparent backdrop to close on click outside */}
                        <div
                            className="fixed inset-0 z-[90] bg-transparent"
                            onClick={() => setDeleteConfirm({ ...deleteConfirm, show: false })}
                        ></div>

                        <div
                            className="absolute z-[100] bg-[#1E293B] rounded-2xl shadow-2xl p-6 w-80 border border-slate-700/50 animate-in fade-in zoom-in-95 duration-200"
                            style={{
                                top: deleteConfirm.position.top,
                                right: deleteConfirm.position.right
                            }}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-3">
                                    <AlertTriangle size={24} />
                                </div>
                                <h3 className="text-lg font-black text-white mb-1">Confirm Delete</h3>
                                <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                                    Permanently remove this item?
                                </p>
                                <div className="flex gap-2 w-full">
                                    <button
                                        onClick={() => setDeleteConfirm({ ...deleteConfirm, show: false })}
                                        className="flex-1 py-2 text-slate-400 font-bold hover:bg-slate-800 rounded-lg transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 shadow-md shadow-red-500/20 transition-colors text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            {/* Little arrow pointing to the right (towards the button) */}
                            <div className="absolute top-8 -right-2 w-4 h-4 bg-[#1E293B] rotate-45 border-t border-r border-slate-700/50"></div>
                        </div>
                    </>
                )
            }
        </div >
    );
}

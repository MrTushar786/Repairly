
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Clock, CheckCircle, AlertCircle, LogOut, Wrench, User, Save, Camera, Loader2 } from 'lucide-react';

export default function ClientDashboard() {
    const [user, setUser] = useState(null);
    const [myRepairs, setMyRepairs] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('repairs'); // 'repairs' | 'profile'
    const navigate = useNavigate();

    // Profile State
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const getSession = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
            } else {
                setUser(user);
                // Initialize form data from user metadata
                setFullName(user.user_metadata?.full_name || '');
                setPhone(user.user_metadata?.phone || '');
                setAvatarUrl(user.user_metadata?.custom_avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || '');

                fetchRepairs(user.email);
            }

            // Fetch Services for lookup
            const { data: serviceData } = await supabase.from('repair_services').select('id, label');
            if (serviceData) setServices(serviceData);

            setLoading(false);
        };
        getSession();
    }, [navigate]);

    const fetchRepairs = async (email) => {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('customer_email', email)
            .order('created_at', { ascending: false });

        if (data) setMyRepairs(data);
    };

    // Handle Profile Picture Upload
    const handleAvatarUpload = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // 2. Get Public URL
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            // 3. Update User Metadata
            const { error: updateError } = await supabase.auth.updateUser({
                data: { custom_avatar_url: publicUrl }
            });

            if (updateError) throw updateError;

            setAvatarUrl(publicUrl);
            alert('Profile picture updated!');

        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Error uploading image. Make sure you have an "avatars" bucket created in Supabase with public access.');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: fullName, phone: phone }
            });
            if (error) throw error;
            alert('Profile details updated successfully!');
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-300">Loading your profile...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 pt-24 md:pt-32">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-secondary mb-1">My Account</h1>
                        <p className="text-slate-500 font-medium">Manage your repairs and profile settings.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex flex-1 md:flex-none">
                            <button
                                onClick={() => setActiveTab('repairs')}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'repairs' ? 'bg-secondary text-white shadow-md' : 'text-slate-500 hover:text-secondary'}`}
                            >
                                My Repairs
                            </button>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-secondary text-white shadow-md' : 'text-slate-500 hover:text-secondary'}`}
                            >
                                Edit Profile
                            </button>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="bg-white p-3.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm group"
                            title="Sign Out"
                        >
                            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div>

                    {/* REPAIRS TAB */}
                    {activeTab === 'repairs' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white rounded-3xl p-8 shadow-card border border-slate-100 relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-blue-50 text-primary rounded-xl">
                                            <Wrench size={24} />
                                        </div>
                                        <h2 className="text-lg font-bold text-secondary">Service History</h2>
                                    </div>

                                    {myRepairs.length === 0 ? (
                                        <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                                            <p className="text-slate-400 font-bold mb-4">No repairs found linked to this email.</p>
                                            <button onClick={() => navigate('/booking')} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all">
                                                Book a Repair
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {myRepairs.map(repair => (
                                                <div key={repair.id} className="group bg-slate-50 hover:bg-white p-6 rounded-2xl border border-transparent hover:border-slate-100 hover:shadow-lg transition-all duration-300">
                                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${repair.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                                {repair.status === 'Completed' ? <CheckCircle size={20} /> : <Wrench size={20} />}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-secondary text-lg">{repair.device_brand} {repair.device_model}</h4>
                                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                                    <span className="font-mono text-xs">#{repair.id}</span>
                                                                    <span>•</span>
                                                                    <span>{services.find(s => s.id === repair.service_type)?.label || repair.service_type}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-6">
                                                            <div className="text-right">
                                                                {repair.estimated_cost && (
                                                                    <div className="text-lg font-black text-slate-800 mb-1">{repair.estimated_cost}</div>
                                                                )}
                                                                <div className={`text-sm font-bold uppercase tracking-wider mb-1 ${repair.status === 'Completed' ? 'text-green-600' : 'text-blue-600'}`}>
                                                                    {repair.status || 'Received'}
                                                                </div>
                                                                <div className="text-xs text-slate-400 font-medium flex items-center justify-end gap-1">
                                                                    <Clock size={12} /> {new Date(repair.created_at).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 h-1 bg-slate-200 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${repair.status === 'Completed' ? 'bg-green-500 w-full' : 'bg-blue-500 w-1/3 animate-pulse'}`}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Promo */}
                            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden">
                                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Need Help with Another Device?</h3>
                                        <p className="text-slate-400 text-sm">We offer 10% off for returning customers.</p>
                                    </div>
                                    <button onClick={() => navigate('/booking')} className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap">
                                        Start New Booking
                                    </button>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            </div>
                        </div>
                    )}

                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white rounded-3xl p-8 shadow-card border border-slate-100">

                                {/* Avatar Section */}
                                <div className="flex flex-col items-center mb-8">
                                    <div className="relative group cursor-pointer">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-lg" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-4 border-slate-50 shadow-lg">
                                                <User size={40} />
                                            </div>
                                        )}

                                        {/* Hover Overlay for Upload */}
                                        <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                            {uploading ? <Loader2 size={24} className="text-white animate-spin" /> : <Camera size={24} className="text-white" />}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-slate-400 font-bold mt-3 uppercase tracking-wider">Change Photo</p>
                                </div>

                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                        <User size={24} />
                                    </div>
                                    <h2 className="text-lg font-bold text-secondary">Personal Information</h2>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Full Name</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-bold text-secondary transition-all"
                                            placeholder="Your Name"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-bold text-secondary transition-all"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>

                                    <div className="opacity-60">
                                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Email Address (Read Only)</label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            readOnly
                                            className="w-full h-14 px-4 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed"
                                        />
                                        <p className="text-[10px] text-slate-400 mt-2 px-1">To change your email, please contact support.</p>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="w-full h-14 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:-translate-y-1"
                                        >
                                            {saving ? 'Saving...' : <> <Save size={18} /> Save Changes </>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

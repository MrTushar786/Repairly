
import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Smartphone, Check, ArrowLeft, Laptop, Tablet, Gamepad2, Wrench, Battery, Droplets, Usb, Disc, Cpu, Wifi, Camera, Speaker, User } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { toast } from 'sonner';

const ICON_MAP = {
    Smartphone, Battery, Droplets, Usb, Disc, Wrench, Cpu, Wifi, Camera, Speaker
};

export default function BookingWidget() {
    const location = useLocation();
    const navigate = useNavigate();
    const { type: initialType, model: initialModel } = location.state || {};

    const [step, setStep] = useState(1);
    const [user, setUser] = useState(null); // Auth user

    const { deviceModels } = useShop();

    // Dynamic Services
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);

    // State
    const [repairType, setRepairType] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get Auth User & Pre-fill & Fetch Services & Models
    useEffect(() => {
        const init = async () => {
            // 1. Check User
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setName(user.user_metadata?.full_name || user.user_metadata?.name || '');
                setEmail(user.email || '');
                setPhone(user.user_metadata?.phone || user.phone || '');
            }

            // 2. Fetch Services
            const { data: serviceData } = await supabase.from('repair_services').select('*').order('created_at', { ascending: true });
            if (serviceData) {
                setServices(serviceData);
            }
            setLoadingServices(false);


        };
        init();
    }, []);

    // Pre-fill if coming from Home
    useEffect(() => {
        if (initialModel) {
            // Reverse lookup model to find Category and Brand
            for (const [cat, brands] of Object.entries(deviceModels)) {
                for (const [brand, models] of Object.entries(brands)) {
                    if (models.includes(initialModel)) {
                        setSelectedCategory(cat);
                        setSelectedBrand(brand);
                        setSelectedModel(initialModel);
                        setStep(2); // Auto-jump to Device step
                        return;
                    }
                }
            }
        }
    }, [initialModel, deviceModels]);

    const steps = [
        { num: 1, label: 'Service' },
        { num: 2, label: 'Device' },
        { num: 3, label: 'Login' }, // Renamed from Contact
        { num: 4, label: 'Slot' },
        { num: 5, label: 'Done' }
    ];

    // Helper to Handle "Next Step" from Device Selection
    const handleDeviceNext = () => {
        if (user) {
            // If logged in, skip Contact step (Step 3) and go to Time (Step 4)
            setStep(4);
        } else {
            // Force Login
            navigate('/login');
        }
    };

    return (
        <div className="w-full bg-white border border-primary-light/50 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-card">
            {/* Decorative Mint Blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-light rounded-full blur-2xl opacity-50 pointer-events-none"></div>

            {/* Header */}
            <div className="mb-6 relative z-10">
                <h3 className="text-secondary text-xl font-bold">Book a Repair</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-text-muted mt-1">
                    <span className={step >= 1 ? 'text-primary' : ''}>Service</span>
                    <ChevronRight size={12} />
                    <span className={step >= 2 ? 'text-primary' : ''}>Device</span>
                    <ChevronRight size={12} />

                    {/* Conditionally render 'Contact' only if user is NOT logged in or we are currently ON that step (step 3) */}
                    {(!user || step === 3) && (
                        <>
                            <span className={step >= 3 ? 'text-primary' : ''}>Contact</span>
                            <ChevronRight size={12} />
                        </>
                    )}

                    <span className={step >= 4 ? 'text-primary' : ''}>Time</span>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mt-4">
                    {[1, 2, 3, 4, 5].map((s) => {
                        // Skip rendering dot 3 if user is logged in, effectively hiding it from progress?
                        // Better to just visually indicate progress.
                        // Simple approach: Render all, but logic jumps over 3.
                        return (
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= s ? 'bg-primary' : 'bg-gray-200'}`} />
                        )
                    })}
                </div>
            </div>

            {/* Steps Content */}
            <div className="min-h-[350px] flex flex-col relative z-10">

                {/* Step 1: Select Service */}
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">What needs fixing?</span>

                        {loadingServices ? (
                            <div className="flex justify-center items-center py-12 text-slate-400">Loading Services...</div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {services.map(r => {
                                    const IconComponent = ICON_MAP[r.icon_key] || Wrench;
                                    return (
                                        <button
                                            key={r.id}
                                            onClick={() => setRepairType(r.id)} // Using UUID main ID
                                            className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all duration-200 group
                                                ${repairType === r.id ? 'border-primary bg-primary-light/30 ring-1 ring-primary' : 'border-slate-100 bg-bg-input hover:border-primary/50'}
                                            `}
                                        >
                                            <div className="mb-1">
                                                {r.image_url ? (
                                                    <div className="w-8 h-8 rounded-lg overflow-hidden">
                                                        <img src={r.image_url} alt={r.label} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <IconComponent size={24} className={repairType === r.id ? 'text-primary' : 'text-slate-400'} />
                                                )}
                                            </div>
                                            <div>
                                                <span className="font-bold text-secondary block text-sm">{r.label}</span>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-xs text-text-muted undo-bold">{r.price}</span>
                                                    {r.duration && <span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded">{r.duration}</span>}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {services.length === 0 && !loadingServices && (
                            <div className="text-center text-sm text-red-400 py-4">
                                No services available. Please check back later.
                            </div>
                        )}

                        <div className="pt-4 mt-auto">
                            <button
                                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all flex items-center justify-between px-6 group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                                disabled={!repairType}
                                onClick={() => setStep(2)}
                            >
                                Continue <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Select Device */}
                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">Identify Device</span>

                        {/* Category Selector */}
                        <div>
                            <label className="text-xs font-bold text-slate-400 mb-2 block">Category</label>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {Object.keys(deviceModels).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => { setSelectedCategory(cat); setSelectedBrand(''); setSelectedModel(''); }}
                                        className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs font-bold transition-all 
                                            ${selectedCategory === cat ? 'bg-secondary text-white border-secondary' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-primary'}
                                        `}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Brand Selector */}
                        {selectedCategory && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <label className="text-xs font-bold text-slate-400 mb-2 block">Brand</label>
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {Object.keys(deviceModels[selectedCategory]).map(brand => (
                                        <button
                                            key={brand}
                                            onClick={() => { setSelectedBrand(brand); setSelectedModel(''); }}
                                            className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs font-bold transition-all 
                                                ${selectedBrand === brand ? 'bg-primary text-white border-primary' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-primary'}
                                            `}
                                        >
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Model Dropdown */}
                        <div>
                            <label className="text-xs font-bold text-slate-400 mb-2 block">Model</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold focus:outline-none focus:border-primary disabled:opacity-50"
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    disabled={!selectedBrand}
                                >
                                    <option value="">{selectedBrand ? 'Select Model...' : 'Select Brand First'}</option>
                                    {selectedCategory && selectedBrand && deviceModels[selectedCategory] && deviceModels[selectedCategory][selectedBrand] && deviceModels[selectedCategory][selectedBrand].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={16} />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-6 mt-auto">
                            <button onClick={() => setStep(1)} className="p-3 text-text-muted hover:text-text-main hover:bg-gray-100 rounded-lg">
                                <ArrowLeft size={20} />
                            </button>
                            <button
                                className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg disabled:opacity-50"
                                disabled={!selectedBrand || !selectedModel}
                                onClick={handleDeviceNext}
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                )}


                {/* Step 3: Login Required (Fallback) */}
                {step === 3 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <User size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Login Required</h3>
                        <p className="text-slate-500 mb-6 max-w-xs">You must be logged in to book a repair.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                        >
                            Go to Login
                        </button>
                    </div>
                )}

                {/* Step 4: Date & Time */}
                {step === 4 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">Choose Slot</span>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-main">Date</label>
                            <input
                                type="date"
                                className="w-full p-3 rounded-xl border border-slate-200 bg-bg-input focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        {date && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-main">Time</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '05:30 PM'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTime(t)}
                                            className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors
                                  ${time === t
                                                    ? 'bg-secondary text-white border-secondary shadow-md'
                                                    : 'bg-white border-slate-200 text-text-muted hover:border-primary'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-6 mt-auto">
                            {/* If user is logged in, Back should go to Step 2 (Device), Skip Step 3 */}
                            <button onClick={() => setStep(user ? 2 : 3)} className="p-3 text-text-muted hover:text-text-main hover:bg-gray-100 rounded-lg">
                                <ArrowLeft size={20} />
                            </button>
                            <button
                                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                disabled={!date || !time || isSubmitting}
                                onClick={async () => {
                                    setIsSubmitting(true);
                                    try {
                                        // Save to Supabase
                                        const { error } = await supabase
                                            .from('bookings')
                                            .insert([{
                                                service_type: repairType,
                                                device_category: selectedCategory,
                                                device_brand: selectedBrand,
                                                device_model: selectedModel,
                                                appointment_date: date,
                                                appointment_time: time,
                                                customer_name: name,
                                                customer_email: email,
                                                created_at: new Date()
                                            }]);

                                        if (error) {
                                            console.error('Booking Error:', error);
                                            toast.error(`Booking Failed: ${error.message}`);
                                        } else {
                                            setStep(5);
                                        }
                                    } catch (err) {
                                        console.error('Unexpected Error:', err);
                                        setStep(5);
                                    } finally {
                                        setIsSubmitting(false);
                                    }
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : 'Confirm Booking'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Success */}
                {step === 5 && (
                    <div className="flex flex-col items-center justify-center text-center py-8 animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-primary-light text-primary rounded-full flex items-center justify-center mb-6 shadow-float">
                            <Check size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary mb-2">Booking Confirmed!</h3>
                        <p className="text-text-muted mx-auto mb-8 leading-relaxed text-sm">
                            Thanks, <strong>{name.split(' ')[0]}</strong>! We've received your request.<br /><br />
                            Task: <strong>{services.find(r => r.id === repairType)?.label}</strong><br />
                            Device: <strong>{selectedBrand} {selectedModel}</strong><br />
                            Date: <strong>{date} @ {time}</strong>
                        </p>

                        <button
                            className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg"
                            onClick={() => { setStep(1); setRepairType(''); setDate(''); setTime(''); setSelectedBrand(''); setSelectedModel(''); if (!user) { setName(''); setPhone(''); setEmail(''); } }}
                        >
                            Book Another Device
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

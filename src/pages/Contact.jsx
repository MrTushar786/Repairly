import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Clock, Send, ChevronDown, ChevronUp, HelpCircle, User } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Contact() {
    const { shopData } = useShop();
    const [formState, setFormState] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
    const [openFaq, setOpenFaq] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `Contact Us | ${shopData.name}`;

        // Check Auth
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser(user);
                setFormState(prev => ({
                    ...prev,
                    email: user.email,
                    name: user.user_metadata?.full_name || ''
                }));
            }
        });
    }, [shopData.name]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('support_tickets')
                .insert([{
                    name: formState.name,
                    email: formState.email,
                    subject: formState.subject || 'General Inquiry',
                    message: formState.message
                }]);

            if (error) throw error;

            alert('Support ticket created! We will respond shortly.');
            setFormState({ name: user?.user_metadata?.full_name || '', email: user?.email || '', subject: 'General Inquiry', message: '' });
        } catch (error) {
            console.error('Error submitting ticket:', error.message, error.details);
            alert(`Failed to submit ticket: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const faqs = [
        { q: "Do I need an appointment?", a: "Walk-ins are always welcome! However, booking an appointment online guarantees your spot and reduces wait time." },
        { q: "How long do repairs take?", a: "Most standard repairs (screens, batteries) are completed within 45 minutes. Complex board repairs may take 24-48 hours." },
        { q: "Is there a warranty?", a: "Yes! We offer a solid 1-year warranty on all parts and labor for screen and battery replacements." },
        { q: "Will I lose my data?", a: "In 99% of cases, your data is safe. However, we always recommend backing up your device before any repair service." },
    ];

    return (
        <div className="pt-24 pb-20 lg:pt-32 bg-white min-h-screen overflow-hidden">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Hero Section */}
                <div className="text-center mb-12 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-100 rounded-full blur-3xl opacity-30 -z-10"></div>
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">24/7 Support</span>
                    <h1 className="text-4xl md:text-5xl font-black text-secondary mb-6 tracking-tight">
                        We're Here to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Help</span>.
                    </h1>
                    <p className="text-text-muted text-xl max-w-2xl mx-auto leading-relaxed">
                        Got a broken device or a burning question? Reach out to our team of experts.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">

                    {/* Left Column: Contact Info & Map */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Info Cards */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors group">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-secondary text-lg">Call Support</h3>
                                        <p className="text-text-muted text-sm mb-1">M-F 8am - 8pm EST</p>
                                        <a href={`tel:${shopData.phone}`} className="text-primary font-bold text-lg hover:underline">{shopData.displayPhone}</a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors group">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-secondary text-lg">Email Us</h3>
                                        <p className="text-text-muted text-sm mb-1">Response within 2 hours</p>
                                        <a href={`mailto:${shopData.email}`} className="text-primary font-bold hover:underline">{shopData.email}</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mini Map Card */}
                        <div className="bg-slate-900 p-1 rounded-2xl shadow-xl overflow-hidden relative group">
                            <div className="absolute inset-0 bg-slate-800 opacity-50 z-0"></div>
                            <div className="relative z-10 bg-white/5 backdrop-blur-sm p-6 rounded-xl h-full flex flex-col justify-between min-h-[220px]">
                                <div>
                                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                        <MapPin className="text-primary" size={20} /> {shopData.name}
                                    </h3>
                                    <p className="text-slate-400 text-sm mt-1">{shopData.address.street}<br />{shopData.address.city}, {shopData.address.state} {shopData.address.zip}</p>
                                </div>
                                <iframe
                                    className="w-full h-24 rounded-lg mt-4 opacity-80 hover:opacity-100 transition-opacity"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    src={shopData.googleMapEmbed}
                                ></iframe>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="pt-8">
                            <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
                                <HelpCircle size={20} className="text-primary" /> Common Questions
                            </h3>
                            <div className="space-y-3">
                                {faqs.map((item, i) => (
                                    <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="font-bold text-secondary text-sm">{item.q}</span>
                                            {openFaq === i ? <ChevronUp size={16} className="text-primary" /> : <ChevronDown size={16} className="text-slate-400" />}
                                        </button>
                                        {openFaq === i && (
                                            <div className="p-4 pt-0 bg-white text-sm text-text-muted leading-relaxed border-t border-slate-100">
                                                {item.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Main Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-3xl shadow-2xl shadow-primary/5 border border-slate-100 p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-10 -mt-10"></div>

                            {!user ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center relative z-10">
                                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                        <User size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">Login Required</h3>
                                    <p className="text-slate-500 mb-6 max-w-xs">Please sign in to send us a message or support ticket.</p>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                                    >
                                        Sign In Now
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-secondary mb-2 relative z-10">Send a Message</h2>
                                    <p className="text-text-muted mb-8 relative z-10">Fill out the form below and we'll get back to you asap.</p>

                                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Your Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                                                    placeholder="John Doe"
                                                    value={formState.name}
                                                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Email Address</label>
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                                                    placeholder="john@example.com"
                                                    value={formState.email}
                                                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-secondary uppercase tracking-wider">Subject</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium appearance-none cursor-pointer"
                                                    value={formState.subject}
                                                    onChange={e => setFormState({ ...formState, subject: e.target.value })}
                                                >
                                                    <option>General Inquiry</option>
                                                    <option>Repair Status</option>
                                                    <option>Warranty Claim</option>
                                                    <option>Business Partnership</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-secondary uppercase tracking-wider">Message</label>
                                            <textarea
                                                required
                                                rows="6"
                                                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium resize-none"
                                                placeholder="Tell us about your device issue..."
                                                value={formState.message}
                                                onChange={e => setFormState({ ...formState, message: e.target.value })}
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={20} /> SEND MESSAGE
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Footer() {
    const navigate = useNavigate();
    const { shopData } = useShop();
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        navigate('/contact', { state: { email } });
    };

    return (
        <footer className="bg-secondary text-white pt-16 pb-24 border-t border-slate-800">
            <div className="container mx-auto px-4">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="inline-block">
                            <span className="text-2xl font-black text-white tracking-tighter uppercase">
                                {shopData.branding.namePrefix} <span className="text-primary">{shopData.branding.nameHighlight}</span>
                            </span>
                            <span className="block text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">{shopData.branding.subDetails}</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {shopData.tagline} Authorized partners with major manufacturers. We save devices and the planet.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, link: shopData.socials.facebook },
                                { Icon: Twitter, link: shopData.socials.twitter },
                                { Icon: Instagram, link: shopData.socials.instagram },
                                { Icon: Linkedin, link: shopData.socials.linkedin }
                            ].map(({ Icon, link }, i) => (
                                <a key={i} href={link} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors text-white">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
                            <li><Link to="/track" className="hover:text-primary transition-colors">Track Repair</Link></li>
                            <li><Link to="/booking" className="hover:text-primary transition-colors">Book Now</Link></li>
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Services</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link to="/services" className="hover:text-primary transition-colors">iPhone Repair</Link></li>
                            <li><Link to="/services" className="hover:text-primary transition-colors">Samsung Galaxy Repair</Link></li>
                            <li><Link to="/services" className="hover:text-primary transition-colors">MacBook Recovery</Link></li>
                            <li><Link to="/services" className="hover:text-primary transition-colors">Console Fixes</Link></li>
                            <li><Link to="/services" className="hover:text-primary transition-colors">Data Recovery</Link></li>
                        </ul>
                    </div>

                    {/* Contact / Newsletter */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Stay Connected</h4>
                        <div className="space-y-4 mb-6">
                            <div className="flex items-start gap-3 text-sm text-slate-400">
                                <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                                <span>{shopData.address.street}, {shopData.address.city}, {shopData.address.state}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <Phone size={18} className="text-primary shrink-0" />
                                <span>{shopData.displayPhone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <Mail size={18} className="text-primary shrink-0" />
                                <a href={`mailto:${shopData.email}`} className="hover:text-white transition-colors">{shopData.email}</a>
                            </div>
                        </div>

                        <h5 className="font-bold text-sm mb-3">Subscribe to our newsletter</h5>
                        <form onSubmit={handleSubscribe} className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-slate-800 border-none rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary w-full outline-none"
                            />
                            <button type="submit" className="bg-primary text-white px-3 py-2 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors">
                                GO
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
                    <p>&copy; {new Date().getFullYear()} {shopData.name}. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Sitemap</a>
                    </div>
                </div>

            </div>
        </footer>
    );
}

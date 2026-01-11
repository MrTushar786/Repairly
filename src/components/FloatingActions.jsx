import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useLocation } from 'react-router-dom';

export default function FloatingActions() {
    const { shopData } = useShop();
    const location = useLocation();

    // Only show on contact page
    const isContactPage = location.pathname === '/contact';

    if (!isContactPage) return null;

    return (
        <div className="fixed bottom-28 lg:bottom-8 right-4 lg:right-8 flex flex-col gap-3 z-40 animate-in fade-in slide-in-from-bottom-4">
            {/* WhatsApp */}
            <a
                href={`https://wa.me/${shopData.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 lg:w-14 lg:h-14 bg-[#25D366] text-white rounded-full shadow-lg shadow-green-500/20 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                title="Chat on WhatsApp"
            >
                <div className="relative">
                    <MessageCircle size={24} className="fill-current" />
                </div>
            </a>

            {/* Phone Call */}
            <a
                href={`tel:${shopData.phone}`}
                className="w-12 h-12 lg:w-14 lg:h-14 bg-primary text-white rounded-full shadow-lg shadow-orange-500/20 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                title="Call Now"
            >
                <Phone size={24} className="fill-current" />
            </a>

            {/* Labels (Optional, keeping minimal as per previous redesign) */}
            <div className="absolute right-16 top-0 flex-col items-end gap-5 hidden lg:flex pointer-events-none">
                <span className="h-14 flex items-center font-bold text-slate-700 bg-white/80 px-3 rounded-lg backdrop-blur shadow-sm">Chat</span>
                <span className="h-14 flex items-center font-bold text-slate-700 bg-white/80 px-3 rounded-lg backdrop-blur shadow-sm">Call</span>
            </div>
            {/* Note: Labels hidden here to match "Design Redesign" from summary which removed large container. Keeping buttons only for clean look. */}
        </div>
    );
}

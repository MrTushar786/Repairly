import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { SHOP_DATA } from '../data';
import { useLocation } from 'react-router-dom';

export default function FloatingActions() {
    const location = useLocation();

    // Only show on Contact page
    if (location.pathname !== '/contact') return null;

    return (
        <div className="fixed bottom-28 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-3 animate-in fade-in slide-in-from-bottom-4 items-center">
            <a
                href={`https://wa.me/${SHOP_DATA.whatsapp}`}
                className="flex items-center gap-2 pl-3 pr-5 py-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all shadow-lg hover:shadow-green-500/30 hover:-translate-y-1 active:scale-95 border border-white/10 backdrop-blur-sm"
            >
                <MessageCircle size={18} fill="currentColor" className="text-white" />
                <span className="text-xs font-bold tracking-wide">Chat</span>
            </a>

            <a
                href={`tel:${SHOP_DATA.phone}`}
                className="flex items-center gap-2 pl-3 pr-5 py-2.5 rounded-full bg-primary text-white hover:bg-primary-hover transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-1 active:scale-95 border border-white/10 backdrop-blur-sm"
            >
                <Phone size={18} fill="currentColor" className="text-white" />
                <span className="text-xs font-bold tracking-wide">Call</span>
            </a>
        </div>
    );
}

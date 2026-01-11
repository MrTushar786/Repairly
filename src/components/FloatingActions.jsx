import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { SHOP_DATA } from '../data';

export default function FloatingActions() {
    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-4 p-2 bg-white/80 backdrop-blur-xl rounded-full border border-white/40 shadow-2xl ring-1 ring-black/5 hover:scale-105 transition-transform duration-300">
            <a href={`https://wa.me/${SHOP_DATA.whatsapp}`} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold text-sm shadow-lg shadow-green-500/20 hover:brightness-105 active:scale-95 transition-all group">
                <MessageCircle size={20} className="group-hover:animate-bounce" />
                <span>WhatsApp</span>
            </a>
            <a href={`tel:${SHOP_DATA.phone}`} className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all group">
                <Phone size={20} className="group-hover:animate-shake" />
                <span>Call Now</span>
            </a>
        </div>
    );
}

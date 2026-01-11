import React from 'react';
import { Home, Wrench, Package, Phone, User, Store } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function MobileBottomNav({ user }) {
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path) => currentPath === path;

    const navItems = [
        { id: 'home', label: 'Home', icon: Home, path: '/' },
        { id: 'services', label: 'Services', icon: Package, path: '/services' },
        { id: 'repair', label: 'Repair', icon: Wrench, path: '/booking' }, // Central Highlight
        { id: 'contact', label: 'Contact', icon: Phone, path: '/contact' },
        {
            id: 'account',
            label: 'Account',
            icon: User,
            path: user ? '/client/dashboard' : '/login'
        },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 flex justify-around items-end px-2 py-2 z-[60] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)] backdrop-blur-md bg-white/90">
            {navItems.map((item) => {
                const active = isActive(item.path);
                const isRepair = item.id === 'repair';

                return (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`flex flex-col items-center justify-center w-full pb-1 gap-1 transition-all duration-300 relative group
                            ${isRepair ? '-mt-6' : ''}
                        `}
                    >
                        {isRepair ? (
                            <div className={`p-4 rounded-full shadow-lg transition-transform duration-300 ${active
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 scale-110 shadow-orange-200'
                                : 'bg-slate-900 text-white hover:scale-105'}`
                            }>
                                <item.icon size={24} className="text-white" strokeWidth={2.5} />
                            </div>
                        ) : (
                        ): (
                                <>
                                <div className = {`p-1.5 rounded-full transition-all ${active ? 'bg-slate-100' : 'bg-transparent'}`}>
                        {item.id === 'account' && user && (user.user_metadata?.custom_avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture) ? (
                            <img
                                src={user.user_metadata.custom_avatar_url || user.user_metadata.avatar_url || user.user_metadata.picture}
                                alt="Profile"
                                className={`w-[22px] h-[22px] rounded-full object-cover ${active ? 'ring-2 ring-primary ring-offset-1' : 'opacity-80'}`}
                            />
                        ) : (
                            <item.icon
                                size={22}
                                className={`transition-colors duration-300 ${active ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}
                                strokeWidth={active ? 2.5 : 2}
                                fill={active ? "currentColor" : "none"}
                                fillOpacity={active ? 0.1 : 0}
                            />
                        )}
                    </div>
                            </>
    )
}

<span className={`text-[10px] font-bold tracking-tight transition-colors duration-300 ${active ? 'text-primary' : 'text-slate-400'} ${isRepair ? 'mt-1' : ''}`}>
    {item.label}
</span>
                    </Link >
                );
            })}
        </nav >
    );
}

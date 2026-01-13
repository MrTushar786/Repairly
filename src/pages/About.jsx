import React, { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Building2, Recycle, Users, Award } from 'lucide-react';

export default function About() {
    const { shopData } = useShop();

    useEffect(() => {
        document.title = `About Us | ${shopData.name}`;
    }, [shopData.name]);

    return (
        <div className="pt-24 pb-20 lg:pt-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-4xl relative z-10">

                {/* Hero Section */}
                <div className="text-center mb-12 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-3xl opacity-30 -z-10"></div>
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Est. 2014</span>
                    <h1 className="text-4xl md:text-5xl font-black text-secondary mb-6 tracking-tight">
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Tech Triage</span> Team.
                    </h1>
                    <p className="text-text-muted text-xl max-w-2xl mx-auto leading-relaxed">
                        At <strong className="text-secondary">{shopData.name}</strong>, we don't just swap parts. We diagnose, resuscitate, and rapid-discharge your critical devices.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Story & Stats */}
                    <div className="space-y-8 sticky top-32">
                        <div className="inline-flex items-center gap-2 bg-slate-900 px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg shadow-primary/20">
                            <Building2 size={14} /> Our Mission
                        </div>
                        <h2 className="text-3xl font-bold text-secondary leading-tight">Precision Repair. <br /> Emergency Speed.</h2>
                        <p className="text-text-muted text-lg leading-relaxed">
                            We treat every device like a patient in critical condition. Whether it's a shattered iPhone, a water-logged laptop, or an overheating console, our certified technicians are ready to operate.
                            We bridge the gap between "authorized service" quality and "local shop" speed.
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:border-primary/30 transition-colors group">
                                <div className="text-4xl font-black text-primary mb-1 group-hover:scale-110 transition-transform origin-left">10+</div>
                                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Years of Service</div>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:border-primary/30 transition-colors group">
                                <div className="text-4xl font-black text-primary mb-1 group-hover:scale-110 transition-transform origin-left">50k+</div>
                                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Devices Rescued</div>
                            </div>
                        </div>


                    </div>

                    {/* Right Column: Commitments Card */}
                    <div className="relative mt-8 md:mt-0">
                        <div className="absolute inset-0 bg-secondary transform rotate-1 rounded-3xl opacity-5"></div>
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl relative z-10">
                            <h3 className="text-2xl font-bold text-secondary mb-8 flex items-center gap-3">
                                <Award className="text-primary" /> The Fix Promise
                            </h3>
                            <ul className="space-y-8">
                                <li className="flex gap-5">
                                    <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <Recycle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-secondary text-lg">No Fix, No Fee</h4>
                                        <p className="text-slate-500 mt-2 leading-relaxed">Diagnostics are always free. If we can't bring your device back to life, you don't pay a dime.</p>
                                    </div>
                                </li>
                                <li className="flex gap-5">
                                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-secondary text-lg">Data Security Guaranteed</h4>
                                        <p className="text-slate-500 mt-2 leading-relaxed">Your data is your life. We adhere to strict privacy protocols to ensure your photos and files remain private.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

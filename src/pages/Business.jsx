import React from 'react';
import { Building2, Briefcase, FileCheck, Users, ArrowRight, Shield } from 'lucide-react';

export default function Business() {
    React.useEffect(() => {
        document.title = "Business Solutions | Mr. Fix My Phone";
    }, []);

    return (
        <div className="pt-32 pb-24 lg:pt-48 bg-white min-h-screen">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-secondary uppercase tracking-wider mb-6">
                        <Building2 size={14} /> MR. FIX MY PHONE FOR BUSINESS
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-secondary tracking-tight mb-6">
                        Keep your workforce <br /><span className="text-primary">connected.</span>
                    </h1>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto">
                        Scalable repair solutions for schools, enterprises, and government agencies. We manage your fleet so you can manage your business.
                    </p>
                    <div className="flex justify-center gap-4 mt-8">
                        <button className="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover shadow-lg transition-colors">
                            GET CORPORATE QUOTE
                        </button>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors group">
                        <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                            <Briefcase size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-secondary mb-3">Bulk Pricing</h3>
                        <p className="text-text-muted">Exclusive volume discounts for fleets of 10+ devices. The more you break, the more you save.</p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors group">
                        <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                            <Users size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-secondary mb-3">Dedicated Account Manager</h3>
                        <p className="text-text-muted">One point of contact for all your needs. No call centers, just direct support.</p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors group">
                        <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                            <Shield size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-secondary mb-3">Data Security</h3>
                        <p className="text-text-muted">Strict chain of custody and NDA compliance. Your corporate data stays safe with us.</p>
                    </div>
                </div>

                {/* Clients / Trust */}
                <div className="bg-secondary text-white rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-12">Trusted by 500+ Organizations</h2>
                        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="flex items-center gap-2 font-bold text-2xl"><Building2 size={32} /> ACME CORP</div>
                            <div className="flex items-center gap-2 font-bold text-2xl"><Users size={32} /> GOV EDU</div>
                            <div className="flex items-center gap-2 font-bold text-2xl"><Shield size={32} /> CITY HEALTH</div>
                            <div className="flex items-center gap-2 font-bold text-2xl"><Briefcase size={32} /> TECH GIANTS</div>
                        </div>
                        <div className="mt-16 pt-12 border-t border-slate-700">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                                <div className="text-left">
                                    <div className="text-5xl font-black text-primary mb-2 flex">
                                        <CountUp end={98} suffix="%" />
                                    </div>
                                    <div className="text-xs uppercase font-bold text-slate-400 tracking-widest">SLA Compliance</div>
                                </div>
                                <div className="h-16 w-px bg-slate-700 hidden md:block"></div>
                                <div className="text-left">
                                    <div className="text-5xl font-black text-primary mb-2 flex">
                                        <CountUp end={24} suffix="h" />
                                    </div>
                                    <div className="text-xs uppercase font-bold text-slate-400 tracking-widest">Turnaround Time</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

const CountUp = ({ end, suffix = '' }) => {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        let start = 0;
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / end));

        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, stepTime);

        return () => clearInterval(timer);
    }, [end]);

    return <span>{count}{suffix}</span>;
};

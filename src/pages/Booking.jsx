import React from 'react';
import BookingWidget from '../components/BookingWidget';

export default function Booking() {
    React.useEffect(() => {
        document.title = "Book a Repair | Mr. Fix My Phone";
    }, []);

    return (
        <div className="pt-32 pb-40 lg:pt-48 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 max-w-3xl">

                <div className="text-center mb-10">
                    <h1 className="text-3xl lg:text-4xl font-black text-secondary mb-3 tracking-tight">Schedule Your Repair</h1>
                    <p className="text-text-muted">Fast, professional repair services at your convenience.</p>
                </div>

                <BookingWidget />

                <div className="mt-12 flex flex-wrap justify-center gap-8 text-center border-t border-slate-200 pt-8">
                    <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                        <div className="w-2 h-2 rounded-full bg-primary/20 p-1">
                            <div className="w-full h-full rounded-full bg-primary"></div>
                        </div>
                        Free Diagnostics
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                        <div className="w-2 h-2 rounded-full bg-primary/20 p-1">
                            <div className="w-full h-full rounded-full bg-primary"></div>
                        </div>
                        1-Year Warranty
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                        <div className="w-2 h-2 rounded-full bg-primary/20 p-1">
                            <div className="w-full h-full rounded-full bg-primary"></div>
                        </div>
                        Price Match Guarantee
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                        <div className="w-2 h-2 rounded-full bg-primary/20 p-1">
                            <div className="w-full h-full rounded-full bg-primary"></div>
                        </div>
                        Verified Technicians
                    </div>
                </div>

            </div>
        </div>
    );
}

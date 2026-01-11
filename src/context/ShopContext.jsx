import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

// Initial Data Structure (Copied from data.js to remove dependency)
const INITIAL_SHOP_DATA = {
    name: "MR. FIX MY PHONE",
    branding: {
        namePrefix: "MR.",
        nameHighlight: "FIX MY PHONE",
        subDetails: "Repair Support Team",
        logoText: "MR. FIX MY PHONE",
    },
    tagline: "When your tech stops working, we start.",
    area: "Global Network",
    phone: "18005550199",
    displayPhone: "18005550199",
    whatsapp: "18005550199",
    email: "help@mrfixmyphone.com",
    address: {
        street: "267 5th Ave Suite# 106, LL1",
        city: "New York",
        state: "NY",
        zip: "10016",
        full: "267 5th Ave Suite# 106, LL1, New York, NY 10016"
    },
    topFeatures: [
        "Free Diagnostics on All Repairs",
        "Authorized Service Provider",
        "Trained & Certified Technicians"
    ],
    socials: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#"
    },
    googleMapEmbed: "https://maps.google.com/maps?q=267%205th%20Ave%20Suite%20106%2C%20New%20York%2C%20NY%2010016&t=&z=15&ie=UTF8&iwloc=&output=embed",
    mapLink: "https://www.google.com/maps/search/?api=1&query=267+5th+Ave+Suite+106,+New+York,+NY+10016",
    hours: {
        weekdays: "8:00 AM - 8:00 PM",
        saturday: "9:00 AM - 6:00 PM",
        sunday: "10:00 AM - 4:00 PM",
        display: "Mon-Fri: 8AM - 8PM | Sat: 9AM - 6PM | Sun: 10AM - 4PM"
    },
    socialProof: "Authorized Service Provider for Google & Samsung"
};

const INITIAL_SERVICES = [
    {
        id: "phone",
        title: "Cell Phone Repair",
        priceRange: "Free Diagnostics",
        description: "From shattered glass to data recovery. We use OEM-quality parts.",
        time: "Same Day",
        warranty: "1-Year Warranty"
    },
    {
        id: "computer",
        title: "Computer Repair",
        priceRange: "Free Diagnostics",
        description: "Virus removal, start-up issues, and hardware upgrades for Mac & PC.",
        time: "24-48 Hours",
        warranty: "1-Year Warranty"
    },
    {
        id: "console",
        title: "Game Console Repair",
        priceRange: "Free Diagnostics",
        description: "Fixing Red Ring of Death, drifting joy-cons, and HDMI ports.",
        time: "Same Day",
        warranty: "1-Year Warranty"
    },
    {
        id: "tablet",
        title: "Tablet Repair",
        priceRange: "Free Diagnostics",
        description: "Screen replacements and battery swaps for iPad and Galaxy Tab.",
        time: "Same Day",
        warranty: "1-Year Warranty"
    }
];

const ShopContext = createContext();

export function ShopProvider({ children }) {
    const [shopData, setShopData] = useState(INITIAL_SHOP_DATA);
    const [servicesData, setServicesData] = useState(INITIAL_SERVICES);
    const [deviceModels, setDeviceModels] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            // 1. Fetch General Shop Data
            const { data: generalSettings, error: generalError } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'general')
                .maybeSingle();

            if (!generalError && generalSettings?.value) {
                setShopData((prev) => ({ ...prev, ...generalSettings.value }));
            }

            // 2. Fetch Services Data (Display Cards)
            const { data: servicesSettings, error: servicesError } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'services')
                .maybeSingle();

            if (!servicesError && servicesSettings?.value) {
                setServicesData(servicesSettings.value);
            }

            // 3. Fetch Device Models (For Home & Search)
            const { data: modelData } = await supabase
                .from('device_models')
                .select('*')
                .order('created_at', { ascending: false });

            if (modelData && modelData.length > 0) {
                // Transform flat DB structure to nested structure for UI: { Category: { Brand: [Models] } }
                const merged = {};
                modelData.forEach(m => {
                    const { category, brand, model } = m;
                    if (!merged[category]) merged[category] = {};
                    if (!merged[category][brand]) merged[category][brand] = [];
                    if (!merged[category][brand].includes(model)) {
                        merged[category][brand].push(model);
                    }
                });
                setDeviceModels(merged);
            }

        } catch (error) {
            console.warn('Shop Context Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateShopData = async (newData) => {
        setShopData(newData);
        const { error } = await supabase
            .from('site_settings')
            .upsert({ key: 'general', value: newData });
        if (error) throw error;
    };

    const updateServicesData = async (newData) => {
        setServicesData(newData);
        const { error } = await supabase
            .from('site_settings')
            .upsert({ key: 'services', value: newData });
        if (error) throw error;
    };

    return (
        <ShopContext.Provider value={{ shopData, servicesData, deviceModels, loading, updateShopData, updateServicesData }}>
            {children}
        </ShopContext.Provider>
    );
}

export function useShop() {
    return useContext(ShopContext);
}

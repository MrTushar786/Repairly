import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { SHOP_DATA as DEFAULT_SHOP_DATA, SERVICES as DEFAULT_SERVICES } from '../data';

const ShopContext = createContext();

export function ShopProvider({ children }) {
    const [shopData, setShopData] = useState(DEFAULT_SHOP_DATA);
    const [servicesData, setServicesData] = useState(DEFAULT_SERVICES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            // Fetch General Shop Data
            const { data: generalSettings, error: generalError } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'general')
                .maybeSingle();

            if (!generalError && generalSettings?.value) {
                setShopData((prev) => ({ ...prev, ...generalSettings.value }));
            }

            // Fetch Services Data
            const { data: servicesSettings, error: servicesError } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'services')
                .maybeSingle();

            if (!servicesError && servicesSettings?.value) {
                setServicesData(servicesSettings.value);
            }

        } catch (error) {
            // console.warn('Supabase not fully configured yet:', error);
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
        <ShopContext.Provider value={{ shopData, servicesData, loading, updateShopData, updateServicesData }}>
            {children}
        </ShopContext.Provider>
    );
}

export function useShop() {
    return useContext(ShopContext);
}

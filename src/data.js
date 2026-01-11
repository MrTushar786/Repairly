export const SHOP_DATA = {
    name: "MR. FIX MY PHONE",
    branding: {
        namePrefix: "MR.",
        nameHighlight: "FIX MY PHONE",
        subDetails: "Tech Triage Unit",
        logoText: "MR. FIX MY PHONE", // Fallback
    },
    tagline: "When your tech stops working, we start.",
    area: "Global Network",
    phone: "18005550199", // Clean number for tel: links
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
    socials: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#"
    },
    googleMapEmbed: "https://maps.google.com/maps?q=267%205th%20Ave%20Suite%20106%2C%20New%20York%2C%20NY%2010016&t=&z=15&ie=UTF8&iwloc=&output=embed",
    mapLink: "#",
    hours: {
        weekdays: "8:00 AM - 8:00 PM",
        saturday: "9:00 AM - 6:00 PM",
        sunday: "10:00 AM - 4:00 PM",
        display: "Mon-Fri: 8AM - 8PM | Sat: 9AM - 6PM | Sun: 10AM - 4PM"
    },
    socialProof: "Authorized Service Provider for Google & Samsung"
};

export const SERVICES = [
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

export const DEVICE_MODELS = {
    "Phone": {
        "Apple": ["iPhone 18 Pro Max", "iPhone 18 Pro", "iPhone 18 Air", "iPhone 18", "iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone 17", "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16", "iPhone 15", "iPhone 14", "iPhone 13", "iPhone SE (2025)"],
        "Samsung": ["Galaxy S26 Ultra", "Galaxy S26+", "Galaxy S26", "Galaxy S25 Ultra", "Galaxy S25 FE", "Galaxy Z Fold 7", "Galaxy Z Flip 7", "Galaxy A56 5G", "Galaxy A36 5G", "Galaxy M56", "Galaxy S24 FE"],
        "Google": ["Pixel 11 Pro XL", "Pixel 11 Pro", "Pixel 11", "Pixel 10 Pro Fold", "Pixel 10 Pro", "Pixel 10", "Pixel 9a", "Pixel 9 Pro", "Pixel 8 Pro"],
        "OnePlus": ["OnePlus 14 Pro", "OnePlus 13", "OnePlus 13R", "OnePlus Open 2", "OnePlus Nord 5", "OnePlus Nord CE 5", "OnePlus 12"],
        "Xiaomi": ["Xiaomi 16 Ultra", "Xiaomi 15 Pro", "Xiaomi 15", "Redmi Note 15 Pro+", "Redmi Note 15", "Poco F8 Pro", "Poco X7", "Redmi 14C"],
        "Motorola": ["Razr 60 Ultra", "Edge 60 Pro", "Edge 60 Fusion", "Moto G100 (2026)", "Moto G86 5G", "Moto G96 5G", "ThinkPhone 25"],
        "Vivo": ["X300 Pro", "X200 Pro", "V60 5G", "V60e", "V50 Pro", "Y300 5G"],
        "OPPO": ["Find X9 Pro", "Find X8 Pro", "Reno 15 Pro", "Reno 14 Pro", "Find N4 Flip", "F31 Pro Plus"],
        "Realme": ["GT 7 Pro", "Realme 16 Pro+", "Realme 16 Pro", "Realme 15 Pro", "Narzo 80 Pro"]
    },
    "Laptop": {
        "Apple": ["MacBook Air 13-inch (M4)", "MacBook Air 15-inch (M4)", "MacBook Pro 14-inch (M5)", "MacBook Pro 16-inch (M5)", "MacBook Pro (M1 Max)"],
        "Dell": ["XPS 16 (2026)", "XPS 14 (2026)", "XPS 13 (9345)", "Latitude 7450", "Inspiron 16 Plus", "Alienware m18 R2"],
        "HP": ["OmniBook Ultra Flip 14", "Spectre x360 14", "Omen Transcend 14", "Pavilion Plus 14", "EliteBook X G2"],
        "Lenovo": ["ThinkPad X1 Carbon Gen 14", "ThinkPad X9 14 Aura Edition", "Yoga Slim 9i", "Legion Pro 7i", "IdeaPad Slim 3"],
        "Asus": ["Zenbook S 16 OLED", "ROG Zephyrus G16", "ProArt P16", "ROG Strix SCAR 18", "Vivobook 15"],
        "Acer": ["Swift 16 AI", "Aspire Go 15 (2025)", "Nitro 5", "Predator Helios 16"]
    },
    "Tablet": {
        "Apple": ["iPad Pro 13-inch (M5)", "iPad Pro 11-inch (M5)", "iPad Air 11-inch (2025)", "iPad (11th Gen, 2025)", "iPad mini 7"],
        "Samsung": ["Galaxy Tab S12 Ultra", "Galaxy Tab S12", "Galaxy Tab S11 FE+", "Galaxy Tab A11 Plus", "Galaxy Tab A9+"],
        "Xiaomi": ["Xiaomi Pad 7 Pro", "Xiaomi Pad 7", "Redmi Pad 2 Pro 5G", "Redmi Pad Pro", "Poco Pad 5G"],
        "Lenovo": ["Tab K11 Gen 2", "Yoga Tab Plus AI", "Idea Tab Pro", "Tab M11"],
        "OnePlus": ["OnePlus Pad 3", "OnePlus Pad Go 2", "OnePlus Pad Lite"]
    },
    "Console": {
        "Sony": ["PlayStation 5 Pro", "PlayStation 5 Slim", "PlayStation 5 Digital Edition", "PlayStation 4 Pro"],
        "Microsoft": ["Xbox Series X", "Xbox Series S (1TB)", "Xbox Series S (512GB)", "Xbox One S"],
        "Nintendo": ["Nintendo Switch 2", "Nintendo Switch OLED", "Nintendo Switch Lite", "Nintendo Switch (Original)"],
        "Handheld PC": ["Steam Deck OLED", "ROG Xbox Ally X (2025)", "ROG Xbox Ally (2025)", "Lenovo Legion Go 2"]
    }
};

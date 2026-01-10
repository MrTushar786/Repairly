import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

// Construct a high-quality likely URL for the device image
// Uses GSMArena's consistent public image hosting pattern
export function getDeviceImageUrl(brand, model) {
    if (!brand || !model) return null;

    // 1. TIME MACHINE: Map Future/Concept models to their best existing Real-World equivalent
    // This ensures "iPhone 18" shows a high-quality "iPhone 15/16" render, not a broken link.
    const getRealWorldModel = (m) => {
        let name = m.replace(/\s\(\d{4}\)/, '').trim(); // Remove (2025) etc

        // Apple Future -> Current
        if (name.includes("iPhone")) {
            if (name.match(/iPhone\s(1[6-9]|[2-9]\d)/)) {
                // Preserve Pro/Max/Plus distinction for accuracy
                if (name.includes("Pro Max")) return "iPhone 15 Pro Max";
                if (name.includes("Pro")) return "iPhone 15 Pro";
                if (name.includes("Plus") || name.includes("Air")) return "iPhone 15 Plus";
                return "iPhone 15";
            }
        }

        // Samsung Future -> Current
        if (name.includes("Galaxy S")) {
            if (name.match(/S(2[5-9]|[3-9]\d)/)) {
                if (name.includes("Ultra")) return "Galaxy S24 Ultra";
                if (name.includes("+")) return "Galaxy S24 Plus";
                if (name.includes("FE")) return "Galaxy S23 FE";
                return "Galaxy S24";
            }
        }

        // Google Future -> Current
        if (name.includes("Pixel")) {
            if (name.match(/Pixel\s(9|1\d)/)) {
                if (name.includes("Pro XL") || name.includes("Pro")) return "Pixel 8 Pro";
                if (name.includes("Fold")) return "Pixel Fold";
                if (name.includes("a")) return "Pixel 7a"; // or 8a if available
                return "Pixel 8";
            }
        }

        // OnePlus
        if (name.includes("OnePlus")) {
            if (name.match(/1[3-9]/)) return "OnePlus 12";
            if (name.includes("Open")) return "OnePlus Open";
        }

        // Xiaomi Future -> Current
        if (name.includes("Xiaomi") || name.includes("Redmi") || name.includes("Poco")) {
            if (name.includes("Ultra") && name.match(/1[5-9]/)) return "Xiaomi 14 Ultra";
            if (name.includes("Pro") && name.match(/1[5-9]/)) return "Xiaomi 14 Pro";
            if (name.match(/Xiaomi\s1[5-9]/)) return "Xiaomi 14";
            // Generic fallbacks for sub-brands ensuring valid images
            if (name.includes("Redmi Note")) return "Xiaomi Redmi Note 13 Pro";
            if (name.includes("Poco")) return "Xiaomi Poco F5 Pro";
        }

        // Motorola Future -> Current
        if (name.includes("Motorola") || name.includes("Moto") || name.includes("Razr")) {
            if (name.includes("Razr") || name.includes("60")) return "Motorola Razr 40 Ultra";
            if (name.includes("Edge")) return "Motorola Edge 40 Pro";
            if (name.includes("Moto G")) return "Motorola Moto G84";
        }

        // Vivo
        if (name.includes("Vivo") || name.includes("X300") || name.includes("X200")) return "Vivo X100 Pro";

        // OPPO
        if (name.includes("OPPO") || name.includes("Find X")) return "Oppo Find X7 Ultra";

        // Realme
        if (name.includes("Realme") || name.includes("GT")) return "Realme GT5 Pro";

        return name;
    }

    const realModel = getRealWorldModel(model);

    // 2. HARDCODED IMAGE MAP: Verified URLs for the specific "Target" models from step 1.
    // This avoids algorithmic guessing errors (e.g. missing '-5g' suffix or internal IDs).
    const REAL_DEVICE_IMAGES = {
        // Apple
        "iPhone 15 Pro Max": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro-max.jpg",
        "iPhone 15 Pro": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg",
        "iPhone 15 Plus": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-plus.jpg",
        "iPhone 15": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg",

        // Samsung - Note: URLs are case sensitive and specific
        "Galaxy S24 Ultra": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g.jpg",
        "Galaxy S24 Plus": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-plus-5g.jpg",
        "Galaxy S24": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-5g.jpg",
        "Galaxy S23 FE": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-fe.jpg",
        "Galaxy Z Fold 5": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold5-5g.jpg",
        "Galaxy Z Flip 5": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip5-5g.jpg",

        // Google
        "Pixel 8 Pro": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8-pro.jpg",
        "Pixel 8": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8.jpg",
        "Pixel Fold": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-fold.jpg",
        "Pixel 7a": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-7a.jpg",

        // OnePlus
        "OnePlus 12": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-12.jpg",
        "OnePlus Open": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-open.jpg",

        // Xiaomi
        "Xiaomi 14 Ultra": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-ultra.jpg",
        "Xiaomi 14 Pro": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-pro.jpg",
        "Xiaomi 14": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14.jpg",
        "Xiaomi Redmi Note 13 Pro": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-pro.jpg",
        "Xiaomi Poco F5 Pro": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-f5-pro.jpg",

        // Motorola
        "Motorola Razr 40 Ultra": "https://fdn2.gsmarena.com/vv/bigpic/motorola-razr-40-ultra.jpg",
        "Motorola Edge 40 Pro": "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-40-pro.jpg",
        "Motorola Moto G84": "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g84.jpg",

        // Others
        "Vivo X100 Pro": "https://fdn2.gsmarena.com/vv/bigpic/vivo-x100-pro.jpg",
        "Oppo Find X7 Ultra": "https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x7-ultra.jpg",
        "Realme GT5 Pro": "https://fdn2.gsmarena.com/vv/bigpic/realme-gt5-pro.jpg"
    };

    return REAL_DEVICE_IMAGES[realModel] || null;
}

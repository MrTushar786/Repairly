/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#10B981', // Vivid Mint Green
                    hover: '#059669',   // Darker Mint
                    light: '#D1FAE5',   // Subtle Background
                },
                secondary: '#064E3B', // Deep Forest Green
                accent: {
                    DEFAULT: '#34D399',
                    pop: '#F59E0B',     // Amber for CTA
                },
                bg: {
                    body: '#F9FAFB',
                    card: '#FFFFFF',
                    input: '#F3F4F6',
                },
                text: {
                    main: '#111827',
                    muted: '#6B7280',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '16px',
                md: '12px',
                lg: '16px',
                xl: '24px',
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'float': '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
            }
        },
    },
    plugins: [],
}

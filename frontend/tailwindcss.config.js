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
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                custom: {
                    'bg-primary': '#0078AE',
                    'card-text': '#9CA3AF',
                    'input': '#1196d4',
                    'orange': '#D85E00',
                    'bg-secondary': '#16213e',
                    'text-primary': '#e94560',
                    'text-secondary': '#0f3460',
                    'accent': '#00d4ff',
                    'card-bg': '#2a2a3a',
                    'custom-gray': '#808080',
                },
                // Simple custom colors
                'brand-blue': '#4361ee',
                'brand-pink': '#f72585',
                'custom-dark': '#121212',
                'custom-light': '#f8f9fa',
            },
            fontFamily: {
                // This creates a new 'roboto' utility class
                'roboto': ['Roboto', 'sans-serif'],

                // Optional: Replace the default sans font with Roboto
                'sans': ['Roboto', 'sans-serif'],
            },
        },
    },
    plugins: [],
}


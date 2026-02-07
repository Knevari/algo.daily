/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                // Creative Coder Palette
                bg: {
                    DEFAULT: "#05050A", // Deep space black
                    primary: "#05050A",
                    secondary: "#0A0A12", // Slightly lighter for panels
                    tertiary: "#12121A", // Borders/Hover states
                    card: "rgba(10, 10, 18, 0.6)", // Glass effect base
                },
                accent: {
                    primary: "#D946EF", // Neon Fuchsia (Keywords/Variables)
                    secondary: "#8B5CF6", // Neon Violet
                    cyan: "#06B6D4", // Functions/Types
                    green: "#10B981", // Strings/Success
                    orange: "#F59E0B", // Params/Warning
                    glow: "rgba(217, 70, 239, 0.4)",
                },
                text: {
                    primary: "#E2E8F0",
                    secondary: "#94A3B8",
                    muted: "#64748B",
                    code: "#E2E8F0",
                },
                border: {
                    DEFAULT: "rgba(255, 255, 255, 0.08)",
                    hover: "rgba(255, 255, 255, 0.15)",
                    active: "rgba(217, 70, 239, 0.5)",
                },
                // Keeping legacy mappings for compatibility during transition
                success: {
                    DEFAULT: "#10B981",
                    glow: "rgba(16, 185, 129, 0.3)",
                },
                warning: "#F59E0B",
                error: "#EF4444",
            },
            spacing: {
                xs: "0.25rem",
                sm: "0.5rem",
                md: "1rem",
                lg: "1.5rem",
                xl: "2rem",
                "2xl": "3rem",
            },
            borderRadius: {
                sm: "4px",
                md: "8px",
                lg: "12px",
                xl: "16px",
                full: "9999px",
            },
            boxShadow: {
                sm: "0 1px 2px rgba(0, 0, 0, 0.3)",
                md: "0 4px 6px rgba(0, 0, 0, 0.4)",
                lg: "0 10px 15px rgba(0, 0, 0, 0.5)",
                glow: "0 0 20px rgba(217, 70, 239, 0.15)",
                "glow-hover": "0 0 30px rgba(217, 70, 239, 0.3)",
            },
            transitionDuration: {
                fast: "150ms",
                base: "200ms",
                slow: "300ms",
            },
            animation: {
                flicker: "flicker 1.5s ease-in-out infinite",
                pulse: "pulse 2s ease-in-out infinite",
                shine: "shine 3s linear infinite",
                float: "float 3s ease-in-out infinite",
                spin: "spin 1s linear infinite",
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
            },
            keyframes: {
                flicker: {
                    "0%, 100%": { transform: "scale(1) rotate(-2deg)", opacity: "1" },
                    "25%": { transform: "scale(1.05) rotate(2deg)", opacity: "0.9" },
                    "50%": { transform: "scale(0.98) rotate(-1deg)", opacity: "1" },
                    "75%": { transform: "scale(1.02) rotate(1deg)", opacity: "0.95" },
                },
                "pulse-glow": {
                    "0%, 100%": { boxShadow: "0 0 10px rgba(217, 70, 239, 0.2)" },
                    "50%": { boxShadow: "0 0 20px rgba(217, 70, 239, 0.5)" },
                },
                shine: {
                    "0%": { backgroundPosition: "-200% center" },
                    "100%": { backgroundPosition: "200% center" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                spin: {
                    to: { transform: "rotate(360deg)" },
                },
            },
        },
    },
    plugins: [],
};

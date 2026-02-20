

import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ["Ubuntu", "system-ui", "sans-serif"],
                sans: ["Ubuntu", "system-ui", "sans-serif"],
            },
            colors: {
                brand: {
                    dark: "#003147",
                    mid: "#0d5078",
                    hover: "#1a6a9a",
                },
                grey: {
                    light: "#E9E9E9",
                    mid: "#999999",
                    dark: "#6F6F6F",
                    border: "#E0E0E0",
                    card: "#EAEAEA",
                    warm: "#EBECDF",
                },
            },
            fontSize: {
                "xs": ["0.8rem", { lineHeight: "1.4" }],
                "sm": ["0.875rem", { lineHeight: "1.5" }],
                "body": ["0.9rem", { lineHeight: "1.7" }],
                "base": ["0.95rem", { lineHeight: "1.5" }],
                "md": ["1rem", { lineHeight: "1.5" }],
                "lg": ["1.375rem", { lineHeight: "1.3" }],
                "xl": ["1.875rem", { lineHeight: "1.2" }],
            },
            spacing: {
                "1.2": "0.3rem",
                "nav": "4.125rem", /* 66px */
            },
            maxWidth: {
                mobile: "26.875rem", /* 430px */
            },
        },
    },
    plugins: [],
};

export default config;

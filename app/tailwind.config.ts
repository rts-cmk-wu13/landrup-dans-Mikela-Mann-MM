

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
            spacing: {
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

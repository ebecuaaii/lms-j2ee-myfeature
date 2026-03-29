import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#4F46E5",
                    foreground: "#ffffff",
                },
            },
        },
    },
    plugins: [],
};

export default config;

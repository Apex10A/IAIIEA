import type { Config } from "tailwindcss";

const config: Config = {
  // Enable dark mode using class strategy
  darkMode: "class", // This is the key line to add
  
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'spin-fast': 'spin 0.5s linear infinite',
      },
      // Optional: Define custom colors for dark mode
      colors: {
        dark: {
          primary: '#1E293B', // slate-800
          secondary: '#0F172A', // slate-900
          accent: '#7C3AED', // violet-600
        },
        light: {
          primary: '#F1F5F9', // slate-100
          secondary: '#E2E8F0', // slate-200
          accent: '#6D28D9', // violet-700
        }
      }
    }
  },
  plugins: [],
};

export default config;
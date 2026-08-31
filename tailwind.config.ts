import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const baznasColors = {
  // Brand DNA Colors
  primary: "#004229",
  "on-primary": "#ffffff",
  "primary-container": "#075c3b",
  "on-primary-container": "#88d2a8",
  "primary-dark": "#075C3B",
  "deep-emerald": "#075C3B",
  "refined-gold": "#D4AF37",

  // Secondary Accents
  secondary: "#735c00",
  "on-secondary": "#ffffff",
  "secondary-container": "#fed65b",
  "on-secondary-container": "#745c00",
  "secondary-fixed": "#ffe088",
  "on-secondary-fixed": "#241a00",
  "secondary-fixed-dim": "#e9c349",
  "secondary-gray": "#5B6470",

  // Neutrals & Surfaces
  "warm-off-white": "#F8F6F1",
  "near-black": "#1F2937",
  "outline-variant": "#bfc9c0",
  outline: "#707a72",

  // Status semantic colors
  "status-success": "rgb(var(--c-status-success) / <alpha-value>)",
  "on-status-success": "rgb(var(--c-on-status-success) / <alpha-value>)",
  "status-warning": "rgb(var(--c-status-warning) / <alpha-value>)",
  "on-status-warning": "rgb(var(--c-on-status-warning) / <alpha-value>)",
  "status-danger": "rgb(var(--c-status-danger) / <alpha-value>)",
  "on-status-danger": "rgb(var(--c-on-status-danger) / <alpha-value>)",

  // Surface and Neutral tokens
  background: "rgb(var(--c-background) / <alpha-value>)",
  "on-background": "rgb(var(--c-on-background) / <alpha-value>)",
  surface: "rgb(var(--c-surface) / <alpha-value>)",
  "on-surface": "rgb(var(--c-on-surface) / <alpha-value>)",
  "surface-container-lowest": "rgb(var(--c-surface-container-lowest) / <alpha-value>)",
  "surface-container-low": "#f5f3ee",
  "surface-container": "#f0eee9",
  "surface-container-high": "rgb(var(--c-surface-container-high) / <alpha-value>)",
  "surface-variant": "rgb(var(--c-surface-variant) / <alpha-value>)",
  "on-surface-variant": "rgb(var(--c-on-surface-variant) / <alpha-value>)",
  inverse: "rgb(var(--c-inverse) / <alpha-value>)",
  "inverse-surface": "#30312e",

  // Systematic Theme Color Overrides (Dark Green rgb(5 24 8) in Dark Mode)
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: 'rgb(var(--c-theme-bg-700) / <alpha-value>)',
    800: 'rgb(var(--c-theme-bg-800) / <alpha-value>)',
    850: 'rgb(var(--c-theme-bg-850) / <alpha-value>)',
    900: 'rgb(var(--c-theme-bg-900) / <alpha-value>)',
    950: 'rgb(var(--c-theme-bg-950) / <alpha-value>)',
  },
  zinc: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: 'rgb(var(--c-theme-bg-700) / <alpha-value>)',
    800: 'rgb(var(--c-theme-bg-800) / <alpha-value>)',
    900: 'rgb(var(--c-theme-bg-900) / <alpha-value>)',
    950: 'rgb(var(--c-theme-bg-950) / <alpha-value>)',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: 'rgb(var(--c-theme-bg-700) / <alpha-value>)',
    800: 'rgb(var(--c-theme-bg-800) / <alpha-value>)',
    900: 'rgb(var(--c-theme-bg-900) / <alpha-value>)',
    950: 'rgb(var(--c-theme-bg-950) / <alpha-value>)',
  },
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    extend: {
      colors: baznasColors,
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        'space-grotesk': ['var(--font-space-grotesk)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-jakarta)', 'sans-serif'],
      },
      maxWidth: {
        'container-max': '1320px',
      },
      spacing: {
        'margin-desktop': '48px',
        'margin-mobile': '20px',
        gutter: '24px',
        'section-v-spacer': '112px',
      },
      fontSize: {
        'body-md': ['0.95rem', { lineHeight: '1.4rem' }],
        'body-lg': ['1.05rem', { lineHeight: '1.6rem' }],
        'headline-md': ['1.6rem', { lineHeight: '2rem', letterSpacing: '-0.015em' }],
        'headline-lg': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
        'headline-xl': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'headline-xl-mobile': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
    },
  },
  plugins: [forms],
};

export default config;

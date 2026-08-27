import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

// Base colors derived from AGENTS.md (Gold/Green BAZNAS DNA)
const baznasColors = {
  // Primary (Green/Gold)
  primary: "rgb(var(--c-primary) / <alpha-value>)",
  "on-primary": "rgb(var(--c-on-primary) / <alpha-value>)",
  "primary-container": "rgb(var(--c-primary-container) / <alpha-value>)",
  "on-primary-container": "rgb(var(--c-on-primary-container) / <alpha-value>)",
  "primary-dark": "rgb(var(--c-primary-dark) / <alpha-value>)", // For contrast AA (e.g., outline-gold text)

  // Status semantic colors
  "status-success": "rgb(var(--c-status-success) / <alpha-value>)",
  "on-status-success": "rgb(var(--c-on-status-success) / <alpha-value>)",
  "status-warning": "rgb(var(--c-status-warning) / <alpha-value>)",
  "on-status-warning": "rgb(var(--c-on-status-warning) / <alpha-value>)",
  "status-danger": "rgb(var(--c-status-danger) / <alpha-value>)",
  "on-status-danger": "rgb(var(--c-on-status-danger) / <alpha-value>)",

  // Surface and Neutral (Grey/White/Black)
  background: "rgb(var(--c-background) / <alpha-value>)",
  "on-background": "rgb(var(--c-on-background) / <alpha-value>)",
  surface: "rgb(var(--c-surface) / <alpha-value>)",
  "on-surface": "rgb(var(--c-on-surface) / <alpha-value>)",
  "surface-container-lowest": "rgb(var(--c-surface-container-lowest) / <alpha-value>)",
  "surface-container-high": "rgb(var(--c-surface-container-high) / <alpha-value>)",
  "surface-variant": "rgb(var(--c-surface-variant) / <alpha-value>)",
  "on-surface-variant": "rgb(var(--c-on-surface-variant) / <alpha-value>)",
  // Inverse for dark mode contrast
  inverse: "rgb(var(--c-inverse) / <alpha-value>)",
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
        'inter': ['var(--font-inter)'],
        'space-grotesk': ['var(--font-space-grotesk)'],
      },
      // Simplified Font Tokens based on Kemenhaj Pattern
      fontSize: {
        'body-md': ['0.95rem', { lineHeight: '1.4rem' }],
        'body-lg': ['1.05rem', { lineHeight: '1.6rem' }],
        'headline-md': ['1.6rem', { lineHeight: '2rem', letterSpacing: '-0.015em' }],
        'headline-lg': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
      }
    },
  },
  plugins: [forms],
};

export default config;

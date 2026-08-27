import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- BAZNAS Design System ---
        // PRD: Green as primary, Gold as accent, Dark Green for emphasis.
        'baznas-green': {
          DEFAULT: '#006400', // Primary Green (Dark Green for Trust)
          dark: '#004d00',    // Dark Green for emphasis/hover
        },
        'baznas-gold': {
          DEFAULT: '#FFD700', // Accent Gold
        },
        'baznas-neutral': {
          DEFAULT: '#4B5563', // Neutral Gray for text/supporting surfaces
        },
        // --- End BAZNAS Design System ---

        // Custom primary/secondary colors based on the BAZNAS palette
        primary: {
          DEFAULT: 'var(--color-primary-default, #006400)',
          dark: 'var(--color-primary-dark, #004d00)',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #FFD700)',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      // You can also define BAZNAS standard typography here if needed
      fontFamily: {
        // e.g. sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

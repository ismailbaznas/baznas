---
name: Institutional Trust
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#3f4942'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#707a72'
  outline-variant: '#bfc9c0'
  surface-tint: '#1f6b48'
  primary: '#004229'
  on-primary: '#ffffff'
  primary-container: '#075c3b'
  on-primary-container: '#88d2a8'
  inverse-primary: '#8cd6ac'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#632526'
  on-tertiary: '#ffffff'
  tertiary-container: '#803b3b'
  on-tertiary-container: '#ffaeab'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a8f3c7'
  primary-fixed-dim: '#8cd6ac'
  on-primary-fixed: '#002112'
  on-primary-fixed-variant: '#005233'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b1'
  on-tertiary-fixed: '#3c070b'
  on-tertiary-fixed-variant: '#743232'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
  deep-emerald: '#075C3B'
  refined-gold: '#D4AF37'
  warm-off-white: '#F8F6F1'
  near-black: '#1F2937'
  secondary-gray: '#5B6470'
  white: '#FFFFFF'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.0'
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 44px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.2'
  button:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1320px
  section-v-spacer: 112px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system is engineered for **BAZNAS Kabupaten Boven Digoel**, an official Islamic philanthropic institution. The brand personality is rooted in the "Institutional Premium" philosophy: a synthesis of governmental authority, professional financial management, and warm human connection. It seeks to move a visitor through a psychological sequence of "Look, Read, Believe, and Act."

The visual style is **Corporate / Modern** with a strong **Editorial** influence. It avoids the clinical coldness of typical government portals by using high-contrast typography and generous whitespace, similar to a high-end magazine. It adheres to an "Anti-AI" manifesto, prioritizing authenticity and documentary-style realism over excessive gradients, glassmorphism, or synthetic perfection. The goal is to evoke a sense of stability, transparency, and local authenticity.

## Colors

The palette is restrained to maintain professional dignity. 
- **Primary Deep Emerald (#075C3B):** Represents the institutional identity, used for primary actions, navigation, and core branding elements.
- **Secondary Refined Gold (#D4AF37):** Used strictly as an accent for highlights, important metrics, and subtle interaction states. It must never dominate the layout.
- **Warm Off-White (#F8F6F1):** Provides a soft, human alternative to pure white for section backgrounds, creating a "tempo" of alternating light and slightly tinted surfaces.
- **Typography:** Headlines use Near-Black (#1F2937) for high legibility, while secondary text uses a muted Gray (#5B6470).

The visual balance should roughly follow a 70% Neutral, 20% Emerald, and 10% Gold ratio to ensure a clean, airy aesthetic.

## Typography

The system utilizes a dual-font strategy to balance editorial elegance with functional clarity. 
- **Playfair Display** (Serif) is reserved for headlines and storytelling elements. Its high contrast conveys a sense of prestige and history.
- **Plus Jakarta Sans** (Sans-serif) handles all UI, body text, and labels. Its modern, geometric construction ensures readability and a professional, tech-forward feel.

Hierarchical rules emphasize "optical alignment" over mathematical grid-snapping. Hero headlines use tight line-height (0.95–1.05) to create a cohesive visual block, while body copy maintains a generous 1.5–1.6 line-height for accessibility.

## Layout & Spacing

This design system uses a **Fixed Grid** model for desktop, centered within a max-width of 1320px to prevent eyestrain on ultra-wide monitors. A **12-column grid** is standard, with a 24px gutter.

The rhythm of the layout is defined by "Visual Tempo"—alternating vertical padding of 96px to 120px between major sections to prevent a "flat" experience. Whitespace is used as an active design element to signal information importance.
- **Mobile:** Elements reflow to a single column; headlines scale down to 40-48px; horizontal margins decrease to 20px.
- **Peek Rule:** The hero height is capped at 680px on desktop to ensure the top of the subsequent section is visible, psychologically encouraging the user to scroll.

## Elevation & Depth

To maintain institutional trust, the design system avoids heavy shadows and floating effects. 
- **Tonal Layers:** Depth is primarily created through subtle background shifts (White to Warm Off-White) rather than shadows.
- **Low-Contrast Outlines:** Cards and containers use 1px borders in a very light gray or primary-emerald tint instead of drop shadows.
- **Minimal Shadows:** Where absolutely necessary for hierarchy (e.g., hover states on cards), use highly diffused, low-opacity (2-5%) shadows that feel grounded rather than floating.
- **No Glassmorphism:** All surfaces must be solid to communicate stability and transparency.

## Shapes

The shape language is "Institutional Modern." It utilizes medium rounding to appear approachable but maintains enough structure to feel official.
- **Base Corner Radius:** 0.5rem (8px) for buttons and small UI elements.
- **Large Corner Radius:** 1rem (16px) for cards, images, and transparency panels.
- **Storytelling Blocks:** Up to 1.25rem (20px) for large-scale sections like Impact Stories to give them a softer, more human feel.
- **Pills:** Avoid pill-shaped buttons; stick to the defined 8-10px radius to maintain a consistent "official" aesthetic.

## Components

- **Buttons:** 
    - *Primary:* Solid Deep Emerald with white text and an arrow icon (→). 
    - *Secondary:* Outlined Emerald or transparent with Emerald text. 
    - *Action:* High-contrast Refined Gold is used only for the most critical CTA (e.g., "Tunaikan Zakat Sekarang").
- **Cards (Pillars & News):** White background, 1px subtle border, 16px radius. Pillar icons are 32px and rendered in emerald; gold is reserved for the hover state.
- **Trust Strip:** A non-bordered, single-row horizontal layout for statistics. Numbers are large (32-40px) and dark, with labels in small caps Jakarta Sans.
- **Input Fields:** 8px radius, white background with a 1px soft border. Focus states use a primary emerald glow.
- **Transparency Panel:** A split layout (60:40) comparing data metrics on the left with a document/PDF list on the right. Documents utilize a clear "PDF" icon and a simple download link.
- **Impact Story:** Large-format photography (55% width) paired with high-contrast serif headlines (45% width), styled like an editorial spread.
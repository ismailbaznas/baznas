---
name: Nocturnal Institutionalist
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#1E1E1E'
  surface-container-high: '#2A2A2A'
  surface-container-highest: '#353534'
  on-surface: '#FBF9F4'
  on-surface-variant: '#A1A19A'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#3F4942'
  outline-variant: '#3f4942'
  surface-tint: '#8cd6ac'
  primary: '#8cd6ac'
  on-primary: '#003822'
  primary-container: '#075c3b'
  on-primary-container: '#88d2a8'
  inverse-primary: '#1f6b48'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#ffb3b1'
  on-tertiary: '#581c1e'
  tertiary-container: '#803b3b'
  on-tertiary-container: '#ffaeab'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
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
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 42px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
  button:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 15px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1320px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 20px
  section-padding: 112px
  element-gap: 24px
---

## Brand & Style

The design system evolves into a **Dark Mode** environment that emphasizes prestige, security, and quiet authority. The brand personality shifts from an open editorial feel to a "Private Banking" or "Legacy Institution" aesthetic—where the darkness provides a backdrop of infinite depth and the colors act as beacons of light.

The chosen style is **Modern Corporate with Tonal Minimalism**. It utilizes deep charcoal surfaces to reduce eye strain while maintaining a high-contrast relationship with the primary emerald and gold accents. The emotional response is one of "Solid Trust": the interface feels grounded, expensive, and technically precise. It avoids the neon-heavy tropes of dark mode "gaming" styles, opting instead for a matte, sophisticated finish that honors the official nature of the institution.

## Colors

The color palette is architected to preserve legibility in low-light environments while highlighting the brand’s core identifiers.

- **Primary Deep Emerald (#075C3B):** This color becomes the "Anchor." It is used for primary brand surfaces and interactive elements. In dark mode, it acts as a rich, jewel-toned highlight.
- **Accent Refined Gold (#D4AF37):** This is the "Lume." It should be used sparingly for high-priority calls to action and critical status indicators, appearing as if it were metallic foil stamped onto the dark background.
- **Surface Neutrals:** The base is a near-black **#121212**, providing a flicker-free reading experience. **#1E1E1E** is used for container elevations to create subtle depth without relying on shadows.
- **Typography:** The primary text color is a warm **#FBF9F4** (Off-White) to avoid the harsh "vibration" that pure white causes against dark backgrounds.

## Typography

The typography system maintains its editorial dual-font strategy. **Playfair Display** provides the intellectual and institutional weight, while **Plus Jakarta Sans** ensures clear, modern communication.

In dark mode, font weights for body text are slightly lighter (400) to prevent "ink bleed" (where white text appears bolder on black). Headline tracking is tightened for the Serif fonts to maintain a compact, impactful look. Headlines should primarily use the `on-surface` color, while supporting body text should use `on-surface-variant` to establish a clear hierarchy.

## Layout & Spacing

The design system follows a **Fixed Grid** model for desktop environments, ensuring that content density remains professional and readable.

- **Grid:** A 12-column grid system with 24px gutters provides the structure. 
- **Vertical Rhythm:** Sections are separated by generous 112px padding to create a sense of breathing room, which is essential in dark mode to prevent the UI from feeling claustrophobic.
- **Responsiveness:** On mobile, margins shrink to 20px and the layout collapses into a single column. The "Peek Rule" remains: keep the hero section compact enough to show a hint of the following content, signaling that more information is available below the fold.

## Elevation & Depth

In this dark mode environment, depth is communicated through **Tonal Layers** rather than shadows. 

1.  **Base Layer (#121212):** The primary canvas for the application.
2.  **Surface Containers (#1E1E1E):** Used for cards, navigation bars, and grouped elements. These appear to sit slightly above the base.
3.  **High Surfaces (#2A2A2A):** Reserved for floating elements like modals or tooltips.
4.  **Low-Contrast Outlines:** Instead of shadows, use 1px borders (#3F4942) to define the edges of containers. This creates a crisp, "technical" appearance that reinforces the feeling of professional management. 
5.  **Glow States:** Interaction is signaled by subtle emerald or gold glows (5-10% opacity) rather than heavy drop shadows.

## Shapes

The shape language is structured and "Rounded." By using a consistent 0.5rem (8px) radius, the system balances the severity of the dark theme with an approachable, modern feel.

- **Base Radius (0.5rem):** Standard for buttons, input fields, and small UI components.
- **Large Radius (1rem):** Used for cards and content containers.
- **Section Radius (1.5rem):** Occasionally used for full-bleed image containers to soften the visual transition between photography and the UI.

## Components

- **Buttons:**
    - **Primary:** Solid Emerald (#075C3B) with Off-White text.
    - **Secondary:** Outlined with a 1px Emerald border and Emerald text.
    - **High-Impact (CTA):** Solid Refined Gold (#D4AF37) with #121212 text for maximum contrast.
- **Input Fields:** Darker surface (#1E1E1E) with a 1px border (#3F4942). The label should be Plus Jakarta Sans, Small Caps. Focus state triggers an Emerald border.
- **Cards:** Use the Surface-Container color (#1E1E1E). No shadows. Content is separated by generous internal padding (32px).
- **Navigation:** Fixed top bar using the Surface-Container color with a subtle 1px bottom border to separate it from the main content.
- **Trust Strip:** Large Gold metrics against a Deep Emerald background section to create a "Hero Moment" for institutional transparency.
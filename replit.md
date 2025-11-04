# Space Energy Landing Page

## Overview
A responsive landing page showcasing the company's brand with a full-screen satellite/Earth hero background. Built with React, TypeScript, and Tailwind CSS to match the existing website's design system.

## Design System
- **Fonts**: HelveticaNowText (body), HelveticaNowDisplay (headings) - fully integrated
- **Color Palette**: 
  - Primary: Teal-blue (#1e556b / hsl(192 51% 27%))
  - Backgrounds: White (light mode), Dark charcoal (dark mode)
  - Accent: Orange (#ff5625)
- **Border Radius**: 10px standard
- **Typography Scale**: Responsive sizing from mobile (40px h1) to desktop (80px h1)

## Landing Page Features (/)
- Full-screen fixed satellite/Earth background image
- No overlay dimming (background is naturally dark)
- Logo in top-left corner (white/inverted for contrast)
- Navigation links in top-right (stacked vertically on mobile, horizontal with pipes on desktop)
- "Space Energy for Earth" tagline at bottom
- All white text for contrast against dark space background
- Mobile-optimized: vertical nav stack, background positioned at 75% to show satellite clearly (Earth partially cropped on left)

## Assets Used
- Logo: Horizontal Black version (attached_assets/Horizontal Black_1762007292488.png)
- Satellite Background: Earth and satellite (client/public/satellite-earth.webp)
- Fonts: HelveticaNow Display and Text families (from website)
- Favicon: Overview circular logo SVG

## Technical Notes
- HelveticaNow fonts fully integrated from website assets
- Background positioned at 75% center to prioritize satellite visibility on all devices
- All navigation links are placeholder URLs ready for production configuration
- SEO meta tags configured
- Fully responsive across mobile, tablet, and desktop

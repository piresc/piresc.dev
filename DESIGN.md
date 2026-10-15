---
name: piresc.dev
description: Backend engineer portfolio. Quiet confidence through craft.
colors:
  ink: "#E1E0CC"
  accent: "#DEDBC8"
  accent-hover: "#E8E5D0"
  bg: "#000000"
  surface: "#101010"
  surface-strong: "#212121"
typography:
  display:
    fontFamily: "Zodiak, Georgia, serif"
    fontSize: "clamp(2.25rem, 6vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Zodiak, Georgia, serif"
    fontSize: "clamp(1.9rem, 4.6vw, 3.4rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(1.7rem, 3vw, 2.6rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "-0.005em"
  label:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(0.76rem, 0.7rem + 0.14vw, 0.88rem)"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  full: "999px"
spacing:
  xs: "2px"
  sm: "4px"
  md: "8px"
  lg: "16px"
  xl: "24px"
  section: "clamp(80px, 10vw, 128px)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.bg}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  chip:
    backgroundColor: "rgba(222, 219, 200, 0.03)"
    textColor: "rgba(222, 219, 200, 0.7)"
    rounded: "{rounded.full}"
    padding: "6px 12px"
---

# Design System: piresc.dev

## 1. Overview

**Creative North Star: "The Clean Architecture"**

A portfolio that feels like a well-maintained codebase: precise, systematic, nothing wasted. Every visual decision is analogous to a clean function signature: it does one thing, it names itself clearly, and it has no side effects on the surrounding system.

The system is dark, restrained, and unhurried. It uses two typefaces: Zodiak (serif) for display headings, and Satoshi (sans-serif) for body text, labels, and UI. The palette is monochromatic: pure black ground, warm cream ink, tonal grey surfaces for layering. Color strategy is Restrained: one warm neutral accent on ≤10% of any surface.

This system explicitly rejects template-driven dev portfolios, corporate LinkedIn energy, and over-designed agency aesthetics. It also rejects the AI-generated pattern language: no eyebrow scaffolding, no numbered section markers, no identical card grids, no reflex-reject font pairings.

**Key Characteristics:**
- Two-family typography: Zodiak serif for display/headings, Satoshi sans for body/UI
- Flat tonal depth: surface stepping, never shadows
- Content-height containers: no forced aspect ratios
- Motion via framer-motion with expo-out easing and reduced-motion respect
- Warm cream on pure black: high contrast, no tinted neutrals

## 2. Colors

A monochromatic warm-neutral palette on pure black. The warmth lives in the ink, not the ground.

### Primary
- **Warm Cream Ink** (#E1E0CC): Primary text color. Body copy, headings, and high-emphasis content against the black ground.
- **Cream Accent** (#DEDBC8): Interactive elements, links, section headings, CTA buttons. The single accent role.
- **Cream Hover** (#E8E5D0): Hover state for accent elements. Slightly brighter to indicate interactivity.

### Neutral
- **Pure Black** (#000000): Body background. The ground for the entire system.
- **Surface** (#101010): Card backgrounds, contained areas. First tonal step above black.
- **Surface Strong** (#212121): Elevated cards, timeline entries. Second tonal step.
- **Border** (rgba(222, 219, 200, 0.12)): Default dividers and card edges. Barely visible, structural.
- **Border Strong** (rgba(222, 219, 200, 0.25)): Hover-state borders. Visible but not heavy.
- **Muted** (rgba(222, 219, 200, 0.7)): Secondary text, descriptions. Meets 4.5:1 on black.
- **Subtle** (rgba(222, 219, 200, 0.6)): Tertiary text, metadata, periods. Meets 4.5:1 on black.

### Named Rules
**The One Accent Rule.** Cream is the only chromatic signal. No secondary colors, no semantic color coding, no gradients. The restraint IS the brand.

## 3. Typography

**Display Font:** Zodiak (serif, from Fontshare, with system serif fallback)
**Body Font:** Satoshi (sans-serif, from Fontshare, with system sans fallback)

**Character:** Zodiak brings editorial warmth and presence to section headings and hero text. Satoshi is a clean, versatile sans that reads comfortably at body sizes. Together they create typographic contrast without ornament.

### Hierarchy
- **Display** (Zodiak, 400, clamp(2.25rem, 6vw, 4.75rem), 0.95 line-height, -0.025em tracking): Section headings. Serif warmth at large scale.
- **Headline** (Zodiak, 400, clamp(1.9rem, 4.6vw, 3.4rem), 0.98 line-height, -0.02em tracking): Sub-section headings (Stack, Education).
- **Title** (Satoshi, 600, clamp(1.7rem, 3vw, 2.6rem), 1.0 line-height, -0.015em tracking): Company names, metric callouts. Semibold at moderate scale for emphasis.
- **Body** (Satoshi, 400, 1rem, 1.6 line-height, -0.005em tracking): All prose. Max line length 62ch.
- **Label** (Satoshi, 400-500, clamp(0.76rem, 0.7rem + 0.14vw, 0.88rem), 0.01em tracking): Metadata, periods, roles. Small but legible.
- **Stack Label** (Satoshi, 500, clamp(0.72rem, 0.68rem + 0.16vw, 0.8rem), uppercase, 0.18em tracking): Skill category headers only. Reserved for short categorical labels.

### Named Rules
**The Contrast Axis Rule.** Hierarchy is expressed through family contrast (Zodiak vs Satoshi) and weight contrast (400 → 600 within Satoshi). Two typefaces, committed contrast between steps.

## 4. Elevation

This system is flat. No box-shadows anywhere. Depth is conveyed entirely through tonal stepping: bg (#000) → surface (#101010) → surface-strong (#212121). Borders at 12% opacity provide structural edges without implying elevation.

The flatness is deliberate: it mirrors the "clean architecture" metaphor where layers are separated by interfaces, not by physical depth.

### Named Rules
**The No Shadow Rule.** Surfaces never lift. Hover states use border-opacity shifts, not elevation changes. If something needs more prominence, it gets a lighter tonal step, not a drop shadow.

## 5. Components

### Buttons
- **Shape:** Fully rounded (999px radius). Pill-shaped.
- **Primary:** Cream background (#DEDBC8), black text, 500 weight, px-6 py-3. Icon (arrow) in a black circle inset for hero CTA.
- **Hover:** Background shifts to #E8E5D0. Subtle icon translate-x (0.5px).
- **Ghost:** Transparent background, cream text, 1px border at --border opacity. Border strengthens on hover.
- **Focus:** 2px outline, 4px offset, cream color. Visible and unambiguous.

### Chips
- **Style:** Fully rounded (999px). 1px border at --border opacity. Near-transparent background (3% cream). Muted text.
- **Use:** Technology tags, proof-point pills. Not interactive.

### Cards / Containers
- **Corner Style:** None (0px radius). Sharp edges throughout.
- **Background:** --surface (default) or --surface-strong (elevated content).
- **Shadow Strategy:** None. See Elevation.
- **Border:** 1px at rgba(222, 219, 200, 0.12). Structural, not decorative.
- **Internal Padding:** 24px (p-6) default, 32px (p-8) on md+ for timeline entries.

### Navigation
- **Style:** Centered pill, black/80 background with backdrop-blur-xl, rounded-b-2xl on md.
- **Typography:** 14px, --muted color default.
- **Hover:** Shifts to --text color.
- **Focus:** 2px outline, 4px offset, cream.
- **Position:** Fixed top center within hero, then scrolls away.

### Hero CTA (Signature)
- **Structure:** Pill button with text label + circular black icon container (ArrowRight).
- **Hover:** Background brightens, icon container shifts 0.5px right.
- **Weight:** 500, text-sm to text-base responsive.

## 6. Do's and Don'ts

### Do:
- **Do** use weight contrast (300 vs 600) to create hierarchy within a single font family.
- **Do** use tonal stepping (#000 → #101 → #212) for all depth relationships.
- **Do** keep accent usage under 10% of any viewport. Cream headings + one CTA per fold.
- **Do** respect reduced motion via `useReducedMotion` on every animated component.
- **Do** use expo-out easing ([0.22, 1, 0.36, 1]) for all reveal animations.
- **Do** cap display headings at clamp max ≤ 6rem with tracking ≥ -0.04em.
- **Do** maintain 4.5:1 contrast minimum on all body text roles.

### Don't:
- **Don't** use eyebrow scaffolding (tiny uppercase tracked labels above every section heading).
- **Don't** use numbered section markers (01 / 02 / 03) on unranked content.
- **Don't** use identical card grids across multiple sections. Each section earns its own layout.
- **Don't** use gradient text, side-stripe borders, or glassmorphism.
- **Don't** use generic dev portfolio patterns: template-driven dark themes with no point of view.
- **Don't** use corporate/enterprise patterns: stiff, formal, LinkedIn-profile energy, buzzwords.
- **Don't** introduce a third font family. The two-family system (Zodiak display + Satoshi body) is the system.
- **Don't** add shadows or elevation. Flat tonal layering only.
- **Don't** use forced aspect ratios on content cards. Let content dictate height.
- **Don't** use em dashes in copy. Use commas, colons, semicolons, or periods.

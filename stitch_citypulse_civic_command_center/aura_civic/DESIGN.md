---
name: Aura Civic
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#00668a'
  on-secondary: '#ffffff'
  secondary-container: '#40c2fd'
  on-secondary-container: '#004d6a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002114'
  on-tertiary-container: '#009669'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#68fcbf'
  tertiary-fixed-dim: '#45dfa4'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.035em
  display-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-xs:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  metric-display:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 3rem
  margin-tablet: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies an atmospheric, hyper-refined civic intelligence interface where the ambient clarity of Apple Weather converges with the technical precision of Vercel. 

### Brand Personality & Emotional Intent
- **Transparent & Calming:** Demystifies complex environmental and civic metrics (air quality, transit cadence, water purity, municipal power grids) without inducing anxiety.
- **Architectural & Breathable:** Prioritizes generous whitespace, structural rhythm, and spatial calm over decorative density.
- **Vigilant yet Welcoming:** Balances the authority of public health infrastructure with the tactile warmth of consumer lifestyle software.

### Aesthetic Movement
The design language is **Minimalist-Glassmorphic Precision**:
- Layered off-white and zinc tinted surfaces (`#F8FAFC`, `#FFFFFF`) ground the viewport.
- Ultra-subtle frosted glass headers and overlays (12px–20px blur, 75% opacity) allow soft contextual bleed.
- Hairline borders (`1px solid rgba(15, 23, 42, 0.06)`) define structural boundaries without visual weight.
- Pastel environmental indicators provide immediate status readouts without harsh alarmism.

## Colors

The palette is engineered around an ultra-clean, clinical-yet-inviting light canvas. Environmental state mapping uses soft, pastel accents calibrated for high readability and low visual fatigue.

### Core Foundation
- **Canvas Base:** `#F8FAFC` (Slate 50) — Crisp, cool ambient canvas.
- **Surface Layer:** `#FFFFFF` — Pure white for container elevations and primary card bodies.
- **Surface Subdued:** `rgba(241, 245, 249, 0.7)` — Light grey fill for inset modules and nested data blocks.
- **Hairline Border:** `rgba(15, 23, 42, 0.06)` — Standard boundary for all container edges.

### Typography & Content Tokens
- **Primary Ink:** `#0F172A` (Slate 900) — High-contrast, precise reading color for headlines, active metrics, and primary buttons.
- **Secondary Ink:** `#475569` (Slate 600) — Sub-headlines, metadata, and supporting metrics.
- **Muted Ink:** `#94A3B8` (Slate 400) — Captions, disabled indicators, micro-labels, and grid axis text.

### Civic Health Indicator Accents
- **Optimal (Mint Green):**
  - Surface: `#ECFDF5` | Border: `rgba(52, 211, 153, 0.25)` | Foreground: `#059669`
  - Used for clean air index, optimal transit flow, and normal water levels.
- **Advisory (Soft Sky Blue):**
  - Surface: `#F0F9FF` | Border: `rgba(56, 189, 248, 0.25)` | Foreground: `#0284C7`
  - Used for cooling centers, scheduled municipal operations, and normal fluctuations.
- **Moderate (Warm Peach / Amber):**
  - Surface: `#FFFBEB` | Border: `rgba(251, 191, 36, 0.28)` | Foreground: `#D97706`
  - Used for ozone warnings, moderate pollen, and transit delays.
- **Action Required (Gentle Coral):**
  - Surface: `#FFF1F2` | Border: `rgba(251, 113, 133, 0.25)` | Foreground: `#E11D48`
  - Used for heat advisories, unhealthful AQI thresholds, and boil-water notices.

## Typography

The type system is built solely on **Inter**, tuned for tabular precision, data density, and contemporary editorial flow.

### Hierarchical Directives
- **Metrics & Telemetry:** Large scale numeric readouts (AQI ratings, temperatures, particulate matter counts) utilize `metric-display` with tabular numbers (`font-feature-settings: "tnum" 1`) and negative tracking to preserve horizontal rhythm.
- **Section Headers & Context:** Utilize `headline-md` and `headline-sm` with tight tracking (`-0.02em`) to mirror developer-grade technical dashboards.
- **Micro-Data & Badges:** `label-xs` utilizes uppercase transformations with positive letter spacing (`0.04em`) to establish visual separation between descriptive category tags and raw numeric figures.

## Layout & Spacing

The structural layout uses a flexible **12-column fluid grid** flanked by generous margins, enforcing breathable separation between data telemetry clusters.

### Breakpoints & Layout Adapters
- **Desktop (1280px+):** 12-column grid, max-width `1360px`, `margin: 3rem`, `gutter: 1.5rem`. Primary layout displays hero status widgets alongside multi-metric secondary grids.
- **Tablet (768px – 1279px):** 8-column grid, `margin-tablet: 1.5rem`, `gutter: 1.25rem`. Content reflows into dual-column cards; interactive charts maintain full column spans.
- **Mobile (Below 768px):** 4-column grid or single-column stack, `margin-mobile: 1rem`, `gutter-mobile: 0.75rem`. Widgets convert to vertically nested card blocks with horizontal swipe drawers for time-series charts.

### Spatial Rationale
- Inner card padding strictly uses `space-lg` (`1.5rem`) on desktop and `space-md` (`1rem`) on mobile to maintain internal roominess.
- Related telemetry pairs within cards are bound with tight `space-xs` (`0.25rem`) or `space-sm` (`0.5rem`) gaps to preserve data grouping.

## Elevation & Depth

Visual depth avoids heavy drop shadows, relying instead on stacked tonal surfaces, frosted ambient layers, and low-contrast perimeter hairlines.

### Tonal Stratification
- **Level 0 (Atmosphere Canvas):** `#F8FAFC`. The foundational backdrop.
- **Level 1 (Structural Card):** `#FFFFFF` with border `1px solid rgba(15, 23, 42, 0.05)` and subtle micro-shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.03), 0 4px 16px -2px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Active / Raised Interactive Layer):** `#FFFFFF` with border `1px solid rgba(15, 23, 42, 0.08)` and ambient lift: `0 10px 30px -4px rgba(15, 23, 42, 0.06), 0 4px 8px -2px rgba(15, 23, 42, 0.02)`.
- **Level 3 (Overlay & Modal Shelves):** Backdrop-filter `blur(20px) saturate(180%)`, surface `rgba(255, 255, 255, 0.85)`, and border `1px solid rgba(255, 255, 255, 0.5)`.

### Frosted Navigation & Banners
Floating city-switcher pills, sticky headers, and real-time refresh tickers float above the grid using:
```css
background: rgba(248, 250, 252, 0.75);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border-bottom: 1px solid rgba(15, 23, 42, 0.06);
```

## Shapes

The interface balances welcoming consumer curves with the structured geometry of civic dashboards.

### Corner Radius System
- **Main Metric Cards & Containers:** `rounded-2xl` (`1rem` to `1.25rem` / `16px–20px`). Softens dense environmental data and creates a calm, handheld tactile quality.
- **Nested Sub-Panels & Data Trays:** `rounded-xl` (`0.75rem` / `12px`). Ensures harmonious nested geometry inside parent cards.
- **Badges, Status Chips & Pills:** Full pill radius (`9999px`). Signals dynamic state, categorical filters, and quick toggles.
- **Interactive Inputs & Action Buttons:** `rounded-lg` (`0.5rem` / `8px`). Provides a slightly more defined, confident touchpoint.

## Components

### 1. Cards (Civic Metric Blocks)
- **Base Style:** Surface `#FFFFFF`, border `1px solid rgba(15, 23, 42, 0.06)`, `border-radius: 1.25rem`, padding `1.5rem`.
- **Structure:** 
  - Header: Micro category tag (`label-xs` uppercase) + live pulsing indicator dot.
  - Body: Prominent readout (`metric-display`) with inline delta label.
  - Footer: Sparkline chart or textual advisory note set in `body-sm`.
- **States:** Hovering interactive cards scales depth to Level 2 with a transition curve of `cubic-bezier(0.16, 1, 0.3, 1) 200ms`.

### 2. Status Chips & Badges
- **Structure:** Height `24px`, horizontal padding `10px`, `border-radius: 9999px`.
- **Color Mapping:**
  - *Optimal:* Background `#ECFDF5`, text `#059669`, border `rgba(52, 211, 153, 0.3)`.
  - *Advisory:* Background `#F0F9FF`, text `#0284C7`, border `rgba(56, 189, 248, 0.3)`.
  - *Moderate:* Background `#FFFBEB`, text `#D97706`, border `rgba(251, 191, 36, 0.3)`.
  - *Action:* Background `#FFF1F2`, text `#E11D48`, border `rgba(251, 113, 133, 0.3)`.

### 3. Buttons
- **Primary:** Background `#0F172A`, text `#FFFFFF`, radius `0.5rem`, height `40px`, padding `0 1rem`, typography `label-md`. Hover background: `#1E293B`.
- **Secondary / Ghost:** Background `rgba(15, 23, 42, 0.04)`, text `#0F172A`, border `1px solid rgba(15, 23, 42, 0.06)`. Hover background: `rgba(15, 23, 42, 0.08)`.
- **Glass Floating Action:** Background `rgba(255, 255, 255, 0.8)`, backdrop-filter `blur(12px)`, border `1px solid rgba(15, 23, 42, 0.08)`, text `#0F172A`.

### 4. Input Fields & Search
- **Container:** Height `44px`, background `#FFFFFF`, border `1px solid rgba(15, 23, 42, 0.1)`, radius `0.75rem`, text `#0F172A`, placeholder `#94A3B8`.
- **Focus State:** Border color `#0F172A`, box-shadow `0 0 0 3px rgba(15, 23, 42, 0.05)`. Outline: none.

### 5. Checkboxes & Radio Controls
- **Geometry:** `18px x 18px`, radius `4px` (checkbox) or `9999px` (radio).
- **Default:** Border `1.5px solid #CBD5E1`, background `#FFFFFF`.
- **Checked:** Background `#0F172A`, border-color `#0F172A`, white interior mark.

### 6. Lists & Live Advisory Feeds
- **Row Styling:** Subtle divider `1px solid rgba(15, 23, 42, 0.04)`, row padding `12px 0`.
- **Hover:** Background `rgba(241, 245, 249, 0.5)` with `border-radius: 0.5rem`.

### 7. Civic Domain Extensions
- **Sparklines & Mini Area Charts:** Gradient fill fading from pastel indicator hue (`rgba(56, 189, 248, 0.2)`) to transparent (`rgba(255, 255, 255, 0)`), stroke width `1.5px`.
- **Pulse Indicators:** `6px x 6px` dot centered within a soft breathing ring that animates from `opacity: 0.8` to `opacity: 0` via a 2-second keyframe pulse.
---
name: Terminal GIS
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.005em
  headline-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  body-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 12px
    letterSpacing: 0.03em
  code-dense:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 13px
    letterSpacing: 0em
spacing:
  gutter: 1px
  margin: 0px
  space-xs: 0.125rem
  space-sm: 0.25rem
  space-md: 0.5rem
  space-lg: 0.75rem
  space-xl: 1rem
---

## Brand & Style

This design system establishes an ultra-dense, uncompromising operational environment engineered for intelligence analysts, geospatial data scientists, and infrastructure operators. It merges the tabular data density and rapid key-driven scanning of financial terminals with the coordinate-precise spatial rigor of advanced geographic information systems.

The aesthetic philosophy centers on pure utility, high informational velocity, and cognitive clarity under pressure:
- **Utilitarian Brutalism & Instrumental Precision:** Decorative elements, organic curves, diffuse ambient shadows, and stylistic neon glows are strictly eliminated. Every pixel and line serves a measurable purpose: partition, containment, status designation, or measurement.
- **Zero-Friction Cognitive Scanning:** Visual hierarchy is enforced strictly through rigid structural division, 1px geometric borders, and calibrated semantic status markers against deep absorption backgrounds.
- **Institutional Authority:** Surfaces behave like mission-critical instrument panels. The emotional response is one of absolute technical control, uncompromised fidelity, and zero ambiguity.

## Colors

The palette is strictly dark mode, built from deep slate bases engineered to reduce ocular fatigue across multi-monitor terminal arrays while maintaining maximum contrast for data visualization and GIS overlays.

### Surface Architecture
- **Canvas Base (`slate-950` / `#020617`):** The foundational substrate for map viewports, spatial canvases, and structural gutter separators.
- **Panel Surface (`slate-900` / `#0F172A`):** The standard background for docked toolbars, sidebars, data grids, and inspection panels.
- **Surface Elevated (`slate-800/80` / `#1E293B`):** Used exclusively for context menus, active table rows, command bars, and selected viewport overlays.
- **Structural Rules (`slate-800` / `#1E293B`):** The universal 1px border value used to separate panels, headers, and coordinate modules.

### Functional Status System
Colors must never be used decoratively. They function strictly as state indicators:
- **INFO / Navigation (`#3B82F6`):** Steel blue for active vector selections, informational callouts, active coordinate flags, and neutral telemetry cursors.
- **OPTIMAL / STABLE (`#10B981`):** Functional emerald for nominal telemetry, nominal system locks, valid topologies, and verified data pipelines.
- **WARNING (`#F59E0B`):** Focused amber for threshold excursions, degraded GPS accuracy, low latency anomalies, and pending operations.
- **CRITICAL / ALERT (`#EF4444`):** High-saturation pure red reserved strictly for system failures, geospatial boundary violations, critical breaches, and data collisions.
- **Baseline Neutral (`#64748B` to `#94A3B8`):** Muted slate tones for non-critical metadata, grid axes, inactive spatial layers, and table header definitions.

## Typography

Typography prioritizes information density, character differentiation, and vertical spatial efficiency over display flare.

### Structural Division
- **Proportional UI Type (`Inter`):** Assigned to structural navigation, section headers, column labels, status descriptions, and modal titles. Selected for its low horizontal footprint, structural neutrality, and legible rendering at sub-12px sizes.
- **Monospaced Data Type (`JetBrains Mono`):** Non-negotiable for all numeric variables, timestamps (UTC), coordinate notations (WGS84/MGRS/UTM), zoom levels, memory registers, sparkline tooltips, and tabular telemetry. Tabular numbers prevent jitter during real-time streaming updates.

### Usage Rules
- **No Large Hero Sizes:** Maximum headline sizes cap at 18px. Screen real estate belongs to spatial data and tabular feeds.
- **All-Caps Micro Headers:** Section group headers and column titles use `label-sm` with uppercase transformation and a slight letter-spacing expansion (`0.03em`) for immediate section demarcation without increasing vertical height.

## Layout & Spacing

The layout model is governed by a **tiled panel framework** rather than a floating web page grid. The viewport spans 100% of the screen height and width (`100vh` / `100vw`) with zero outer margins.

### Tiling & Grid Mechanism
- **1px Rule Guttering:** Adjacent functional panels (e.g., Vector Map Canvas, Attributes Table, Telemetry Ledger) do not use whitespace margins. Panels are packed edge-to-edge, separated strictly by a continuous `1px solid #1E293B` border.
- **Component Padding Scale:**
  - `space-xs` (2px): Compact table row vertical cell spacing, micro-badge padding.
  - `space-sm` (4px): Standard input vertical padding, icon-to-label gaps, chip containers.
  - `space-md` (8px): Panel header padding, standard component horizontal margins.
  - `space-lg` (12px): Inspector flyout interior margin, metric block separation.
  - `space-xl` (16px): Maximum internal padding allowed for major modal overlays.

### Screen Adaptability
- **Desktop (>= 1440px):** Multi-dock arrangement. Dedicated primary spatial deck with persistent auxiliary side-ledgers (320px fixed) and a bottom-pinned collapsible attribute ledger (240px fixed).
- **Mobile & Tablet (< 1024px):** Layout falls back to a tabbed full-bleed viewport where Map, Ledger, and Status exist as exclusive switchable views, retaining the 0px margin, high-density paradigm.

## Elevation & Depth

This system avoids ambient blur shadows and skeuomorphic depth. Depth is communicated strictly through surface brightness shifting, border delineation, and solid structural overlays.

### Depth Layers
- **Layer 0 (Canvas Substrate):** The map or raw visual deck (`#020617`).
- **Layer 1 (Tiled Containers):** Static docked panels, status bars, and inspection sidebars (`#0F172A`), delineated by a 1px border (`#1E293B`).
- **Layer 2 (Interactive Floating Tools):** Floating spatial toolbars, coordinate crosshair readouts, and scale legends. These sit directly on Layer 0 with a high-opacity solid fill (`#0F172A`) and an exact `1px solid #334155` border to guarantee separation from dynamic map features.
- **Layer 3 (Modal / Critical Overlays):** Command palettes and critical alert confirmation frames. Rendered with an absolute solid background (`#0F172A`), framed by a 1px border matching the operation's severity (e.g., `#EF4444` for system critical, `#3B82F6` for command palette), accompanied by an unblurred, 60% opacity solid black scrim (`#00000099`).

## Shapes

All interactive components, containers, inputs, table rows, and popovers use sharp geometry (`roundedness: 0` / `0px` border-radius). 

Sharp geometry reflects institutional terminal hardware, eliminates antialiasing blur at container intersections, and maximizes usable display area down to the single pixel. Where micro-badges or tags require differentiation, structural corner notches or 1px border encasings are applied rather than rounded corners.

## Components

### Buttons & Action Triggers
- **Geometry:** Height strictly constrained to 24px (compact) or 28px (standard). Border radius is 0px.
- **Primary:** `#3B82F6` background with `#FFFFFF` text, `font-family: JetBrains Mono`, 11px uppercase. Hover: `#2563EB`. Active: `#1D4ED8`.
- **Secondary / Ghost:** Transparent background with `1px solid #1E293B`, `#94A3B8` text. Hover: `#1E293B` background with `#F8FAFC` text.
- **Destructive:** `1px solid #EF4444` outline, transparent fill, `#EF4444` text. On hover, fills solid `#EF4444` with `#FFFFFF` text.

### Data Tables & Attribute Grids
- **Header:** Height 22px, background `#090D16`, text 10px uppercase `Inter` bold, border-bottom `1px solid #1E293B`.
- **Rows:** Height 20px (condensed) or 24px (standard). Alternating rows take `#0F172A` and `#0B1120`. Border-bottom `1px solid #161F30`.
- **Cell Content:** Text aligns vertically center. All numerical figures, dates, and geographic values render in `JetBrains Mono` 11px, aligned right.

### Input Fields & Search Bars
- **Surface:** Fill `#020617`, border `1px solid #1E293B`, focus border `1px solid #3B82F6`. No outline rings or glow shadows.
- **Typography:** `JetBrains Mono` 11px. Placeholders use `#475569`.
- **Height:** 24px fixed. Padding is horizontal 6px, vertical 0px.

### Status Chips & Badges
- **Form:** Boxy, non-rounded tags. Height 16px. Border `1px solid [Status-Color]`, background `rgba([Status-Color], 0.12)`, text `[Status-Color]` in `JetBrains Mono` 10px uppercase.
- **Live Indicator:** A 4px × 4px square dot (never a soft circle) precedes the text label.

### Micro-Charts & Sparklines
- **Format:** Inline visual bars or path graphs fitting inside 16px row heights. 
- **Stroke:** 1px width, no gradient area fills underneath. Baseline is marked by a single `#334155` dotted rule.

### Checkboxes & Toggle Switches
- **Checkboxes:** 12px × 12px square, border `1px solid #475569`, background `#020617`. Selected state shows a filled `#3B82F6` square with a hard 2px inset border instead of an organic checkmark vector.
- **Switches:** Replaced with two-state segmented block buttons (`[ OFF | ON ]`) using monospaced text to eliminate ambiguity.
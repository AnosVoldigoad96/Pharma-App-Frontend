# Supabase Theme - Color Reference Guide

## 🎨 Color Palette Overview

This document provides a visual and technical reference for all colors in the Supabase theme.

---

## Light Mode Colors (`:root`)

### Background & Foreground
```css
--background: oklch(0.9911 0 0);        /* Near white, almost pure */
--foreground: oklch(0.2046 0 0);        /* Very dark gray, readable text */
```
**Usage**: Main page background and body text color
**Example**: `bg-background text-foreground`

---

### Primary (Brand Color - Teal/Green)
```css
--primary: oklch(0.8348 0.1302 160.9080);              /* Vibrant teal */
--primary-foreground: oklch(0.2626 0.0147 166.4589);   /* Dark teal text */
```
**Usage**: Buttons, links, important UI elements, Supabase brand color
**Example**: `bg-primary text-primary-foreground`
**Visual**: A vibrant teal/green - the signature Supabase color

---

### Secondary
```css
--secondary: oklch(0.9940 0 0);         /* Almost white */
--secondary-foreground: oklch(0.2046 0 0); /* Dark gray */
```
**Usage**: Secondary buttons, less prominent UI elements
**Example**: `bg-secondary text-secondary-foreground`

---

### Muted
```css
--muted: oklch(0.9461 0 0);             /* Light gray */
--muted-foreground: oklch(0.2435 0 0);  /* Medium-dark gray */
```
**Usage**: Disabled states, subtle backgrounds, secondary text
**Example**: `bg-muted text-muted-foreground`

---

### Accent
```css
--accent: oklch(0.9461 0 0);            /* Light gray */
--accent-foreground: oklch(0.2435 0 0); /* Medium-dark gray */
```
**Usage**: Hover states, highlights, call-to-action elements
**Example**: `bg-accent text-accent-foreground`

---

### Destructive (Errors, Warnings)
```css
--destructive: oklch(0.5523 0.1927 32.7272);        /* Orange-red */
--destructive-foreground: oklch(0.9934 0.0032 17.2118); /* Off-white */
```
**Usage**: Error messages, delete buttons, warnings
**Example**: `bg-destructive text-destructive-foreground`
**Visual**: A warm orange-red, not too harsh

---

### Card & Popover
```css
--card: oklch(0.9911 0 0);              /* Near white */
--card-foreground: oklch(0.2046 0 0);   /* Dark gray */
--popover: oklch(0.9911 0 0);           /* Near white */
--popover-foreground: oklch(0.4386 0 0); /* Medium gray */
```
**Usage**: Card components, dropdown menus, tooltips
**Example**: `bg-card text-card-foreground`

---

### Borders & Inputs
```css
--border: oklch(0.9037 0 0);            /* Light gray border */
--input: oklch(0.9731 0 0);             /* Very light gray */
--ring: oklch(0.8348 0.1302 160.9080);  /* Teal focus ring */
```
**Usage**: Borders, input fields, focus indicators
**Example**: `border-border bg-input focus:ring-ring`

---

### Charts
```css
--chart-1: oklch(0.8348 0.1302 160.9080);  /* Teal */
--chart-2: oklch(0.6231 0.1880 259.8145);  /* Purple */
--chart-3: oklch(0.6056 0.2189 292.7172);  /* Pink/Magenta */
--chart-4: oklch(0.7686 0.1647 70.0804);   /* Yellow-green */
--chart-5: oklch(0.6959 0.1491 162.4796);  /* Cyan */
```
**Usage**: Data visualization, graphs, charts
**Example**: `fill-chart-1`, `stroke-chart-2`

---

### Sidebar
```css
--sidebar: oklch(0.9911 0 0);                          /* Near white */
--sidebar-foreground: oklch(0.5452 0 0);               /* Medium gray */
--sidebar-primary: oklch(0.8348 0.1302 160.9080);       /* Teal */
--sidebar-primary-foreground: oklch(0.2626 0.0147 166.4589); /* Dark teal */
--sidebar-accent: oklch(0.9461 0 0);                   /* Light gray */
--sidebar-accent-foreground: oklch(0.2435 0 0);        /* Medium-dark gray */
--sidebar-border: oklch(0.9037 0 0);                   /* Light gray */
--sidebar-ring: oklch(0.8348 0.1302 160.9080);          /* Teal */
```
**Usage**: Sidebar navigation components
**Example**: `bg-sidebar text-sidebar-foreground`

---

## Dark Mode Colors (`.dark`)

### Background & Foreground
```css
--background: oklch(0.1822 0 0);        /* Very dark, almost black */
--foreground: oklch(0.9288 0.0126 255.5078); /* Off-white with slight blue tint */
```
**Usage**: Main dark page background and light text
**Example**: `dark:bg-background dark:text-foreground`

---

### Primary (Dark Mode)
```css
--primary: oklch(0.4365 0.1044 156.7556);      /* Darker teal */
--primary-foreground: oklch(0.9213 0.0135 167.1556); /* Light teal-white */
```
**Usage**: Primary elements in dark mode
**Example**: `dark:bg-primary dark:text-primary-foreground`
**Visual**: A more subdued, darker teal suitable for dark backgrounds

---

### Secondary (Dark Mode)
```css
--secondary: oklch(0.2603 0 0);         /* Dark gray */
--secondary-foreground: oklch(0.9851 0 0); /* Almost white */
```
**Usage**: Secondary UI in dark mode
**Example**: `dark:bg-secondary dark:text-secondary-foreground`

---

### Muted (Dark Mode)
```css
--muted: oklch(0.2393 0 0);             /* Dark gray */
--muted-foreground: oklch(0.7122 0 0);  /* Light gray */
```
**Usage**: Muted elements in dark mode
**Example**: `dark:bg-muted dark:text-muted-foreground`

---

### Accent (Dark Mode)
```css
--accent: oklch(0.3132 0 0);            /* Medium-dark gray */
--accent-foreground: oklch(0.9851 0 0); /* Almost white */
```
**Usage**: Accents and highlights in dark mode
**Example**: `dark:bg-accent dark:text-accent-foreground`

---

### Destructive (Dark Mode)
```css
--destructive: oklch(0.3123 0.0852 29.7877);    /* Dark orange-red */
--destructive-foreground: oklch(0.9368 0.0045 34.3092); /* Light peach */
```
**Usage**: Errors in dark mode
**Example**: `dark:bg-destructive dark:text-destructive-foreground`

---

### Card & Popover (Dark Mode)
```css
--card: oklch(0.2046 0 0);              /* Dark gray */
--card-foreground: oklch(0.9288 0.0126 255.5078); /* Off-white */
--popover: oklch(0.2603 0 0);           /* Slightly lighter dark */
--popover-foreground: oklch(0.7348 0 0); /* Medium-light gray */
```
**Usage**: Cards and dropdowns in dark mode
**Example**: `dark:bg-card dark:text-card-foreground`

---

### Borders & Inputs (Dark Mode)
```css
--border: oklch(0.2809 0 0);            /* Medium-dark gray */
--input: oklch(0.2603 0 0);             /* Dark gray */
--ring: oklch(0.8003 0.1821 151.7110);  /* Bright teal ring */
```
**Usage**: Borders and inputs in dark mode
**Example**: `dark:border-border dark:bg-input`

---

### Charts (Dark Mode)
```css
--chart-1: oklch(0.8003 0.1821 151.7110);  /* Bright teal */
--chart-2: oklch(0.7137 0.1434 254.6240);  /* Bright purple */
--chart-3: oklch(0.7090 0.1592 293.5412);  /* Pink */
--chart-4: oklch(0.8369 0.1644 84.4286);   /* Yellow */
--chart-5: oklch(0.7845 0.1325 181.9120);  /* Cyan */
```
**Usage**: Data visualization in dark mode
**Note**: Brighter, more saturated colors for better visibility on dark backgrounds

---

### Sidebar (Dark Mode)
```css
--sidebar: oklch(0.1822 0 0);                      /* Very dark */
--sidebar-foreground: oklch(0.6301 0 0);           /* Medium gray */
--sidebar-primary: oklch(0.4365 0.1044 156.7556);   /* Dark teal */
--sidebar-primary-foreground: oklch(0.9213 0.0135 167.1556); /* Light teal */
--sidebar-accent: oklch(0.3132 0 0);               /* Medium-dark */
--sidebar-accent-foreground: oklch(0.9851 0 0);    /* Almost white */
--sidebar-border: oklch(0.2809 0 0);               /* Dark gray */
--sidebar-ring: oklch(0.8003 0.1821 151.7110);      /* Bright teal */
```

---

## Design Tokens

### Typography
```css
--font-sans: Outfit, sans-serif;
--font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
--font-mono: monospace;
```

### Border Radius
```css
--radius: 0.5rem;           /* Base: 8px */
--radius-sm: 0.125rem;      /* 2px */
--radius-md: 0.25rem;       /* 4px */
--radius-lg: 0.5rem;        /* 8px */
--radius-xl: 0.625rem;      /* 10px */
```
**Usage**: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`

### Shadows
```css
--shadow-2xs: 0px 1px 3px 0px hsl(0 0% 0% / 0.09);
--shadow-xs: 0px 1px 3px 0px hsl(0 0% 0% / 0.09);
--shadow-sm: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17);
--shadow: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17);
--shadow-md: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 2px 4px -1px hsl(0 0% 0% / 0.17);
--shadow-lg: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 4px 6px -1px hsl(0 0% 0% / 0.17);
--shadow-xl: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 8px 10px -1px hsl(0 0% 0% / 0.17);
--shadow-2xl: 0px 1px 3px 0px hsl(0 0% 0% / 0.43);
```
**Usage**: `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`
**Note**: Subtle shadows designed for the Supabase aesthetic

### Letter Spacing (Tracking)
```css
--tracking-normal: 0.025em;     /* Base tracking */
--tracking-tighter: -0.025em;   /* Tighter */
--tracking-tight: 0em;          /* Tight */
--tracking-wide: 0.05em;        /* Wide */
--tracking-wider: 0.075em;      /* Wider */
--tracking-widest: 0.125em;     /* Widest */
```

---

## OKLCH Color Space Benefits

The Supabase theme uses **OKLCH** (OK Lightness Chroma Hue) color space instead of traditional RGB or HSL:

✅ **Perceptually uniform** - Equal changes in values = equal visual differences
✅ **Better color gradients** - Smoother transitions without muddy colors
✅ **Wider color gamut** - Access to more vibrant colors
✅ **Predictable lightness** - `oklch(0.5 ...)` is always 50% lightness
✅ **Better accessibility** - Easier to maintain contrast ratios

---

## Common Usage Patterns

### Button Examples
```tsx
// Primary Button
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Primary Action
</button>

// Secondary Button
<button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
  Secondary Action
</button>

// Destructive Button
<button className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
  Delete
</button>
```

### Card Example
```tsx
<div className="bg-card text-card-foreground rounded-lg shadow-md border border-border p-6">
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-muted-foreground">Card description text</p>
</div>
```

### Input Example
```tsx
<input 
  type="text"
  className="bg-input border border-border rounded-md px-4 py-2 focus:ring-2 focus:ring-ring"
  placeholder="Enter text..."
/>
```

---

## Theme Switching

To enable dark mode, add the `.dark` class to the `<html>` element:
```tsx
<html className="dark">
  {/* All colors will automatically switch to dark mode variants */}
</html>
```

Or use next-themes for automatic dark mode detection:
```tsx
import { ThemeProvider } from "@/components/theme-provider"

<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

---

## Visual Color Preview

### Light Mode Palette
- **Background**: Near-white (99.11% lightness)
- **Primary**: Vibrant teal - Supabase signature color
- **Muted**: Soft light gray for subtle elements
- **Destructive**: Warm orange-red for errors
- **Charts**: Colorful palette (teal, purple, pink, yellow-green, cyan)

### Dark Mode Palette
- **Background**: Very dark (18.22% lightness)
- **Primary**: Deeper teal, less bright
- **Muted**: Darker grays with good contrast
- **Destructive**: Darker red-orange
- **Charts**: Brighter, more saturated for visibility

---

## Resources

- [OKLCH Color Picker](https://oklch.com)
- [Supabase Brand Guidelines](https://supabase.com/brand-assets)
- [Tailwind CSS Color Documentation](https://tailwindcss.com/docs/customizing-colors)

# Theme & Styling Documentation

Complete guide to theming, styling, and customization in ePharmatica.

## Overview

The ePharmatica platform uses a modern theming system built on:
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui components** - Pre-built, customizable UI components
- **CSS custom properties** - Dynamic theme variables
- **OKLCH color space** - Perceptually uniform colors
- **Supabase Theme** - Clean, professional design system

## Current Theme

The project uses the **Supabase theme** with a vibrant teal/green primary color and support for both light and dark modes.

### Key Colors

**Light Mode:**
- Background: Near-white `oklch(0.9911 0 0)`
- Primary: Vibrant teal `oklch(0.8348 0.1302 160.9080)`
- Foreground: Dark text `oklch(0.2046 0 0)`

**Dark Mode:**
- Background: Very dark `oklch(0.1822 0 0)`
- Primary: Darker teal `oklch(0.4365 0.1044 156.7556)`
- Foreground: Light text `oklch(0.9288 0.0126 255.5078)`

See complete color reference in [THEME_COLOR_REFERENCE.md](../../THEME_COLOR_REFERENCE.md)

## Theme Configuration

### Static Theme (Current Setup)

**File:** `app/globals.css`

The theme is defined using CSS custom properties:

```css
:root {
  --background: oklch(0.9911 0 0);
  --foreground: oklch(0.2046 0 0);
  --primary: oklch(0.8348 0.1302 160.9080);
  /* ... more colors */
}

.dark {
  --background: oklch(0.1822 0 0);
  --foreground: oklch(0.9288 0.0126 255.5078);
  --primary: oklch(0.4365 0.1044 156.7556);
  /* ... dark mode colors */
}
```

### Dynamic Theme (Database-Driven)

**Feature Flag:** `lib/theme-config.ts`

```typescript
export const ENABLE_DATABASE_COLORS = false;  // Currently disabled
```

**When enabled:**
- Theme colors fetched from `site_settings` table
- Supports per-site customization
- Colors stored in JSONB format
- Can switch between light/dark or single theme

**Database Structure:**
```typescript
site_settings.colors = {
  light: {
    background: "oklch(...)",
    primary: "oklch(...)",
    // ... all color tokens
  },
  dark: {
    background: "oklch(...)",
    primary: "oklch(...)",
    // ... dark variants
  }
}
```

## Theme System Architecture

```
app/globals.css (Static theme CSS variables)
    ↓
lib/theme-config.ts (Feature flag)
    ↓
[if ENABLE_DATABASE_COLORS = true]
    ↓
site_settings table (Database colors)
    ↓
components/theme-injector.tsx (Server-side injection)
components/theme-script.tsx (Client-side application)
```

## Customizing Colors

### Method 1: Edit globals.css (Recommended)

1. Open `app/globals.css`
2. Find the `:root` or `.dark` section
3. Modify color values:

```css
:root {
  --primary: oklch(0.7 0.2 280);  /* Change to purple */
  --primary-foreground: oklch(1 0 0);  /* White text */
}
```

4. Save and refresh - changes are immediate in development

### Method 2: Use shadcn Theme Installer

```bash
# Browse themes at https://ui.shadcn.com/themes
npx shadcn@latest add https://tweakcn.com/r/themes/[theme-name].json
```

This will update `globals.css` with the new theme.

### Method 3: Database-Driven Theme

1. Enable the feature:
   ```typescript
   // lib/theme-config.ts
   export const ENABLE_DATABASE_COLORS = true;
   ```

2. Update `site_settings` table:
   ```sql
   UPDATE site_settings
   SET colors = '{
     "light": {
       "primary": "oklch(0.7 0.2 280)",
       "background": "oklch(1 0 0)"
     }
   }'::jsonb;
   ```

3. Restart the dev server

## Color Tokens Reference

### Available Tokens

| Token | Purpose | Example Usage |
|-------|---------|---------------|
| `background` | Page background | `bg-background` |
| `foreground` | Text color | `text-foreground` |
| `primary` | Brand color, CTA buttons | `bg-primary` |
| `primary-foreground` | Text on primary | `text-primary-foreground` |
| `secondary` | Secondary buttons | `bg-secondary` |
| `muted` | Subtle backgrounds | `bg-muted` |
| `muted-foreground` | Subtle text | `text-muted-foreground` |
| `accent` | Highlights, hover states | `bg-accent` |
| `destructive` | Errors, delete actions | `bg-destructive` |
| `border` | Borders | `border-border` |
| `input` | Input backgrounds | `bg-input` |
| `ring` | Focus rings | `focus:ring-ring` |
| `card` | Card backgrounds | `bg-card` |
| `popover` | Dropdown/tooltip bg | `bg-popover` |

### Chart Colors

For data visualization:
- `chart-1` to `chart-5` - Predefined chart colors

**Usage:**
```tsx
<div className="fill-chart-1 stroke-chart-2">
  {/* Chart content */}
</div>
```

### Sidebar Colors

Special tokens for sidebar components:
- `sidebar` / `sidebar-foreground`
- `sidebar-primary` / `sidebar-primary-foreground`
- `sidebar-accent` / `sidebar-accent-foreground`
- `sidebar-border`
- `sidebar-ring`

## Design Tokens

### Typography

**Fonts:**
```css
--font-sans: Outfit, sans-serif;
--font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
--font-mono: monospace;
```

**Usage:**
```tsx
<h1 className="font-sans">Sans-serif heading</h1>
<p className="font-serif">Serif paragraph</p>
<code className="font-mono">Monospace code</code>
```

**Letter Spacing:**
```css
--tracking-normal: 0.025em;  /* Base tracking */
```

Classes: `tracking-tighter`, `tracking-tight`, `tracking-normal`, `tracking-wide`, `tracking-wider`, `tracking-widest`

### Border Radius

```css
--radius: 0.5rem;  /* Base: 8px */
```

Utilities:
- `rounded-sm` - 2px (--radius - 4px)
- `rounded-md` - 4px (--radius - 2px)
- `rounded-lg` - 8px (--radius)
- `rounded-xl` - 10px (--radius + 4px)

### Shadows

Supabase theme shadows are subtle and refined:

```css
--shadow-sm: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), ...;
--shadow-md: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), ...;
--shadow-lg: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), ...;
```

**Usage:**
```tsx
<div className="shadow-sm">Light shadow</div>
<div className="shadow-md">Medium shadow</div>
<div className="shadow-lg">Large shadow</div>
```

## Dark Mode

### Enabling Dark Mode

The theme supports dark mode via the `.dark` class on the `<html>` element.

**Manual Toggle:**
```tsx
<html className={isDark ? 'dark' : ''}>
```

**With next-themes (Recommended):**

1. Ensure `ThemeProvider` is in layout:
   ```tsx
   import { ThemeProvider } from '@/components/theme-provider'
   
   <ThemeProvider attribute="class" defaultTheme="system">
     {children}
   </ThemeProvider>
   ```

2. Create a theme toggle:
   ```tsx
   'use client'
   import { useTheme } from 'next-themes'
   
   export function ThemeToggle() {
     const { theme, setTheme } = useTheme()
     
     return (
       <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
         Toggle theme
       </button>
     )
   }
   ```

### Dark Mode Classes

Use Tailwind's `dark:` variant:

```tsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-black dark:text-white">
    Adapts to theme
  </p>
</div>
```

## shadcn/ui Components

### Adding Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

Components are added to `components/ui/` and automatically use theme colors.

### Component Customization

Components are copied to your project, so you can modify them:

**Example: `components/ui/button.tsx`**
```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        // Add your own variants
        gradient: "bg-gradient-to-r from-primary to-accent",
      },
    },
  }
)
```

## Custom Animations

The project includes custom CSS animations in `globals.css`:

### Gradient Shift
```css
.gradient-primary-animated {
  animation: gradient-shift 8s ease infinite;
}
```

### Float Animation
```css
.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

### Shimmer Effect
```css
.shimmer {
  animation: shimmer 2s infinite;
}
```

### Custom Utilities

**Glass Effect:**
```tsx
<div className="glass-effect">
  {/* Glassmorphism background */}
</div>
```

**Gradient Text:**
```tsx
<h1 className="gradient-text">
  Gradient heading
</h1>
```

**Card Hover:**
```tsx
<div className="card-hover">
  {/* Hover lift effect */}
</div>
```

## OKLCH Color Space

### Why OKLCH?

The theme uses OKLCH instead of RGB/HSL for:
- ✅ **Perceptual uniformity** - Equal changes look equal to human eye
- ✅ **Wider gamut** - Access to more vibrant colors
- ✅ **Predictable lightness** - L value directly corresponds to perceived brightness
- ✅ **Better gradients** - Smoother transitions, no muddy colors

### OKLCH Syntax

```css
oklch(L C H)
```

- **L** (Lightness): 0 to 1 (0 = black, 1 = white)
- **C** (Chroma): 0 to 0.4 (0 = gray, higher = more saturated)
- **H** (Hue): 0 to 360 (color wheel degrees)

**Examples:**
```css
oklch(0.5 0 0)           /* 50% gray */
oklch(0.7 0.25 30)       /* Orange */
oklch(0.6 0.22 160)      /* Teal (Supabase primary) */
oklch(0.3 0.15 270)      /* Purple */
```

### Creating OKLCH Colors

Use online tools:
- https://oklch.com
- https://www.oklch.org

Or convert from hex:
```typescript
import { formatHex, oklch, parseHex } from 'culori'

const hex = '#3b82f6'
const oklchColor = oklch(parseHex(hex))
console.log(`oklch(${oklchColor.l} ${oklchColor.c} ${oklchColor.h})`)
```

## Best Practices

### 1. Use Theme Tokens

**❌ Don't:**
```tsx
<button className="bg-blue-500 text-white">
```

**✅ Do:**
```tsx
<button className="bg-primary text-primary-foreground">
```

### 2. Test Both Modes

Always test UI in both light and dark modes:
```tsx
// Good practice
<div className="bg-card text-card-foreground border border-border">
```

### 3. Consistent Spacing

Use Tailwind's spacing scale:
```tsx
<div className="p-4 md:p-6 lg:p-8">  {/* Consistent scaling */}
```

### 4. Accessible Contrast

Ensure sufficient contrast ratios (WCAG AA: 4.5:1 for text):
- Test with browser DevTools
- Use `primary-foreground` pairs
- Check dark mode separately

## Troubleshooting

### Colors Not Applying

**Issue:** Custom colors not working

**Solutions:**
1. Check that color is defined in `globals.css`
2. Verify `@theme inline` section includes the token
3. Restart dev server after CSS changes
4. Clear browser cache

### Dark Mode Not Working

**Issue:** `.dark` class has no effect

**Solutions:**
1. Verify `.dark` CSS rules exist in `globals.css`
2. Check `<html>` element has `dark` class
3. Ensure `@custom-variant dark` is defined

### Supabase Theme Override

**Issue:** Database colors override static theme

**Solution:**
```typescript
// lib/theme-config.ts
export const ENABLE_DATABASE_COLORS = false;
```

## Migration from Old Themes

If updating from a previous theme:

1. **Backup current `globals.css`**
2. **Run theme installer:**
   ```bash
   npx shadcn@latest add https://tweakcn.com/r/themes/supabase.json
   ```
3. **Merge custom animations/utilities** from backup
4. **Test all pages** in light and dark modes
5. **Update any hardcoded colors** to use tokens

## Related Files

- `app/globals.css` - Theme definitions
- `components/theme-provider.tsx` - next-themes wrapper
- `components/theme-injector.tsx` - Server-side theme injection
- `components/theme-script.tsx` - Client-side theme application
- `lib/theme-config.ts` - Feature flags
- `lib/theme-utils.ts` - Theme utility functions
- `THEME_COLOR_REFERENCE.md` - Complete color reference
- `SUPABASE_THEME_IMPLEMENTATION.md` - Implementation details

## Further Reading

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Theming Guide](https://ui.shadcn.com/themes)
- [OKLCH Color Space](https://oklch.com)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [next-themes Documentation](https://github.com/pacocoursey/next-themes)

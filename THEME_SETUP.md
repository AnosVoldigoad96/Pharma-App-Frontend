# Theme System Setup Guide

## Overview

The theme system now supports:
- **Database-driven colors**: Fetch colors from `site_settings.colors` in Supabase (currently disabled)
- **Dark mode**: Enabled with theme toggle button
- **Theme fallback**: Uses Cyberpunk theme colors when database colors are not available
- **Dual theme support**: Can have separate light and dark colors from database

## How It Works

### 1. Theme Provider (`components/theme-provider.tsx`)
- Uses `next-themes` for dark mode management
- Supports system preference detection
- Handles theme switching between light/dark

### 2. Theme Injector (`components/theme-injector.tsx`)
- Server-side component that injects CSS variables from database
- Applies colors to `:root` (light mode) and `.dark` (dark mode)
- Falls back to theme defaults if database colors are missing

### 3. Theme Script (`components/theme-script.tsx`)
- Client-side component for dynamic theme updates
- Applies database colors when settings change
- Handles both single and dual theme structures

### 4. Theme Toggle
- Added to navigation bar (desktop and mobile)
- Toggles between light and dark mode
- Persists user preference

## Database Structure

### Single Theme (Current)
```json
{
  "primary": "oklch(0.7227 0.1920 149.5793)",
  "secondary": "oklch(0.9514 0.0250 236.8242)",
  ...
}
```

### Dual Theme (Future)
```json
{
  "light": {
    "primary": "oklch(0.7227 0.1920 149.5793)",
    ...
  },
  "dark": {
    "primary": "oklch(0.7729 0.1535 163.2231)",
    ...
  }
}
```

## Color Priority

1. **Database colors** (if enabled and available) → Override theme defaults
2. **Theme defaults** (Cyberpunk) → Used when database colors are disabled or missing

### Light Mode
- Database colors → `:root` CSS variables (if enabled)
- Theme defaults → `:root` in `globals.css` (Cyberpunk theme)

### Dark Mode
- Database dark colors → `.dark` CSS variables (if dual theme and enabled)
- Theme dark defaults → `.dark` in `globals.css` (Cyberpunk theme fallback)

## Usage

### Toggle Dark Mode
- Click the sun/moon icon in the navigation bar
- Or use the mobile menu toggle

### Customize Colors
1. Update `site_settings.colors` in Supabase
2. Colors will automatically apply on next page load
3. For dual theme, use `{ light: {...}, dark: {...} }` structure

## Theme Colors Available

The Cyberpunk theme includes:
- Primary: Magenta/Pink (oklch(0.6726 0.2904 341.4084))
- Secondary, Accent colors
- Muted, Destructive colors
- Card, Popover, Input, Border colors
- Sidebar colors
- Chart colors (1-5)
- All with foreground variants

### Fonts
- Sans: Outfit
- Mono: Fira Code
- Serif: ui-serif, Georgia, Cambria, Times New Roman

## Files Modified

- `app/layout.tsx` - Added ThemeProvider wrapper
- `components/theme-provider.tsx` - New theme provider component
- `components/navigation.tsx` - Added theme toggle button
- `components/theme-injector.tsx` - Updated for dark mode support
- `components/theme-script.tsx` - Updated for dark mode support
- `app/globals.css` - Contains Cyberpunk theme colors (light & dark)

## Testing

1. **Test dark mode toggle**: Click the theme button in navigation
2. **Test database colors**: Update colors in Supabase and refresh
3. **Test theme fallback**: Remove database colors, should use theme defaults
4. **Test system preference**: Set system to dark mode, should auto-detect


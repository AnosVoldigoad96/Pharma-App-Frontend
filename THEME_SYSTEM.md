# Theme System Documentation

The ePharmatica frontend uses a dynamic theme system that fetches colors from the Supabase database and applies them as CSS variables throughout the application.

## How It Works

1. **Database Storage**: Colors are stored in the `site_settings` table in the `colors` JSONB field
2. **Server-Side Fetching**: The layout component fetches site settings on each page load
3. **CSS Variable Injection**: Colors are injected as CSS variables that override the default values
4. **Client-Side Updates**: A client component ensures colors are updated dynamically if they change

## Database Structure

The `colors` field in `site_settings` table can have either a **single theme** structure or a **dual theme** structure:

### Single Theme (Current Setup)

For a single theme, colors are directly in the `colors` object:

```json
{
  "card": "#ffffff",
  "ring": "#e5e7eb",
  "input": "#f3f4f6",
  "muted": "#f3f4f6",
  "accent": "#3b82f6",
  "border": "#e5e7eb",
  "chart1": "#3b82f6",
  "chart2": "#10b981",
  "chart3": "#f59e0b",
  "chart4": "#ef4444",
  "chart5": "#8b5cf6",
  "popover": "#ffffff",
  "primary": "#000000",
  "secondary": "#6b7280",
  "background": "#ffffff",
  "foreground": "#111827",
  "destructive": "#ef4444",
  "sidebarRing": "#e5e7eb",
  "sidebarAccent": "#f3f4f6",
  "sidebarBorder": "#e5e7eb",
  "cardForeground": "#111827",
  "sidebarPrimary": "#000000",
  "mutedForeground": "#6b7280",
  "accentForeground": "#ffffff",
  "popoverForeground": "#111827",
  "primaryForeground": "#ffffff",
  "sidebarBackground": "#ffffff",
  "sidebarForeground": "#111827",
  "secondaryForeground": "#ffffff",
  "destructiveForeground": "#ffffff",
  "sidebarAccentForeground": "#111827",
  "sidebarPrimaryForeground": "#ffffff"
}
```

### Dual Theme (Future - Light/Dark)

For dual theme support, nest colors in `light` and `dark` objects:

```json
{
  "light": {
    "card": "#ffffff",
    "ring": "#e5e7eb",
    "input": "#f3f4f6",
    "muted": "#f3f4f6",
    "accent": "#3b82f6",
    "border": "#e5e7eb",
    "chart1": "#3b82f6",
    "chart2": "#10b981",
    "chart3": "#f59e0b",
    "chart4": "#ef4444",
    "chart5": "#8b5cf6",
    "popover": "#ffffff",
    "primary": "#000000",
    "secondary": "#6b7280",
    "background": "#ffffff",
    "foreground": "#111827",
    "destructive": "#ef4444",
    "sidebarRing": "#e5e7eb",
    "sidebarAccent": "#f3f4f6",
    "sidebarBorder": "#e5e7eb",
    "cardForeground": "#111827",
    "sidebarPrimary": "#000000",
    "mutedForeground": "#6b7280",
    "accentForeground": "#ffffff",
    "popoverForeground": "#111827",
    "primaryForeground": "#ffffff",
    "sidebarBackground": "#ffffff",
    "sidebarForeground": "#111827",
    "secondaryForeground": "#ffffff",
    "destructiveForeground": "#ffffff",
    "sidebarAccentForeground": "#111827",
    "sidebarPrimaryForeground": "#ffffff"
  },
  "dark": {
    "card": "#1f2937",
    "ring": "#374151",
    "input": "#374151",
    "muted": "#374151",
    "accent": "#60a5fa",
    "border": "#374151",
    "chart1": "#60a5fa",
    "chart2": "#34d399",
    "chart3": "#fbbf24",
    "chart4": "#f87171",
    "chart5": "#a78bfa",
    "popover": "#1f2937",
    "primary": "#ffffff",
    "secondary": "#9ca3af",
    "background": "#111827",
    "foreground": "#f9fafb",
    "destructive": "#f87171",
    "sidebarRing": "#374151",
    "sidebarAccent": "#374151",
    "sidebarBorder": "#374151",
    "cardForeground": "#f9fafb",
    "sidebarPrimary": "#ffffff",
    "mutedForeground": "#9ca3af",
    "accentForeground": "#111827",
    "popoverForeground": "#f9fafb",
    "primaryForeground": "#111827",
    "sidebarBackground": "#1f2937",
    "sidebarForeground": "#f9fafb",
    "secondaryForeground": "#111827",
    "destructiveForeground": "#111827",
    "sidebarAccentForeground": "#f9fafb",
    "sidebarPrimaryForeground": "#111827"
  }
}
```

## CSS Variables

All color properties from the database are automatically mapped to CSS variables. The system converts camelCase property names to kebab-case CSS variables:

- `card` → `--card`
- `cardForeground` → `--card-foreground`
- `chart1` → `--chart-1`
- `sidebarRing` → `--sidebar-ring`
- `primaryForeground` → `--primary-foreground`
- etc.

**Available color properties:**
- `card`, `cardForeground`
- `ring`, `input`, `muted`, `mutedForeground`
- `accent`, `accentForeground`
- `border`
- `chart1`, `chart2`, `chart3`, `chart4`, `chart5`
- `popover`, `popoverForeground`
- `primary`, `primaryForeground`
- `secondary`, `secondaryForeground`
- `background`, `foreground`
- `destructive`, `destructiveForeground`
- `sidebarRing`, `sidebarAccent`, `sidebarBorder`
- `sidebarPrimary`, `sidebarBackground`, `sidebarForeground`
- `sidebarAccentForeground`, `sidebarPrimaryForeground`

These variables are applied to both light mode (`:root`) and dark mode (`.dark`).

## Components

### ThemeInjector (`components/theme-injector.tsx`)
- Server component that injects CSS variables from database
- Runs on every page load
- Injects styles directly into the DOM

### ThemeScript (`components/theme-script.tsx`)
- Client component that updates colors dynamically
- Handles runtime color changes
- Ensures colors are applied even after client-side navigation

## How to Update Colors

### Option 1: Update via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → `site_settings`
3. Edit the `colors` JSONB field
4. Update the color values (use hex codes or CSS color values)
5. Save the changes

### Option 2: Update via SQL

```sql
UPDATE site_settings
SET colors = '{
  "light": {
    "primary": "#your-color",
    "secondary": "#your-color",
    "muted": "#your-color",
    "accent": "#your-color"
  },
  "dark": {
    "primary": "#your-color",
    "secondary": "#your-color",
    "muted": "#your-color",
    "accent": "#your-color"
  }
}'::jsonb
WHERE id = 'your-settings-id';
```

### Option 3: Update via API

You can create an admin page or API route to update colors programmatically.

## Color Format

Colors can be specified in any CSS-compatible format:
- Hex: `#3b82f6`
- RGB: `rgb(59, 130, 246)`
- RGBA: `rgba(59, 130, 246, 1)`
- HSL: `hsl(217, 91%, 60%)`
- Named colors: `blue`, `red`, etc.

## Default Colors

If no colors are found in the database, the app will use the default colors defined in `app/globals.css`.

## Testing

1. Update colors in the database
2. Refresh the page (or wait for automatic update)
3. Colors should be applied immediately
4. Check browser DevTools → Elements → Computed styles to verify CSS variables

## Troubleshooting

### Colors not updating
- Check that `site_settings` table has a row with colors
- Verify the JSON structure is correct
- Check browser console for errors
- Ensure Supabase connection is working

### Colors not applying
- Verify CSS variables are being set (check DevTools)
- Check that components are using Tailwind classes that reference these variables
- Ensure `ThemeInjector` is in the layout

### Dark mode not working
- Make sure the `.dark` class is applied to the `<html>` or `<body>` element
- Verify dark mode colors are in the database
- Check that dark mode styles are being injected

## Example: Changing Primary Color

To change the primary color to blue:

1. Update database:
```json
{
  "light": {
    "primary": "#3b82f6",
    ...
  },
  "dark": {
    "primary": "#60a5fa",
    ...
  }
}
```

2. Refresh the page
3. All elements using `bg-primary`, `text-primary`, etc. will update automatically


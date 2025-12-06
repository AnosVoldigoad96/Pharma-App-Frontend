# Color Mapping Reference

This document shows how database color properties map to CSS variables.

## Property Name → CSS Variable Mapping

| Database Property | CSS Variable | Description |
|------------------|--------------|-------------|
| `card` | `--card` | Card background color |
| `cardForeground` | `--card-foreground` | Card text color |
| `ring` | `--ring` | Focus ring color |
| `input` | `--input` | Input border color |
| `muted` | `--muted` | Muted background color |
| `mutedForeground` | `--muted-foreground` | Muted text color |
| `accent` | `--accent` | Accent color |
| `accentForeground` | `--accent-foreground` | Accent text color |
| `border` | `--border` | Border color |
| `chart1` | `--chart-1` | Chart color 1 |
| `chart2` | `--chart-2` | Chart color 2 |
| `chart3` | `--chart-3` | Chart color 3 |
| `chart4` | `--chart-4` | Chart color 4 |
| `chart5` | `--chart-5` | Chart color 5 |
| `popover` | `--popover` | Popover background |
| `popoverForeground` | `--popover-foreground` | Popover text color |
| `primary` | `--primary` | Primary brand color |
| `primaryForeground` | `--primary-foreground` | Primary text color |
| `secondary` | `--secondary` | Secondary color |
| `secondaryForeground` | `--secondary-foreground` | Secondary text color |
| `background` | `--background` | Page background |
| `foreground` | `--foreground` | Default text color |
| `destructive` | `--destructive` | Error/destructive color |
| `destructiveForeground` | `--destructive-foreground` | Destructive text color |
| `sidebarBackground` | `--sidebar` | Sidebar background (special mapping) |
| `sidebarForeground` | `--sidebar-foreground` | Sidebar text color |
| `sidebarPrimary` | `--sidebar-primary` | Sidebar primary color |
| `sidebarPrimaryForeground` | `--sidebar-primary-foreground` | Sidebar primary text |
| `sidebarAccent` | `--sidebar-accent` | Sidebar accent color |
| `sidebarAccentForeground` | `--sidebar-accent-foreground` | Sidebar accent text |
| `sidebarBorder` | `--sidebar-border` | Sidebar border color |
| `sidebarRing` | `--sidebar-ring` | Sidebar focus ring |

## Database JSON Structure

Your `site_settings.colors` JSONB column can follow either structure:

### Single Theme Structure (Current - Recommended)

Colors are directly in the `colors` object (no nesting):

```json
{
  "card": "#ffffff",
  "cardForeground": "#111827",
  "ring": "#e5e7eb",
  "input": "#f3f4f6",
  "muted": "#f3f4f6",
  "mutedForeground": "#6b7280",
  "accent": "#3b82f6",
  "accentForeground": "#ffffff",
  "border": "#e5e7eb",
  "chart1": "#3b82f6",
  "chart2": "#10b981",
  "chart3": "#f59e0b",
  "chart4": "#ef4444",
  "chart5": "#8b5cf6",
  "popover": "#ffffff",
  "popoverForeground": "#111827",
  "primary": "#000000",
  "primaryForeground": "#ffffff",
  "secondary": "#6b7280",
  "secondaryForeground": "#ffffff",
  "background": "#ffffff",
  "foreground": "#111827",
  "destructive": "#ef4444",
  "destructiveForeground": "#ffffff",
  "sidebarBackground": "#ffffff",
  "sidebarForeground": "#111827",
  "sidebarPrimary": "#000000",
  "sidebarPrimaryForeground": "#ffffff",
  "sidebarAccent": "#f3f4f6",
  "sidebarAccentForeground": "#111827",
  "sidebarBorder": "#e5e7eb",
  "sidebarRing": "#e5e7eb"
}
```

### Dual Theme Structure (Future - Light/Dark)

For dual theme support, nest colors in `light` and `dark` objects:

```json
{
  "light": {
    "card": "#ffffff",
    "cardForeground": "#111827",
    "ring": "#e5e7eb",
    // ... all other colors
  },
  "dark": {
    "card": "#1f2937",
    "cardForeground": "#f9fafb",
    "ring": "#374151",
    // ... all other colors
  }
}
```

## Notes

- All properties are **optional** - you only need to include the colors you want to customize
- Colors can be in any CSS format: hex (`#ffffff`), rgb(`rgb(255,255,255)`), hsl(`hsl(0,0%,100%)`), or named colors (`white`)
- The `sidebarBackground` property maps to `--sidebar` CSS variable (not `--sidebar-background`)
- Chart colors (`chart1`-`chart5`) automatically convert to `--chart-1` through `--chart-5`
- All camelCase properties automatically convert to kebab-case CSS variables


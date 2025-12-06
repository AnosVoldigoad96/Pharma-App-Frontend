# Database Colors Feature Flag

## Current Status: DISABLED

Database color fetching is currently **disabled**. The app uses the Ocean Breeze theme colors from `globals.css` for both light and dark modes.

## How to Re-Enable Database Colors

When you're ready to enable database color fetching:

### Step 1: Update the Feature Flag

Edit `lib/theme-config.ts`:

```typescript
// Change this line:
export const ENABLE_DATABASE_COLORS = false;

// To:
export const ENABLE_DATABASE_COLORS = true;
```

### Step 2: Ensure Database Has Colors

Make sure your `site_settings` table has a `colors` column with color values in the correct format.

## Current Behavior (Flag = false)

- ✅ Uses Ocean Breeze theme colors from `globals.css`
- ✅ Light mode: Uses `:root` colors from theme
- ✅ Dark mode: Uses `.dark` colors from theme
- ✅ Theme toggle works perfectly
- ❌ Database colors are ignored

## When Enabled (Flag = true)

- ✅ Fetches colors from `site_settings.colors`
- ✅ Database colors override theme defaults
- ✅ Supports single theme (applies to light mode)
- ✅ Supports dual theme (`{ light: {...}, dark: {...} }`)
- ✅ Falls back to theme defaults if database colors are missing

## Files Involved

- `lib/theme-config.ts` - Feature flag
- `components/theme-injector.tsx` - Server-side color injection (checks flag)
- `components/theme-script.tsx` - Client-side color updates (checks flag)
- `app/globals.css` - Theme defaults (Ocean Breeze)

All code is preserved and ready to be re-enabled with a single flag change!


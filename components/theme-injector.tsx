import type { SiteSettings, ColorProperties } from "@/lib/supabase/types";
import { generateThemeCSS } from "@/lib/theme-utils";
import { ENABLE_DATABASE_COLORS } from "@/lib/theme-config";

interface ThemeInjectorProps {
  settings: SiteSettings | null;
}

// Check if colors object has light/dark structure
function isDualTheme(colors: SiteSettings["colors"]): colors is { light?: ColorProperties; dark?: ColorProperties } {
  if (!colors || typeof colors !== "object") return false;
  // If it has "light" or "dark" keys, it's a dual theme structure
  // Otherwise, it's a single theme with colors directly in the object
  return "light" in colors || "dark" in colors;
}

export function ThemeInjector({ settings }: ThemeInjectorProps) {
  // If database colors are disabled, do not inject any styles
  // Theme defaults from globals.css will be used instead
  if (!ENABLE_DATABASE_COLORS) {
    return null;
  }
  
  if (!settings?.colors) return null;

  const colors = settings.colors;

  // Handle single theme (colors directly in colors object)
  // Apply to :root (light mode), dark mode will use theme defaults
  if (!isDualTheme(colors)) {
    const css = generateThemeCSS(colors as ColorProperties, ":root");
    return (
      <style
        id="theme-injector-styles"
        dangerouslySetInnerHTML={{
          __html: css,
        }}
      />
    );
  }

  // Handle dual theme (light/dark structure)
  // Apply light colors to :root, dark colors to .dark
  // If dark colors are missing, .dark class will use theme defaults from globals.css
  const lightCSS = generateThemeCSS(colors.light, ":root");
  const darkCSS = colors.dark ? generateThemeCSS(colors.dark, ".dark") : "";

  // Only render if we have at least one theme
  if (!colors.light && !colors.dark) {
    return null;
  }

  return (
    <style
      id="theme-injector-styles"
      dangerouslySetInnerHTML={{
        __html: `${lightCSS}${darkCSS ? `\n${darkCSS}` : ""}`,
      }}
    />
  );
}


"use client";

import { useEffect } from "react";
import type { SiteSettings, ColorProperties } from "@/lib/supabase/types";
import { applyThemeColors, generateThemeCSS } from "@/lib/theme-utils";
import { ENABLE_DATABASE_COLORS } from "@/lib/theme-config";

interface ThemeScriptProps {
  settings: SiteSettings | null;
}

// Check if colors object has light/dark structure
function isDualTheme(colors: SiteSettings["colors"]): colors is { light?: ColorProperties; dark?: ColorProperties } {
  if (!colors || typeof colors !== "object") return false;
  // If it has "light" or "dark" keys, it's a dual theme structure
  // Otherwise, it's a single theme with colors directly in the object
  return "light" in colors || "dark" in colors;
}

export function ThemeScript({ settings }: ThemeScriptProps) {
  useEffect(() => {
    // If database colors are disabled, remove any existing database color styles
    // and use theme defaults from globals.css (Cyberpunk theme)
    if (!ENABLE_DATABASE_COLORS) {
      // Remove any existing database color style elements that might have been injected
      const themeInjectorStyle = document.getElementById("theme-injector-styles");
      if (themeInjectorStyle) {
        themeInjectorStyle.remove();
      }
      const dynamicDarkTheme = document.getElementById("dynamic-dark-theme");
      if (dynamicDarkTheme) {
        dynamicDarkTheme.remove();
      }
      // Clear any inline styles on root that might have been applied from database
      const root = document.documentElement;
      // Remove all custom color properties that might have been set by database
      // This ensures theme defaults from globals.css are used
      const colorProps = [
        '--primary', '--primary-foreground',
        '--secondary', '--secondary-foreground',
        '--accent', '--accent-foreground',
        '--muted', '--muted-foreground',
        '--destructive', '--destructive-foreground',
        '--card', '--card-foreground',
        '--popover', '--popover-foreground',
        '--border', '--input', '--ring',
        '--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5',
        '--sidebar', '--sidebar-foreground', '--sidebar-primary', '--sidebar-primary-foreground',
        '--sidebar-accent', '--sidebar-accent-foreground',
        '--sidebar-border', '--sidebar-ring',
        '--background', '--foreground'
      ];
      colorProps.forEach(prop => {
        root.style.removeProperty(prop);
      });
      return;
    }
    
    if (!settings?.colors) return;

    const root = document.documentElement;
    const colors = settings.colors;

    // Handle single theme (colors directly in colors object)
    if (!isDualTheme(colors)) {
      applyThemeColors(root, colors as ColorProperties);
      return;
    }

    // Handle dual theme (light/dark structure)
    // Apply light theme colors to :root (only if light colors exist)
    if (colors.light) {
      applyThemeColors(root, colors.light);
    }

    // Apply dark theme colors dynamically (only if dark colors exist)
    // If dark colors don't exist, theme defaults from globals.css will be used
    if (colors.dark) {
      const styleId = "dynamic-dark-theme";
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      // generateThemeCSS now handles null/undefined safely
      styleElement.textContent = generateThemeCSS(colors.dark, ".dark");
    } else {
      // Remove dark theme styles if they exist but dark colors are not provided
      // This allows theme defaults to be used
      const styleElement = document.getElementById("dynamic-dark-theme");
      if (styleElement) {
        styleElement.remove();
      }
    }
  }, [settings]);

  return null;
}


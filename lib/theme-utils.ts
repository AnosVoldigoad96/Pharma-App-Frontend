/**
 * Special mappings for CSS variable names
 * Some database property names map to different CSS variable names
 */
const SPECIAL_MAPPINGS: Record<string, string> = {
  sidebarBackground: "sidebar", // sidebarBackground -> sidebar (not sidebar-background)
};

/**
 * Converts camelCase to kebab-case for CSS variable names
 * Examples:
 * - "cardForeground" -> "card-foreground"
 * - "chart1" -> "chart-1"
 * - "sidebarRing" -> "sidebar-ring"
 * - "sidebarBackground" -> "sidebar" (special mapping)
 */
function camelToKebab(str: string): string {
  // Check for special mappings first
  if (SPECIAL_MAPPINGS[str]) {
    return SPECIAL_MAPPINGS[str];
  }

  // First handle camelCase (lowercase letter followed by uppercase)
  let result = str.replace(/([a-z0-9])([A-Z])/g, "$1-$2");
  // Then handle numbers (letter/number followed by number)
  result = result.replace(/([a-zA-Z])(\d)/g, "$1-$2");
  return result.toLowerCase();
}

/**
 * Maps color object to CSS variables string
 */
export function generateThemeCSS(
  colors: Record<string, string | undefined> | null | undefined,
  selector: ":root" | ".dark"
): string {
  // Return empty CSS if colors is null or undefined
  if (!colors) {
    return `${selector} {\n  }\n`;
  }

  const cssVars: string[] = [];

  for (const [key, value] of Object.entries(colors)) {
    if (value) {
      // Convert camelCase to kebab-case and add -- prefix
      const cssVarName = `--${camelToKebab(key)}`;
      cssVars.push(`${cssVarName}: ${value};`);
    }
  }

  return `${selector} {\n    ${cssVars.join("\n    ")}\n  }`;
}

/**
 * Applies theme colors to DOM element
 */
export function applyThemeColors(
  element: HTMLElement,
  colors: Record<string, string | undefined> | null | undefined
): void {
  // Return early if colors is null or undefined
  if (!colors) {
    return;
  }

  for (const [key, value] of Object.entries(colors)) {
    if (value) {
      const cssVarName = `--${camelToKebab(key)}`;
      element.style.setProperty(cssVarName, value);
    }
  }
}


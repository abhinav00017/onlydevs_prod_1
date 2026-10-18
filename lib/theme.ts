import type { Theme } from "./schema";
import { FONT_VARIABLES } from "./font-vars";

/** Maps theme.json colour keys to the CSS variables that styles/globals.css hands to Tailwind. */
const COLOR_VARS: Record<keyof Theme["colors"], string> = {
  primary: "--theme-primary",
  onPrimary: "--theme-on-primary",
  heading: "--theme-heading",
  body: "--theme-body",
  link: "--theme-link",
  background: "--theme-background",
  surface: "--theme-surface",
  surfaceAlt: "--theme-surface-alt",
  accent: "--theme-accent",
  muted: "--theme-muted",
  footer: "--theme-footer",
  onFooter: "--theme-on-footer",
};

/**
 * Turns theme.json into a `:root { ... }` rule. The layout injects it into <head>.
 * Zod has already checked every value (hex colours, CSS lengths, known font keys), so nothing here is free text.
 */
export function themeToCss(theme: Theme): string {
  const decls: string[] = [];
  for (const [key, cssVar] of Object.entries(COLOR_VARS) as [keyof Theme["colors"], string][]) {
    decls.push(`${cssVar}:${theme.colors[key]}`);
  }
  decls.push(`--theme-font-heading:var(${FONT_VARIABLES[theme.fonts.heading]})`);
  decls.push(`--theme-font-body:var(${FONT_VARIABLES[theme.fonts.body]})`);
  decls.push(`--theme-radius:${theme.radius}`);
  return `:root{${decls.join(";")}}`;
}

/** WCAG relative luminance of a #RRGGBB colour. */
export function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two #RRGGBB colours (1 to 21). */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

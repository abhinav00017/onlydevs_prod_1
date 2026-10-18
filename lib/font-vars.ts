import type { FontKey } from "./schema";

/** CSS variable each font in lib/fonts.ts declares. Kept apart so lib/theme.ts stays free of next/font. */
export const FONT_VARIABLES: Record<FontKey, string> = {
  inter: "--font-inter",
  "dm-sans": "--font-dm-sans",
  manrope: "--font-manrope",
  fraunces: "--font-fraunces",
  "playfair-display": "--font-playfair-display",
  lora: "--font-lora",
};

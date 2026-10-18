// next/font needs literal options at module scope, so the template ships a fixed set of
// open Google fonts. theme.json picks two of them by key. Fonts are self-hosted at build time.
// preload is off because only two of these are used per client; the browser downloads
// a font file only when an element uses that family.
import { DM_Sans, Fraunces, Inter, Lora, Manrope, Playfair_Display } from "next/font/google";
import type { FontKey } from "./schema";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap", preload: false });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", preload: false });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", preload: false });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
  preload: false,
});
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap", preload: false });

const FONTS: Record<FontKey, { variable: string }> = {
  inter,
  "dm-sans": dmSans,
  manrope,
  fraunces,
  "playfair-display": playfair,
  lora,
};

/** Class names that declare the CSS variables for the chosen fonts. */
export function fontClassNames(keys: FontKey[]): string {
  return [...new Set(keys)].map((k) => FONTS[k].variable).join(" ");
}

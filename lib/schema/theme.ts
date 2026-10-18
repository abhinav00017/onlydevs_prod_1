import { z } from "zod";
import { hexColor } from "./common";
import { FONT_KEYS } from "./names";

const font = z.enum(FONT_KEYS, { error: `must be one of: ${FONT_KEYS.join(", ")}` });

export const themeSchema = z.object({
  colors: z.object({
    /** Buttons and accents. */
    primary: hexColor,
    /** Text on primary buttons. */
    onPrimary: hexColor,
    /** Headings and strong text. */
    heading: hexColor,
    /** Body text. Use it on the page background only. */
    body: hexColor,
    /** Inline links. */
    link: hexColor,
    /** Page background. */
    background: hexColor,
    /** Tinted section background. */
    surface: hexColor,
    /** Second tinted background (hero, cards). */
    surfaceAlt: hexColor,
    /** Decorative accent, borders. */
    accent: hexColor,
    /** Quiet borders and dividers. */
    muted: hexColor,
    footer: hexColor,
    onFooter: hexColor,
  }),
  fonts: z.object({ heading: font, body: font }),
  radius: z
    .string()
    .regex(/^\d+(\.\d+)?(rem|px)$/, "must be a CSS length in rem or px, like 1rem"),
});

export type Theme = z.infer<typeof themeSchema>;

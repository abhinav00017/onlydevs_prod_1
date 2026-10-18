import { z } from "zod";
import { ICON_NAMES, SECTION_NAMES } from "./names";

const PLACEHOLDER = /\bTODO\b/;

/** Non-empty text. Any value that still contains "TODO" fails, so template placeholders never ship. */
export const text = z
  .string()
  .trim()
  .min(1, "must not be empty")
  .refine((v) => !PLACEHOLDER.test(v), "still has a TODO placeholder");

export const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "must be a 6-digit hex colour, like #0B2142");

export const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase letters, numbers and hyphens, like my-clinic");

/** E.164 phone number: +, country code, then digits. */
export const phone = z
  .string()
  .regex(/^\+[1-9]\d{7,14}$/, "must be a full phone number with country code and no spaces, like +918914805523");

export const imageFile = z
  .string()
  .regex(/^[\w-]+\.(png|jpe?g|webp|avif|svg|ico)$/i, "must be a file name inside images/, like doctor.jpg");

/**
 * A link target in client data.
 * - "/path" for a page on this site, with an optional simple query like "/book?type=online"
 * - "https://..." for another site
 * - "action:call", "action:whatsapp" or "action:book" so phone numbers live in one place (site.json)
 */
export const href = z
  .string()
  .regex(
    /^(\/[a-z0-9\-/]*(\?[a-z0-9_-]+=[a-z0-9_-]+(&[a-z0-9_-]+=[a-z0-9_-]+)*)?|https:\/\/\S+|action:(call|whatsapp|book))$/,
    'must be a site path like /about or /book?type=online, an https:// URL, or one of action:call, action:whatsapp, action:book',
  );

export const icon = z.enum(ICON_NAMES, {
  error: `must be one of: ${ICON_NAMES.join(", ")}`,
});

export const sectionName = z.enum(SECTION_NAMES, {
  error: `must be one of: ${SECTION_NAMES.join(", ")}`,
});

export const link = z.object({ label: text, href });

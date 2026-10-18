import { z } from "zod";
import { icon, imageFile, slug, text } from "./common";

export const doctorFileSchema = z.object({
  eyebrow: text.optional(),
  heading: text,
  intro: text.optional(),
  doctors: z
    .array(
      z.object({
        slug,
        name: text,
        credentials: text,
        role: text,
        experienceYears: z.number().int().min(0),
        hospital: text,
        image: imageFile,
        imageAlt: text,
        bio: z.array(text).min(1),
        focusAreas: z.array(text).default([]),
      }),
    )
    .min(1, "must list at least one doctor"),
});

export const servicesFileSchema = z.object({
  eyebrow: text.optional(),
  heading: text,
  intro: text.optional(),
  items: z
    .array(
      z.object({
        slug,
        name: text,
        icon,
        summary: text.max(200, "must be 200 characters or fewer"),
        body: z.array(text).min(1),
      }),
    )
    .min(1, "must list at least one service")
    .refine((items) => new Set(items.map((i) => i.slug)).size === items.length, "service slugs must be unique"),
});

const highlightGroup = z.object({
  eyebrow: text.optional(),
  heading: text,
  intro: text.optional(),
  items: z.array(z.object({ icon, title: text, text })).min(1),
});

export const highlightsFileSchema = z.object({
  highlights: highlightGroup,
  whyChooseUs: highlightGroup,
});

export const testimonialsFileSchema = z.object({
  eyebrow: text.optional(),
  heading: text,
  intro: text.optional(),
  items: z.array(z.object({ name: text, quote: text, context: text.optional() })).min(1),
});

export const faqFileSchema = z.object({
  eyebrow: text.optional(),
  heading: text,
  intro: text.optional(),
  items: z.array(z.object({ question: text, answer: text })).min(1),
});

export type DoctorFile = z.infer<typeof doctorFileSchema>;
export type Doctor = DoctorFile["doctors"][number];
export type ServicesFile = z.infer<typeof servicesFileSchema>;
export type Service = ServicesFile["items"][number];
export type HighlightGroup = z.infer<typeof highlightGroup>;
export type HighlightsFile = z.infer<typeof highlightsFileSchema>;
export type TestimonialsFile = z.infer<typeof testimonialsFileSchema>;
export type FaqFile = z.infer<typeof faqFileSchema>;

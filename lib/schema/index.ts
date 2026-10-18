import { siteSchema } from "./site";
import { themeSchema } from "./theme";
import { pagesSchema } from "./pages";
import {
  doctorFileSchema,
  faqFileSchema,
  highlightsFileSchema,
  servicesFileSchema,
  testimonialsFileSchema,
} from "./content";

/** Every JSON file a client folder must contain, and the schema that checks it. */
export const CLIENT_FILES = {
  "site.json": siteSchema,
  "theme.json": themeSchema,
  "pages.json": pagesSchema,
  "doctor.json": doctorFileSchema,
  "services.json": servicesFileSchema,
  "highlights.json": highlightsFileSchema,
  "testimonials.json": testimonialsFileSchema,
  "faq.json": faqFileSchema,
} as const;

export * from "./names";
export * from "./site";
export * from "./theme";
export * from "./pages";
export * from "./content";

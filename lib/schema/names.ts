// Plain lists shared by the schemas, the components and the tests.
// Keep these free of React and Node imports so every layer can use them.

export const SECTION_NAMES = [
  "hero",
  "quickActions",
  "services",
  "about",
  "highlights",
  "whyChooseUs",
  "doctors",
  "testimonials",
  "faq",
  "cta",
  "map",
] as const;
export type SectionName = (typeof SECTION_NAMES)[number];

export const ICON_NAMES = [
  "activity",
  "arrow-right",
  "award",
  "baby",
  "book-open",
  "building",
  "calendar",
  "calendar-check",
  "check",
  "clock",
  "hand-heart",
  "headset",
  "heart-pulse",
  "hospital",
  "leaf",
  "mail",
  "map-pin",
  "message",
  "microscope",
  "monitor",
  "phone",
  "quote",
  "ribbon",
  "shield",
  "sparkles",
  "star",
  "stethoscope",
  "user",
  "users",
] as const;
export type IconName = (typeof ICON_NAMES)[number];

export const FONT_KEYS = [
  "inter",
  "dm-sans",
  "manrope",
  "fraunces",
  "playfair-display",
  "lora",
] as const;
export type FontKey = (typeof FONT_KEYS)[number];

// Fixed routes the app ships. Nav links must point at one of these,
// a service page, or a legal page.
export const STATIC_ROUTES = ["/", "/about", "/services", "/book", "/contact", "/faq"] as const;

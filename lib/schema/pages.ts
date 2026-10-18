import { z } from "zod";
import { href, icon, imageFile, link, sectionName, slug, text } from "./common";

const navItem = z.object({ label: text, href: z.string().regex(/^\/[a-z0-9\-/]*$/, "must be a site path like /about") });

const meta = z.object({
  title: text,
  description: text.max(200, "must be 200 characters or fewer for search results"),
});

const pageHeader = meta.extend({
  eyebrow: text.optional(),
  heading: text,
  intro: text.optional(),
});

const sectionList = z.array(sectionName).min(1, "must list at least one section");

export const pagesSchema = z.object({
  nav: z.array(navItem).min(1, "must have at least one link"),
  footerNav: z.array(navItem).default([]),
  home: meta.extend({ sections: sectionList }),
  about: pageHeader.extend({ sections: sectionList }),
  services: pageHeader.extend({ sections: z.array(sectionName).default([]) }),
  book: pageHeader,
  contact: pageHeader.extend({ sections: z.array(sectionName).default([]) }),
  faq: pageHeader.extend({ sections: z.array(sectionName).default([]) }),
  legal: z
    .array(z.object({ slug, title: text, description: text.max(200) }))
    .min(1, "must list at least one legal page"),

  /** Content for sections that are not backed by their own JSON file. */
  sections: z.object({
    hero: z.object({
      eyebrow: text,
      heading: text,
      text,
      image: imageFile,
      imageAlt: text,
      primaryCta: link,
      secondaryCta: link.optional(),
      stats: z.array(z.object({ value: text, label: text })).default([]),
    }),
    quickActions: z.object({
      heading: text,
      items: z
        .array(z.object({ icon, title: text, text, href }))
        .min(1)
        .max(4, "must have 4 items or fewer"),
    }),
    about: z.object({
      eyebrow: text,
      heading: text,
      paragraphs: z.array(text).min(1),
      cta: link,
    }),
    cta: z.object({
      heading: text,
      text,
      primaryCta: link,
      secondaryCta: link.optional(),
    }),
    map: z.object({
      eyebrow: text.optional(),
      heading: text,
      intro: text.optional(),
    }),
  }),
});

export type Pages = z.infer<typeof pagesSchema>;
export type NavItem = z.infer<typeof navItem>;
export type PageHeaderData = z.infer<typeof pageHeader>;

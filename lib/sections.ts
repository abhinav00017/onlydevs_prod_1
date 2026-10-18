// Maps each section name in pages.json to the component that renders it.
// The schema (lib/schema/names.ts) rejects unknown names, so the build fails before this runs.
import { createElement, Fragment, type ReactElement } from "react";
import type { ClientData } from "./load-client";
import type { SectionName } from "./schema/names";
import { About } from "@/components/sections/About";
import { Cta } from "@/components/sections/Cta";
import { Doctors } from "@/components/sections/Doctors";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Highlights } from "@/components/sections/Highlights";
import { Map } from "@/components/sections/Map";
import { QuickActions } from "@/components/sections/QuickActions";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";

type Renderer = (client: ClientData) => ReactElement;

export const SECTIONS: Record<SectionName, Renderer> = {
  hero: (c) => createElement(Hero, { data: c.pages.sections.hero, site: c.site, slug: c.slug }),
  quickActions: (c) => createElement(QuickActions, { data: c.pages.sections.quickActions, site: c.site }),
  services: (c) => createElement(Services, { data: c.services, ui: c.site.ui }),
  about: (c) =>
    createElement(About, { data: c.pages.sections.about, doctor: c.doctors.doctors[0], site: c.site, slug: c.slug }),
  highlights: (c) => createElement(Highlights, { data: c.highlights.highlights, id: "highlights" }),
  whyChooseUs: (c) => createElement(Highlights, { data: c.highlights.whyChooseUs, id: "why-choose-us", tinted: true }),
  doctors: (c) => createElement(Doctors, { data: c.doctors, ui: c.site.ui, slug: c.slug }),
  testimonials: (c) => createElement(Testimonials, { data: c.testimonials }),
  faq: (c) => createElement(Faq, { data: c.faq }),
  cta: (c) => createElement(Cta, { data: c.pages.sections.cta, site: c.site }),
  map: (c) => createElement(Map, { data: c.pages.sections.map, site: c.site }),
};

/** Renders a page's ordered list of sections. */
export function renderSections(names: readonly SectionName[], client: ClientData): ReactElement {
  return createElement(
    Fragment,
    null,
    names.map((name, i) => createElement(Fragment, { key: `${name}-${i}` }, SECTIONS[name](client))),
  );
}

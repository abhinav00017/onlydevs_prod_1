// Loads and validates one client folder. Pure Node: no React, no Next.
// lib/client.ts wraps this for the app; scripts and tests call it directly.
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import type { z } from "zod";
import {
  CLIENT_FILES,
  STATIC_ROUTES,
  type DoctorFile,
  type FaqFile,
  type HighlightsFile,
  type Pages,
  type ServicesFile,
  type Site,
  type TestimonialsFile,
  type Theme,
} from "./schema";

export type LegalPage = { slug: string; title: string; description: string; html: string };

export type ClientData = {
  slug: string;
  site: Site;
  theme: Theme;
  pages: Pages;
  doctors: DoctorFile;
  services: ServicesFile;
  highlights: HighlightsFile;
  testimonials: TestimonialsFile;
  faq: FaqFile;
  legal: LegalPage[];
};

export class ClientDataError extends Error {
  constructor(
    public readonly slug: string,
    public readonly problems: string[],
  ) {
    super(
      `Client "${slug}" has ${problems.length} problem${problems.length === 1 ? "" : "s"}:\n` +
        problems.map((p) => `  - ${p}`).join("\n") +
        `\nFix the files in clients/${slug}/ and run again.`,
    );
    this.name = "ClientDataError";
  }
}

export const CLIENTS_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "clients");

function formatPath(file: string, issuePath: PropertyKey[]): string {
  if (issuePath.length === 0) return file;
  const parts = issuePath.map((p) => (typeof p === "number" ? `[${p}]` : `.${String(p)}`)).join("");
  return `${file} › ${parts.replace(/^\./, "")}`;
}

export function loadClient(slug: string, clientsDir: string = CLIENTS_DIR): ClientData {
  const dir = path.join(/*turbopackIgnore: true*/ clientsDir, slug);
  if (!/^[a-z0-9_][a-z0-9-]*$/.test(slug) || !fs.existsSync(dir)) {
    const known = fs.existsSync(clientsDir)
      ? fs.readdirSync(clientsDir).filter((d) => !d.startsWith("."))
      : [];
    throw new ClientDataError(slug, [
      `folder clients/${slug}/ does not exist. Known clients: ${known.join(", ") || "none"}`,
    ]);
  }

  const problems: string[] = [];
  const parsed: Record<string, unknown> = {};

  for (const [file, schema] of Object.entries(CLIENT_FILES)) {
    const filePath = path.join(/*turbopackIgnore: true*/ dir, file);
    if (!fs.existsSync(filePath)) {
      problems.push(`${file} is missing`);
      continue;
    }
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
      problems.push(`${file} is not valid JSON: ${(err as Error).message}`);
      continue;
    }
    const result = (schema as z.ZodType).safeParse(raw);
    if (!result.success) {
      for (const issue of result.error.issues) {
        problems.push(`${formatPath(file, issue.path)}: ${issue.message}`);
      }
    } else {
      parsed[file] = result.data;
    }
  }

  if (problems.length > 0) throw new ClientDataError(slug, problems);

  const data = {
    slug,
    site: parsed["site.json"] as Site,
    theme: parsed["theme.json"] as Theme,
    pages: parsed["pages.json"] as Pages,
    doctors: parsed["doctor.json"] as DoctorFile,
    services: parsed["services.json"] as ServicesFile,
    highlights: parsed["highlights.json"] as HighlightsFile,
    testimonials: parsed["testimonials.json"] as TestimonialsFile,
    faq: parsed["faq.json"] as FaqFile,
  };

  // Checks that span files.
  if (data.site.slug !== slug) {
    problems.push(`site.json › slug: is "${data.site.slug}" but the folder is clients/${slug}/`);
  }

  const legal: LegalPage[] = [];
  for (const [i, page] of data.pages.legal.entries()) {
    const mdPath = path.join(/*turbopackIgnore: true*/ dir, "legal", `${page.slug}.md`);
    if (STATIC_ROUTES.includes(`/${page.slug}` as (typeof STATIC_ROUTES)[number]) || page.slug === "services") {
      problems.push(`pages.json › legal[${i}].slug: "${page.slug}" clashes with a built-in page`);
    }
    if (!fs.existsSync(mdPath)) {
      problems.push(`pages.json › legal[${i}]: legal/${page.slug}.md is missing`);
      continue;
    }
    const md = fs.readFileSync(mdPath, "utf8");
    if (/\bTODO\b/.test(md)) problems.push(`legal/${page.slug}.md: still has a TODO placeholder`);
    legal.push({ ...page, html: marked.parse(md, { async: false }) });
  }

  const routes = new Set<string>([
    ...STATIC_ROUTES,
    ...data.services.items.map((s) => `/services/${s.slug}`),
    ...data.pages.legal.map((l) => `/${l.slug}`),
  ]);
  const visitTypeIds = data.site.booking.visitTypes.map((t) => t.id);
  const checkRoute = (label: string, target: string) => {
    if (!target.startsWith("/")) return;
    const [pathname, query] = target.split("?");
    if (!routes.has(pathname)) {
      problems.push(`${label}: "${target}" is not a page on this site`);
      return;
    }
    // /book?type=<id> preselects a visit type, so the id must be one site.json lists.
    const type = new URLSearchParams(query ?? "").get("type");
    if (pathname === "/book" && type !== null && !visitTypeIds.includes(type)) {
      problems.push(`${label}: "${type}" is not a visit type. Use one of: ${visitTypeIds.join(", ")}`);
    }
  };
  if (data.site.offer?.ctaHref) checkRoute("site.json › offer.ctaHref", data.site.offer.ctaHref);
  data.pages.nav.forEach((n, i) => checkRoute(`pages.json › nav[${i}].href`, n.href));
  data.pages.footerNav.forEach((n, i) => checkRoute(`pages.json › footerNav[${i}].href`, n.href));
  const s = data.pages.sections;
  checkRoute("pages.json › sections.hero.primaryCta.href", s.hero.primaryCta.href);
  if (s.hero.secondaryCta) checkRoute("pages.json › sections.hero.secondaryCta.href", s.hero.secondaryCta.href);
  s.quickActions.items.forEach((q, i) => checkRoute(`pages.json › sections.quickActions.items[${i}].href`, q.href));
  checkRoute("pages.json › sections.about.cta.href", s.about.cta.href);
  checkRoute("pages.json › sections.cta.primaryCta.href", s.cta.primaryCta.href);
  if (s.cta.secondaryCta) checkRoute("pages.json › sections.cta.secondaryCta.href", s.cta.secondaryCta.href);

  const images = new Set(
    fs.existsSync(path.join(/*turbopackIgnore: true*/ dir, "images")) ? fs.readdirSync(path.join(/*turbopackIgnore: true*/ dir, "images")) : [],
  );
  const checkImage = (label: string, file: string) => {
    if (!images.has(file)) problems.push(`${label}: images/${file} is missing`);
  };
  checkImage("site.json › images.favicon", data.site.images.favicon);
  checkImage("site.json › images.ogImage", data.site.images.ogImage);
  checkImage("pages.json › sections.hero.image", s.hero.image);
  data.doctors.doctors.forEach((d, i) => checkImage(`doctor.json › doctors[${i}].image`, d.image));

  if (problems.length > 0) throw new ClientDataError(slug, problems);

  return { ...data, legal };
}

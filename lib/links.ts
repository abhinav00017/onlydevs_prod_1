import type { Site } from "./schema";

/** Public URL of a file in clients/<slug>/images/ after scripts/sync-images.ts copies it. */
export function imageUrl(slug: string, file: string): string {
  return `/clients/${slug}/${file}`;
}

export function telHref(site: Site): string {
  return `tel:${site.contact.phone}`;
}

export function whatsappHref(site: Site, text?: string): string | undefined {
  const number = site.contact.whatsapp;
  if (!number) return undefined;
  const base = `https://wa.me/${number.replace(/^\+/, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function mapEmbedUrl(site: Site): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(site.contact.mapQuery)}&output=embed`;
}

export function directionsUrl(site: Site): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.contact.mapQuery)}`;
}

/** Turns an href from client data into a real URL. "action:*" values resolve against site.json. */
export function resolveHref(href: string, site: Site): string {
  switch (href) {
    case "action:call":
      return telHref(site);
    case "action:whatsapp":
      return whatsappHref(site) ?? telHref(site);
    case "action:book":
      return "/book";
    default:
      return href;
  }
}

export function isInternal(href: string): boolean {
  return href.startsWith("/");
}

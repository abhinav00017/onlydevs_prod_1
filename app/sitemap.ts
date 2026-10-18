import type { MetadataRoute } from "next";
import { getClient } from "@/lib/client";
import { STATIC_ROUTES } from "@/lib/schema/names";

export default function sitemap(): MetadataRoute.Sitemap {
  const { site, services, legal } = getClient();
  const paths = [
    ...STATIC_ROUTES,
    ...services.items.map((s) => `/services/${s.slug}`),
    ...legal.map((l) => `/${l.slug}`),
  ];
  return paths.map((p) => ({ url: new URL(p, site.url).toString() }));
}

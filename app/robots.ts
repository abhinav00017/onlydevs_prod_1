import type { MetadataRoute } from "next";
import { getClient } from "@/lib/client";

export default function robots(): MetadataRoute.Robots {
  const { site } = getClient();
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}

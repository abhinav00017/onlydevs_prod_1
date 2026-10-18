import type { MetadataRoute } from "next";
import { getClient } from "@/lib/client";
import { imageUrl } from "@/lib/links";

export default function manifest(): MetadataRoute.Manifest {
  const { site, theme, slug } = getClient();
  const icon = site.images.favicon;
  const ext = icon.split(".").pop()?.toLowerCase();
  const type = ext === "svg" ? "image/svg+xml" : ext === "ico" ? "image/x-icon" : `image/${ext === "jpg" ? "jpeg" : ext}`;
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: theme.colors.background,
    theme_color: theme.colors.primary,
    icons: [{ src: imageUrl(slug, icon), sizes: "any", type }],
  };
}

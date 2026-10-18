import type { Metadata, Viewport } from "next";
import { getClient } from "@/lib/client";
import { fontClassNames } from "@/lib/fonts";
import { imageUrl } from "@/lib/links";
import { themeToCss } from "@/lib/theme";
import { FloatingCall } from "@/components/layout/FloatingCall";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "@/styles/globals.css";

// Every page is client data read from JSON at build time. Fail the build if any route
// stops being fully static.
export const ensureStatic = "navigation";

export function generateMetadata(): Metadata {
  const { site, slug, pages } = getClient();
  const og = imageUrl(slug, site.images.ogImage);
  return {
    metadataBase: new URL(site.url),
    title: { default: pages.home.title, template: `%s | ${site.name}` },
    description: site.description,
    applicationName: site.name,
    icons: { icon: imageUrl(slug, site.images.favicon) },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale.replace("-", "_"),
      title: pages.home.title,
      description: site.description,
      images: [{ url: og, width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: "summary_large_image", images: [og] },
  };
}

export function generateViewport(): Viewport {
  const { theme } = getClient();
  return { themeColor: theme.colors.background, width: "device-width", initialScale: 1 };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const client = getClient();
  const { site, theme, pages } = client;
  return (
    <html lang={site.locale} className={fontClassNames([theme.fonts.heading, theme.fonts.body])}>
      <head>
        <style id="client-theme" dangerouslySetInnerHTML={{ __html: themeToCss(theme) }} />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-primary px-4 py-2 font-semibold text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {site.ui.skipToContent}
        </a>
        <Header site={site} nav={pages.nav} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer site={site} nav={pages.footerNav.length ? pages.footerNav : pages.nav} legal={client.legal} />
        <FloatingCall site={site} />
      </body>
    </html>
  );
}

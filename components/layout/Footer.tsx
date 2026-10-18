import Link from "next/link";
import type { NavItem, Site } from "@/lib/schema";
import type { LegalPage } from "@/lib/load-client";
import { telHref } from "@/lib/links";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

type Props = { site: Site; nav: NavItem[]; legal: Pick<LegalPage, "slug" | "title">[] };

export function Footer({ site, nav, legal }: Props) {
  const { ui, contact } = site;
  const a = contact.address;
  return (
    <footer className="bg-footer pt-16 pb-28 text-on-footer/85 md:pb-12">
      <Container>
        <div className="grid gap-10 md:grid-cols-[3fr_2fr_3fr]">
          <div>
            <p className="font-heading text-2xl font-semibold text-on-footer">{site.name}</p>
            <p className="mt-1 text-sm">{site.tagline}</p>
            <p className="mt-4 max-w-sm leading-relaxed">{site.footer.blurb}</p>
          </div>
          <nav aria-label={ui.footerNav}>
            <ul className="space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="underline-offset-4 hover:text-on-footer hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-4">
            <p className="flex gap-3">
              <Icon name="map-pin" className="mt-0.5 size-5 shrink-0 text-primary" />
              <span>
                {contact.hospital}
                <br />
                {a.street}, {a.locality}, {a.city}, {a.region} {a.postalCode}
              </span>
            </p>
            <p className="flex gap-3">
              <Icon name="phone" className="mt-0.5 size-5 shrink-0 text-primary" />
              <a href={telHref(site)} className="font-semibold text-on-footer underline-offset-4 hover:underline">
                {contact.phoneDisplay}
              </a>
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-on-footer/15 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>{site.footer.copyright}</p>
          <nav aria-label={ui.legalNav}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legal.map((l) => (
                <li key={l.slug}>
                  <Link href={`/${l.slug}`} className="underline-offset-4 hover:text-on-footer hover:underline">
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}

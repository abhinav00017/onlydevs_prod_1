import Link from "next/link";
import type { NavItem, Site } from "@/lib/schema";
import { telHref } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";

type Props = { site: Site; nav: NavItem[] };

export function Header({ site, nav }: Props) {
  const { ui } = site;
  // No backdrop-filter on <header>: it would trap the fixed mobile menu panel inside the header box.
  return (
    <header className="sticky top-0 z-50 border-b border-muted bg-background">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="flex min-w-0 items-center gap-3 lg:shrink-0">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-lg font-semibold text-on-primary"
            aria-hidden="true"
          >
            {site.monogram}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-heading text-lg leading-tight font-semibold text-heading">
              {site.name}
            </span>
            <span className="hidden truncate text-xs text-body sm:block lg:hidden xl:block">{site.tagline}</span>
          </span>
        </Link>

        <nav aria-label={ui.mainNav} className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="relative py-2 font-medium transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition hover:text-heading hover:after:scale-x-100"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <a href={telHref(site)} className="hidden items-center gap-2 font-semibold whitespace-nowrap text-heading xl:flex">
            <Icon name="phone" className="size-4" />
            {site.contact.phoneDisplay}
          </a>
          <Button href="/book" icon="calendar-check">
            {ui.bookAppointment}
          </Button>
        </div>

        <MobileNav
          items={nav}
          label={ui.mainNav}
          openLabel={ui.openMenu}
          closeLabel={ui.closeMenu}
          bookHref="/book"
          bookLabel={ui.bookAppointment}
        />
      </Container>
    </header>
  );
}

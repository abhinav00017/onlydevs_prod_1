import Link from "next/link";
import type { NavItem, Site } from "@/lib/schema";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";

type Props = { site: Site; nav: NavItem[] };

/**
 * Three groups: brand on the left, nav in the middle, Book on the right.
 * The phone number is not here: the hero, the floating mobile bar, /contact and the footer carry it,
 * and on a max-w-6xl row it left no space between the groups (measured at 1280 to 1920).
 */
export function Header({ site, nav }: Props) {
  const { ui } = site;
  // No backdrop-filter on <header>: it would trap the fixed mobile menu panel inside the header box.
  return (
    <header className="sticky top-0 z-50 border-b border-muted bg-background">
      <Container className="flex h-16 items-center gap-4 lg:h-20 lg:gap-8">
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
            <span className="hidden truncate text-xs text-body sm:block lg:hidden 2xl:block">{site.tagline}</span>
          </span>
        </Link>

        <nav aria-label={ui.mainNav} className="hidden min-w-0 flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-8 xl:gap-10">
            {nav.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="relative block px-1 py-2 text-[15px] font-medium whitespace-nowrap transition after:absolute after:inset-x-1 after:bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition hover:text-heading hover:after:scale-x-100 xl:text-base"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden shrink-0 lg:block">
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

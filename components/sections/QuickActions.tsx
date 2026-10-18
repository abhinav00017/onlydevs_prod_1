import Link from "next/link";
import type { Pages, Site } from "@/lib/schema";
import { isInternal, resolveHref } from "@/lib/links";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

type Props = { data: Pages["sections"]["quickActions"]; site: Site };

export function QuickActions({ data, site }: Props) {
  return (
    <section aria-labelledby="quick-actions-heading" className="bg-background py-12 sm:py-16">
      <Container>
        <h2 id="quick-actions-heading" className="sr-only">
          {data.heading}
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((item) => {
            const target = resolveHref(item.href, site);
            const inner = (
              <>
                <span className="flex size-12 items-center justify-center rounded-full bg-surface-alt text-heading ring-1 ring-accent transition group-hover:bg-primary group-hover:text-on-primary">
                  <Icon name={item.icon} className="size-6" />
                </span>
                <span className="mt-4 block font-heading text-lg font-semibold text-heading">{item.title}</span>
                <span className="mt-1 block text-body">{item.text}</span>
              </>
            );
            const classes =
              "group block h-full rounded-theme bg-background p-6 ring-1 ring-muted transition hover:-translate-y-0.5 hover:shadow-md hover:ring-accent";
            return (
              <li key={item.title}>
                {isInternal(target) ? (
                  <Link href={target} className={classes}>
                    {inner}
                  </Link>
                ) : (
                  <a
                    href={target}
                    className={classes}
                    {...(target.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {inner}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

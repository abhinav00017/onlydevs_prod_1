import Link from "next/link";
import type { ServicesFile, UiLabels } from "@/lib/schema";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  data: ServicesFile;
  ui: UiLabels;
  /** Hide the section heading when the page header already says it. */
  showHeading?: boolean;
  /** Slug to leave out, for the "other services" list on a service page. */
  exclude?: string;
  heading?: string;
};

export function Services({ data, ui, showHeading = true, exclude, heading }: Props) {
  const items = data.items.filter((s) => s.slug !== exclude);
  return (
    <section aria-labelledby="services-heading" className="bg-background py-16 sm:py-24">
      <Container>
        {showHeading ? (
          <SectionHeading id="services-heading" eyebrow={data.eyebrow} heading={heading ?? data.heading} intro={heading ? undefined : data.intro} />
        ) : (
          <h2 id="services-heading" className="sr-only">
            {heading ?? data.heading}
          </h2>
        )}
        <ul className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${showHeading ? "mt-12" : ""}`}>
          {items.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col rounded-theme bg-background p-7 ring-1 ring-muted transition hover:-translate-y-0.5 hover:shadow-md hover:ring-accent"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-surface-alt text-heading ring-1 ring-accent">
                  <Icon name={s.icon} className="size-6" />
                </span>
                <h3 className="mt-5 text-xl font-semibold">{s.name}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-body">{s.summary}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-link">
                  {ui.learnMore}
                  <span className="sr-only">: {s.name}</span>
                  <Icon name="arrow-right" className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

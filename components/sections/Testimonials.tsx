import type { TestimonialsFile } from "@/lib/schema";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials({ data }: { data: TestimonialsFile }) {
  return (
    <section aria-labelledby="testimonials-heading" className="bg-surface-alt py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="testimonials-heading"
          eyebrow={data.eyebrow}
          heading={data.heading}
          intro={data.intro}
          tone="tint"
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {data.items.map((t) => (
            <li key={t.name}>
              <figure className="flex h-full flex-col rounded-theme bg-background p-7 shadow-sm ring-1 ring-accent">
                <Icon name="quote" className="size-8 text-primary" />
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-heading">
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption className="mt-6 border-t border-muted pt-4">
                  <span className="font-semibold text-heading">{t.name}</span>
                  {t.context ? <span className="block text-sm text-body">{t.context}</span> : null}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

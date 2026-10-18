import type { HighlightGroup } from "@/lib/schema";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = { data: HighlightGroup; id: string; tinted?: boolean };

/** A grid of short points with icons. Serves both "highlights" and "whyChooseUs". */
export function Highlights({ data, id, tinted = false }: Props) {
  const headingId = `${id}-heading`;
  return (
    <section aria-labelledby={headingId} className={`${tinted ? "bg-surface" : "bg-background"} py-16 sm:py-24`}>
      <Container>
        <SectionHeading
          id={headingId}
          eyebrow={data.eyebrow}
          heading={data.heading}
          intro={data.intro}
          tone={tinted ? "tint" : "plain"}
        />
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item) => (
            <li key={item.title} className="flex gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
                <Icon name={item.icon} className="size-6" />
              </span>
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className={`mt-1 leading-relaxed ${tinted ? "text-heading/80" : "text-body"}`}>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

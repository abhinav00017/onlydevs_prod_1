import type { FaqFile } from "@/lib/schema";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = { data: FaqFile; showHeading?: boolean };

/** Native <details> accordion: works without JavaScript and with the keyboard. */
export function Faq({ data, showHeading = true }: Props) {
  return (
    <section aria-labelledby="faq-heading" className="bg-background py-16 sm:py-24">
      <Container className="max-w-3xl">
        {showHeading ? (
          <SectionHeading id="faq-heading" eyebrow={data.eyebrow} heading={data.heading} intro={data.intro} />
        ) : (
          <h2 id="faq-heading" className="sr-only">
            {data.heading}
          </h2>
        )}
        <div className={`divide-y divide-muted rounded-theme ring-1 ring-muted ${showHeading ? "mt-12" : ""}`}>
          {data.items.map((item) => (
            <details key={item.question} className="group px-5 py-1 sm:px-6">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-heading text-lg font-semibold text-heading [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-alt text-xl leading-none transition group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 leading-relaxed text-body">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

import type { Pages, Site } from "@/lib/schema";
import { resolveHref } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

type Props = { data: Pages["sections"]["cta"]; site: Site };

export function Cta({ data, site }: Props) {
  return (
    <section aria-labelledby="cta-heading" className="bg-background py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-footer px-6 py-12 text-center sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-primary/25 blur-3xl"
            aria-hidden="true"
          />
          <h2 id="cta-heading" className="relative text-3xl font-semibold text-on-footer sm:text-4xl">
            {data.heading}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-on-footer/85">{data.text}</p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button href={resolveHref(data.primaryCta.href, site)} icon="calendar-check">
              {data.primaryCta.label}
            </Button>
            {data.secondaryCta ? (
              <Button href={resolveHref(data.secondaryCta.href, site)} variant="inverse" icon="phone">
                {data.secondaryCta.label}
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

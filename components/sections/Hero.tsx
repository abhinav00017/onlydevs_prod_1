import Image from "next/image";
import type { Pages, Site } from "@/lib/schema";
import { imageUrl, resolveHref } from "@/lib/links";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

type Props = { data: Pages["sections"]["hero"]; site: Site; slug: string };

export function Hero({ data, site, slug }: Props) {
  const src = imageUrl(slug, data.image);
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-surface-alt">
      <div
        className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div>
          <Badge>
            <Icon name="stethoscope" className="size-4 text-primary" />
            {data.eyebrow}
          </Badge>
          <h1 id="hero-heading" className="mt-5 text-4xl leading-[1.1] font-semibold sm:text-5xl lg:text-6xl">
            {data.heading}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-heading/80">{data.text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={resolveHref(data.primaryCta.href, site)} icon="calendar-check">
              {data.primaryCta.label}
            </Button>
            {data.secondaryCta ? (
              <Button href={resolveHref(data.secondaryCta.href, site)} variant="secondary" icon="phone">
                {data.secondaryCta.label}
              </Button>
            ) : null}
          </div>
          {data.stats.length > 0 ? (
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {data.stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-sm text-heading/80">{s.label}</dt>
                  <dd className="font-heading text-3xl font-semibold text-heading">{s.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] bg-accent" aria-hidden="true" />
          <Image
            src={src}
            alt={data.imageAlt}
            width={800}
            height={960}
            priority
            unoptimized={src.endsWith(".svg")}
            className="relative aspect-[5/6] w-full rounded-[2rem] bg-surface object-cover"
          />
        </div>
      </Container>
    </section>
  );
}

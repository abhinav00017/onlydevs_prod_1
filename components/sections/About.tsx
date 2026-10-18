import Image from "next/image";
import type { Doctor, Pages, Site } from "@/lib/schema";
import { imageUrl, resolveHref } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

type Props = { data: Pages["sections"]["about"]; doctor: Doctor; site: Site; slug: string };

export function About({ data, doctor, site, slug }: Props) {
  const src = imageUrl(slug, doctor.image);
  return (
    <section aria-labelledby="about-heading" className="bg-surface py-16 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <Image
          src={src}
          alt={doctor.imageAlt}
          width={640}
          height={760}
          unoptimized={src.endsWith(".svg")}
          className="mx-auto aspect-[16/19] w-full max-w-sm rounded-[2rem] bg-surface-alt object-cover lg:max-w-none"
        />
        <div>
          <p className="mb-3 text-sm font-semibold tracking-wide text-heading uppercase">
            <span className="mr-2 inline-block h-0.5 w-6 rounded-full bg-primary align-middle" aria-hidden="true" />
            {data.eyebrow}
          </p>
          <h2 id="about-heading" className="text-3xl leading-tight font-semibold sm:text-4xl">
            {data.heading}
          </h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-heading/80">
            {data.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-theme bg-background p-4 ring-1 ring-accent">
              <Icon name="award" className="mt-0.5 size-5 shrink-0 text-heading" />
              <div>
                <dt className="text-sm text-heading/80">{site.ui.experience}</dt>
                <dd className="font-semibold text-heading">
                  {doctor.experienceYears}
                  {site.ui.yearsSuffix}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-theme bg-background p-4 ring-1 ring-accent">
              <Icon name="hospital" className="mt-0.5 size-5 shrink-0 text-heading" />
              <div>
                <dt className="text-sm text-heading/80">{site.ui.hospital}</dt>
                <dd className="font-semibold text-heading">{doctor.hospital}</dd>
              </div>
            </div>
          </dl>
          <div className="mt-8">
            <Button href={resolveHref(data.cta.href, site)} variant="secondary" icon="arrow-right">
              {data.cta.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

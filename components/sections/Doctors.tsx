import Image from "next/image";
import type { DoctorFile, UiLabels } from "@/lib/schema";
import { imageUrl } from "@/lib/links";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = { data: DoctorFile; ui: UiLabels; slug: string };

export function Doctors({ data, ui, slug }: Props) {
  return (
    <section aria-labelledby="doctors-heading" className="bg-background py-16 sm:py-24">
      <Container>
        <SectionHeading id="doctors-heading" eyebrow={data.eyebrow} heading={data.heading} intro={data.intro} />
        <div className="mt-12 space-y-16">
          {data.doctors.map((d) => {
            const src = imageUrl(slug, d.image);
            return (
              <article key={d.slug} className="grid items-start gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
                <Image
                  src={src}
                  alt={d.imageAlt}
                  width={640}
                  height={760}
                  unoptimized={src.endsWith(".svg")}
                  className="mx-auto aspect-[16/19] w-full max-w-sm rounded-[2rem] bg-surface-alt object-cover lg:max-w-none"
                />
                <div>
                  <h3 className="text-3xl font-semibold">{d.name}</h3>
                  <p className="mt-2 text-lg font-medium text-heading">{d.credentials}</p>
                  <p className="text-body">{d.role}</p>
                  <dl className="mt-6 flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-surface-alt px-4 py-2 ring-1 ring-accent">
                      <Icon name="award" className="size-4 text-heading" />
                      <dt className="sr-only">{ui.experience}</dt>
                      <dd className="text-sm font-medium text-heading">
                        {d.experienceYears}
                        {ui.yearsSuffix}
                      </dd>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-surface-alt px-4 py-2 ring-1 ring-accent">
                      <Icon name="hospital" className="size-4 text-heading" />
                      <dt className="sr-only">{ui.hospital}</dt>
                      <dd className="text-sm font-medium text-heading">{d.hospital}</dd>
                    </div>
                  </dl>
                  <div className="mt-6 space-y-4 text-lg leading-relaxed text-body">
                    {d.bio.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  {d.focusAreas.length > 0 ? (
                    <>
                      <h4 className="mt-8 text-lg font-semibold">{ui.focusAreas}</h4>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {d.focusAreas.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-body">
                            <Icon name="check" className="mt-1 size-4 shrink-0 text-heading" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

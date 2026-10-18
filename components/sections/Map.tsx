import type { Pages, Site } from "@/lib/schema";
import { directionsUrl, mapEmbedUrl, telHref } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = { data: Pages["sections"]["map"]; site: Site };

export function Map({ data, site }: Props) {
  const { contact, ui } = site;
  const a = contact.address;
  return (
    <section aria-labelledby="map-heading" className="bg-surface py-16 sm:py-24">
      <Container>
        <SectionHeading id="map-heading" eyebrow={data.eyebrow} heading={data.heading} intro={data.intro} tone="tint" />
        <div className="mt-12 grid gap-6 lg:grid-cols-[2fr_3fr]">
          <div className="rounded-theme bg-background p-7 ring-1 ring-accent">
            <dl className="space-y-6">
              <div className="flex gap-4">
                <Icon name="hospital" className="mt-0.5 size-6 shrink-0 text-heading" />
                <div>
                  <dt className="text-sm text-body">{ui.hospital}</dt>
                  <dd className="font-semibold text-heading">{contact.hospital}</dd>
                </div>
              </div>
              <div className="flex gap-4">
                <Icon name="map-pin" className="mt-0.5 size-6 shrink-0 text-heading" />
                <div>
                  <dt className="text-sm text-body">{ui.address}</dt>
                  <dd className="text-heading">
                    <address className="not-italic">
                      {a.street}
                      <br />
                      {a.locality}
                      <br />
                      {a.city}, {a.region} {a.postalCode}
                    </address>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <Icon name="phone" className="mt-0.5 size-6 shrink-0 text-heading" />
                <div>
                  <dt className="text-sm text-body">{ui.phone}</dt>
                  <dd>
                    <a href={telHref(site)} className="font-semibold text-link underline-offset-4 hover:underline">
                      {contact.phoneDisplay}
                    </a>
                  </dd>
                </div>
              </div>
              {contact.email ? (
                <div className="flex gap-4">
                  <Icon name="mail" className="mt-0.5 size-6 shrink-0 text-heading" />
                  <div>
                    <dt className="text-sm text-body">{ui.email}</dt>
                    <dd>
                      <a href={`mailto:${contact.email}`} className="font-semibold text-link underline-offset-4 hover:underline">
                        {contact.email}
                      </a>
                    </dd>
                  </div>
                </div>
              ) : null}
              {contact.hours.length > 0 ? (
                <div className="flex gap-4">
                  <Icon name="clock" className="mt-0.5 size-6 shrink-0 text-heading" />
                  <div>
                    <dt className="text-sm text-body">{ui.hours}</dt>
                    {contact.hours.map((h) => (
                      <dd key={h.days} className="text-heading">
                        <span className="font-medium">{h.days}:</span> {h.time}
                      </dd>
                    ))}
                  </div>
                </div>
              ) : null}
            </dl>
            <Button href={directionsUrl(site)} variant="secondary" icon="map-pin" className="mt-8 w-full sm:w-auto">
              {ui.getDirections}
            </Button>
          </div>
          <div className="min-h-80 overflow-hidden rounded-theme ring-1 ring-accent">
            <iframe
              title={ui.mapTitle}
              src={mapEmbedUrl(site)}
              className="size-full min-h-80 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

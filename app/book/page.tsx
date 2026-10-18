import type { Metadata } from "next";
import { Suspense } from "react";
import { getClient } from "@/lib/client";
import { telHref, whatsappHref } from "@/lib/links";
import { activeOffer } from "@/lib/offer";
import { AppointmentForm } from "@/components/booking/AppointmentForm";
import { AppointmentFormFromUrl } from "@/components/booking/AppointmentFormFromUrl";
import { OfferCard } from "@/components/offer/OfferCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";

export function generateMetadata(): Metadata {
  const { book } = getClient().pages;
  return { title: book.title, description: book.description, alternates: { canonical: "/book" } };
}

export default function BookPage() {
  const { site, pages } = getClient();
  const page = pages.book;
  const wa = whatsappHref(site);
  const a = site.contact.address;
  const offer = activeOffer(site);
  const formProps = {
    reasons: site.booking.reasons,
    visitTypes: site.booking.visitTypes,
    labels: site.ui.form,
    provider: site.booking.provider,
  };
  return (
    <>
      <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro} />
      <section className="bg-background py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <div className="rounded-theme bg-background p-6 ring-1 ring-muted sm:p-8">
            {/* ?type= is read in the browser. The static HTML holds the form with the first visit type. */}
            <Suspense fallback={<AppointmentForm {...formProps} />}>
              <AppointmentFormFromUrl {...formProps} />
            </Suspense>
          </div>
          <aside className="space-y-6">
            {offer ? <OfferCard offer={offer} label={site.ui.offerLabel} /> : null}
            <div className="rounded-theme bg-surface-alt p-7 ring-1 ring-accent">
              <p className="font-heading text-xl font-semibold text-heading">{site.ui.callNow}</p>
              <a href={telHref(site)} className="mt-2 block text-2xl font-semibold text-link underline-offset-4 hover:underline">
                {site.contact.phoneDisplay}
              </a>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button href={telHref(site)} icon="phone">
                  {site.ui.callNow}
                </Button>
                {wa ? (
                  <Button href={wa} variant="secondary" icon="message">
                    {site.ui.whatsapp}
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="flex gap-4 rounded-theme bg-surface p-7 ring-1 ring-accent">
              <Icon name="map-pin" className="mt-0.5 size-6 shrink-0 text-heading" />
              <div className="text-heading">
                <p className="font-semibold">{site.contact.hospital}</p>
                <address className="mt-1 not-italic text-heading/80">
                  {a.street}, {a.locality}, {a.city}, {a.region} {a.postalCode}
                </address>
              </div>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}

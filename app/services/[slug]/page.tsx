import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getClient } from "@/lib/client";
import { Services } from "@/components/sections/Services";
import { Cta } from "@/components/sections/Cta";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";

export function generateStaticParams() {
  return getClient().services.items.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getClient().services.items.find((s) => s.slug === slug);
  if (!service) return {};
  return { title: service.name, description: service.summary, alternates: { canonical: `/services/${slug}` } };
}

// With Cache Components, params is read inside a Suspense child, never in the page function itself.
export default function ServicePage({ params }: PageProps<"/services/[slug]">) {
  return (
    <Suspense>
      <ServiceDetail params={params} />
    </Suspense>
  );
}

async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = getClient();
  const service = client.services.items.find((s) => s.slug === slug);
  if (!service) notFound();
  return (
    <>
      <PageHeader eyebrow={client.services.heading} heading={service.name} intro={service.summary} />
      <section className="bg-background py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-body">
            {service.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <aside className="h-fit rounded-theme bg-surface-alt p-7 ring-1 ring-accent">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-background text-heading ring-1 ring-accent">
              <Icon name={service.icon} className="size-6" />
            </span>
            <p className="mt-4 font-heading text-xl font-semibold text-heading">{client.pages.sections.cta.heading}</p>
            <Button href="/book" icon="calendar-check" className="mt-5">
              {client.site.ui.bookAppointment}
            </Button>
          </aside>
        </Container>
      </section>
      <Services data={client.services} ui={client.site.ui} exclude={service.slug} heading={client.site.ui.otherServices} />
      <Cta data={client.pages.sections.cta} site={client.site} />
    </>
  );
}

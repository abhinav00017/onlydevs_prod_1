import type { Metadata } from "next";
import { getClient } from "@/lib/client";
import { renderSections } from "@/lib/sections";
import { Services } from "@/components/sections/Services";
import { PageHeader } from "@/components/ui/PageHeader";

export function generateMetadata(): Metadata {
  const { services } = getClient().pages;
  return { title: services.title, description: services.description, alternates: { canonical: "/services" } };
}

export default function ServicesPage() {
  const client = getClient();
  const page = client.pages.services;
  return (
    <>
      <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro} />
      <Services data={client.services} ui={client.site.ui} showHeading={false} />
      {renderSections(page.sections, client)}
    </>
  );
}

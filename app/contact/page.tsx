import type { Metadata } from "next";
import { getClient } from "@/lib/client";
import { renderSections } from "@/lib/sections";
import { Map } from "@/components/sections/Map";
import { PageHeader } from "@/components/ui/PageHeader";

export function generateMetadata(): Metadata {
  const { contact } = getClient().pages;
  return { title: contact.title, description: contact.description, alternates: { canonical: "/contact" } };
}

export default function ContactPage() {
  const client = getClient();
  const page = client.pages.contact;
  return (
    <>
      <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro} />
      <Map data={client.pages.sections.map} site={client.site} />
      {renderSections(page.sections, client)}
    </>
  );
}

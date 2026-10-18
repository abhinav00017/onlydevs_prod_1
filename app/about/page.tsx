import type { Metadata } from "next";
import { getClient } from "@/lib/client";
import { renderSections } from "@/lib/sections";
import { PageHeader } from "@/components/ui/PageHeader";

export function generateMetadata(): Metadata {
  const { about } = getClient().pages;
  return { title: about.title, description: about.description, alternates: { canonical: "/about" } };
}

export default function AboutPage() {
  const client = getClient();
  const page = client.pages.about;
  return (
    <>
      <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro} />
      {renderSections(page.sections, client)}
    </>
  );
}

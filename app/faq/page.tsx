import type { Metadata } from "next";
import { getClient } from "@/lib/client";
import { renderSections } from "@/lib/sections";
import { Faq } from "@/components/sections/Faq";
import { PageHeader } from "@/components/ui/PageHeader";

export function generateMetadata(): Metadata {
  const { faq } = getClient().pages;
  return { title: faq.title, description: faq.description, alternates: { canonical: "/faq" } };
}

export default function FaqPage() {
  const client = getClient();
  const page = client.pages.faq;
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: client.faq.items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }}
      />
      <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro} />
      <Faq data={client.faq} showHeading={false} />
      {renderSections(page.sections, client)}
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getClient } from "@/lib/client";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

// Legal pages come from clients/<slug>/legal/<page>.md, listed in pages.json "legal".
export function generateStaticParams() {
  return getClient().legal.map((l) => ({ legal: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[legal]">): Promise<Metadata> {
  const { legal } = await params;
  const page = getClient().legal.find((l) => l.slug === legal);
  if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: `/${legal}` } };
}

export default function LegalPage({ params }: PageProps<"/[legal]">) {
  return (
    <Suspense>
      <LegalContent params={params} />
    </Suspense>
  );
}

async function LegalContent({ params }: { params: Promise<{ legal: string }> }) {
  const { legal } = await params;
  const page = getClient().legal.find((l) => l.slug === legal);
  if (!page) notFound();
  return (
    <>
      <PageHeader heading={page.title} intro={page.description} />
      <section className="bg-background py-14 sm:py-20">
        <Container>
          {/* Markdown from the repo's own client folder, converted at build time. */}
          <div className="prose-legal" dangerouslySetInnerHTML={{ __html: page.html }} />
        </Container>
      </section>
    </>
  );
}

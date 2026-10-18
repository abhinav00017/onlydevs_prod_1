import { getClient } from "@/lib/client";
import { renderSections } from "@/lib/sections";
import { jsonLdForClinic } from "@/lib/json-ld";

export default function HomePage() {
  const client = getClient();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdForClinic(client) }}
      />
      {renderSections(client.pages.home.sections, client)}
    </>
  );
}

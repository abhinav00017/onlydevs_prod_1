import type { ClientData } from "./load-client";
import { imageUrl } from "./links";

/** schema.org data for search engines. Escapes "<" so the JSON cannot close the script tag. */
export function jsonLdForClinic(client: ClientData): string {
  const { site, doctors, slug } = client;
  const a = site.contact.address;
  const doctor = doctors.doctors[0];
  const data = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.contact.phone,
    image: new URL(imageUrl(slug, doctor.image), site.url).toString(),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${a.street}, ${a.locality}`,
      addressLocality: a.city,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    hospitalAffiliation: { "@type": "Hospital", name: site.contact.hospital },
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

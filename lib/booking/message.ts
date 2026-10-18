import type { Site, VisitType } from "../schema";
import type { BookingRequest } from "./schema";

export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

/** The visit type a request names. The request schema has already checked the id. */
export function visitTypeOf(site: Site, id: string): VisitType {
  const type = site.booking.visitTypes.find((t) => t.id === id);
  if (!type) throw new Error(`Unknown visit type "${id}"`);
  return type;
}

/** "Online consultation" becomes "online consultation". Acronyms such as "MRI scan" keep their case. */
function lowerFirst(label: string): string {
  if (label.length > 1 && label[1] === label[1].toUpperCase() && label[1] !== label[1].toLowerCase()) return label;
  return label.charAt(0).toLowerCase() + label.slice(1);
}

/**
 * The request as plain text, the same for every provider: site.json booking.messageTemplate,
 * then booking.freeLine when the chosen visit type is free.
 */
export function bookingMessage(site: Site, req: BookingRequest): string {
  const type = visitTypeOf(site, req.visitType);
  const lines = [
    fillTemplate(site.booking.messageTemplate, {
      clinic: site.name,
      name: req.name,
      phone: req.phone,
      date: req.date,
      reason: req.reason,
      visitType: type.label,
    }),
  ];
  if (type.free) lines.push(fillTemplate(site.booking.freeLine, { visitType: lowerFirst(type.label) }));
  return lines.join("\n");
}

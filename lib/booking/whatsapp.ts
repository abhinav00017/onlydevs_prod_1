import type { Site } from "../schema";
import { whatsappHref } from "../links";
import type { BookingRequest } from "./schema";

export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

/**
 * WhatsApp provider. The server builds a wa.me deep link with the request as the message.
 * The patient taps it and sends the message from their own WhatsApp. Nothing is stored here.
 */
export function buildWhatsAppBooking(site: Site, req: BookingRequest): string {
  const message = fillTemplate(site.booking.messageTemplate, {
    clinic: site.name,
    name: req.name,
    phone: req.phone,
    date: req.date,
    reason: req.reason,
  });
  const url = whatsappHref(site, message);
  if (!url) throw new Error("site.json contact.whatsapp is not set");
  return url;
}

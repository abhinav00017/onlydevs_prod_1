import type { Site } from "../schema";
import { whatsappHref } from "../links";
import { bookingMessage } from "./message";
import type { BookingRequest } from "./schema";

/**
 * WhatsApp provider. The server builds a wa.me deep link with the request as the message.
 * The patient taps it and sends the message from their own WhatsApp. Nothing is stored here.
 */
export function buildWhatsAppBooking(site: Site, req: BookingRequest): string {
  const url = whatsappHref(site, bookingMessage(site, req));
  if (!url) throw new Error("site.json contact.whatsapp is not set");
  return url;
}

import type { Site } from "../schema";
import { bookingMessage, visitTypeOf } from "./message";
import type { BookingRequest } from "./schema";

export class EmailNotConfiguredError extends Error {
  constructor() {
    super("Email booking is not set up yet.");
    this.name = "EmailNotConfiguredError";
  }
}

/** The email the clinic will get. Ready for the provider below; tests check it now. */
export function buildBookingEmail(site: Site, req: BookingRequest): { subject: string; text: string } {
  const type = visitTypeOf(site, req.visitType);
  return {
    subject: `${type.label}: ${req.name}, ${req.date}`,
    text: bookingMessage(site, req),
  };
}

/**
 * Email provider: STUB.
 *
 * TODO: pick an email service and send the request to the clinic. Env vars it will read
 * (listed in .env.example, never committed with values):
 *   BOOKING_EMAIL_TO      clinic inbox that receives requests
 *   BOOKING_EMAIL_FROM    verified sender address
 *   EMAIL_API_KEY         API key for the chosen email service
 *
 * Until then it throws, and /api/book answers 501 so the form tells people to call.
 */
export async function sendBookingEmail(site: Site, req: BookingRequest): Promise<void> {
  const email = buildBookingEmail(site, req);
  void email;
  const configured = process.env.BOOKING_EMAIL_TO && process.env.BOOKING_EMAIL_FROM && process.env.EMAIL_API_KEY;
  if (!configured) throw new EmailNotConfiguredError();
  throw new EmailNotConfiguredError();
}

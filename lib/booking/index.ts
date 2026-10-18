import type { Site } from "../schema";
import { EmailNotConfiguredError, sendBookingEmail } from "./email";
import { bookingRequestSchema, type BookingResult } from "./schema";
import { buildWhatsAppBooking } from "./whatsapp";

export type { BookingResult } from "./schema";

/** Validates a booking request and hands it to the provider site.json picks. */
export async function handleBooking(site: Site, body: unknown, now?: Date): Promise<BookingResult> {
  const schema = bookingRequestSchema({
    reasons: site.booking.reasons,
    visitTypes: site.booking.visitTypes.map((t) => t.id),
    timeZone: site.timezone,
    now,
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, status: 400, error: "Please check the highlighted fields.", fieldErrors };
  }

  if (site.booking.provider === "whatsapp") {
    return { ok: true, provider: "whatsapp", url: buildWhatsAppBooking(site, parsed.data) };
  }

  try {
    await sendBookingEmail(site, parsed.data);
    return { ok: true, provider: "email" };
  } catch (err) {
    if (err instanceof EmailNotConfiguredError) {
      return { ok: false, status: 501, error: err.message };
    }
    throw err;
  }
}

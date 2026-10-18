import { getClient } from "@/lib/client";
import { handleBooking } from "@/lib/booking";

const MAX_BODY_BYTES = 4_000;

/** Appointment requests from components/booking/AppointmentForm. Validated with Zod on the server. */
export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Request is too large." }, { status: 413 });
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "Send the form as JSON." }, { status: 400 });
  }

  const { site } = getClient();
  const result = await handleBooking(site, body);
  if (result.ok) return Response.json(result);
  return Response.json(result, { status: result.status });
}

import { z } from "zod";

/** Today's date (YYYY-MM-DD) in the clinic's time zone. */
export function todayIn(timeZone: string, now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Builds the request schema for one client: the reason and the visit type must be ones the clinic lists,
 * and the date must fall between today and one year ahead in the clinic's time zone.
 */
export function bookingRequestSchema(opts: { reasons: string[]; visitTypes: string[]; timeZone: string; now?: Date }) {
  const today = todayIn(opts.timeZone, opts.now);
  const lastDay = addDays(today, 365);
  return z.object({
    name: z.string().trim().min(2, "Enter your name").max(80, "Name is too long"),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a phone number with digits only")
      .refine((v) => v.replace(/\D/g, "").length >= 7, "Enter a phone number with digits only"),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date")
      .refine((d) => !Number.isNaN(Date.parse(`${d}T00:00:00Z`)), "Choose a date")
      .refine((d) => d >= today, "Choose today or a later date")
      .refine((d) => d <= lastDay, "Choose a date within the next year"),
    reason: z.enum(opts.reasons as [string, ...string[]], { error: "Choose a reason from the list" }),
    visitType: z.enum(opts.visitTypes as [string, ...string[]], { error: "Choose how you would like to consult" }),
    /** Honeypot. People never see this field; bots fill it. */
    website: z.string().max(0).optional().or(z.literal("")),
  });
}

export type BookingRequest = z.infer<ReturnType<typeof bookingRequestSchema>>;

export type BookingResult =
  | { ok: true; provider: "whatsapp"; url: string }
  | { ok: true; provider: "email" }
  | { ok: false; status: number; error: string; fieldErrors?: Record<string, string> };

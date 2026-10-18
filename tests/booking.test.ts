import { describe, expect, it } from "vitest";
import { handleBooking } from "@/lib/booking";
import { buildBookingEmail } from "@/lib/booking/email";
import { drgowthami } from "./helpers";

// 10:00 on 18 Oct 2026 in India.
const NOW = new Date("2026-10-18T04:30:00Z");
const valid = {
  name: "Test Patient",
  phone: "+91 90000 00000",
  date: "2026-10-20",
  reason: "Pregnancy care",
  visitType: "clinic",
};

function whatsappText(result: Awaited<ReturnType<typeof handleBooking>>): string {
  if (!result.ok || result.provider !== "whatsapp") throw new Error("expected whatsapp");
  return new URL(result.url).searchParams.get("text") ?? "";
}

describe("booking", () => {
  const { site } = drgowthami();

  it("builds a wa.me link to the clinic with the request as the message", async () => {
    const result = await handleBooking(site, valid, NOW);
    expect(result.ok).toBe(true);
    if (!result.ok || result.provider !== "whatsapp") throw new Error("expected whatsapp");
    const url = new URL(result.url);
    expect(url.origin + url.pathname).toBe("https://wa.me/918914805523");
    const text = url.searchParams.get("text") ?? "";
    expect(text).toContain("Name: Test Patient");
    expect(text).toContain("Preferred date: 2026-10-20");
    expect(text).toContain("Reason: Pregnancy care");
    expect(text).toContain("Visit type: Visit the clinic");
    expect(text).not.toContain("free");
  });

  it("adds the free line to an online consultation", async () => {
    const text = whatsappText(await handleBooking(site, { ...valid, visitType: "online" }, NOW));
    expect(text).toContain("Visit type: Online consultation");
    expect(text.split("\n").at(-1)).toBe("First online consultation: free");
  });

  it("rejects an unknown visit type with 400", async () => {
    const result = await handleBooking(site, { ...valid, visitType: "bogus" }, NOW);
    expect(result).toEqual({
      ok: false,
      status: 400,
      error: "Please check the highlighted fields.",
      fieldErrors: { visitType: "Choose how you would like to consult" },
    });
  });

  it("rejects a request with no visit type", async () => {
    const { visitType, ...rest } = valid;
    void visitType;
    const result = await handleBooking(site, rest, NOW);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.fieldErrors ?? {})).toEqual(["visitType"]);
  });

  it("puts the visit type and the free line in the email", () => {
    const email = buildBookingEmail(site, { ...valid, visitType: "online", website: "" });
    expect(email.subject).toBe("Online consultation: Test Patient, 2026-10-20");
    expect(email.text).toContain("Visit type: Online consultation");
    expect(email.text).toContain("First online consultation: free");
  });

  it("rejects a past date, an unknown reason and a bad phone", async () => {
    const result = await handleBooking(site, { ...valid, date: "2026-10-17", reason: "Botox", phone: "abc" }, NOW);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.status).toBe(400);
    expect(Object.keys(result.fieldErrors ?? {}).sort()).toEqual(["date", "phone", "reason"]);
  });

  it("accepts today in the clinic's time zone", async () => {
    const result = await handleBooking(site, { ...valid, date: "2026-10-18" }, NOW);
    expect(result.ok).toBe(true);
  });

  it("answers 501 when the email provider is chosen but not built", async () => {
    const result = await handleBooking({ ...site, booking: { ...site.booking, provider: "email" } }, valid, NOW);
    expect(result).toEqual({ ok: false, status: 501, error: "Email booking is not set up yet." });
  });
});

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ClientDataError, loadClient } from "@/lib/load-client";
import { brokenCopy, problemsOf } from "./helpers";

describe("client data validation", () => {
  it("accepts clients/drgowthami", () => {
    const c = loadClient("drgowthami");
    expect(c.site.name).toBe("Dr. Gowthami Namballa");
    expect(c.services.items.map((s) => s.slug)).toEqual([
      "gynecology",
      "obstetrics",
      "preventive-care",
      "wellness-checks",
      "cancer-screening",
    ]);
    expect(c.legal.map((l) => l.slug)).toEqual(["terms", "privacy"]);
    expect(c.legal[0].html).toContain("<h2>");
  });

  it("fills interface words from defaults", () => {
    expect(loadClient("drgowthami").site.ui.bookAppointment).toBe("Book appointment");
  });

  it("rejects clients/_template until every TODO is replaced", () => {
    const problems = problemsOf(() => loadClient("_template"));
    expect(problems.length).toBeGreaterThan(20);
    expect(problems).toContain("site.json › name: still has a TODO placeholder");
    expect(problems).toContain(
      "site.json › contact.phone: must be a full phone number with country code and no spaces, like +918914805523",
    );
  });

  it("names the folder when the client does not exist", () => {
    expect(() => loadClient("nobody")).toThrow(ClientDataError);
    expect(problemsOf(() => loadClient("nobody"))[0]).toMatch(/clients\/nobody\/ does not exist/);
  });

  it("rejects an unknown home section name", () => {
    const dir = brokenCopy("pages.json", (j) => {
      (j.home as { sections: string[] }).sections.push("carousel");
    });
    const problems = problemsOf(() => loadClient("drgowthami", dir));
    expect(problems.some((p) => p.startsWith("pages.json › home.sections[9]: must be one of: hero,"))).toBe(true);
  });

  it("rejects a colour that is not hex", () => {
    const dir = brokenCopy("theme.json", (j) => {
      (j.colors as Record<string, string>).primary = "pink";
    });
    expect(problemsOf(() => loadClient("drgowthami", dir))).toEqual([
      "theme.json › colors.primary: must be a 6-digit hex colour, like #0B2142",
    ]);
  });

  it("rejects a nav link to a page that does not exist", () => {
    const dir = brokenCopy("pages.json", (j) => {
      (j.nav as { href: string }[])[0].href = "/blog";
    });
    expect(problemsOf(() => loadClient("drgowthami", dir))).toEqual([
      'pages.json › nav[0].href: "/blog" is not a page on this site',
    ]);
  });

  it("rejects a missing image", () => {
    const dir = brokenCopy("doctor.json", (j) => {
      (j.doctors as { image: string }[])[0].image = "missing.jpg";
    });
    expect(problemsOf(() => loadClient("drgowthami", dir))).toEqual([
      "doctor.json › doctors[0].image: images/missing.jpg is missing",
    ]);
  });

  it("requires a WhatsApp number when WhatsApp booking is on", () => {
    const dir = brokenCopy("site.json", (j) => {
      delete (j.contact as Record<string, unknown>).whatsapp;
    });
    expect(problemsOf(() => loadClient("drgowthami", dir))).toEqual([
      "site.json › contact.whatsapp: is required when booking.provider is whatsapp",
    ]);
  });

  it("rejects a missing legal markdown file", () => {
    const dir = brokenCopy("pages.json", () => {});
    fs.rmSync(path.join(dir, "drgowthami", "legal", "privacy.md"));
    expect(problemsOf(() => loadClient("drgowthami", dir))).toEqual([
      "pages.json › legal[1]: legal/privacy.md is missing",
    ]);
  });

  it("_template has every file a client needs", () => {
    const want = fs.readdirSync(path.join(process.cwd(), "clients", "drgowthami")).sort();
    const have = fs.readdirSync(path.join(process.cwd(), "clients", "_template")).sort();
    expect(have).toEqual(want);
  });
});

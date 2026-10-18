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

  it("treats the offer as optional", () => {
    const dir = brokenCopy("site.json", (j) => {
      delete j.offer;
    });
    expect(loadClient("drgowthami", dir).site.offer).toBeUndefined();
  });

  it("needs the offer's button label and link together", () => {
    const dir = brokenCopy("site.json", (j) => {
      delete (j.offer as Record<string, unknown>).ctaHref;
    });
    expect(problemsOf(() => loadClient("drgowthami", dir))).toEqual([
      "site.json › offer.ctaHref: ctaLabel and ctaHref must be set together",
    ]);
  });

  it("rejects an offer link to a visit type that does not exist", () => {
    const dir = brokenCopy("site.json", (j) => {
      (j.offer as Record<string, unknown>).ctaHref = "/book?type=house-call";
    });
    expect(problemsOf(() => loadClient("drgowthami", dir))).toEqual([
      'site.json › offer.ctaHref: "house-call" is not a visit type. Use one of: clinic, online',
    ]);
  });

  it("requires booking.visitTypes", () => {
    const dir = brokenCopy("site.json", (j) => {
      delete (j.booking as Record<string, unknown>).visitTypes;
    });
    expect(problemsOf(() => loadClient("drgowthami", dir))).toEqual([
      "site.json › booking.visitTypes: must list the ways to consult, like a clinic visit",
    ]);
  });

  it("requires at least one visit type", () => {
    const dir = brokenCopy("site.json", (j) => {
      (j.booking as Record<string, unknown>).visitTypes = [];
    });
    expect(problemsOf(() => loadClient("drgowthami", dir))).toEqual([
      "site.json › booking.visitTypes: must list at least one visit type",
    ]);
  });

  it("rejects two visit types with the same id", () => {
    const dir = brokenCopy("site.json", (j) => {
      const types = (j.booking as { visitTypes: { id: string }[] }).visitTypes;
      types[1].id = types[0].id;
    });
    expect(problemsOf(() => loadClient("drgowthami", dir))).toEqual([
      "site.json › booking.visitTypes: every visit type id must be unique",
    ]);
  });

  it("requires {visitType} in a custom booking message", () => {
    const dir = brokenCopy("site.json", (j) => {
      (j.booking as Record<string, unknown>).messageTemplate = "Hello {clinic}. Name: {name}";
    });
    expect(problemsOf(() => loadClient("drgowthami", dir))).toEqual([
      "site.json › booking.messageTemplate: must include {visitType} so the clinic knows how to consult",
    ]);
  });

  it("_template fails on its visit type and offer placeholders", () => {
    const problems = problemsOf(() => loadClient("_template"));
    expect(problems).toContain("site.json › booking.visitTypes[0].label: still has a TODO placeholder");
    expect(problems).toContain("site.json › offer.title: still has a TODO placeholder");
  });
});

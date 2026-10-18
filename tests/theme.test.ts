import { describe, expect, it } from "vitest";
import { contrast, themeToCss } from "@/lib/theme";
import { drgowthami } from "./helpers";

describe("theme", () => {
  const { theme } = drgowthami();

  it("writes every colour, both fonts and the radius as CSS variables", () => {
    const css = themeToCss(theme);
    expect(css).toMatch(/^:root\{.*\}$/);
    expect(css).toContain("--theme-primary:#EF5697");
    expect(css).toContain("--theme-heading:#0B2142");
    expect(css).toContain("--theme-font-heading:var(--font-fraunces)");
    expect(css).toContain("--theme-font-body:var(--font-inter)");
    expect(css).toContain("--theme-radius:1.25rem");
  });

  // The colour pairs the components actually use. WCAG AA needs 4.5:1 for body text.
  const pairs: [string, keyof typeof theme.colors, keyof typeof theme.colors][] = [
    ["body text on page background", "body", "background"],
    ["headings on page background", "heading", "background"],
    ["headings on surface", "heading", "surface"],
    ["headings on surfaceAlt", "heading", "surfaceAlt"],
    ["button text on primary", "onPrimary", "primary"],
    ["links on page background", "link", "background"],
    ["links on surfaceAlt (hero offer line)", "link", "surfaceAlt"],
    ["footer text on footer", "onFooter", "footer"],
  ];
  it.each(pairs)("%s meets WCAG AA (4.5:1)", (_label, fg, bg) => {
    expect(contrast(theme.colors[fg], theme.colors[bg])).toBeGreaterThanOrEqual(4.5);
  });
});

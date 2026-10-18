import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Hero } from "@/components/sections/Hero";
import { drgowthami } from "../helpers";

it("Hero renders the heading, both calls to action and the image alt text", () => {
  const c = drgowthami();
  render(<Hero data={c.pages.sections.hero} site={c.site} slug={c.slug} />);
  expect(screen.getByRole("heading", { level: 1, name: "Top Gynecologist in Vizag" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Book appointment" }).getAttribute("href")).toBe("/book");
  expect(screen.getByRole("link", { name: "Call +91 89148 05523" }).getAttribute("href")).toBe("tel:+918914805523");
  expect(screen.getByAltText(c.pages.sections.hero.imageAlt)).toBeTruthy();
});

it("Hero shows the offer line when the offer is on, and not when it is off", () => {
  const c = drgowthami();
  const { unmount } = render(<Hero data={c.pages.sections.hero} site={c.site} slug={c.slug} />);
  expect(screen.getByText(/Your first online consultation is free/)).toBeTruthy();
  expect(screen.getByRole("link", { name: "Book online" }).getAttribute("href")).toBe("/book?type=online");
  unmount();
  const off = { ...c.site, offer: { ...c.site.offer!, enabled: false } };
  render(<Hero data={c.pages.sections.hero} site={off} slug={c.slug} />);
  expect(screen.queryByText(/Your first online consultation is free/)).toBeNull();
});

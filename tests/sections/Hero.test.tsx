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
  expect(screen.getByAltText(/Placeholder illustration of a doctor/)).toBeTruthy();
});

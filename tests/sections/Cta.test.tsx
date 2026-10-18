import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Cta } from "@/components/sections/Cta";
import { drgowthami } from "../helpers";

it("Cta renders the heading and both buttons", () => {
  const c = drgowthami();
  render(<Cta data={c.pages.sections.cta} site={c.site} />);
  expect(screen.getByRole("heading", { level: 2, name: "Ready to book your visit?" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Book appointment" }).getAttribute("href")).toBe("/book");
  expect(screen.getByRole("link", { name: "Call now" }).getAttribute("href")).toBe("tel:+918914805523");
});

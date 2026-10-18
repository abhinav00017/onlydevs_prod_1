import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Highlights } from "@/components/sections/Highlights";
import { drgowthami } from "../helpers";

it("Highlights renders each point as a heading", () => {
  const c = drgowthami();
  render(<Highlights data={c.highlights.highlights} id="highlights" />);
  expect(screen.getByRole("heading", { level: 2, name: "What makes us different" })).toBeTruthy();
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
});

it("Highlights also serves Why Choose Us", () => {
  const c = drgowthami();
  render(<Highlights data={c.highlights.whyChooseUs} id="why-choose-us" tinted />);
  expect(screen.getByRole("heading", { level: 3, name: "Experienced specialist" })).toBeTruthy();
});

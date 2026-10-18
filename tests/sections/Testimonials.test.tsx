import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Testimonials } from "@/components/sections/Testimonials";
import { drgowthami } from "../helpers";

it("Testimonials renders each quote with its author", () => {
  const c = drgowthami();
  const { container } = render(<Testimonials data={c.testimonials} />);
  expect(container.querySelectorAll("blockquote")).toHaveLength(3);
  expect(screen.getByText("Sravani R.")).toBeTruthy();
  expect(screen.getByText("Priya M.")).toBeTruthy();
  expect(screen.getByText("Meena D.")).toBeTruthy();
});

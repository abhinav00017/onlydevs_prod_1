import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Faq } from "@/components/sections/Faq";
import { drgowthami } from "../helpers";

it("Faq renders a details element per question", () => {
  const c = drgowthami();
  const { container } = render(<Faq data={c.faq} />);
  expect(container.querySelectorAll("details")).toHaveLength(c.faq.items.length);
  expect(screen.getByText("How do I book an appointment?")).toBeTruthy();
});

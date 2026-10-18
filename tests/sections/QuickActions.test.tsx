import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { QuickActions } from "@/components/sections/QuickActions";
import { drgowthami } from "../helpers";

it("QuickActions resolves action: links from site.json", () => {
  const c = drgowthami();
  render(<QuickActions data={c.pages.sections.quickActions} site={c.site} />);
  const links = screen.getAllByRole("link");
  expect(links).toHaveLength(4);
  expect(links.map((l) => l.getAttribute("href"))).toEqual([
    "/book",
    "tel:+918914805523",
    "https://wa.me/918914805523",
    "/contact",
  ]);
});

import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Services } from "@/components/sections/Services";
import { drgowthami } from "../helpers";

it("Services lists every service with a link to its page", () => {
  const c = drgowthami();
  render(<Services data={c.services} ui={c.site.ui} />);
  expect(screen.getByRole("heading", { level: 2, name: c.services.heading })).toBeTruthy();
  expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
    "Gynecology",
    "Obstetrics",
    "Preventive Care",
    "Wellness Checks",
    "Cancer Screening",
  ]);
  expect(screen.getByRole("link", { name: /Gynecology/ }).getAttribute("href")).toBe("/services/gynecology");
});

it("Services can leave out the current service", () => {
  const c = drgowthami();
  render(<Services data={c.services} ui={c.site.ui} exclude="obstetrics" heading="Other services" />);
  expect(screen.queryByRole("heading", { name: "Obstetrics" })).toBeNull();
});

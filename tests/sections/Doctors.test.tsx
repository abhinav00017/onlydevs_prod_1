import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Doctors } from "@/components/sections/Doctors";
import { drgowthami } from "../helpers";

it("Doctors renders the profile with credentials and focus areas", () => {
  const c = drgowthami();
  render(<Doctors data={c.doctors} ui={c.site.ui} slug={c.slug} />);
  expect(screen.getByRole("heading", { level: 3, name: "Dr. Gowthami Namballa" })).toBeTruthy();
  expect(screen.getByText("MS Obstetrics and Gynecology")).toBeTruthy();
  expect(screen.getByText("Pregnancy and delivery care")).toBeTruthy();
  expect(screen.getByAltText(/Placeholder portrait/)).toBeTruthy();
});

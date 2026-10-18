import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { About } from "@/components/sections/About";
import { drgowthami } from "../helpers";

it("About shows the doctor, experience and hospital", () => {
  const c = drgowthami();
  render(<About data={c.pages.sections.about} doctor={c.doctors.doctors[0]} site={c.site} slug={c.slug} />);
  expect(screen.getByRole("heading", { level: 2, name: "Dr. Gowthami Namballa" })).toBeTruthy();
  expect(screen.getByText("10+ years")).toBeTruthy();
  expect(screen.getByText("Medlife Multi Speciality Hospital, Visakhapatnam")).toBeTruthy();
  expect(screen.getByRole("link", { name: "More about Dr. Gowthami" }).getAttribute("href")).toBe("/about");
});

import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Map } from "@/components/sections/Map";
import { drgowthami } from "../helpers";

it("Map shows the address, phone and a titled map frame", () => {
  const c = drgowthami();
  render(<Map data={c.pages.sections.map} site={c.site} />);
  expect(screen.getByText("Medlife Multi Speciality Hospital")).toBeTruthy();
  expect(screen.getByRole("link", { name: "+91 89148 05523" }).getAttribute("href")).toBe("tel:+918914805523");
  const frame = screen.getByTitle("Map showing the clinic location");
  expect(frame.getAttribute("src")).toContain("maps.google.com");
  expect(screen.getByRole("link", { name: "Get directions" }).getAttribute("target")).toBe("_blank");
});

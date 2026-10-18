import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { AppointmentForm } from "@/components/booking/AppointmentForm";
import { drgowthami } from "../helpers";

it("AppointmentForm labels every field", () => {
  const c = drgowthami();
  render(<AppointmentForm reasons={c.site.booking.reasons} labels={c.site.ui.form} provider="whatsapp" />);
  expect(screen.getByLabelText(/Your name/)).toBeTruthy();
  expect(screen.getByLabelText(/Phone number/)).toBeTruthy();
  expect(screen.getByLabelText(/Preferred date/)).toBeTruthy();
  expect(screen.getByLabelText(/Reason for visit/).tagName).toBe("SELECT");
  expect(screen.getByRole("button", { name: /Request appointment/ })).toBeTruthy();
});

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppointmentForm } from "@/components/booking/AppointmentForm";
import { drgowthami } from "../helpers";

const c = drgowthami();
const props = {
  reasons: c.site.booking.reasons,
  visitTypes: c.site.booking.visitTypes,
  labels: c.site.ui.form,
  provider: "whatsapp" as const,
};

describe("AppointmentForm", () => {
  it("labels every field", () => {
    render(<AppointmentForm {...props} />);
    expect(screen.getByLabelText(/Your name/)).toBeTruthy();
    expect(screen.getByLabelText(/Phone number/)).toBeTruthy();
    expect(screen.getByLabelText(/Preferred date/)).toBeTruthy();
    expect(screen.getByLabelText(/Reason for visit/).tagName).toBe("SELECT");
    expect(screen.getByRole("button", { name: /Request appointment/ })).toBeTruthy();
  });

  it("offers each visit type as a labelled radio and picks the first by default", () => {
    render(<AppointmentForm {...props} />);
    const group = screen.getByRole("group", { name: /How would you like to consult\?/ });
    expect(group.getAttribute("aria-describedby")).toBeTruthy();
    const clinic = screen.getByRole("radio", { name: "Visit the clinic" }) as HTMLInputElement;
    const online = screen.getByRole("radio", { name: /Online consultation/ }) as HTMLInputElement;
    expect(clinic.checked).toBe(true);
    expect(online.checked).toBe(false);
    expect(clinic.name).toBe("visitType");
    expect(screen.getByText("Medlife Multi Speciality Hospital, Collectorate Junction")).toBeTruthy();
  });

  it("shows the Free badge only on the free type", () => {
    render(<AppointmentForm {...props} />);
    expect(screen.getAllByText("Free")).toHaveLength(1);
    expect(screen.getByRole("radio", { name: "Online consultation Free" })).toBeTruthy();
  });

  it("preselects the type named in ?type= and shows its description", () => {
    render(<AppointmentForm {...props} initialVisitType="online" />);
    expect((screen.getByRole("radio", { name: /Online consultation/ }) as HTMLInputElement).checked).toBe(true);
    expect(screen.getByText("Video or phone call. Your first one is free.")).toBeTruthy();
  });

  it("falls back to the first type when ?type= is unknown", () => {
    render(<AppointmentForm {...props} initialVisitType="bogus" />);
    expect((screen.getByRole("radio", { name: "Visit the clinic" }) as HTMLInputElement).checked).toBe(true);
  });

  it("changes the description when the visitor picks another type", () => {
    render(<AppointmentForm {...props} />);
    fireEvent.click(screen.getByRole("radio", { name: /Online consultation/ }));
    expect(screen.getByText("Video or phone call. Your first one is free.")).toBeTruthy();
    expect(screen.queryByText("Medlife Multi Speciality Hospital, Collectorate Junction")).toBeNull();
  });
});

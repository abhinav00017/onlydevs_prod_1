import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { OfferAnnouncement } from "@/components/offer/OfferAnnouncement";
import { OFFER_DISMISSED_ATTR, OFFER_STORAGE_KEY, offerDismissScript, offerId } from "@/lib/offer";
import type { Site } from "@/lib/schema";
import { drgowthami } from "../helpers";

const { site } = drgowthami();

afterEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute(OFFER_DISMISSED_ATTR);
});

describe("announcement bar", () => {
  it("shows an enabled offer with its link and a dismiss button", () => {
    render(<OfferAnnouncement site={site} />);
    const bar = screen.getByRole("complementary", { name: "Offer" });
    expect(bar.textContent).toContain("Your first online consultation is free");
    expect(screen.getByRole("link", { name: "Book online" }).getAttribute("href")).toBe("/book?type=online");
    expect(screen.getByRole("button", { name: "Hide this offer" })).toBeTruthy();
  });

  it("renders nothing when the offer is disabled", () => {
    const off: Site = { ...site, offer: { ...site.offer!, enabled: false } };
    const { container } = render(<OfferAnnouncement site={off} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when site.json has no offer", () => {
    const { container } = render(<OfferAnnouncement site={{ ...site, offer: undefined }} />);
    expect(container.innerHTML).toBe("");
  });

  it("remembers the dismissal and hides the bar through the <html> attribute", () => {
    render(<OfferAnnouncement site={site} />);
    fireEvent.click(screen.getByRole("button", { name: "Hide this offer" }));
    expect(localStorage.getItem(OFFER_STORAGE_KEY)).toBe(offerId(site.offer!));
    expect(document.documentElement.hasAttribute(OFFER_DISMISSED_ATTR)).toBe(true);
  });

  it("the <head> script hides the bar only for the offer the visitor dismissed", () => {
    const run = () => new Function(offerDismissScript(site.offer!))();
    localStorage.setItem(OFFER_STORAGE_KEY, "an-older-offer");
    run();
    expect(document.documentElement.hasAttribute(OFFER_DISMISSED_ATTR)).toBe(false);
    localStorage.setItem(OFFER_STORAGE_KEY, offerId(site.offer!));
    run();
    expect(document.documentElement.hasAttribute(OFFER_DISMISSED_ATTR)).toBe(true);
  });
});

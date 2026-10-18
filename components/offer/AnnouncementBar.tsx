"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { Offer } from "@/lib/schema";
import { OFFER_DISMISSED_ATTR, OFFER_STORAGE_KEY } from "@/lib/offer";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

type Props = {
  offer: Offer;
  /** offerId(offer), worked out on the server so the inline <head> script and this component agree. */
  offerId: string;
  label: string;
  dismissLabel: string;
};

/**
 * A slim bar above the header. The server always renders it; the <head> script from lib/offer.ts
 * hides it before paint for a visitor who dismissed this offer, so nothing jumps after hydration.
 */
export function AnnouncementBar({ offer, offerId, label, dismissLabel }: Props) {
  function dismiss() {
    document.documentElement.setAttribute(OFFER_DISMISSED_ATTR, "");
    try {
      localStorage.setItem(OFFER_STORAGE_KEY, offerId);
    } catch {
      // Storage blocked: the bar stays hidden until the next page load.
    }
  }

  const cta =
    offer.ctaLabel && offer.ctaHref ? (
      offer.ctaHref.startsWith("/") ? (
        <Link href={offer.ctaHref} className="font-semibold whitespace-nowrap underline underline-offset-4">
          {offer.ctaLabel}
        </Link>
      ) : (
        <a href={offer.ctaHref} className="font-semibold whitespace-nowrap underline underline-offset-4">
          {offer.ctaLabel}
        </a>
      )
    ) : null;

  return (
    <aside aria-label={label} data-offer-bar="" className="bg-primary text-on-primary">
      <Container className="flex items-center gap-3 py-1">
        <p className="min-w-0 flex-1 text-sm leading-snug sm:text-center">
          <Icon name="sparkles" className="mr-1.5 hidden size-4 align-[-3px] sm:inline" />
          <span className="font-semibold">{offer.title}</span>
          {offer.text ? <span className="hidden md:inline"> {offer.text}</span> : null}
          {cta ? <> {cta}</> : null}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="-mr-2 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-on-primary/10"
        >
          <X className="size-5" aria-hidden="true" />
          <span className="sr-only">{dismissLabel}</span>
        </button>
      </Container>
    </aside>
  );
}

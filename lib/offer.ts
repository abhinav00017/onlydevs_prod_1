import type { Offer, Site } from "./schema";

/** localStorage key that holds the id of the offer a visitor hid. */
export const OFFER_STORAGE_KEY = "offer-dismissed";

/** Attribute on <html> that hides the announcement bar. styles/globals.css reads it. */
export const OFFER_DISMISSED_ATTR = "data-offer-dismissed";

/** The offer to show, or undefined when site.json has none or turns it off. */
export function activeOffer(site: Site): Offer | undefined {
  return site.offer?.enabled ? site.offer : undefined;
}

/**
 * A short id for the offer's wording. A visitor who hid one offer sees the bar again when the wording changes.
 * Only [0-9a-z], so it is safe to put inside an inline script.
 */
export function offerId(offer: Offer): string {
  const source = `${offer.title}|${offer.text ?? ""}|${offer.ctaHref ?? ""}`;
  let hash = 5381;
  for (let i = 0; i < source.length; i++) hash = ((hash * 33) ^ source.charCodeAt(i)) >>> 0;
  return hash.toString(36);
}

/**
 * Runs in <head> before the page paints. Hides the bar for a visitor who hid this offer,
 * so the bar never flashes in and out. localStorage can throw (private mode, blocked storage),
 * so the script swallows errors and the bar stays visible.
 */
export function offerDismissScript(offer: Offer): string {
  const key = JSON.stringify(OFFER_STORAGE_KEY);
  const id = JSON.stringify(offerId(offer));
  const attr = JSON.stringify(OFFER_DISMISSED_ATTR);
  return `try{if(localStorage.getItem(${key})===${id})document.documentElement.setAttribute(${attr},"")}catch(e){}`;
}

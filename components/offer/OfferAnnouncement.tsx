import type { Site } from "@/lib/schema";
import { activeOffer, offerId } from "@/lib/offer";
import { AnnouncementBar } from "./AnnouncementBar";

/** The announcement bar when site.json has an enabled offer; nothing otherwise. */
export function OfferAnnouncement({ site }: { site: Site }) {
  const offer = activeOffer(site);
  if (!offer) return null;
  return (
    <AnnouncementBar
      offer={offer}
      offerId={offerId(offer)}
      label={site.ui.offerLabel}
      dismissLabel={site.ui.dismissOffer}
    />
  );
}

import type { Offer } from "@/lib/schema";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** The offer as a highlighted card beside the booking form. Hides the button when it points back to /book. */
export function OfferCard({ offer, label }: { offer: Offer; label: string }) {
  const showCta = offer.ctaLabel && offer.ctaHref && !offer.ctaHref.startsWith("/book");
  return (
    <div className="rounded-theme bg-surface-alt p-7 ring-2 ring-primary">
      <Badge tone="primary">
        <Icon name="sparkles" className="size-4" />
        {label}
      </Badge>
      <p className="mt-4 font-heading text-xl font-semibold text-heading">{offer.title}</p>
      {offer.text ? <p className="mt-2 text-heading/80">{offer.text}</p> : null}
      {showCta ? (
        <Button href={offer.ctaHref!} variant="secondary" className="mt-5">
          {offer.ctaLabel}
        </Button>
      ) : null}
    </div>
  );
}

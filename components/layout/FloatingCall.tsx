import type { Site } from "@/lib/schema";
import { telHref, whatsappHref } from "@/lib/links";
import { Icon } from "@/components/ui/Icon";

/** Call and WhatsApp buttons pinned to the bottom of the screen on phones. Hidden from md up. */
export function FloatingCall({ site }: { site: Site }) {
  const wa = whatsappHref(site);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-muted bg-background/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md gap-3">
        <a
          href={telHref(site)}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-on-primary"
        >
          <Icon name="phone" className="size-5" />
          {site.ui.callNow}
        </a>
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-background font-semibold text-heading ring-1 ring-heading/25"
          >
            <Icon name="message" className="size-5" />
            {site.ui.whatsapp}
          </a>
        ) : null}
      </div>
    </div>
  );
}

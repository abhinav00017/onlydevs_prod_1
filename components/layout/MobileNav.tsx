"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { NavItem } from "@/lib/schema";
import { NavLink } from "./NavLink";

type Props = {
  items: NavItem[];
  label: string;
  openLabel: string;
  closeLabel: string;
  bookHref: string;
  bookLabel: string;
};

export function MobileNav({ items, label, openLabel, closeLabel, bookHref, bookLabel }: Props) {
  const [open, setOpen] = useState(false);
  // The panel starts at the header's bottom edge. With the offer bar above the header that edge moves,
  // so it is measured each time the menu opens.
  const [top, setTop] = useState<number>();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  function toggle() {
    if (!open) {
      const header = rootRef.current?.closest("header");
      if (header) setTop(Math.max(0, header.getBoundingClientRect().bottom));
    }
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div ref={rootRef} className="ml-auto lg:hidden">
      <button
        type="button"
        className="flex size-11 items-center justify-center rounded-full text-heading ring-1 ring-muted"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
      >
        {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        <span className="sr-only">{open ? closeLabel : openLabel}</span>
      </button>
      <div
        id={panelId}
        hidden={!open}
        style={top === undefined ? undefined : { top }}
        className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-background px-4 pt-4 pb-10"
      >
        <nav aria-label={label}>
          <ul className="divide-y divide-muted">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-heading text-2xl font-semibold"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href={bookHref}
          onClick={() => setOpen(false)}
          className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-primary px-5 font-semibold text-on-primary"
        >
          {bookLabel}
        </Link>
      </div>
    </div>
  );
}

"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
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
  const panelId = useId();

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
    <div className="lg:hidden">
      <button
        type="button"
        className="flex size-11 items-center justify-center rounded-full text-heading ring-1 ring-muted"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        <span className="sr-only">{open ? closeLabel : openLabel}</span>
      </button>
      <div
        id={panelId}
        hidden={!open}
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

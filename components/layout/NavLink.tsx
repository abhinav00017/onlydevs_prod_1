"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = { href: string; children: ReactNode; className?: string; onClick?: () => void };

/** A nav link that marks itself aria-current="page" on the matching route. */
export function NavLink({ href, children, className = "", onClick }: Props) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`${className} ${active ? "text-heading after:scale-x-100" : "text-heading/75"}`}
    >
      {children}
    </Link>
  );
}

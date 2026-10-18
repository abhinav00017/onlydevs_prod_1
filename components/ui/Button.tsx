import Link from "next/link";
import type { ReactNode } from "react";
import type { IconName } from "@/lib/schema/names";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "inverse";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:brightness-95 shadow-sm",
  secondary: "bg-background text-heading ring-1 ring-heading/20 hover:ring-heading/50",
  ghost: "text-heading hover:bg-heading/5",
  inverse: "bg-on-footer text-footer hover:brightness-95",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: IconName;
  className?: string;
  external?: boolean;
};

/** A link styled as a button. Internal paths use next/link; tel:, https: and the rest use <a>. */
export function Button({ href, children, variant = "primary", icon, className = "", external }: Props) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full whitespace-nowrap px-5 py-2.5 text-base font-semibold transition ${VARIANTS[variant]} ${className}`;
  const content = (
    <>
      {icon ? <Icon name={icon} className="size-5 shrink-0" /> : null}
      <span>{children}</span>
    </>
  );
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  const opensNewTab = external ?? href.startsWith("https://");
  return (
    <a
      href={href}
      className={classes}
      {...(opensNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  );
}

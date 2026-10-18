import type { ReactNode } from "react";

type Tone = "default" | "primary";

const TONES: Record<Tone, string> = {
  default: "bg-background text-heading ring-1 ring-accent",
  primary: "bg-primary text-on-primary",
};

export function Badge({
  children,
  className = "",
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}

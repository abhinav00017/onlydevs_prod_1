import type { ReactNode } from "react";

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-sm font-medium text-heading ring-1 ring-accent ${className}`}
    >
      {children}
    </span>
  );
}

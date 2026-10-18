import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li" | "figure";
};

export function Card({ children, className = "", as: Tag = "div" }: Props) {
  return (
    <Tag className={`rounded-theme bg-background p-6 ring-1 ring-muted transition-shadow ${className}`}>
      {children}
    </Tag>
  );
}

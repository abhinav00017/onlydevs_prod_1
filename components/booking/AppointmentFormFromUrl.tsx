"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentProps } from "react";
import { AppointmentForm } from "./AppointmentForm";

/**
 * Reads ?type= in the browser and preselects that visit type. Render it inside <Suspense>:
 * the root layout sets ensureStatic = "navigation", which allows useSearchParams only there.
 */
export function AppointmentFormFromUrl(props: Omit<ComponentProps<typeof AppointmentForm>, "initialVisitType">) {
  const type = useSearchParams().get("type") ?? undefined;
  return <AppointmentForm {...props} initialVisitType={type} />;
}

"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { UiLabels } from "@/lib/schema";
import type { BookingResult } from "@/lib/booking/schema";
import { Icon } from "@/components/ui/Icon";

type Props = {
  reasons: string[];
  labels: UiLabels["form"];
  provider: "whatsapp" | "email";
};

type FieldName = "name" | "phone" | "date" | "reason";
type State =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string; fieldErrors: Partial<Record<FieldName, string>> }
  | { status: "done"; url?: string };

const inputClass =
  "mt-2 block min-h-12 w-full rounded-xl border-0 bg-background px-4 py-3 text-base text-heading ring-1 ring-heading/20 placeholder:text-heading/50 focus:ring-2 focus:ring-link focus:outline-none aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-primary";

export function AppointmentForm({ reasons, labels, provider }: Props) {
  const [state, setState] = useState<State>({ status: "idle" });
  const dateRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Set the earliest date in the browser so the static page does not depend on build time.
  // The server checks the date again in the clinic's time zone.
  useEffect(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    if (dateRef.current) dateRef.current.min = local;
  }, [state.status]);

  // Move focus to the result so keyboard and screen reader users, and people scrolled down, see it.
  useEffect(() => {
    if (state.status === "done") doneRef.current?.focus();
  }, [state.status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const result = (await res.json()) as BookingResult;
      if (result.ok) {
        setState({ status: "done", url: result.provider === "whatsapp" ? result.url : undefined });
      } else {
        setState({
          status: "error",
          message: res.status === 400 ? result.error : labels.error,
          fieldErrors: (result.fieldErrors ?? {}) as Partial<Record<FieldName, string>>,
        });
      }
    } catch {
      setState({ status: "error", message: labels.error, fieldErrors: {} });
    }
  }

  if (state.status === "done") {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        className="scroll-mt-28 rounded-theme bg-surface-alt p-8 ring-1 ring-accent"
      >
        <h2 className="text-2xl font-semibold">{labels.successHeading}</h2>
        <p className="mt-3 text-lg text-heading/80">
          {provider === "whatsapp" ? labels.successWhatsapp : labels.successEmail}
        </p>
        {state.url ? (
          <a
            href={state.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-on-primary"
          >
            <Icon name="message" className="size-5" />
            {labels.openWhatsapp}
          </a>
        ) : null}
      </div>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors : {};
  const field = (name: FieldName) => ({
    id: `${id}-${name}`,
    name,
    required: true,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });
  const errorText = (name: FieldName) =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className="mt-2 text-sm font-medium text-heading">
        <span aria-hidden="true" className="mr-1 text-primary">●</span>
        {errors[name]}
      </p>
    ) : null;
  const requiredMark = (
    <span className="text-heading/70">
      {" "}
      <span aria-hidden="true">*</span>
      <span className="sr-only">({labels.required})</span>
    </span>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {state.status === "error" ? (
        <div role="alert" className="rounded-xl bg-surface-alt p-4 font-medium text-heading ring-1 ring-primary">
          {state.message}
        </div>
      ) : null}

      <div>
        <label htmlFor={`${id}-name`} className="font-medium text-heading">
          {labels.name}
          {requiredMark}
        </label>
        <input {...field("name")} type="text" autoComplete="name" maxLength={80} className={inputClass} />
        {errorText("name")}
      </div>

      <div>
        <label htmlFor={`${id}-phone`} className="font-medium text-heading">
          {labels.phone}
          {requiredMark}
        </label>
        <input {...field("phone")} type="tel" autoComplete="tel" inputMode="tel" maxLength={20} className={inputClass} />
        {errorText("phone")}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-date`} className="font-medium text-heading">
            {labels.date}
            {requiredMark}
          </label>
          <input {...field("date")} ref={dateRef} type="date" className={inputClass} />
          {errorText("date")}
        </div>
        <div>
          <label htmlFor={`${id}-reason`} className="font-medium text-heading">
            {labels.reason}
            {requiredMark}
          </label>
          <select {...field("reason")} defaultValue="" className={inputClass}>
            <option value="" disabled>
              {labels.reasonPlaceholder}
            </option>
            {reasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errorText("reason")}
        </div>
      </div>

      {/* Honeypot: hidden from people and screen readers. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <p className="text-sm text-body">{labels.privacyNote}</p>

      <button
        type="submit"
        disabled={state.status === "submitting"}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-on-primary shadow-sm transition hover:brightness-95 disabled:opacity-70 sm:w-auto"
      >
        <Icon name="calendar-check" className="size-5" />
        {state.status === "submitting" ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}

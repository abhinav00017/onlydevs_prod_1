type Props = {
  eyebrow?: string;
  heading: string;
  intro?: string;
  align?: "left" | "center";
  id?: string;
  /** Use "tint" on surface backgrounds so body text keeps enough contrast. */
  tone?: "plain" | "tint";
};

export function SectionHeading({ eyebrow, heading, intro, align = "center", id, tone = "plain" }: Props) {
  const center = align === "center";
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold tracking-wide text-heading uppercase">
          <span className="mr-2 inline-block h-0.5 w-6 rounded-full bg-primary align-middle" aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="text-3xl leading-tight font-semibold sm:text-4xl">
        {heading}
      </h2>
      {intro ? (
        <p className={`mt-4 text-lg leading-relaxed ${tone === "tint" ? "text-heading/80" : "text-body"}`}>{intro}</p>
      ) : null}
    </div>
  );
}

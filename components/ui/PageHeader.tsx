import { Container } from "./Container";

type Props = { eyebrow?: string; heading: string; intro?: string };

/** The h1 band at the top of every page except home. */
export function PageHeader({ eyebrow, heading, intro }: Props) {
  return (
    <section className="bg-surface-alt py-14 sm:py-20">
      <Container>
        <div className="max-w-3xl">
          {eyebrow ? <p className="mb-3 text-sm font-semibold tracking-wide text-heading uppercase">{eyebrow}</p> : null}
          <h1 className="text-4xl leading-tight font-semibold sm:text-5xl">{heading}</h1>
          {intro ? <p className="mt-5 text-lg leading-relaxed text-heading/80">{intro}</p> : null}
        </div>
      </Container>
    </section>
  );
}

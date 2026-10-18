import { getClient } from "@/lib/client";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  const { ui } = getClient().site;
  return (
    <section className="bg-surface-alt py-24 sm:py-32">
      <Container className="text-center">
        <h1 className="text-4xl font-semibold sm:text-5xl">{ui.notFoundHeading}</h1>
        <p className="mt-4 text-lg text-heading/80">{ui.notFoundText}</p>
        <div className="mt-8">
          <Button href="/">{ui.backHome}</Button>
        </div>
      </Container>
    </section>
  );
}

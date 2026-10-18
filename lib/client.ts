import "server-only";
import { loadClient, type ClientData } from "./load-client";

export type { ClientData, LegalPage } from "./load-client";

let cached: ClientData | undefined;

/** The slug of the client this build serves, from the CLIENT env var. */
export function clientSlug(): string {
  const slug = process.env.CLIENT;
  if (!slug) {
    throw new Error(
      "CLIENT is not set. Copy .env.example to .env.local, or run with CLIENT=<slug>, for example CLIENT=drgowthami npm run dev.",
    );
  }
  return slug;
}

/**
 * Loads and validates clients/<CLIENT>/. Throws a readable error on bad data.
 * Production caches the result; development reloads so JSON edits show on refresh.
 */
export function getClient(): ClientData {
  if (cached && process.env.NODE_ENV === "production") return cached;
  cached = loadClient(clientSlug());
  return cached;
}

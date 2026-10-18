// Loads .env, .env.local etc. the same way Next.js does, so scripts see CLIENT.
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

export function requireClient(): string {
  const slug = process.env.CLIENT;
  if (!slug) {
    console.error(
      "CLIENT is not set. Copy .env.example to .env.local, or run with CLIENT=<slug>, for example CLIENT=drgowthami npm run dev.",
    );
    process.exit(1);
  }
  return slug;
}

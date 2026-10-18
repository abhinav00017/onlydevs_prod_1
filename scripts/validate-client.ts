// Validates clients/<CLIENT>/ before `next build`, so bad data stops the build with a readable list.
import { requireClient } from "./env";
import { ClientDataError, loadClient } from "../lib/load-client";

const slug = requireClient();
try {
  const client = loadClient(slug);
  console.log(
    `validate-client: clients/${slug}/ is valid (${client.services.items.length} services, ${client.legal.length} legal pages).`,
  );
} catch (err) {
  if (err instanceof ClientDataError) {
    console.error(`\n${err.message}\n`);
    process.exit(1);
  }
  throw err;
}

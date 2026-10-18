// Copies clients/<CLIENT>/images/ to public/clients/<CLIENT>/ so Next.js can serve them.
// Runs before `npm run dev` and `npm run build`. public/clients/ is generated and git-ignored.
import fs from "node:fs";
import path from "node:path";
import { requireClient } from "./env";

const slug = requireClient();
const from = path.join(process.cwd(), "clients", slug, "images");
const outRoot = path.join(process.cwd(), "public", "clients");
const to = path.join(outRoot, slug);

if (!fs.existsSync(from)) {
  console.error(`sync-images: clients/${slug}/images/ does not exist.`);
  process.exit(1);
}

// Remove other clients' images so one build never ships another client's files.
fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(to, { recursive: true });
fs.cpSync(from, to, { recursive: true });
const count = fs.readdirSync(to).length;
console.log(`sync-images: copied ${count} file(s) from clients/${slug}/images/ to public/clients/${slug}/`);

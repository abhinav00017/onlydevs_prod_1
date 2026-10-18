// npm run new-client <slug>
// Copies clients/_template/ to clients/<slug>/ and sets the slug. Fill in every TODO, then run
// CLIENT=<slug> npm run build. The build fails and lists each field that still needs a value.
import fs from "node:fs";
import path from "node:path";

const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("Usage: npm run new-client <slug>   (lowercase letters, numbers and hyphens, like dr-anita)");
  process.exit(1);
}

const clients = path.join(process.cwd(), "clients");
const from = path.join(clients, "_template");
const to = path.join(clients, slug);
if (fs.existsSync(to)) {
  console.error(`clients/${slug}/ already exists. Pick another slug or edit that folder.`);
  process.exit(1);
}

fs.cpSync(from, to, { recursive: true });
const sitePath = path.join(to, "site.json");
const site = JSON.parse(fs.readFileSync(sitePath, "utf8"));
site.slug = slug;
fs.writeFileSync(sitePath, `${JSON.stringify(site, null, 2)}\n`);

console.log(`Created clients/${slug}/.
Next:
  1. Replace every TODO in clients/${slug}/*.json and clients/${slug}/legal/*.md.
  2. Replace the placeholder files in clients/${slug}/images/.
  3. Run CLIENT=${slug} npm run build. It lists anything still missing.`);

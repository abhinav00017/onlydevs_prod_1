# Decisions

Append only. Newest at the bottom.

## 2026-10-18

- Project created at `~/passion-projects/onlydevs_prod_1/`. GitHub: abhinav00017/onlydevs_prod_1.
- Purpose: a web app for a hospital clinic. Users, features and stack not decided yet.
- Memory lives in the repo under `.claude/memory/`, same layout as vibeinn.

## 2026-10-18 (later)

- The app is a revamp of Dr. Gowthami Namballa's clinic website. Reference: https://xscade.wixstudio.com/drgowthami (built by a third party on Wix). Obstetrician and gynecologist, Medlife Multi Speciality Hospital, Visakhapatnam.
- Keep the reference site's colour palette only. Everything else: modern, simpler, straightforward.
- Palette (from computed styles): navy #0B2142, pink #EF5697, blue #1736B0, grey-text #66768E, cream #FFFAF2, blush #FFF7F7, sand #ECDCCD, light #EFEDED.
- Current site pages: Home, About Us, Book Online, Terms, Privacy, Accessibility. Book Appointment is a tel: link to +91 89148 05523. Address: Collectorate Junction, 15-13-12, Srirangapuram, Krishna Nagar, Maharani Peta, Visakhapatnam 530002.
- Proposed structure (awaiting Abhinav's yes): Next.js App Router, TypeScript, Tailwind; content as JSON in `content/`; pages read content only via `lib/content.ts`; routes: /, /about, /services, /services/[slug], /book, /contact, /terms, /privacy.
- Scalability requirement: this is a multi-client template, not a one-off site. Code is shared; each client is a data folder under `clients/<slug>/` (site.json, theme.json, pages.json, doctor(s).json, services.json, highlights.json, testimonials.json, faq.json, legal/*.md, images/). `CLIENT` env var picks the folder. One Vercel project per client, same repo.
- Components never hard-code text, colours, contacts or page lists. Zod validates every client JSON at build. Home sections are a list in pages.json. Theme is CSS variables from theme.json. Booking providers are pluggable (WhatsApp and email first).
- Dr. Gowthami is client one and lives at `clients/drgowthami/`.

## 2026-10-18 (scaffold)

- Stack as installed: Next.js 16.4.2 (Turbopack), React 19.3, Tailwind v4 via `@tailwindcss/turbopack` (no PostCSS file), Zod 4, Vitest 5, Node 22. `@types/node` moved to ^22 so Vitest's peer range resolves.
- create-next-app ran in a temp folder; files moved in. Its default `app/favicon.ico`, sample page and `public/*.svg` were removed.
- Cache Components and Partial Prefetching stay on (create-next-app default). Root layout sets `ensureStatic = 'navigation'`, so the build fails if any page stops being fully static. Dynamic routes (`/services/[slug]`, `/[legal]`) read `params` only inside a Suspense child. `dynamicParams` is not available with Cache Components; unknown slugs call `notFound()` (404 in `next start`, measured).
- Client data loads with synchronous `fs` reads in `lib/load-client.ts`. Its `path.join` calls carry `/*turbopackIgnore: true*/` so the tracer does not ship the whole repo; `next.config.ts` adds `clients/**` to the `/api/book` trace instead.
- Validation runs twice: `scripts/validate-client.ts` in `prebuild` prints a readable list and exits 1; the loader throws the same error inside `next build` if `prebuild` is skipped.
- Template gating: `clients/_template` is meant to FAIL validation. Any string containing "TODO" fails the schema, so a new client cannot ship with placeholder text.
- Fonts: headings Fraunces, body Inter. `lib/fonts.ts` declares a fixed set of six open Google fonts (Inter, DM Sans, Manrope, Fraunces, Playfair Display, Lora) because next/font needs literal options. theme.json picks two by key. Preload is off for all six.
- Tailwind v4 `@theme inline` maps `--theme-*` variables (written into `<head>` from theme.json) to utility colours. The default Tailwind palette is switched off (`--color-*: initial`), so components can only use theme tokens.
- Contrast: white text on pink #EF5697 is 3.3:1 (fails WCAG AA). Buttons use navy text on pink (4.9:1). Grey body #66768E on cream/blush is under 4.5:1, so tinted sections use navy at 80% for body text. A test checks the pairs.
- Interface words (button labels, form labels, aria labels) live in site.json `ui` with defaults in the schema, so a client file can leave them out.
- Links in client data use `action:call`, `action:whatsapp`, `action:book` so the phone number lives only in site.json.
- Booking reason is a fixed list in site.json, not free text, to keep health details out of the WhatsApp link. Server checks the date in the clinic's time zone (site.json `timezone`).
- Tests: Vitest + jsdom + Testing Library, `server-only` aliased to a stub, Vite's native `resolve.tsconfigPaths` (the plugin is not needed with Vite 8).
- Quick actions changed from the reference ("Live Chat", "24/7 Support", "Top Articles") to Book, Call, WhatsApp, Find the clinic, because the site has no chat, no 24/7 service and no articles.
- Header has no `backdrop-filter`: it made the fixed mobile menu panel 56px tall inside the header (measured in the browser).
- Images are placeholders (SVG figures, a plain 1200x630 PNG for Open Graph). Site URL is a guess: https://drgowthami.vercel.app.

## 2026-10-18 (verified by Abhinav's session)

- Scaffold reviewed. Lint, tsc, 36 tests and `CLIENT=drgowthami npm run build` all pass on the main machine.
- Scalability proven: a throwaway `clients/testclinic` (new name, teal theme, Playfair heading font) built and rendered with zero code changes. Validation caught a wrong font name with a clear message. Test client removed afterwards.
- Dev: `npm run dev` on port 3000 with `.env.local` (CLIENT=drgowthami, git-ignored). The app preview tool cannot launch it from this session; start it in the background and open http://localhost:3000.
- Not pushed to GitHub yet. Waiting on Abhinav.

## 2026-10-18 (feedback after first run)

- Header felt compressed on desktop: brand, nav, phone and button sat packed together. Fix: more space between the groups, nav centred, phone number out of the header on normal desktops.
- Dr. Gowthami gives every patient one free online consultation. Show this offer on the site (announcement bar and booking page). Offer text and on/off live in site.json so other clients can drop it.
- Booking must allow an online consultation, not only a clinic visit. The form gets a visit type choice (in clinic / online). Visit types are data in site.json.

## 2026-10-18 (header, offer, online booking)

- Header: brand left, nav centred in a `flex-1` middle group, Book button right. Nav gap is 32px at lg and 40px from xl; nav text 15px at lg, 16px from xl. Header row is 80px on lg+ (81px with the bottom border).
- The phone number is out of the header at every width. Measured: the header row stays inside max-w-6xl (1088px of content) even at 1920, so brand, nav, phone and button could not all fit with space between them. The hero, floating mobile bar, /contact and footer still show it.
- Tagline shows on sm to md and from 2xl (1536px) up. At lg and xl it pushed the groups together.
- Measured gaps between brand, nav and button: 36px at 1024, 84px at 1280 and 1440, 56px at 1920 (tagline on). No wrap at any of these widths.
- `site.offer` is optional: `{ enabled, title, text?, ctaLabel?, ctaHref? }`. ctaLabel and ctaHref must be set together. The title is capped at 80 characters for the bar. A disabled offer still has to pass validation (no TODO).
- Client hrefs may now carry a simple query, like `/book?type=online`. The loader checks the path is a real page and, for `/book?type=`, that the id is in `booking.visitTypes`.
- Offer bar: server-rendered, `bg-primary` with `text-on-primary` (4.9:1). Dismissal stores a hash of the offer wording in localStorage `offer-dismissed`. An inline `<head>` script sets `data-offer-dismissed` on `<html>` before paint, and CSS hides the bar, so a returning visitor sees no flash. New wording gives a new hash, so the bar shows again. `<html>` has `suppressHydrationWarning` only when an offer is on.
- The mobile menu panel now measures the header's bottom edge when it opens, because the bar moves the header down until the page scrolls.
- `booking.visitTypes` is required, min 1, unique ids: `{ id, label, description?, free? }`.
- `/book?type=` is read with `useSearchParams()` in a client component inside `<Suspense>`. Server-side `searchParams` would break `ensureStatic = 'navigation'`. The static HTML has the form with the first visit type; the browser switches to the requested type after hydration.
- `/api/book` validates `visitType` against the client's ids and answers 400 with `fieldErrors.visitType` for an unknown or missing one.
- The request message lives in one place, `lib/booking/message.ts`, for WhatsApp and email. `booking.messageTemplate` must contain `{visitType}`. When the type is free, `booking.freeLine` (default "First {visitType}: free") is added, with the label's first letter in lower case unless it is an acronym.
- The email provider is still a stub, but `buildBookingEmail` builds the subject and text now and has a test.
- The dev server served stale CSS once (a rule appended to globals.css did not appear) until it restarted. Cause not known.
- 18 Oct 2026: deployed to Vercel as project `drgowthami`, live at https://drgowthami.vercel.app. Deploy is manual from the CLI. See hosting.md.
- 19 Oct 2026: real photo of Dr. Gowthami (holding a newborn, in scrubs) added as clients/drgowthami/images/doctor.webp. Used for both the hero and the doctor portrait. Placeholder SVGs removed. Render tests now read alt text from client data, not hard-coded strings. OG image and favicon are still placeholders.

## 2026-10-20 (demo hub)

- onlydevs is a business that sells digital services to local businesses. Dr. Gowthami is client one. The repo also gets a demo hub for sales demos.
- Demo hub flow: landing page "select a client type" (Clinic, Cafe, more later) → industry page with its 6 services → each service opens a demo. Clinic services: website, Google Business Profile, WhatsApp automation, online consultations, offers and packages, patient records.
- Day one: hub + industry pages + Clinic "website" demo linked to the Dr. Gowthami site. Other services open a clean coming-soon demo page. Real demos get built one at a time after.
- Style: minimal, simple, straight. Neutral palette until Abhinav gives brand guidelines.
- Services pitch (Abhinav's draft, tightened): 1 website, 2 Google Business Profile + reviews, 3 WhatsApp automation (confirmations, reminders, follow-ups, review requests, later prescriptions), 4 online consultations, 5 offers and packages, 6 patient records (phase two; DPDP consent needed). Setup fee for 1-2, monthly for 3-6.

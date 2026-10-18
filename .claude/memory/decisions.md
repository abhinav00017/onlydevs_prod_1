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

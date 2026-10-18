---
name: hosting
description: Where drgowthami is hosted and how to deploy it
metadata:
  type: reference
---

- Live site: https://drgowthami.vercel.app (production alias). First deployed 18 Oct 2026.
- Vercel project: `drgowthami` on team `abhinav00017s-projects`, account abhinav00017. Linked via `.vercel/` (git-ignored). Env var `CLIENT=drgowthami` is set for production, preview and development.
- GitHub: https://github.com/abhinav00017/onlydevs_prod_1, branch `main`. Vercel could not connect the repo (GitHub app not installed), so pushes do not deploy on their own.
- Deploy: push to `main`, then run `vercel deploy --prod --yes` from the repo root.
- New client: `npm run new-client <slug>`, fill the JSON, then `vercel link --yes --project <slug>` in a fresh checkout or after removing `.vercel/`, set `CLIENT=<slug>` on that project, deploy.

**How to apply:** After each change Abhinav wants live, push and run the deploy command. Tell him the live URL. See [[decisions]].

---
name: feedback_personal_email
description: Personal projects use Abhinav's personal git email only, never the work email
metadata:
  type: feedback
---

Abhinav said on 18 Oct 2026: do not use his work email (abhinav@automateaccounts.com) on personal projects.

**Why:** onlydevs and vibeinn are personal. Work identity must not appear in their git history or anywhere else.

**How to apply:** Commit as Abhinav Naidu Chintala <abhinavch53@gmail.com> (the repo and global git config already say so). Never pass the work email with `git -c user.email=...`. Never put it in files, Vercel, or env values. If a commit slips through, amend with `--reset-author` before pushing.

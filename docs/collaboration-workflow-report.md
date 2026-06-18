# Collaboration Workflow Report

## 1) Issues Created

I created three GitHub issues on my repo, one per feature branch. Each was filed with the enhancement label and a short acceptance summary in the body.

- #1 [Feature] User authentication — requested adding an in-memory auth service, a POST /api/auth/login endpoint, and improved client-side validation with UI feedback states on login.js.
- #2 [Feature] Database connection — requested replacing the db stub with an env-driven config module, connect()/getClient()/disconnect() functions, and an in-memory store with query() and insert() helpers.
- #3 [Feature] API endpoints — requested splitting src/routes/api.js into smaller modules (health.js, items.js) and adding a validated POST /api/items endpoint plus per-id lookup.

## 2) PR Summary

- PR #4: [Feature] Database connection — Closes #2. Added src/db/config.js with env-driven defaults and validation; implemented connect(), getClient(), and disconnect() in src/db/index.js; added an in-memory store with query() and insert() helpers. 110 insertions across 2 files. Screenshots: N/A (backend module only).
- PR #5: [Feature] User authentication — Closes #1. Added the auth service in src/services/auth.js; added POST /api/auth/login in src/routes/auth.js and mounted it in app.js; rewrote public/login.js with client-side validation, UI feedback states, and a fetch call to the new endpoint. 92 insertions across 5 files. Screenshots: N/A.
- PR #6: [Feature] API endpoints — Closes #3. Extracted the health route into its own module (src/routes/health.js); added src/routes/items.js with GET /api/items, GET /api/items/:id, and POST /api/items; added input validation on POST /api/items. 87 insertions across 4 files. Screenshots: N/A.

## 3) Self-Review Evidence

I left at least two self-review comments on every PR using the Files changed -> Review changes flow, submitted as "Comment" because GitHub disallows self-approval. On the db PR I noted that validateConfig() catches bad ports and inverted pool ranges as a useful defensive guard, and suggested moving the store into its own file as the schema grows. On the api PR I called out that api.js is now a clean aggregator and that the createdAt field on items will help when sorting and pagination are added.

On the auth PR (#5) I posted a critical self-review comment pointing out that validateCredentials() did not enforce the minimum password length on the server. The client-side clientValidate() required six or more characters, but a direct POST to /api/auth/login would have bypassed that check. I addressed this with a follow-up commit, fix(auth): enforce minimum password length server-side per review, which added a MIN_PASSWORD_LENGTH = 6 constant and a server-side length guard before the credential lookup. I then replied to the original comment confirming the fix.

Before each merge I ran npm test, npm run lint, and npm run format:check and confirmed all three passed, plus a manual curl smoke test of the new endpoints (POST /api/auth/login, GET /api/health, POST /api/items, GET /api/items).

## 4) Merge Strategy

I used Squash and merge for all three PRs. The main benefit is a clean, linear history on main: one commit per feature. The log stays readable, reverting an entire feature becomes a single git revert, and the feature branch's intermediate work-in-progress commits never reach main. It also pairs cleanly with the "Require linear history" branch-protection rule I enabled in Phase 3, which would block ordinary merge commits.

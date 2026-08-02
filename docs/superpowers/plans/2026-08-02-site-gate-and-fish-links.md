# Site Gate and Fish Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a password-only tab-session gate and make full `/fish` specimen fields clickable.

**Architecture:** `BaseLayout.astro` emits a synchronous, rerunnable inline gate script and a simple GET form. A GitHub Actions secret supplies the build-time value. Each fish specimen’s existing anchor uses a pseudo-element as a stretched link, preserving native link semantics.

**Tech Stack:** Astro 7.1.6, TypeScript 6.0.3, Playwright 1.62.1, GitHub Actions

## Global Constraints

- The gate is cosmetic and must not be described as secure authentication.
- Never commit, print, or place the real password in tests or documentation.
- Access lasts only in `sessionStorage` for the current tab.
- Local development remains unlocked without `SITE_GATE_PASSWORD`.
- Production deployment fails if the GitHub Actions secret is missing.
- Preserve the root checkout’s uncommitted `.gitignore` change.

---

### Task 1: Full specimen-field links

**Files:**
- Modify: `tests/e2e/fish.spec.ts`
- Modify: `src/components/fish/SpecimenField.astro`

**Interfaces:**
- Consumes: the existing `withBasePath()` record URL
- Produces: a native anchor whose hit area covers its specimen field

- [ ] Add a browser test that clicks the first `[data-specimen-field]` image and expects `/fish/specimen-01`.
- [ ] Run `npm run test:e2e -- tests/e2e/fish.spec.ts` and confirm the new test fails because the image is outside the link.
- [ ] Add `class="specimen-field__link"` and an accessible record-specific label to the existing anchor.
- [ ] Cover the field with `.specimen-field__link::after`; add an inset `:focus-visible::after` outline and no JavaScript handler.
- [ ] Rerun the fish and accessibility browser tests and confirm they pass.
- [ ] Commit as `fix: make specimen fields clickable`.

### Task 2: Password-only tab gate

**Files:**
- Create: `tests/e2e/gate.spec.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`
- Modify: `.github/workflows/deploy-pages.yml`
- Modify: `README.md`

**Interfaces:**
- Consumes: build-time `SITE_GATE_PASSWORD`
- Produces: `data-site-access="locked|granted"`, session key `chapel-koi-site-access`, and a password-only GET form

- [ ] Add a browser test, enabled only when `SITE_GATE_PASSWORD` exists, that proves the initial lock, invalid-password error, valid `?pass=` grant, query cleanup, and session persistence after navigating to `/fish`.
- [ ] Run `SITE_GATE_PASSWORD=test-only-access-key npm run test:e2e -- tests/e2e/gate.spec.ts` and confirm it fails because the gate does not exist.
- [ ] In `BaseLayout.astro`, read `process.env.SITE_GATE_PASSWORD`, set the initial HTML access state, add a synchronous inline head script with `data-astro-rerun`, and add the password-only form before normal page content.
- [ ] In `global.css`, hide normal body children while locked and style the gate with existing project tokens, visible focus, and responsive sizing.
- [ ] Rerun the focused gate test and accessibility suite with the test-only value; confirm they pass.
- [ ] Update the Pages workflow to fail when `SITE_GATE_PASSWORD` is empty, run the gate test with the secret, and pass the secret only to the build step.
- [ ] Document the cosmetic limitation, tab duration, and required repository secret without showing a password value.
- [ ] Run `npm run check`, `npm test`, the focused secret-enabled gate test, `npm run build`, and `git diff --check`.
- [ ] Commit as `feat: add cosmetic site gate`.

### Task 3: Integrate and deploy

- [ ] Review the completed diff for security wording, password leakage, accessibility, and GitHub workflow correctness.
- [ ] Require the user to configure the `SITE_GATE_PASSWORD` GitHub Actions secret before pushing.
- [ ] Merge into `main` without staging `.gitignore`.
- [ ] Push `main`, verify the GitHub Actions deployment succeeds, and test the live locked and valid-query flows without exposing the password in logs.

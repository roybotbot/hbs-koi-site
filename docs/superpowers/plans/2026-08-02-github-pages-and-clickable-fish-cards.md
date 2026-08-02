# GitHub Pages and Clickable Fish Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make homepage fish cards fully clickable and deploy the static Astro site to GitHub Pages automatically after pushes to `main`.

**Architecture:** A small pure helper prefixes internal links with Astro’s build-time base URL, allowing the same components to work at `/` locally and `/chapel-koi-site/` on project Pages. GitHub’s official Pages actions validate, build, upload, and deploy `dist`; generated output is not committed.

**Tech Stack:** Astro 7.1.6, TypeScript 6.0.3, Vitest 4.1.10, Playwright 1.62.1, GitHub Actions Pages v4/v5

## Global Constraints

- Keep `main` as the default source branch; do not create or commit generated files to `gh-pages`.
- Use only official GitHub actions for checkout, Node setup, Pages configuration, artifact upload, and deployment.
- Preserve the root checkout’s uncommitted `.gitignore` entry `graphics/`.
- Do not add dependencies.
- Local development must continue to use `/`; project Pages must use `/chapel-koi-site/`.
- A failed check, test, or build must prevent deployment and leave the previous deployment intact.

---

### Task 1: Base-path-aware internal links

**Files:**
- Create: `src/lib/content/withBasePath.ts`
- Create: `tests/unit/withBasePath.test.ts`
- Modify: `astro.config.mjs`
- Modify: `src/components/layout/SiteNav.astro`
- Modify: `src/components/layout/SiteFooter.astro`
- Modify: `src/components/home/FishPreview.astro`
- Modify: `src/components/fish/SpecimenField.astro`

**Interfaces:**
- Produces: `withBasePath(path: string, basePath?: string): string`
- Consumes: Vite’s `import.meta.env.BASE_URL`, and optional `BASE_PATH`/`SITE_URL` build environment variables

- [ ] **Step 1: Write the failing unit test**

```ts
import { describe, expect, it } from 'vitest';
import { withBasePath } from '../../src/lib/content/withBasePath';

describe('withBasePath', () => {
  it.each([
    ['/', '/chapel-koi-site/'],
    ['/fish', '/chapel-koi-site/fish'],
    ['/fish/specimen-01', '/chapel-koi-site/fish/specimen-01'],
    ['/history#sources', '/chapel-koi-site/history#sources'],
  ])('prefixes %s with the project base', (path, expected) => {
    expect(withBasePath(path, '/chapel-koi-site/')).toBe(expected);
  });

  it('keeps local root-based paths unchanged', () => {
    expect(withBasePath('/fish', '/')).toBe('/fish');
  });
});
```

- [ ] **Step 2: Run the unit test and verify RED**

Run: `npm run test:unit -- tests/unit/withBasePath.test.ts`
Expected: FAIL because `src/lib/content/withBasePath.ts` does not exist.

- [ ] **Step 3: Implement the helper**

```ts
export function withBasePath(path: string, basePath = import.meta.env.BASE_URL): string {
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  if (path === '/') return normalizedBase;
  return `${normalizedBase}${path.replace(/^\/+/, '')}`;
}
```

- [ ] **Step 4: Apply the helper to internal links**

Import `withBasePath` in `SiteNav.astro`, `SiteFooter.astro`, `FishPreview.astro`, and `SpecimenField.astro`. Replace only internal root-relative `href` values:

```astro
href={withBasePath('/')}
href={withBasePath('/fish')}
href={withBasePath('/history')}
href={withBasePath('/history#sources')}
href={withBasePath('/history#accessibility')}
href={withBasePath(`/fish/${record.id}`)}
```

Leave external links and `#main-content` unchanged.

Add optional build base configuration:

```js
export default defineConfig({
  site: process.env.SITE_URL,
  base: process.env.BASE_PATH,
  output: 'static',
  // existing Vite configuration remains unchanged
});
```

- [ ] **Step 5: Verify GREEN**

Run: `npm run test:unit -- tests/unit/withBasePath.test.ts && npm run check`
Expected: all helper cases pass; Astro reports 0 errors, warnings, and hints.

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs src/lib/content/withBasePath.ts tests/unit/withBasePath.test.ts src/components/layout/SiteNav.astro src/components/layout/SiteFooter.astro src/components/home/FishPreview.astro src/components/fish/SpecimenField.astro
git commit -m "feat: support project Pages base path"
```

---

### Task 2: Fully clickable fish preview cards

**Files:**
- Modify: `tests/e2e/home.spec.ts`
- Modify: `src/components/home/FishPreview.astro`

**Interfaces:**
- Consumes: `withBasePath()` from Task 1
- Produces: one keyboard-accessible card link per homepage fish preview

- [ ] **Step 1: Write the failing browser test**

Append a focused test:

```ts
test('fish preview card opens its specimen record from the image', async ({ page }) => {
  await page.goto('/');
  const firstCard = page.locator('.fish-preview__record').first();
  await expect(firstCard.getByRole('link', { name: 'View Specimen 01 record' })).toBeVisible();
  await firstCard.getByRole('img').click();
  await expect(page).toHaveURL(/\/fish\/specimen-01$/);
});
```

- [ ] **Step 2: Run the browser test and verify RED**

Run: `npm run test:e2e -- tests/e2e/home.spec.ts`
Expected: FAIL because the card has no link and clicking its image does not navigate.

- [ ] **Step 3: Wrap each card’s content in one link**

Inside each article, add a block-level link around the figure and details:

```astro
<a
  class="fish-preview__link"
  href={withBasePath(`/fish/${record.id}`)}
  aria-label={`View ${record.data.label} record`}
>
  <!-- existing figure and details -->
  <span class="fish-preview__action" aria-hidden="true">View record ↗</span>
</a>
```

Move card padding to `.fish-preview__link`, give the link `display: block`, `height: 100%`, inherited color, and no default text decoration. Add a visible `:focus-visible` outline and keep the action cue visually distinct. Do not add nested links or JavaScript click handlers.

- [ ] **Step 4: Verify GREEN**

Run: `npm run test:e2e -- tests/e2e/home.spec.ts tests/e2e/accessibility.spec.ts`
Expected: card navigation and existing accessibility checks pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/FishPreview.astro tests/e2e/home.spec.ts
git commit -m "fix: make fish preview cards clickable"
```

---

### Task 3: Official GitHub Pages deployment

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Create: `tests/unit/deployPagesWorkflow.test.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: `SITE_URL` and `BASE_PATH` from `actions/configure-pages` outputs
- Produces: a GitHub Pages deployment from `dist` after every successful push to `main`

- [ ] **Step 1: Write the failing workflow contract test**

```ts
import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const workflowPath = new URL('../../.github/workflows/deploy-pages.yml', import.meta.url);

describe('GitHub Pages workflow', () => {
  it('builds main and deploys dist with official Pages actions', async () => {
    const workflow = await readFile(workflowPath, 'utf8');
    expect(workflow).toContain('branches: [main]');
    expect(workflow).toContain('actions/configure-pages@v5');
    expect(workflow).toContain('actions/upload-pages-artifact@v3');
    expect(workflow).toContain('actions/deploy-pages@v4');
    expect(workflow).toContain('path: dist');
    expect(workflow).toContain('SITE_URL: ${{ steps.pages.outputs.origin }}');
    expect(workflow).toContain('BASE_PATH: ${{ steps.pages.outputs.base_path }}');
  });
});
```

- [ ] **Step 2: Run the contract test and verify RED**

Run: `npm run test:unit -- tests/unit/deployPagesWorkflow.test.ts`
Expected: FAIL with `ENOENT` because the workflow does not exist.

- [ ] **Step 3: Add the workflow**

Create `.github/workflows/deploy-pages.yml` with:

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run check
      - run: npm test
      - uses: actions/configure-pages@v5
        id: pages
        with:
          enablement: true
      - run: npm run build
        env:
          SITE_URL: ${{ steps.pages.outputs.origin }}
          BASE_PATH: ${{ steps.pages.outputs.base_path }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Document deployment behavior**

Update README to state that Pages source is **GitHub Actions**, pushes to `main` deploy automatically, generated output comes from `dist`, and the expected URL is `https://roybotbot.github.io/chapel-koi-site/`. Retain the existing Cloudflare instructions as an alternative.

- [ ] **Step 5: Verify the workflow contract and project build**

Run:

```bash
npm run test:unit -- tests/unit/deployPagesWorkflow.test.ts
SITE_URL=https://roybotbot.github.io BASE_PATH=/chapel-koi-site npm run build
rg 'href="/chapel-koi-site/(fish|history)' dist
rg 'https://roybotbot.github.io/chapel-koi-site/' dist/index.html
```

Expected: the workflow test passes; seven routes build; generated links use `/chapel-koi-site/`; the homepage canonical uses the public Pages URL.

- [ ] **Step 6: Run full verification**

Run: `npm run check && npm test && npm run build && git diff --check`
Expected: 0 Astro diagnostics, all unit/browser tests pass, seven routes build, and the diff is clean.

- [ ] **Step 7: Commit**

```bash
git add .github/workflows/deploy-pages.yml tests/unit/deployPagesWorkflow.test.ts README.md
git commit -m "ci: deploy site to GitHub Pages"
```

- [ ] **Step 8: Integrate and publish**

Merge the feature branch into `main` without staging the root checkout’s `.gitignore`, push `main`, inspect the GitHub Actions run, and verify `https://roybotbot.github.io/chapel-koi-site/` returns the deployed site with working fish links.

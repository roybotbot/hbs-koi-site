# Chapel Koi Pond Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved Chapel Koi Pond design as a static Astro 7.1 site with factual fish records, a Preline-style history timeline, and a progressive-enhancement WebGL wake.

**Architecture:** Astro renders all content and navigation as static HTML. Fish records come from a build-validated content collection, while focused Astro components own each visual section. The homepage pond progressively mounts a Three.js/WebGL2 simulation; every route remains complete and usable without client JavaScript.

**Tech Stack:** Astro 7.1.6, TypeScript, Tailwind CSS 4, Preline, Three.js, GLSL, GSAP, Vitest, Playwright, axe-core, Cloudflare Pages.

## Global Constraints

- Site title is `Chapel Koi Pond`.
- Site is independent and must not use Harvard seals, official HBS lockups, or crimson-led branding.
- Routes are `/`, `/fish`, `/fish/[id]`, and `/history`; there is no keeper route.
- Fish use neutral identifiers such as `Specimen 01`; do not use Aoi, Momo, Kumo, or Hikari.
- Unknown facts render as `Unknown` or `Unconfirmed`; never invent behavior, age, variety, biography, or names.
- Oleg Mashtaler's supplied engraving remains square and fills a 1:1 container edge-to-edge.
- Footer contains `A project by Roy Natian`, linking `Roy Natian` to `https://natian.io`.
- Footer contains `Not affiliated with or endorsed by Harvard University.`
- Preline timeline is static; do not install `@tailwindcss/forms` or load Preline JavaScript solely for the timeline.
- WebGL wake affects only the homepage pond image; text and navigation never distort.
- Reduced motion, unavailable WebGL2, low-power mode, and offscreen state use or pause on a static image.
- Temporary assets require source URL, license, creator when known, and replacement status.
- Standalone samples may use `file:///Users/roy/Projects/hbs-koi-site/...`; production Astro code must import assets.
- Use npm and commit after every task.

---

## File structure

```text
astro.config.mjs                    Astro static build and Tailwind Vite plugin
package.json                        Scripts and pinned direct dependencies
playwright.config.ts                Chromium end-to-end configuration
tsconfig.json                       Astro strict TypeScript configuration
public/_headers                     Cloudflare cache headers
src/content.config.ts               Fish content collection schema
src/content/fish/*.md               Four temporary specimen records
src/assets/chapel/*                 Licensed temporary chapel and pond images
src/assets/fish/*                   Licensed representative koi images
src/assets/people/oleg-engraved.png Supplied square engraving
src/components/layout/*             Navigation and footer
src/components/home/*               Hero, fish preview, and stewardship
src/components/fish/*               Collection item and record facts
src/components/history/Timeline.astro Static Preline-style timeline
src/components/pond/PondWake.astro  Canvas and static fallback markup
src/data/history.ts                 Sourced chronology
src/data/imageCredits.ts            Asset provenance
src/layouts/BaseLayout.astro        Shared document and page transitions
src/lib/content/displayValue.ts     Unknown-value formatter
src/lib/pond/body.ts                Inertial pointer body
src/lib/pond/support.ts             Progressive-enhancement decision
src/lib/pond/createPondWake.ts      Three.js renderer lifecycle
src/lib/pond/FluidSimulation.ts     WebGL render targets and passes
src/lib/pond/shaders/*.glsl         Advection, divergence, pressure, height, normals, composite
src/pages/index.astro               Homepage
src/pages/fish/index.astro          Full-screen fish collection
src/pages/fish/[id].astro           Static fish records
src/pages/history.astro             History page
src/styles/global.css               Material tokens and global rules
tests/e2e/*.spec.ts                 Route, accessibility, and fallback tests
tests/unit/*.test.ts                Content and pond-physics tests
```

---

### Task 1: Repository hygiene and Astro baseline

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/pages/index.astro`
- Create: `src/styles/global.css`
- Create: `public/_headers`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Modify: Git index/history before first public push

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `preview`, `check`, `test`, `test:unit`, `test:e2e`.
- Produces: Tailwind 4 available in every Astro component through `src/styles/global.css`.

- [ ] **Step 1: Remove private/transient files from the unpublished initial commit**

Create `.gitignore`:

```gitignore
node_modules/
dist/
.astro/
.superpowers/
.DS_Store
playwright-report/
test-results/
coverage/
```

Run:

```bash
git rm -r --cached .superpowers .DS_Store
git add .gitignore
git commit --amend --no-edit
```

Expected: `git ls-files` contains no `.superpowers`, `.DS_Store`, server token, PID, or companion log.

- [ ] **Step 2: Declare dependencies and scripts**

Create `package.json`:

```json
{
  "name": "chapel-koi-pond",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "npm run test:unit && npm run test:e2e",
    "test:unit": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "astro": "7.1.6",
    "gsap": "3.15.0",
    "preline": "4.2.0",
    "three": "0.185.1"
  },
  "devDependencies": {
    "@astrojs/check": "0.9.10",
    "@axe-core/playwright": "4.12.1",
    "@playwright/test": "1.62.1",
    "@tailwindcss/vite": "4.3.3",
    "@types/node": "26.1.2",
    "@types/three": "0.185.3",
    "tailwindcss": "4.3.3",
    "typescript": "6.0.3",
    "vitest": "4.1.10"
  }
}
```

Use these exact versions, verified against npm on 2026-08-01. Do not add `@tailwindcss/forms`, React, Vue, or a CMS.

Run: `npm install`

Expected: `package-lock.json` is created and `npm ls --depth=0` reports no invalid dependency.

Dependency rationale:

- `three`: manages WebGL render targets and shader passes; the standard DOM and Astro cannot provide GPU fluid simulation.
- `gsap`: implements the approved restrained page fade; do not use it elsewhere.
- `preline`: supplies the user-requested timeline structure and Tailwind variants; no interactive runtime is needed for the static timeline.
- `vitest`: tests TypeScript physics and formatting modules without a browser.
- `@playwright/test` and `@axe-core/playwright`: verify real navigation, reduced motion, responsive layout, and accessibility; Node's test runner cannot exercise browser APIs.

- [ ] **Step 3: Configure Astro and Tailwind**

Create `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "types": ["node", "vitest/globals"]
  }
}
```

Create `src/styles/global.css`:

```css
@import "tailwindcss";
@import "../../node_modules/preline/variants.css";
@source "../../node_modules/preline/dist/*.js";

:root {
  --concrete-900: #2c332f;
  --concrete-700: #59615c;
  --concrete-500: #858a86;
  --paper: #eeece5;
  --pond-900: #183026;
  --pond-700: #34483d;
  --fern: #657d6c;
  --koi: #bf5b35;
}

* { box-sizing: border-box; }
html { background: var(--concrete-900); color: var(--paper); }
body { margin: 0; min-width: 320px; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
a { color: inherit; }
:focus-visible { outline: 2px solid var(--paper); outline-offset: 4px; }
```

Do not import Preline JavaScript.

- [ ] **Step 4: Add baseline page and static headers**

Create `src/pages/index.astro`:

```astro
---
import '../styles/global.css';
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content="An independent record of the koi living within the Class of 1959 Chapel pond." />
    <title>Chapel Koi Pond</title>
  </head>
  <body>
    <main><h1>Chapel Koi Pond</h1></main>
  </body>
</html>
```

Create `public/_headers`:

```text
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

- [ ] **Step 5: Configure tests and verify baseline**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['tests/unit/**/*.test.ts'] } });
```

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  webServer: { command: 'npm run dev -- --host 127.0.0.1', url: 'http://127.0.0.1:4321', reuseExistingServer: !process.env.CI },
  use: { baseURL: 'http://127.0.0.1:4321', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

Run:

```bash
npx playwright install chromium
npm run check
npm run build
```

Expected: both commands exit 0 and `dist/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add .gitignore package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts playwright.config.ts public src
git commit -m "build: scaffold Astro site"
```

---

### Task 2: Content model and temporary assets

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/fish/specimen-01.md`
- Create: `src/content/fish/specimen-02.md`
- Create: `src/content/fish/specimen-03.md`
- Create: `src/content/fish/specimen-04.md`
- Create: `src/lib/content/displayValue.ts`
- Create: `tests/unit/displayValue.test.ts`
- Create: `src/data/imageCredits.ts`
- Create: `src/assets/chapel/chapel-light.jpg`
- Create: `src/assets/chapel/chapel-pond.jpg`
- Create: `src/assets/fish/specimen-01.jpg` through `specimen-04.jpg`
- Create: `src/assets/people/oleg-engraved.png`

**Interfaces:**
- Produces: content collection `fish` with `id`, `label`, `markings`, `variety`, `age`, `recordStatus`, `image`, `imageAlt`, `sourceUrl`, `license`, `replacementStatus`.
- Produces: `displayValue(value: string | number | null | undefined, fallback?: string): string`.
- Produces: `imageCredits` array used by the footer.

- [ ] **Step 1: Write the failing formatter test**

Create `tests/unit/displayValue.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { displayValue } from '../../src/lib/content/displayValue';

describe('displayValue', () => {
  it('preserves confirmed values', () => expect(displayValue('Kohaku')).toBe('Kohaku'));
  it('renders missing values as Unknown', () => expect(displayValue(null)).toBe('Unknown'));
  it('accepts an explicit fallback', () => expect(displayValue(undefined, 'Unconfirmed')).toBe('Unconfirmed'));
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm run test:unit -- displayValue`

Expected: FAIL because `src/lib/content/displayValue.ts` does not exist.

- [ ] **Step 3: Implement the formatter**

Create `src/lib/content/displayValue.ts`:

```ts
export function displayValue(
  value: string | number | null | undefined,
  fallback = 'Unknown',
): string {
  return value === null || value === undefined || value === '' ? fallback : String(value);
}
```

Run: `npm run test:unit -- displayValue`

Expected: 3 tests pass.

- [ ] **Step 4: Define the Astro collection schema**

Create `src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const fish = defineCollection({
  loader: glob({ base: './src/content/fish', pattern: '**/*.md' }),
  schema: ({ image }) => z.object({
    order: z.number().int().positive(),
    label: z.string(),
    markings: z.string(),
    variety: z.string().nullable(),
    age: z.string().nullable(),
    recordStatus: z.enum(['incomplete', 'verified']),
    image: image(),
    imageAlt: z.string(),
    sourceUrl: z.string().url(),
    license: z.string(),
    replacementStatus: z.enum(['temporary', 'final']),
  }),
});

export const collections = { fish };
```

- [ ] **Step 5: Add four explicit temporary records**

Use this complete shape for each file, changing `order`, `label`, `markings`, `image`, `imageAlt`, and source metadata to match the downloaded image:

```md
---
order: 1
label: Specimen 01
markings: Orange and white
variety: null
age: null
recordStatus: incomplete
image: ../../assets/fish/specimen-01.jpg
imageAlt: Representative orange-and-white koi viewed through dark pond water
sourceUrl: https://commons.wikimedia.org/wiki/File:2002-08_Koi_in_pond.jpg
license: CC BY 1.0
replacementStatus: temporary
---

This representative image is temporary and does not identify an individual fish in the chapel pond.
```

Use the following approved source pages for the other three records:

```text
https://commons.wikimedia.org/wiki/File:2_year_old_Aka_Muji.jpg
https://commons.wikimedia.org/wiki/File:2_year_old_Platina.jpg
https://commons.wikimedia.org/wiki/File:2_year_old_Yamabuki.jpg
```

Each record body must state that the representative image is temporary.

- [ ] **Step 6: Copy and download assets**

Copy the supplied portrait:

```bash
mkdir -p src/assets/{chapel,fish,people}
cp oleg-engraved.png src/assets/people/oleg-engraved.png
```

Download the approved Wikimedia files with `curl --fail --location --user-agent 'ChapelKoiPond/0.1'` into the exact paths above. Record the Commons description page, license, and creator in `src/data/imageCredits.ts`; do not treat upload URLs as credit URLs.

Create `src/data/imageCredits.ts` with:

```ts
export interface ImageCredit {
  asset: string;
  title: string;
  creator: string;
  sourceUrl: string;
  license: string;
  replacementStatus: 'temporary' | 'final';
}

export const imageCredits: ImageCredit[] = [
  {
    asset: 'chapel-light.jpg',
    title: '1959 chapel light',
    creator: 'Dsmack (attribution inferred from the Commons record)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:1959chapellight.jpg',
    license: 'CC BY-SA 3.0',
    replacementStatus: 'temporary',
  },
  {
    asset: 'chapel-pond.jpg',
    title: 'Class of 1959 Chapel koi pond',
    creator: 'Dsmack (attribution inferred from the Commons record)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:1959chapelgardenfromtop2.JPG',
    license: 'CC BY-SA 3.0',
    replacementStatus: 'temporary',
  },
  {
    asset: 'specimen-01.jpg',
    title: '2002-08 Koi in pond',
    creator: 'Magnus Manske',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2002-08_Koi_in_pond.jpg',
    license: 'CC BY 1.0',
    replacementStatus: 'temporary',
  },
  {
    asset: 'specimen-02.jpg',
    title: '2 year old Aka Muji',
    creator: 'Paulman',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2_year_old_Aka_Muji.jpg',
    license: 'CC BY-SA 3.0',
    replacementStatus: 'temporary',
  },
  {
    asset: 'specimen-03.jpg',
    title: '2 year old Platina',
    creator: 'Paulman',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2_year_old_Platina.jpg',
    license: 'CC BY-SA 3.0',
    replacementStatus: 'temporary',
  },
  {
    asset: 'specimen-04.jpg',
    title: '2 year old Yamabuki',
    creator: 'Paulman',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2_year_old_Yamabuki.jpg',
    license: 'CC BY-SA 3.0',
    replacementStatus: 'temporary',
  },
  {
    asset: 'oleg-engraved.png',
    title: 'Oleg Mashtaler engraving',
    creator: 'Supplied project asset',
    sourceUrl: 'supplied locally',
    license: 'Project asset',
    replacementStatus: 'final',
  },
];
```

- [ ] **Step 7: Validate content and commit**

Run:

```bash
npm run check
npm run build
npm run test:unit
```

Expected: schema validates, static build succeeds, and formatter tests pass.

Commit:

```bash
git add src/content.config.ts src/content src/lib/content src/data src/assets tests/unit/displayValue.test.ts
git commit -m "feat: add fish records and licensed assets"
```

---

### Task 3: Shared layout, navigation, and footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/layout/SiteNav.astro`
- Create: `src/components/layout/SiteFooter.astro`
- Modify: `src/styles/global.css`
- Modify: `src/pages/index.astro`
- Create: `tests/e2e/shell.spec.ts`

**Interfaces:**
- `BaseLayout.astro` accepts `title`, `description`, and optional `theme: 'dark' | 'paper'`.
- `SiteNav.astro` renders Home, Fish, and History links.
- `SiteFooter.astro` renders attribution, credits, unofficial notice, and Roy Natian link.

- [ ] **Step 1: Write failing shell tests**

Create `tests/e2e/shell.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('shared shell exposes approved navigation and credits', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Chapel Koi Pond' })).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Fish' })).toHaveAttribute('href', '/fish');
  await expect(page.getByRole('navigation').getByRole('link', { name: 'History' })).toHaveAttribute('href', '/history');
  await expect(page.getByText('Not affiliated with or endorsed by Harvard University.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Roy Natian' })).toHaveAttribute('href', 'https://natian.io');
});
```

Run: `npm run test:e2e -- shell.spec.ts`

Expected: FAIL because shared shell does not exist.

- [ ] **Step 2: Implement the layout and navigation**

`BaseLayout.astro` must:

- Import `src/styles/global.css`.
- Render skip link, `SiteNav`, `<main id="main-content">`, and `SiteFooter`.
- Set title to `${title} | Chapel Koi Pond` except on the homepage.
- Add description, canonical-ready metadata, and `data-theme` on `<body>`.

`SiteNav.astro` markup:

```astro
<header class="site-nav">
  <a class="site-title" href="/">Chapel Koi Pond</a>
  <span class="site-location">Allston · Massachusetts</span>
  <nav aria-label="Primary">
    <a href="/fish">Fish</a>
    <a href="/history">History</a>
  </nav>
</header>
```

- [ ] **Step 3: Implement footer copy exactly**

`SiteFooter.astro` must include:

```astro
<footer class="site-footer">
  <div>
    <strong>Chapel Koi Pond</strong>
    <p>Independent documentation project.</p>
    <p>Not affiliated with or endorsed by Harvard University.</p>
  </div>
  <div>
    <a href="/history#sources">Image credits</a>
    <p>A project by <a href="https://natian.io" rel="author">Roy Natian</a>.</p>
  </div>
</footer>
```

- [ ] **Step 4: Add material-system CSS**

Add named layers for `.site-nav`, `.site-footer`, `.eyebrow`, `.paper-surface`, `.pond-surface`, and responsive breakpoints at 850px and 600px. Use hard borders and no `border-radius`, pill styles, or component box shadows.

- [ ] **Step 5: Run tests and commit**

Run:

```bash
npm run check
npm run test:e2e -- shell.spec.ts
```

Expected: shell test passes at desktop width.

Commit:

```bash
git add src/layouts src/components/layout src/styles/global.css src/pages/index.astro tests/e2e/shell.spec.ts
git commit -m "feat: add shared site shell"
```

---

### Task 4: Homepage static composition and Oleg stewardship

**Files:**
- Create: `src/components/home/HomeHero.astro`
- Create: `src/components/home/FishPreview.astro`
- Create: `src/components/home/Stewardship.astro`
- Create: `src/components/pond/PondWake.astro`
- Modify: `src/pages/index.astro`
- Create: `tests/e2e/home.spec.ts`

**Interfaces:**
- `HomeHero.astro` owns heading, factual description, plaque, and `PondWake` slot.
- `FishPreview.astro` consumes sorted `CollectionEntry<'fish'>[]`.
- `Stewardship.astro` imports square Oleg asset and renders approved copy/link.
- `PondWake.astro` initially renders static fallback plus non-mounted canvas.

- [ ] **Step 1: Write failing homepage tests**

Create `tests/e2e/home.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('homepage presents factual collection and stewardship', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Class of 1959 Chapel')).toBeVisible();
  await expect(page.getByText('Built 1992')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Oleg Mashtaler' })).toBeVisible();
  await expect(page.getByText("He also cares for the chapel's 17 koi.")).toBeVisible();
  await expect(page.getByRole('link', { name: /Read Oleg's HBS profile/i })).toHaveAttribute('href', 'https://www.hbs.edu/news/stories/oleg-mashtaler');
  await expect(page.locator('[data-oleg-portrait]')).toHaveCSS('aspect-ratio', '1 / 1');
  await expect(page.getByText('Specimen 01')).toBeVisible();
});
```

- [ ] **Step 2: Verify test failure**

Run: `npm run test:e2e -- home.spec.ts`

Expected: FAIL because homepage sections are absent.

- [ ] **Step 3: Implement static hero and pond fallback**

`PondWake.astro` renders:

```astro
<div class="pond-wake" data-pond-wake>
  <Image class="pond-wake__fallback" src={pondImage} alt="" aria-hidden="true" />
  <canvas data-pond-canvas aria-hidden="true"></canvas>
</div>
```

The fallback remains visible unless a later script adds `data-enhanced="true"`.

Hero description is exactly:

`An independent record of the koi living within the Class of 1959 Chapel pond.`

- [ ] **Step 4: Implement fish preview and stewardship**

Sort records by `data.order`, show first four, and display only label, markings, and record status.

Use this exact stewardship copy:

```text
Oleg Mashtaler has worked with HBS Facilities since 2010. As a daytime operator, he maintains HVAC systems across campus and responds to equipment problems.

He also cares for the chapel's 17 koi. He helped improve the pond's filtration and water treatment, monitors pH, and feeds the fish, which swim over when he approaches.
```

Render `oleg-engraved.png` with Astro `<Image>` inside `[data-oleg-portrait]` using `aspect-ratio: 1 / 1`, `width: 100%`, `height: 100%`, and `object-fit: cover`.

- [ ] **Step 5: Run checks and commit**

Run:

```bash
npm run check
npm run test:e2e -- home.spec.ts shell.spec.ts
```

Expected: both tests pass.

Commit:

```bash
git add src/components/home src/components/pond src/pages/index.astro tests/e2e/home.spec.ts
git commit -m "feat: build immersive homepage"
```

---

### Task 5: Fish collection and record routes

**Files:**
- Create: `src/components/fish/SpecimenField.astro`
- Create: `src/components/fish/RecordFacts.astro`
- Create: `src/pages/fish/index.astro`
- Create: `src/pages/fish/[id].astro`
- Create: `tests/e2e/fish.spec.ts`

**Interfaces:**
- `SpecimenField.astro` consumes one `CollectionEntry<'fish'>` and current index/count.
- `RecordFacts.astro` consumes `variety`, `age`, and `markings` and calls `displayValue`.
- `[id].astro` uses `getStaticPaths()` to produce one static route per fish entry.

- [ ] **Step 1: Write failing route tests**

Create `tests/e2e/fish.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('collection shows one factual specimen field at a time', async ({ page }) => {
  await page.goto('/fish');
  await expect(page.getByRole('heading', { level: 1, name: 'Observed fish' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Specimen 01' })).toBeVisible();
  await expect(page.getByText('01 / 04')).toBeVisible();
  await expect(page.locator('[data-specimen-field]')).toHaveCount(4);
});

test('record keeps unknown facts explicit', async ({ page }) => {
  await page.goto('/fish/specimen-01');
  await expect(page.getByRole('heading', { level: 1, name: 'Specimen 01' })).toBeVisible();
  await expect(page.getByText('Unconfirmed')).toBeVisible();
  await expect(page.getByText('Unknown')).toBeVisible();
  await expect(page.getByText(/Behavior, location, and health information appear only/)).toBeVisible();
});
```

- [ ] **Step 2: Verify route tests fail**

Run: `npm run test:e2e -- fish.spec.ts`

Expected: FAIL with 404 responses.

- [ ] **Step 3: Build the collection page**

`src/pages/fish/index.astro` loads and sorts the collection:

```astro
---
import { getCollection } from 'astro:content';
const fish = (await getCollection('fish')).sort((a, b) => a.data.order - b.data.order);
---
```

Render normal document flow. Each `SpecimenField` uses `min-height: 100svh`; do not add scroll snapping or carousel controls.

- [ ] **Step 4: Build static record pages**

Use current Astro API:

```astro
---
import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const fish = await getCollection('fish');
  return fish.map((record) => ({ params: { id: record.id }, props: { record } }));
}

interface Props { record: CollectionEntry<'fish'>; }
const { record } = Astro.props;
---
```

Record section order: dark portrait, 5px koi-orange separator, warm-paper identification, facts, dark record policy. Do not add fictional timeline or related-fish cards.

- [ ] **Step 5: Run and commit**

Run:

```bash
npm run check
npm run build
npm run test:e2e -- fish.spec.ts
```

Expected: four `/fish/specimen-*` HTML pages are generated and tests pass.

Commit:

```bash
git add src/components/fish src/pages/fish tests/e2e/fish.spec.ts
git commit -m "feat: add fish collection and records"
```

---

### Task 6: Sourced Preline-style History timeline

**Files:**
- Create: `src/data/history.ts`
- Create: `src/components/history/Timeline.astro`
- Create: `src/pages/history.astro`
- Create: `tests/e2e/history.spec.ts`

**Interfaces:**
- Produces: `HistoryEvent` with `date`, `title`, `body`, `sourceLabel`, `sourceUrl`.
- `Timeline.astro` consumes `items: HistoryEvent[]` and renders a static vertical sequence.

- [ ] **Step 1: Write the failing History test**

Create `tests/e2e/history.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('history uses sourced vertical chronology', async ({ page }) => {
  await page.goto('/history');
  await expect(page.getByRole('heading', { level: 1, name: 'The pond in context' })).toBeVisible();
  for (const date of ['1959', '1992', '1997', '2011', 'Present']) {
    await expect(page.getByText(date, { exact: true })).toBeVisible();
  }
  await expect(page.locator('[data-timeline-item]')).toHaveCount(5);
  await expect(page.getByRole('link', { name: /HBS history/i })).toHaveAttribute('href', /hbs\.edu/);
  await expect(page.getByRole('link', { name: /Reference article/i })).toHaveAttribute('href', /wikipedia\.org/);
});
```

- [ ] **Step 2: Verify History test fails**

Run: `npm run test:e2e -- history.spec.ts`

Expected: FAIL with 404.

- [ ] **Step 3: Add exact sourced event data**

Create `src/data/history.ts` and export five records with the approved copy from the design spec. Each event must link to one of:

```text
https://www.hbs.edu/about/campus-and-culture/campus-built-on-philanthropy/class-of-1959-chapel
https://en.wikipedia.org/wiki/The_Class_of_1959_Chapel
https://www.hbs.edu/news/stories/oleg-mashtaler
```

- [ ] **Step 4: Implement static Preline structure**

Use the Preline base component relationship exactly: flex row, relative rail, connector pseudo-element, marker, growing content column.

```astro
{items.map((item) => (
  <article class="timeline-item flex gap-x-6" data-timeline-item>
    <div class="timeline-rail relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:border-s">
      <div class="timeline-marker-shell relative z-10 size-7 flex items-center justify-center">
        <span class="timeline-marker size-2 rotate-45" aria-hidden="true"></span>
      </div>
    </div>
    <div class="timeline-entry grow pb-14">
      <time>{item.date}</time>
      <h2>{item.title}</h2>
      <p>{item.body}</p>
      <a href={item.sourceUrl}>{item.sourceLabel}</a>
    </div>
  </article>
))}
```

No Preline JS, accordion, avatar, icon, rounded card, or hover-only behavior.

- [ ] **Step 5: Compose History page and commit**

Use actual pond image for hero, warm paper for timeline, and chapel-light image for one short setting section. Include the HBS and Wikipedia source links in a footer section with `id="sources"`.

Run:

```bash
npm run check
npm run test:e2e -- history.spec.ts
```

Expected: all five events and source links pass.

Commit:

```bash
git add src/data/history.ts src/components/history src/pages/history.astro tests/e2e/history.spec.ts
git commit -m "feat: add sourced history timeline"
```

---

### Task 7: Pond body physics and support policy

**Files:**
- Create: `src/lib/pond/body.ts`
- Create: `src/lib/pond/support.ts`
- Create: `tests/unit/body.test.ts`
- Create: `tests/unit/support.test.ts`

**Interfaces:**
- `createBodyState(position?: Vec2): BodyState`.
- `stepBody(state: BodyState, target: Vec2, deltaSeconds: number): BodyState`.
- `shouldEnablePondWake(capabilities: PondCapabilities): boolean`.

- [ ] **Step 1: Write failing body tests**

Create `tests/unit/body.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createBodyState, stepBody } from '../../src/lib/pond/body';

describe('stepBody', () => {
  it('moves toward target without teleporting', () => {
    const initial = createBodyState({ x: 0.5, y: 0.5 });
    const next = stepBody(initial, { x: 0.9, y: 0.5 }, 1 / 60);
    expect(next.position.x).toBeGreaterThan(0.5);
    expect(next.position.x).toBeLessThan(0.9);
    expect(next.velocity.x).toBeGreaterThan(0);
  });

  it('retains inertia after target stops', () => {
    let state = createBodyState({ x: 0.5, y: 0.5 });
    state = stepBody(state, { x: 0.9, y: 0.5 }, 1 / 60);
    const next = stepBody(state, state.position, 1 / 60);
    expect(next.velocity.x).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Verify body tests fail**

Run: `npm run test:unit -- body`

Expected: FAIL because module does not exist.

- [ ] **Step 3: Implement deterministic inertial body**

Create `src/lib/pond/body.ts`:

```ts
export interface Vec2 { x: number; y: number; }
export interface BodyState { position: Vec2; velocity: Vec2; acceleration: Vec2; }

export function createBodyState(position: Vec2 = { x: 0.5, y: 0.5 }): BodyState {
  return { position: { ...position }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 } };
}

export function stepBody(state: BodyState, target: Vec2, dt: number): BodyState {
  const spring = 16;
  const drag = Math.exp(-5 * dt);
  const acceleration = {
    x: (target.x - state.position.x) * spring,
    y: (target.y - state.position.y) * spring,
  };
  const velocity = {
    x: (state.velocity.x + acceleration.x * dt) * drag,
    y: (state.velocity.y + acceleration.y * dt) * drag,
  };
  return {
    acceleration,
    velocity,
    position: {
      x: Math.min(1, Math.max(0, state.position.x + velocity.x * dt)),
      y: Math.min(1, Math.max(0, state.position.y + velocity.y * dt)),
    },
  };
}
```

- [ ] **Step 4: Write and implement support-policy tests**

Create `tests/unit/support.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { shouldEnablePondWake } from '../../src/lib/pond/support';

const capable = { webgl2: true, reducedMotion: false, saveData: false, lowMemory: false };

describe('shouldEnablePondWake', () => {
  it('enables capable devices', () => expect(shouldEnablePondWake(capable)).toBe(true));
  it('disables reduced motion', () => expect(shouldEnablePondWake({ ...capable, reducedMotion: true })).toBe(false));
  it('disables data saver', () => expect(shouldEnablePondWake({ ...capable, saveData: true })).toBe(false));
  it('disables missing WebGL2', () => expect(shouldEnablePondWake({ ...capable, webgl2: false })).toBe(false));
});
```

Create `src/lib/pond/support.ts`:

```ts
export interface PondCapabilities {
  webgl2: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  lowMemory: boolean;
}

export function shouldEnablePondWake(value: PondCapabilities): boolean {
  return value.webgl2 && !value.reducedMotion && !value.saveData && !value.lowMemory;
}
```

- [ ] **Step 5: Run and commit**

Run: `npm run test:unit -- body support`

Expected: all pond unit tests pass.

Commit:

```bash
git add src/lib/pond tests/unit/body.test.ts tests/unit/support.test.ts
git commit -m "feat: add inertial pond body physics"
```

---

### Task 8: WebGL2 fluid wake and lifecycle

**Files:**
- Create: `src/lib/pond/FluidSimulation.ts`
- Create: `src/lib/pond/createPondWake.ts`
- Create: `src/lib/pond/shaders/fullscreen.vert.glsl`
- Create: `src/lib/pond/shaders/advection.frag.glsl`
- Create: `src/lib/pond/shaders/divergence.frag.glsl`
- Create: `src/lib/pond/shaders/jacobi.frag.glsl`
- Create: `src/lib/pond/shaders/gradientSubtract.frag.glsl`
- Create: `src/lib/pond/shaders/height.frag.glsl`
- Create: `src/lib/pond/shaders/normals.frag.glsl`
- Create: `src/lib/pond/shaders/composite.frag.glsl`
- Modify: `src/components/pond/PondWake.astro`
- Create: `tests/e2e/pond.spec.ts`

**Interfaces:**
- `FluidSimulation.step(input: SimulationInput): void`.
- `FluidSimulation.render(): void`.
- `FluidSimulation.resize(width: number, height: number): void`.
- `FluidSimulation.dispose(): void`.
- `createPondWake({ canvas, sourceImage }): () => void` returns cleanup.

- [ ] **Step 1: Write failing progressive-enhancement tests**

Create `tests/e2e/pond.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('keeps static pond when reduced motion is requested', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('[data-pond-wake]')).not.toHaveAttribute('data-enhanced', 'true');
  await expect(page.locator('.pond-wake__fallback')).toBeVisible();
});

test('canvas never intercepts page interaction', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-pond-canvas]')).toHaveCSS('pointer-events', 'none');
  await page.getByRole('link', { name: 'Fish' }).click();
  await expect(page).toHaveURL(/\/fish$/);
});
```

- [ ] **Step 2: Implement shader passes**

Each fragment shader must perform one named pass only:

- `advection`: semi-Lagrangian backtrace of velocity and height.
- `divergence`: divergence of advected velocity.
- `jacobi`: one pressure iteration; execute 12 iterations per frame.
- `gradientSubtract`: subtract pressure gradient from velocity.
- `height`: propagate damped shallow-water height and inject body force based on velocity and acceleration.
- `normals`: convert height neighbors to surface normal.
- `composite`: refract source texture, add restrained Fresnel/specular/caustic terms, and tint shallow water green.

Use floating-point ping-pong render targets at simulation resolution no larger than 512×512. Do not distort DOM text.

- [ ] **Step 3: Implement simulation lifecycle**

`FluidSimulation` owns renderer, scene, orthographic camera, full-screen quad, materials, and render targets. `dispose()` must dispose every geometry, material, texture, and target.

`createPondWake` must:

1. Detect WebGL2, reduced motion, `navigator.connection?.saveData`, and `navigator.deviceMemory <= 4`.
2. Return a no-op cleanup when `shouldEnablePondWake` is false.
3. Convert pointer position to pond-local UV target.
4. Advance `stepBody` with clamped delta time.
5. Use `IntersectionObserver` to pause while offscreen.
6. Use `ResizeObserver` to update renderer and simulation sizes.
7. Set `data-enhanced="true"` only after first successful render.
8. Restore fallback and dispose cleanly on error.

- [ ] **Step 4: Mount from PondWake.astro**

Use a small module script that imports `createPondWake`, waits for the source image to decode, mounts once, and cleans up on `astro:before-swap`. Canvas CSS:

```css
.pond-wake canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
}
.pond-wake[data-enhanced="true"] canvas { opacity: 1; }
.pond-wake[data-enhanced="true"] .pond-wake__fallback { visibility: hidden; }
```

- [ ] **Step 5: Verify behavior and commit**

Run:

```bash
npm run check
npm run test:unit
npm run test:e2e -- pond.spec.ts home.spec.ts
npm run build
```

Expected: reduced-motion fallback passes, navigation remains clickable, build succeeds, and no WebGL errors appear in browser console.

Commit:

```bash
git add src/lib/pond src/components/pond tests/e2e/pond.spec.ts
git commit -m "feat: add WebGL pond wake"
```

---

### Task 9: Page fades, accessibility, responsive polish, and public documentation

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`
- Modify: all route/component styles as required
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `README.md`
- Modify: `public/_headers`

**Interfaces:**
- GSAP transition module responds to Astro page lifecycle and honors reduced motion.
- README documents local setup, content replacement, credits, and deployment.

- [ ] **Step 1: Add failing accessibility tests**

Create `tests/e2e/accessibility.spec.ts`:

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of ['/', '/fish', '/fish/specimen-01', '/history']) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  });
}

test('mobile navigation and Oleg portrait preserve reading order', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Oleg Mashtaler' })).toBeVisible();
  await expect(page.locator('[data-oleg-portrait]')).toHaveCSS('aspect-ratio', '1 / 1');
});
```

- [ ] **Step 2: Add restrained GSAP fade**

In `BaseLayout.astro`, use Astro's client router lifecycle only if it is supported by Astro 7.1 documentation at implementation time. Animate page opacity from 0 to 1 and `y` from 6 to 0 over at most 0.35 seconds. Skip importing or invoking GSAP when `prefers-reduced-motion: reduce` matches.

No scale, slide, parallax, text splitting, or staggered component entrance.

- [ ] **Step 3: Fix responsive and focus behavior**

Validate 390px, 768px, 1280px, and 1600px widths. Ensure:

- Navigation remains readable without a menu dependency.
- Oleg title and portrait stack in source order on mobile.
- Fish fields use `100svh` but allow content overflow.
- Timeline connector aligns with every marker.
- External links have visible focus and a textual or accessible indication.
- Contrast is at least 4.5:1 for normal text.

- [ ] **Step 4: Write public README**

README sections:

```md
# Chapel Koi Pond

Independent documentation site for the koi living in the Class of 1959 Chapel pond.

## Local development
npm install
npm run dev

## Verification
npm run check
npm run test
npm run build

## Content and images
Fish facts remain unknown until verified. Temporary Wikimedia images retain source and license metadata and must be replaced before publication.

## Attribution
A project by [Roy Natian](https://natian.io). Not affiliated with or endorsed by Harvard University.
```

Also document Node version, Astro 7.1, and Cloudflare Pages build command `npm run build` with output directory `dist`.

- [ ] **Step 5: Run full verification**

Run:

```bash
npm run check
npm run test:unit
npm run test:e2e
npm run build
git diff --check
git status --short
```

Expected:

- Astro check exits 0.
- All Vitest and Playwright tests pass.
- Production build exits 0.
- `git diff --check` reports nothing.
- Only intended task files are modified.

Perform one manual Chromium review at 390×844 and 1440×900. Confirm no new console warnings and that wake pauses offscreen.

- [ ] **Step 6: Commit**

```bash
git add README.md src public tests/e2e/accessibility.spec.ts
git commit -m "feat: finish accessible responsive site"
```

---

## Completion gate

Before declaring the build complete:

1. Compare every route to `docs/superpowers/specs/2026-08-01-chapel-koi-pond-design.md`.
2. Confirm `.superpowers`, `.DS_Store`, tokens, PIDs, and local logs are absent from Git history.
3. Confirm GitHub repository visibility is `PUBLIC`.
4. Confirm `main` is pushed and the working tree is clean.
5. Report temporary-image licenses, anything not visually verified, and Cloudflare deployment status separately.

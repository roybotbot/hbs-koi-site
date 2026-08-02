# GitHub Pages and Clickable Fish Cards Design

## Goal

Make each homepage fish preview card open its specimen record, then deploy the static site to GitHub Pages automatically whenever `main` is pushed.

## Fish card behavior

Each `.fish-preview__record` remains an article but contains one block-level link wrapping the image, temporary-image notice, identity, metadata, and visible “View record” cue. The link has a concise accessible name and a card-level focus indicator. It introduces no nested interactive controls.

Clicking anywhere in the card, including its image, opens `/fish/[id]`. Keyboard users can tab to the card and activate it with standard link controls.

## Base-path support

The project Pages URL is `https://roybotbot.github.io/chapel-koi-site/`. Astro therefore builds with:

- `site`: `https://roybotbot.github.io`
- `base`: `/chapel-koi-site`

A small internal-path helper prefixes route links with Astro’s build-time base URL. It covers the site title, primary navigation, footer links, fish previews, and collection record links. External links and same-page fragment links remain unchanged. Local development keeps `/` as the base.

## Deployment

`.github/workflows/deploy-pages.yml` uses only GitHub’s official actions. It runs on pushes to `main` and manual dispatches.

The workflow:

1. Checks out `main`.
2. Installs Node.js 22 and dependencies with `npm ci`.
3. Installs Playwright Chromium and its runner dependencies.
4. Runs Astro checks, unit tests, and browser tests.
5. Reads the repository Pages origin and base path from `actions/configure-pages`.
6. Builds the static site with those values.
7. Uploads `dist` and deploys it through the `github-pages` environment.

GitHub Pages stores a deployment artifact rather than generated files on a `gh-pages` branch. `main` remains the default source branch.

## Failure behavior

A failed check, test, or build prevents deployment. GitHub retains the previous successful Pages deployment. The workflow uses deployment concurrency so a newer push supersedes an older in-progress deployment.

If GitHub Pages is not enabled yet, the configure step requests enablement for GitHub Actions publishing.

## Verification

Automated coverage will prove:

- Clicking a fish card image navigates to the corresponding specimen route.
- The base-path helper handles root, route, and fragment-bearing paths.
- Existing accessibility and route behavior remains green.
- A production build generated with the Pages origin/base contains `/chapel-koi-site/` links and no localhost canonical.
- The workflow file is syntactically valid and references official Pages actions.

After pushing, the GitHub Actions run and resulting Pages URL will be checked directly.

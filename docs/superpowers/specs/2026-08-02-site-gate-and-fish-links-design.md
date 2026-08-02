# Site Gate and Fish Links Design

## Goal

Add a deliberately cosmetic password-only gate and make each full specimen field on `/fish` open its detail record.

## Site gate

The gate is a static-site deterrent, not authentication. Direct assets and built source remain public.

When `SITE_GATE_PASSWORD` exists at build time, every page starts locked. An inline head script runs before the body renders and grants access when either:

- the current URL has a matching `pass` query parameter, or
- the current tab has a prior grant in `sessionStorage`.

After reading `pass`, the script removes it with `history.replaceState`. Access lasts only for the current browser tab. Without access, the page shows a full-screen panel with the site title and one password field; there is no username. Invalid values return to the same locked panel with a short error.

The inline script reruns after Astro client-router navigation so the tab grant survives page changes. Local development remains ungated when `SITE_GATE_PASSWORD` is absent.

The password is never committed. GitHub Actions reads `SITE_GATE_PASSWORD` from a repository secret, runs a dedicated gate test with it, and passes it to the static build. Production deployment fails before upload when the secret is missing.

## Fish collection links

Each `/fish` specimen section retains its semantic section, heading, metadata, image, and visible “Open specimen record” link. The link receives an absolute-positioned pseudo-element covering the full specimen field. Clicking the image or any empty part of the field opens that specimen’s record. A visible inset focus outline covers the field for keyboard users. No JavaScript click handler is used.

## Verification

- A focused browser test proves locked, invalid, valid-query, URL-cleanup, and tab-session behavior.
- A focused browser test clicks the first specimen image and reaches `/fish/specimen-01`.
- Existing accessibility tests remain clean.
- Astro check, unit tests, browser tests, and static build pass.

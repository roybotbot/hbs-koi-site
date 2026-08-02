# Chapel Koi Pond

Independent documentation site for the koi living in the Class of 1959 Chapel pond.

This is an unofficial project. It is not affiliated with or endorsed by Harvard University.

## Local development

Requires Node.js 22.12 or newer and npm 9.6.5 or newer. The site uses Astro 7.1.

```sh
npm install
npm run dev
```

## Verification

```sh
npm run check
npm test
npm run build
```

The static production output is written to `dist/`.

## Content and images

Fish facts remain `Unknown` or `Unconfirmed` until they are verified. Update records in `src/content/fish/`; the schema is defined in `src/content.config.ts`.

The current fish and chapel photographs are temporary Wikimedia Commons assets. Their source pages, creators, licenses, and replacement status are recorded in `src/data/imageCredits.ts` and displayed on the History page. They must be replaced with verified chapel photography before publication.

Temporary sources include:

- Chapel photographs by Dsmack — CC BY-SA 3.0
- “2002-08 Koi in pond” by Magnus Manske — CC BY 1.0
- Three representative koi photographs by Paulman — CC BY-SA 3.0

The Oleg Mashtaler engraving is a supplied project asset and is marked final.

## Deployment

Cloudflare Pages settings:

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 22.12 or newer
- Environment variable: `SITE_URL` set to the deployed HTTPS origin, enabling canonical URLs

No deployment is performed automatically by this repository.

## Attribution

A project by [Roy Natian](https://natian.io). Not affiliated with or endorsed by Harvard University.

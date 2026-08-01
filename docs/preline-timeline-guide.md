# Using Preline to build an elegant timeline in Astro

Preline is a Tailwind CSS component library with a dedicated timeline component and an Astro framework guide. The workflow is straightforward: install Preline, load its CSS and JavaScript once in your Astro app, then drop in the timeline markup you want to use. The timeline component is meant for chronological content such as history, milestones, event sequences, and activity logs. See the official docs for the framework setup and component reference: [Astro guide](https://www.preline.co/docs/frameworks-astro.html) and [Timeline component](https://preline.co/docs/components/timeline.html).

## What you need

- Astro
- Tailwind CSS
- Preline
- Optional: `@tailwindcss/forms` if you use Preline form patterns alongside the timeline

The Astro guide on Preline’s site says the integration was tested with Astro `6.0.2`, so it is safest to compare your project structure to their file paths and loader setup if you are on a different version.

## Install Preline

```bash
npm install preline
npm install -D @tailwindcss/forms
```

If you are not using forms, you can skip the second line. Preline’s Astro guide notes that some components rely on third-party libraries, but a basic timeline does not need extra plugins beyond the core package and its CSS/JS setup.

## Add Preline CSS

In `src/styles/global.css`:

```css
@import "tailwindcss";
@import "preline/variants.css";
@source "../../node_modules/preline/dist/*.js";

/* Optional theme layer */
@import "preline/css/themes/theme.css";

/* Optional forms plugin */
/* @plugin "@tailwindcss/forms"; */
```

This gives Astro access to Preline’s utility variants and allows Tailwind to see Preline’s JS-driven class names.

## Add the Preline JS loader

Create `src/scripts/preline.ts`:

```ts
import { HSStaticMethods } from "preline/preline";

const initPreline = () => {
  window.HSStaticMethods.autoInit();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPreline);
} else {
  initPreline();
}

document.addEventListener("astro:page-load", initPreline);
```

Then load it once in your shared layout, usually `src/layouts/Layout.astro`:

```astro
---
import "../styles/global.css";
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Site</title>
  </head>
  <body>
    <slot />
    <script>
      import "../scripts/preline.ts";
    </script>
  </body>
</html>
```

Preline’s docs use the same pattern: initialize once, then re-run on Astro page transitions with `astro:page-load`.

## Basic timeline markup

The official timeline component is built around a vertical stack of dated items. A simple version looks like this:

```astro
---
const items = [
  {
    date: "2020",
    title: "Project starts",
    body: "The first concept is shaped into a clear product direction.",
  },
  {
    date: "2022",
    title: "First release",
    body: "A usable timeline appears in production with better spacing and hierarchy.",
  },
  {
    date: "2026",
    title: "Refinement",
    body: "The layout gets cleaner, more compact, and easier to scan.",
  },
];
---

<section class="w-full max-w-2xl">
  {items.map((item) => (
    <div class="flex gap-x-3">
      <div class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:inset-s-3.5 after:border-s after:border-neutral-200">
        <div class="relative z-10 size-7 flex items-center justify-center">
          <div class="size-2 rounded-full bg-neutral-400"></div>
        </div>
      </div>

      <div class="grow pt-0.5 pb-8">
        <div class="text-xs font-medium uppercase tracking-wide text-neutral-500">
          {item.date}
        </div>
        <h3 class="mt-1 font-medium text-neutral-900">{item.title}</h3>
        <p class="mt-1 text-sm text-neutral-600">{item.body}</p>
      </div>
    </div>
  ))}
</section>
```

That is the core structure: a line, a dot, and a content block. Once that works, you can style it into something far more polished.

## Good timeline patterns to borrow from Preline

Preline’s timeline docs include these useful variations:

- default vertical timeline
- collapsible timeline
- hoverable rows
- side timestamps
- icons and avatars

Preline also has timeline blocks, which are more opinionated and easier to copy as a finished section if you want a stronger visual treatment.

## Make it look better

A timeline gets ugly fast when the spacing is too tight or the hierarchy is flat. The biggest wins are:

- keep dates small and muted
- make titles slightly heavier than body text
- use one strong accent color for dots or connectors
- leave room between entries
- use avatars or icons only when they add meaning
- avoid oversized cards unless the story needs images

For an editorial look, use restrained typography and a narrow text column. For a product changelog, make the date line tight and the content more compact.

## When to use the block version instead of the base component

Use the base component when:

- you want a lightweight timeline
- the content is mostly text
- you want full control over spacing and color

Use the blocks when:

- you want a ready-made section
- the timeline needs images, avatars, or richer layout treatment
- you are building a landing page or marketing page and want to move fast

## Common gotchas

### 1. The timeline renders but looks plain

That usually means the Preline CSS import or theme import is missing, or Tailwind is not seeing the Preline classes.

### 2. Interactive pieces do not work after navigation

Make sure the loader is initialized on `astro:page-load`, not just on first load.

### 3. Styles are fighting each other

Keep the timeline inside its own component and let Astro scope the styles where possible. If you use Tailwind utilities directly, stay consistent about where your component-level styling lives.

### 4. You copied a block that uses extra plugins

Some Preline blocks assume other packages or plugins are present. Check the block’s notes before pasting it straight into Astro.

## Recommended build path

1. Install Preline.
2. Add the CSS imports.
3. Add the Preline loader once in your layout.
4. Start with the base timeline component.
5. Style spacing, typography, and connector line.
6. Upgrade to a block only if you need a richer section.

## Links

- [Preline Astro guide](https://www.preline.co/docs/frameworks-astro.html)
- [Preline timeline component](https://preline.co/docs/components/timeline.html)
- [Preline JS guide](https://preline.co/docs/preline-javascript.html)
- [Preline blocks](https://www.preline.co/blocks/data-display/timelines/)

## Bottom line

For Astro, Preline is best when you want a polished Tailwind-first timeline without building every state and layout variant from scratch. Use the base timeline if you care about control. Use a block if you care about speed.

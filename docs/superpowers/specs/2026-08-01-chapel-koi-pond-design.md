# Chapel Koi Pond design

Date: 2026-08-01
Status: Approved

## Purpose

Chapel Koi Pond is an independent website documenting the koi living in the Class of 1959 Chapel pond at Harvard Business School. The fish are the subject. The chapel supplies setting, history, and visual material, but architecture does not lead the content hierarchy.

The site is not affiliated with or endorsed by Harvard University. It must not use the Harvard seal, official HBS wordmark, or a crimson-led brand system.

## Direction: Submerged Archive

The approved direction combines concrete and greenhouse atmosphere in equal measure without depicting a greenhouse as a visual theme. Greenhouse qualities are conveyed through diffuse daylight, humidity, reflections, and restrained green casts. Structural glazing, greenhouse illustrations, and overt botanical decoration are excluded.

The experience should feel quiet, physical, and lived-in. It should not look like a new luxury brand, a startup site, or a generic editorial template.

### Material language

- Gray concrete and charcoal provide the dominant surfaces.
- Deep pond green and black-green define water.
- Warm paper surfaces separate factual records from photography.
- Restrained fern green appears in rules, markers, and subtle tinting.
- Orange comes from koi photography and may be echoed by one thin accent rule.
- Surfaces have hard edges. There are no cards, pills, large soft shadows, glossy panels, or decorative gradients.

### Light and photography

Light is diffuse and overcast. Concrete remains gray, while koi provide the strongest warm color. Chapel and pond photographs may be cropped into abstract fields of concrete, shadow, water, and planting.

Temporary photography may come from Wikimedia Commons or other online sources during prototyping. Every temporary asset must store its source, license, and replacement status. All temporary images will be replaced with original photography before publication.

Standalone HTML samples must use complete local file URLs, for example:

`file:///Users/roy/Projects/hbs-koi-site/oleg-engraved.png`

The production Astro site must use imported project assets and Astro's image pipeline because local `file://` URLs cannot deploy.

### Typography

The typographic voice is quiet and literary rather than ultra-modern.

- Display: Baskerville, Iowan Old Style, or an equivalent restrained serif until a licensed final typeface is selected.
- Interface and metadata: neutral sans serif with small uppercase labels and moderate tracking.
- Headings may be expressive, but site copy remains factual.
- Body copy must avoid poetic slogans, invented behavior, sentimental language, and generic stillness metaphors.

## Identity and footer

Site title: **Chapel Koi Pond**

The location may appear as a plain text credit: “Harvard Business School · Class of 1959 Chapel.” This is not a Harvard brand lockup.

The footer includes:

- Independent project notice: “Not affiliated with or endorsed by Harvard University.”
- Image credits and accessibility links.
- “A project by [Roy Natian](https://natian.io).”

## Information architecture

The first release contains four routes:

- `/` — homepage
- `/fish` — fish collection
- `/fish/[id]` — individual fish record
- `/history` — pond and chapel history

There is no separate keeper page. Pond stewardship appears as a concise homepage section.

## Homepage

The homepage uses an immersive, full-screen material composition rather than a centered container of cards.

### Hero

The hero combines concrete photography, water, and sparse text. It contains:

- Chapel Koi Pond title
- A factual one-sentence description
- Simple Fish and History navigation
- A quiet inscription: “Class of 1959 Chapel · Built 1992”
- The interactive WebGL pond surface

### Fish preview

A short preview introduces the observed collection. It does not reproduce the full Fish page. Fish are identified by visible markings until names and care records are confirmed.

Example label: “Specimen 01 · Orange and white.”

### Stewardship

Oleg Mashtaler appears once on the homepage with the supplied square engraved portrait. The artwork remains 1:1 and fills a matching square container edge-to-edge. The layout must adapt to the artwork rather than adding white side gutters or changing its aspect ratio.

Approved blurb:

> Oleg Mashtaler has worked with HBS Facilities since 2010. As a daytime operator, he maintains HVAC systems across campus and responds to equipment problems.
>
> He also cares for the chapel's 17 koi. He helped improve the pond's filtration and water treatment, monitors pH, and feeds the fish, which swim over when he approaches.

The section links to [Oleg's HBS profile](https://www.hbs.edu/news/stories/oleg-mashtaler). The link is clearly external.

## Fish collection

The Fish page presents one specimen at a time in a full-screen photographic field.

- Normal vertical scrolling moves between specimens.
- Each specimen occupies approximately one viewport.
- Labels show observed markings and verified facts.
- A plain link opens the individual record.
- There is no carousel, forced scroll snapping, card grid, or decorative page animation.

Current names such as Aoi, Momo, Kumo, and Hikari are discarded because they are not verified. Until names or species are confirmed, records use neutral identifiers such as “Specimen 01.”

## Individual fish record

A fish record combines a dark water portrait with high-contrast factual surfaces.

- Dark green photographic header
- Thin koi-orange separator
- Warm paper identification section
- High-contrast fact row
- Dark green record-policy section

Unknown values remain visibly “Unknown” or “Unconfirmed.” The site must never invent age, species, favorite location, behavior, biography, or personality.

Behavior, location, health, and timeline information appear only after observation or confirmation by the caretaker.

## History page

The History page is brief and koi-centered. It explains the water garden and only enough chapel history to establish context.

The hero uses actual pond photography. The page then uses a vertical timeline based on Preline's base line-marker-content structure, restyled for the Submerged Archive system.

### Timeline treatment

- One continuous vertical connector
- Small diamond markers in restrained green
- Small, muted dates
- Serif event titles
- Narrow factual body copy
- Source label on each entry
- No cards, icons, avatars, accordions, or hover-dependent content

### Timeline content

- **1959:** The graduating class that later funded the chapel through its 25th- and 30th-reunion campaigns.
- **1992:** Moshe Safdie and Associates completed the chapel and enclosed water garden.
- **1997:** A chamber organ designed by Taylor & Boody Organbuilders was added.
- **2011:** The building achieved LEED Gold certification after work reducing energy and water use.
- **Present:** Oleg Mashtaler cares for the pond's 17 koi and monitors its treatment systems.

Sources:

- [HBS: MBA Class of 1959 Chapel](https://www.hbs.edu/about/campus-and-culture/campus-built-on-philanthropy/class-of-1959-chapel)
- [Wikipedia: The Class of 1959 Chapel](https://en.wikipedia.org/wiki/The_Class_of_1959_Chapel)
- [HBS News: Know Your HBS Staff: Oleg Mashtaler](https://www.hbs.edu/news/stories/oleg-mashtaler)

## Motion and interaction

The wake is the only signature interaction.

- It is confined to the homepage pond surface.
- Pointer movement controls an inertial submerged body rather than drawing at cursor position.
- The body produces displacement, refraction, a widening wake, and gradual dissipation.
- Underlying pond and concrete imagery may refract. Text and navigation never distort.
- There are no cursor trails, decorative particles, fake circular rings, or moving greenhouse structures.
- Page transitions use a short fade with a 4–6px vertical shift.
- Fish collection and record pages remain visually still.

When WebGL is unavailable, reduced motion is enabled, a low-power condition is detected, or the pond is offscreen, the site uses or pauses on a static pond image. The wake must never block navigation or scrolling.

## Technical architecture

### Stack

- Astro 7.1 with static output
- Tailwind CSS
- Preline base timeline structure
- Three.js and custom GLSL for the wake simulation
- GSAP only for restrained page fades
- Astro Image for production assets
- Cloudflare Pages deployment

Astro 7.1 APIs and Preline integration must be checked against current Context7 and official documentation before implementation. The saved Preline guide was tested with Astro 6.0.2, so its loader paths cannot be copied blindly.

The timeline itself is static. Do not add `@tailwindcss/forms`, third-party timeline plugins, or Preline interactive loaders unless another approved component requires them.

### Content flow

Fish records live in an Astro content collection. Each record stores:

- Stable identifier
- Confirmed name, if one becomes available
- Observed markings
- Confirmed variety and age, when known
- Record status
- Image and alt text
- Image source, license, and replacement status
- Verified observations

Build-time schema validation rejects malformed required fields. Optional facts render as “Unknown” rather than breaking the page.

### Components

- Shared layout and navigation
- Homepage hero and WebGL pond
- Fish collection specimen section
- Fish record facts and observation sections
- Oleg stewardship block
- Preline-styled history timeline
- Shared footer and source credits

## Accessibility and failure behavior

- Semantic landmarks and heading order
- Keyboard-accessible navigation and external links
- WCAG AA text contrast
- Useful alt text for documentary images
- Decorative textures hidden from assistive technology
- Reduced-motion and no-WebGL fallbacks
- No information conveyed only through color or animation
- Mobile layouts preserve reading order and use square treatment for Oleg's portrait

## Verification

Before completion:

- Run Astro type and content checks.
- Build the static production output.
- Test keyboard navigation and visible focus states.
- Test reduced-motion and WebGL fallback paths.
- Check desktop and mobile layouts visually.
- Audit WCAG AA contrast.
- Measure wake performance at representative desktop viewport sizes.
- Confirm every temporary image has a source, license, and replacement marker.
- Confirm the unofficial-project notice and Roy Natian credit appear in the footer.

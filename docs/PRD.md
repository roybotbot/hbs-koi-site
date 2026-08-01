# PRD: Harvard Business School Chapel Koi Pond

Version: 1.0

## vision

Build a museum-quality website documenting the koi fish in the Harvard Business School chapel pond.

The site should feel less like a university website and more like an architectural installation.

Imagine the intersection of:

* Tadao Ando
* Peter Zumthor
* Naoshima museums
* The Harvard campus
* A quiet greenhouse
* A Japanese courtyard

The website should communicate stillness.

Nothing should feel digital for the sake of being digital.

Movement should exist only because water, plants, and light move.

---

# design principles

## emotional goals

The visitor should feel:

* calm
* curious
* contemplative
* respectful

Not:

* excited
* entertained
* sold to

---

## visual language

Materials:

* worn concrete
* limestone
* paper
* glass
* oxidized bronze
* moss
* fern
* still water

No glossy UI.

No startup cards.

No giant shadows.

No neumorphism.

No bright gradients.

No rounded pill buttons.

---

## inspiration

Architecture:

* Tadao Ando
* SANAA
* Peter Zumthor
* Kengo Kuma (subtle influence only)

Editorial:

* Kinfolk
* Apartamento
* Monocle
* Aesop architecture

Museums:

* Louisiana Museum
* Dia Beacon
* Naoshima

---

# color palette

Base

warm limestone

aged concrete

paper

charcoal

Accent

fern green

moss green

pond green

oxidized bronze

Avoid saturated colors.

Orange should only come from the koi themselves.

---

# typography

Primary serif

Canela

or

Ivar

or

Freight Display

Secondary sans

Inter

IBM Plex Sans

Suisse

Body text should almost disappear.

Headings should feel literary rather than corporate.

---

# motion philosophy

The site should appear almost still.

A visitor should notice movement only after spending a few seconds looking.

Nothing should feel animated.

Everything should feel alive.

---

# pages

## home

Contains

Hero

About the koi

Who maintains them

Fish gallery

Navigation

History

---

Hero

Large architectural composition.

Very little text.

One sentence.

Large water surface.

Concrete surrounding it.

Fern edges.

Minimal navigation.

---

About

Two short paragraphs.

No more.

---

Maintenance

Profile of facilities staff.

Short.

Editorial style.

---

Fish gallery

Grid.

Each fish shown like a museum specimen.

Not social profile cards.

Each opens dedicated page.

---

## fish profile

Large portrait.

Biography.

Age.

Species.

Markings.

Behavior.

Favorite location.

Timeline.

Photo gallery.

Optional video.

Related fish.

---

## history

History of chapel.

History of pond.

Timeline.

Historic photographs.

Construction.

Renovations.

Who cares for pond.

Ecology.

Water filtration.

---

# navigation

Extremely simple.

Home

History

Fish

No dropdowns.

---

# animations

Animations must never exist for decoration.

Every animation should simulate something physical.

Examples

light

wind

water

glass

plants

---

# wake interaction

This is the signature interaction.

It must feel like moving an object through perfectly calm water.

Not:

cursor trail

particle effect

circle ripple

mouse follower

Instead:

a moving submerged glass object pushing water.

---

Desired effect

Mouse movement should create:

pressure

displacement

refraction

caustics

wake

surface tension

The effect should linger.

Not immediately disappear.

Wake should widen as it travels.

Energy should dissipate naturally.

---

Requirements

60 fps

GPU accelerated

No DOM animation

No CSS ripple hacks

No SVG ripple hacks

Entire effect lives inside WebGL.

---

Technology

Use WebGL2.

Recommended:

Three.js

or

PixiJS

or

Custom raw WebGL.

No Canvas2D implementation.

---

Rendering pipeline

Render order

Scene

↓

Offscreen framebuffer

↓

Height field simulation

↓

Velocity simulation

↓

Surface normals

↓

Refraction shader

↓

Final composite

---

Wake simulation

Maintain:

velocity field

height field

pressure field

Cursor does NOT create circles.

Cursor represents a moving rigid body.

Movement injects force into simulation.

Fluid solver propagates force.

Result becomes wake.

---

Simulation

Implement

semi-Lagrangian advection

Jacobi pressure solve

divergence pass

velocity pass

height propagation

normal generation

refraction

No fake rings.

---

Visual characteristics

Wake should produce

V-shaped wake

secondary ripples

cross waves

refraction

compression

stretching

light bending

caustics

surface reflections

tiny specular highlights

---

Body interaction

Mouse is not directly connected to wake.

Instead

mouse controls invisible body

body has

mass

velocity

drag

inertia

acceleration

friction

Wake depends on

speed

direction

acceleration

not cursor position.

---

Refraction

Underlying concrete texture should bend.

Fern reflections should bend.

Text should NOT distort.

Only pond layer.

---

Lighting

Implement

Fresnel

specular

normal mapping

fake subsurface scattering

soft caustics

reflection tint

---

Water characteristics

Water is

shallow

clean

still

slightly green

not ocean

not pool

not blue

---

Performance

Target

120fps

Minimum

60fps

Desktop first.

Graceful degradation.

Disable automatically on

low-end GPUs

battery saver

prefers-reduced-motion

---

Plant animation

Extremely subtle.

Only

ferns

small grasses

reflections

No floating leaves.

No particles.

---

Page transitions

Fade.

Tiny vertical shift.

No sliding.

No scaling.

No dramatic transitions.

---

# assets

Need

Professional photography

Concrete textures

Fern photography

Historic photographs

Koi portraits

Water sounds (optional)

Ambient recordings (optional)

---

# accessibility

WCAG AA

Keyboard navigation

Reduced motion support

High contrast support

Semantic HTML

Proper landmarks

---

# technology stack

Framework

Astro

Styling

Tailwind CSS

Animation

GSAP (page transitions only)

Rendering

Three.js

or PixiJS

Shaders

GLSL

Image optimization

Astro Image

Deployment

Cloudflare Pages

---

# stretch goals

Real-time reflections.

Seasonal themes.

Morning and evening lighting.

Weather-reactive ambience.

Gentle ambient audio.

Interactive pond map showing each koi's preferred location.

Daily "pond conditions" generated from weather.

---

# success criteria

The site should not immediately register as a website.

The first impression should be that the visitor is looking through a sheet of glass into a quiet architectural space.

The wake interaction should be memorable because it behaves like physics rather than interface animation. A visitor should feel like they disturbed calm water, not like they moved a cursor across a webpage.


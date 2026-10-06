# Riviera Custom Pools — Website Concept (2026)

A presentation-ready redesign concept for [Riviera Custom Pools](http://rivieracustompoolshouston.com), Houston — positioned for commercial (hotels, high-end hospitality, multifamily) and high-end residential clients.

**Live preview:** https://jrpena99.github.io/riviera-pools/

## Structure
- `docs/` — the static site (served by GitHub Pages)
- `build.mjs` — generates every page in `docs/` from shared layout + project data. Run `node build.mjs` after editing.
- `docs/assets/` — `site.css`, `site.js`

## Run locally
```
python -m http.server 4400 -d docs
```
Then open http://localhost:4400

## Content sources
- Company facts, services, 6-phase construction process, testimonials, service areas, address and phone come from Riviera's current website.
- Commercial focus (hotels, high-end hospitality, apartments) per the client.
- `docs/img/riviera/` — Riviera's own project photos (from the current site, 600px originals).
- `docs/img/*-m.jpg / *-l.jpg` — high-resolution **representative** photography (Unsplash), labelled on the site. Replace with Riviera commercial photography before launch.

## Before launch
- Replace representative imagery with Riviera project photography (especially commercial).
- Confirm project names, locations and features on each project page.
- Connect the contact form to a backend (currently confirms on screen only).

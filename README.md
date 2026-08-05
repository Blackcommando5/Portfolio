# Portfolio — Subashkrishnan K

Personal portfolio covering five disciplines: 3D modelling, web, mobile, Windows
desktop, and AR/VR. Built with Next.js 16 (App Router) and Tailwind v4.

Deployed on Vercel/Firebase Hosting. Set `NEXT_PUBLIC_SITE_URL` in the host's
environment so canonical and Open Graph URLs resolve correctly.

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind v4, CSS custom properties for theme tokens |
| Motion | Framer Motion, Lenis smooth scroll |
| 3D | React Three Fiber, drei, three.js |
| Icons | lucide-react |

## Structure

```
src/
  app/
    page.tsx              landing page — composes the section components
    projects/page.tsx     project index, grouped by discipline
    projects/[slug]/      long-form case studies (SSG)
    globals.css           theme tokens, glass utilities, keyframes
  components/
    sections/             one component per landing-page section
    case-study/           case-study layout, screen viewer, SVG diagrams
    ui/                   primitives — glass card, glow button, badge, toggle
    three/                React Three Fiber scenes
    layout/               navbar, footer
    providers/            smooth scroll
  hooks/
  lib/
    data.ts               all site content — profile, skills, projects, certs
    case-studies.ts       long-form project write-ups keyed by slug
    theme.ts              theme store, read from the <html> class
```

### Content lives in two files

`lib/data.ts` holds everything the landing page renders. `lib/case-studies.ts`
holds the long-form write-ups. A project in `data.ts` gets a case-study page by
setting its `slug` to match an entry in `case-studies.ts` — no route changes
needed.

### Theming

The `<html>` element carries the `light` class and is the single source of
truth. An inline script in the document head applies the stored preference
before first paint, so there is no flash of the wrong theme. React reads that
class through `useSyncExternalStore` rather than keeping its own copy, so the
two cannot drift apart.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
npx tsc --noEmit
```

## Assets

Renders and screenshots live in `public/`. Source renders come out of Blender at
print resolution, so they are downscaled and converted to WebP before being
committed — the 3D gallery is ~1.3 MB on disk rather than ~457 MB.

Rule of thumb when adding a render: longest edge 2400px, WebP quality ~82.

Case-study screenshots go in `public/projects/<slug>/<name>.webp`. A screen with
no file yet renders a labelled placeholder frame rather than a broken image, so a
case study is publishable before every capture exists.

## License

All rights reserved. Code and content © Subashkrishnan K.

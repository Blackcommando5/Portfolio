# Project thumbnails

Every project card can carry a thumbnail. Drop a file into
`public/projects/thumbs/` named by the slug below, then run:

```bash
npm run thumbs         # wires image fields into src/lib/data.ts
npm run thumbs:check   # report only, writes nothing
```

The script adds an `image` field for each thumbnail it finds and removes the
field again if a file is deleted, so a missing image falls back to the card's
placeholder frame instead of rendering broken. Safe to run repeatedly.

**Format:** WebP, 1600×900 (16:9), quality ~82. PNG and JPG also work.

---

## Shared style suffix

Append this to every prompt so the set reads as one system:

> Dark near-black background (#0A0A0F), cyan (#00F0FF) and violet (#8B5CF6)
> accent lighting, subtle grid overlay, volumetric glow, cinematic rim light,
> high detail, 16:9 composition, no text, no words, no letters, no logos, no
> watermark, centred subject with breathing room.

Add `--ar 16:9` on Midjourney. **Keep "no text"** — generated lettering always
looks wrong, and these sit directly under real titles.

---

## Featured

| File | Prompt subject |
|------|----------------|
| `wedfind-ai.webp` | Wireframe human faces floating in dark space, each connected by glowing cyan lines to a cluster of small photo frames; one face highlighted violet as its matching photos illuminate. Abstract facial-recognition mesh, privacy-respecting, no recognisable identity. |
| `teamshare.webp` | Several isolated computer terminals on a dark plane, linked by glowing cyan cables in a closed loop with no connection leaving the frame; a violet padlock glowing at the centre of the network. Air-gapped, self-contained. |
| `gmeeting.webp` | A cyan audio waveform crossing the frame, transforming mid-flight into flowing lines of abstract transcript text and then into a violet glowing summary card. Left-to-right pipeline, real-time. |
| `ae-prompt-bridge.webp` | A glowing cyan text cursor on the left emitting a beam that strikes a rotating 3D geometric composition on the right, mid-assembly with pieces flying into place. |
| `figma-to-after-effects.webp` | A flat vector shape on the left with visible Bézier handles and control points, morphing across the frame into a layered 3D composition on the right; glowing cyan path nodes tracing the curve. |
| `nur.webp` | A single potted plant lit dramatically in dark space, cyan scan lines sweeping across its leaves as a violet diagnostic overlay reads the foliage. |
| `whats-for-dinner.webp` | Fresh ingredients arranged on a dark surface, connected by glowing cyan lines to a floating violet recipe card. Overhead angle, appetising but moody. |
| `bakery-wholesaler.webp` | Sacks and containers of baking ingredients on industrial shelving in dark space, cyan data lines rising from them into a floating violet dashboard grid. |
| `math-game.webp` | A stylised low-poly fantasy game environment with a glowing cyan portal, floating geometric shapes, and a medieval market stall. Game world, VR, inviting. |
| `number-system-2.webp` | Floating translucent 3D number tokens sorted into glowing cyan and violet groups, with a portal arch behind them. |

## Secondary

| File | Prompt subject |
|------|----------------|
| `eventora.webp` | A glowing cyan event ticket floating in dark space with a QR pattern, breaking into multiple individual passes fanning outward, violet stage lights behind. |
| `furniture-retail.webp` | A minimal furniture vignette — sofa, side table, plant — lit warmly against a dark background with a subtle cyan grid floor. Showroom, calm, premium. |

## VR lessons

One template, swap the subject:

> Inside a dark futuristic VR classroom, a glowing cyan holographic **[SUBJECT]**
> floats at eye level, with faint violet grid floor and volumetric light.
> Immersive, spatial, educational.

| File | `[SUBJECT]` |
|------|-------------|
| `lines-and-angles.webp` | intersecting lines with highlighted angle pairs |
| `basic-geometry.webp` | triangle being constructed from three glowing sides |
| `circle-theorems.webp` | circle with inscribed angles and chords |
| `tangent-to-a-circle.webp` | circle with a tangent line touching at one point, right-angle marker |
| `angle-bisector.webp` | angle split by a glowing bisector ray |
| `perpendicular-bisector.webp` | line segment with a perpendicular bisector and equidistant points |
| `equilateral-triangle.webp` | perfectly equilateral triangle with equal-length markers |
| `triangle-congruence-theorems.webp` | two identical triangles overlapping to show congruence |
| `quadrilateral-explorer.webp` | morphing quadrilateral shifting between square, rhombus, parallelogram |
| `coordinate-geometry.webp` | 3D coordinate plane with plotted points and axes |
| `angles-of-elevation-and-depression.webp` | observer sight line rising to a distant tower, angle arc marked |
| `surface-area-volume-explorer.webp` | transparent cube and cylinder with unfolding surface nets |
| `number-systems.webp` | nested sets of floating numbers grouped by type |
| `statistics-data-room.webp` | floating 3D bar chart and scatter plot in a data room |
| `mirror-reflection.webp` | laser beam striking a mirror, equal incident and reflected angles |
| `projectile-motion.webp` | cannon firing along a glowing parabolic arc trajectory |
| `experiment.webp` | abstract floating interactive objects with glowing grab handles |

---

## A note on the VR lessons

Those seventeen are Sashainfinity's work. Generated illustrations are not
screenshots of their product, so they carry less risk than real captures — but
they still visually represent client work. Worth mentioning when asking about
screenshot permission.

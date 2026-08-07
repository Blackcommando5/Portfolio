/**
 * Normalise dropped-in thumbnails.
 *
 * Generated images arrive as multi-megabyte PNGs at whatever size the tool
 * produced. This converts every PNG or JPG in public/projects/thumbs/ to a
 * 1600x900 WebP, then deletes the original so only one file per slug remains —
 * the wiring script prefers .webp, so leaving both would silently keep serving
 * the old cover.
 *
 *     npm run thumbs:opt      # convert, then wire
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const THUMBS = path.join(process.cwd(), "public/projects/thumbs");
const W = 1600;
const H = 900;
const TARGET = W / H;
/* Anything within this of 16:9 is treated as 16:9 and simply resized. */
const TOLERANCE = 0.02;

if (!fs.existsSync(THUMBS)) {
  console.log("no thumbs directory");
  process.exit(0);
}

const sources = fs
  .readdirSync(THUMBS)
  .filter((f) => /\.(png|jpe?g)$/i.test(f))
  .sort();

if (sources.length === 0) {
  console.log("nothing to convert — every thumbnail is already WebP");
  process.exit(0);
}

let before = 0;
let after = 0;

for (const file of sources) {
  const src = path.join(THUMBS, file);
  const slug = file.replace(/\.(png|jpe?g)$/i, "");
  const dest = path.join(THUMBS, `${slug}.webp`);

  const meta = await sharp(src).metadata();
  const ratio = meta.width / meta.height;
  const portrait = meta.height > meta.width;

  /* Near-16:9 resizes cleanly. Portrait sources get letterboxed on the site's
     own background rather than cropped to an arbitrary slice. Anything else
     is cover-cropped from the top, where the meaningful UI usually sits. */
  const fit =
    Math.abs(ratio - TARGET) <= TOLERANCE ? "fill" : portrait ? "contain" : "cover";

  const info = await sharp(src)
    .resize(W, H, { fit, position: "top", background: { r: 10, g: 10, b: 15 } })
    .webp({ quality: 82 })
    .toFile(dest);

  const inKb = fs.statSync(src).size / 1024;
  const outKb = fs.statSync(dest).size / 1024;
  before += inKb;
  after += outKb;

  fs.unlinkSync(src);

  console.log(
    `${slug.padEnd(30)} ${meta.width}x${meta.height} -> ${info.width}x${info.height}  ` +
      `${Math.round(inKb)}KB -> ${Math.round(outKb)}KB  (${fit})`
  );
}

console.log(
  `\n${sources.length} converted · ${(before / 1024).toFixed(1)} MB -> ${(after / 1024).toFixed(1)} MB`
);
console.log("originals removed so only the WebP remains per slug");

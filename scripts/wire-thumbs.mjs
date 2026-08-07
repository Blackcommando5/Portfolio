/**
 * Wire project thumbnails into src/lib/data.ts.
 *
 * Drop images into public/projects/thumbs/ named by the slug this script
 * derives from each project title, then run:
 *
 *     npm run thumbs
 *
 * It adds an `image` field for every thumbnail that exists and removes the
 * field again if a file is deleted, so the card falls back to its placeholder
 * frame rather than rendering a broken image. Safe to run repeatedly.
 *
 * Pass --check to report status without writing anything.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const DATA = path.join(ROOT, "src/lib/data.ts");
const THUMBS = path.join(ROOT, "public/projects/thumbs");
const WEB_DIR = "/projects/thumbs";
const CHECK_ONLY = process.argv.includes("--check");

/** Titles whose derived slug is awkward. */
const OVERRIDES = {
  "What's For Dinner — AI Meal Planner": "whats-for-dinner",
  "Bakery Ingredients Wholesaler — Storefront & Admin": "bakery-wholesaler",
};

/** Everything before the em dash, lowercased and hyphenated. */
function slugFor(title) {
  if (OVERRIDES[title]) return OVERRIDES[title];
  return title
    .split(/[—–]/)[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const source = fs.readFileSync(DATA, "utf8");
/* Preserve the file's existing line ending. Joining with "\n" unconditionally
   rewrites a CRLF file end to end — invisible in `git diff`, which normalises,
   but a whole-file change on disk. */
const EOL = source.includes("\r\n") ? "\r\n" : "\n";
const lines = source.split(/\r?\n/);

const available = fs.existsSync(THUMBS)
  ? new Set(
      fs
        .readdirSync(THUMBS)
        .filter((f) => /\.(webp|png|jpe?g)$/i.test(f))
        .map((f) => f)
    )
  : new Set();

/** Prefer webp, then png, then jpg, for a given slug. */
function fileFor(slug) {
  for (const ext of ["webp", "png", "jpg", "jpeg"]) {
    if (available.has(`${slug}.${ext}`)) return `${slug}.${ext}`;
  }
  return null;
}

const out = [];
const report = [];
let added = 0;
let removed = 0;
let unchanged = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = /^(\s*)title: "(.+)",$/.exec(line);

  /* Only project entries are indented four spaces inside the array. */
  if (!match || match[1].length !== 4) {
    out.push(line);
    continue;
  }

  const [, indent, title] = match;
  const slug = slugFor(title);
  const file = fileFor(slug);

  out.push(line);

  /* An existing image field sits directly below the title. */
  let next = i + 1;
  const following = [];
  while (next < lines.length && /^\s*(slug|alsoIn|image):/.test(lines[next])) {
    following.push(lines[next]);
    next++;
  }
  const existingIdx = following.findIndex((l) => /^\s*image:/.test(l));
  const hasImage = existingIdx !== -1;

  const kept = following.filter((l) => !/^\s*image:/.test(l));
  out.push(...kept);

  if (file) {
    out.push(`${indent}image: "${WEB_DIR}/${file}",`);
    if (hasImage) unchanged++;
    else added++;
    report.push({ title, slug, status: hasImage ? "ok" : "added", file });
  } else {
    if (hasImage) removed++;
    report.push({ title, slug, status: hasImage ? "removed" : "missing", file: `${slug}.webp` });
  }

  i = next - 1;
}

const result = out.join(EOL);

if (!CHECK_ONLY && result !== source) {
  fs.writeFileSync(DATA, result, "utf8");
}

/* ── Report ─────────────────────────────────────────────────────────────── */

const width = Math.max(...report.map((r) => r.slug.length));
for (const r of report) {
  const mark =
    r.status === "added" ? "+" : r.status === "ok" ? " " : r.status === "removed" ? "-" : "·";
  console.log(`${mark} ${r.slug.padEnd(width)}  ${r.status === "missing" ? "no file" : r.file}`);
}

/* "removed" means the file went away, so it is awaiting an image again. */
const absent = report.filter((r) => r.status === "missing" || r.status === "removed").length;
console.log(
  `\n${report.length} projects · ${report.length - absent} wired · ${absent} awaiting an image`
);
if (added || removed) console.log(`data.ts updated: +${added} -${removed}`);
if (CHECK_ONLY) console.log("(--check: nothing written)");

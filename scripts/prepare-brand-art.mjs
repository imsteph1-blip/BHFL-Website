/**
 * Turns Stephanie's pencil drawings into clean, transparent, recoloured PNGs.
 *
 * The originals are very pale pencil on white paper. Two problems with using
 * them as-is: the white paper shows as a box on cream or photo backgrounds,
 * and the lines are far too faint to read once the art is shrunk down small.
 *
 * This script fixes both. For each drawing it:
 *   1. works out how bright that sheet's blank paper is,
 *   2. turns "darker than the paper" into opacity, so the lines become solid
 *      and the paper disappears,
 *   3. wipes off any faint paper haze around the edges,
 *   4. fills the lines with a brand colour,
 *   5. crops the empty margin away so sizing in CSS is predictable.
 *
 * The original drawings are never modified. Re-run any time with:  npm run art
 */
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'fs';

const SRC = 'public/images/brand';
const OUT = 'public/images/brand/prepared';

// How wide a brightness range to spread from "just barely a line" to "solid
// line". Smaller = bolder, more contrasty art. This pencil is so light that
// we need a narrow range to make it read at small sizes.
const RAMP = 44;

// When deciding where to crop, only count a pixel as real drawing if it is at
// least this many brightness levels darker than the blank paper. Anything
// fainter is paper grain, and counting it would leave the empty margin on.
// Expressed in brightness rather than opacity so it holds if RAMP changes.
const CROP_MARGIN = 4;
const INKED = Math.round((CROP_MARGIN / RAMP) * 255);

const COLOURS = {
  olive: { r: 0x6e, g: 0x70, b: 0x52 }, // on cream and white backgrounds
  cream: { r: 0xf4, g: 0xef, b: 0xe3 }, // on khaki, bark and photo backgrounds
};

// How large each drawing needs to be. These are decorations shown at 60 to
// 200 pixels, so shipping them at full size would cost visitors a megabyte
// of download for nothing. Sized here at roughly twice their largest use,
// which keeps them sharp on high-resolution screens.
const MAX_SIZE = {
  'butterfly-lily-diagonal': 900, // shown tall beside the Our Story section
  'butterfly-lily-wide': 400,     // shown wide in the footer and closing panel
  default: 340,                   // small crests and corner sketches
};

mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => f.endsWith('.png'));
const written = [];

for (const file of files) {
  const base = file.replace(/\.png$/, '');

  // Read the drawing as plain brightness values, 0 (black) to 255 (white).
  const { data, info } = await sharp(`${SRC}/${file}`)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const W = info.width;
  const H = info.height;

  // Find this sheet's own paper brightness. Most of any sheet is blank, so the
  // most common bright value is the paper. Sitting a few points below it stops
  // fine paper grain turning into a visible haze.
  const hist = new Array(256).fill(0);
  for (const v of data) hist[v]++;
  let paperPeak = 0;
  for (let v = 200; v < 256; v++) if (hist[v] > hist[paperPeak]) paperPeak = v;
  const paper = paperPeak - 3;
  const span = RAMP;

  // Turn "darker than the paper" into opacity.
  const alpha = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    const v = Math.round(((paper - data[i]) / span) * 255);
    alpha[i] = v < 0 ? 0 : v > 255 ? 255 : v;
  }

  // Paper is never perfectly even. What survives as a whisper of opacity all
  // over the blank areas looks like a faint dirty film, and because it is
  // random it also makes the file much larger than the drawing warrants.
  // Anything this faint is paper, not pencil, so it is wiped to clear and the
  // rest is stretched back up to full strength.
  const FLOOR = 18;
  const lift = 255 / (255 - FLOOR);
  for (let i = 0; i < alpha.length; i++) {
    alpha[i] = alpha[i] <= FLOOR ? 0 : Math.min(255, Math.round((alpha[i] - FLOOR) * lift));
  }

  // Some sheets are also slightly darker towards the edges, which would leave
  // a faint rectangle of colour floating behind the drawing. Measure that haze
  // on the outer border and subtract it everywhere.
  const ring = [];
  for (let x = 0; x < W; x++) ring.push(alpha[x], alpha[(H - 1) * W + x]);
  for (let y = 0; y < H; y++) ring.push(alpha[y * W], alpha[y * W + W - 1]);
  ring.sort((a, b) => a - b);
  const haze = ring[Math.floor(ring.length * 0.98)];
  if (haze > 0) {
    const scale = 255 / (255 - haze);
    for (let i = 0; i < alpha.length; i++) {
      const v = Math.round((alpha[i] - haze) * scale);
      alpha[i] = v < 0 ? 0 : v > 255 ? 255 : v;
    }
  }

  // Find the drawing's true edges so the blank margin can be cropped off.
  let top = H;
  let bottom = -1;
  let left = W;
  let right = -1;
  for (let y = 0; y < H; y++) {
    const row = y * W;
    for (let x = 0; x < W; x++) {
      if (alpha[row + x] >= INKED) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }
  if (bottom < 0) {
    console.log(`  ${file.padEnd(30)} skipped, no drawing found`);
    continue;
  }
  const cw = right - left + 1;
  const ch = bottom - top + 1;

  for (const [name, rgb] of Object.entries(COLOURS)) {
    // Build the cropped, coloured, transparent image pixel by pixel. Doing the
    // crop here rather than asking sharp to do it keeps it predictable.
    const rgba = Buffer.allocUnsafe(cw * ch * 4);
    let p = 0;
    for (let y = top; y <= bottom; y++) {
      const row = y * W;
      for (let x = left; x <= right; x++) {
        rgba[p++] = rgb.r;
        rgba[p++] = rgb.g;
        rgba[p++] = rgb.b;
        rgba[p++] = alpha[row + x];
      }
    }

    const max = MAX_SIZE[base] ?? MAX_SIZE.default;

    const out = await sharp(rgba, { raw: { width: cw, height: ch, channels: 4 } })
      .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
      // These drawings are one flat colour at varying strengths, so a limited
      // palette stores them at a fraction of the size with no visible loss.
      .png({ compressionLevel: 9, palette: true, colours: 64 })
      .toFile(`${OUT}/${base}-${name}.png`);
    written.push(`${base}-${name}.png ${Math.round(out.size / 1024)}KB`);
  }

  console.log(
    `  ${file.padEnd(30)} paper ${paperPeak}  haze ${haze}  ${W}x${H} -> ${cw}x${ch}`
  );
}

console.log(`\n${written.join('\n')}`);
console.log(`\nDone. ${files.length * 2} files written to ${OUT}/`);

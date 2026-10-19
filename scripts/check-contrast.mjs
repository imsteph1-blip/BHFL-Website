/**
 * Checks that every text colour on the site is dark or light enough against
 * the colour behind it to be comfortably readable.
 *
 * The standard used is WCAG AA, which the brief asks for: ordinary text needs
 * a contrast ratio of at least 4.5, and large headings at least 3.
 *
 * Run any time with:  npm run contrast
 */

const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const channel = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const luminance = (rgb) => {
  const [r, g, b] = rgb.map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)];
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
};
/** Semi-transparent text really sits at a blend of itself and its background. */
const over = (hex, bgHex, alpha) => {
  const fg = parse(hex);
  const bg = parse(bgHex);
  return fg.map((v, i) => v * alpha + bg[i] * (1 - alpha));
};

const C = {
  warmWhite: '#FCFAF4',
  cream: '#F4EFE3',
  sand: '#E1DBC9',
  khakiBand: '#746C53',
  olive: '#6E7052',
  oliveInk: '#46422F',
  earthDeep: '#84674C',
  bark: '#454339',
  caption: '#66604D',
  charcoal: '#3A3A34',
};

// [description, text colour, background colour, "large" for headings]
const checks = [
  ['body text on the page', C.charcoal, C.warmWhite],
  ['body text on cream', C.charcoal, C.cream],
  ['headings on the page', C.oliveInk, C.warmWhite, 'large'],
  ['links', C.olive, C.warmWhite],
  ['captions on the page', C.caption, C.warmWhite],
  ['captions on cream', C.caption, C.cream],
  ['captions on sand', C.caption, C.sand],
  ['outlined button', C.olive, C.warmWhite],
  ['filled button', C.cream, C.earthDeep],
  ['body text on a khaki band', C.cream, C.khakiBand],
  ['heading on a khaki band', C.cream, C.khakiBand, 'large'],
  ['label on a khaki band', C.cream, C.khakiBand],
  ['footer wordmark', C.cream, C.bark, 'large'],
  ['footer links', over(C.cream, C.bark, 0.82), C.bark],
  ['footer tagline', over(C.cream, C.bark, 0.72), C.bark],
  ['footer service area', over(C.cream, C.bark, 0.68), C.bark],
  ['footer verse', over(C.cream, C.bark, 0.86), C.bark, 'large'],
  ['footer fine print', over(C.cream, C.bark, 0.68), C.bark],
];

let failures = 0;

for (const [label, fg, bg, size] of checks) {
  const needed = size === 'large' ? 3 : 4.5;
  const ratio = contrast(typeof fg === 'string' ? parse(fg) : fg, parse(bg));
  const ok = ratio >= needed;
  if (!ok) failures++;
  console.log(
    `${ok ? 'pass' : 'FAIL'}  ${ratio.toFixed(2).padStart(5)} / ${needed}  ${label}`
  );
}

console.log(
  failures === 0
    ? '\nAll good. Every colour pairing is comfortably readable.'
    : `\n${failures} pairing(s) are too faint to read comfortably.`
);

process.exit(failures === 0 ? 0 : 1);

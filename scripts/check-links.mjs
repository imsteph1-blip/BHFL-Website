/**
 * Checks that every link on the built site points at a page that exists.
 *
 * Run after a build with:  npm run links
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const DIST = 'dist';

function pages(dir = DIST, found = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) pages(full, found);
    else if (entry.endsWith('.html')) found.push(full);
  }
  return found;
}

const files = pages();
const broken = new Map();
const ok = new Set();

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const from = '/' + file.replace(/^dist\//, '').replace(/index\.html$/, '');

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    // Only internal page links. Skip anchors, phone, email and outside links.
    if (!href.startsWith('/') || href.startsWith('//')) continue;

    const path = href.split('#')[0].split('?')[0];
    if (path === '') continue;

    const candidates = [
      join(DIST, path),
      join(DIST, path, 'index.html'),
      join(DIST, path.replace(/\/$/, '') + '.html'),
    ];

    if (candidates.some((c) => existsSync(c))) {
      ok.add(path);
    } else {
      if (!broken.has(path)) broken.set(path, new Set());
      broken.get(path).add(from);
    }
  }
}

console.log(`Checked ${files.length} page(s).\n`);

if (broken.size === 0) {
  console.log('Every link points at a page that exists.');
} else {
  console.log(`${broken.size} link target(s) do not exist yet:\n`);
  for (const [path, sources] of [...broken].sort()) {
    console.log(`  ${path}`);
    console.log(`      linked from: ${[...sources].sort().join(', ')}`);
  }
}

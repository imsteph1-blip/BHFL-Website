/**
 * Runs the booking flow's pricing tests against the engine the site actually
 * serves, in public/js/.
 *
 * The test script and the engine are written in the older CommonJS style,
 * while this project is set up as ES modules for Astro. So this builds a small
 * throwaway corner that is set to the older style, lays the files out the way
 * the test expects to find them, and runs it there.
 *
 * Run with:  npm run test:pricing
 */
import { mkdirSync, rmSync, copyFileSync, writeFileSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';

const HARNESS = 'BHFL_Request_Care_Handoff/.testrun';
const ENGINE = 'public/js/bhfl-pricing-engine.js';
const TESTS = 'BHFL_Request_Care_Handoff/tests/test-cases.js';

for (const file of [ENGINE, TESTS]) {
  if (!existsSync(file)) {
    console.error(`Cannot find ${file}. Is the booking page installed?`);
    process.exit(1);
  }
}

rmSync(HARNESS, { recursive: true, force: true });
// The test looks two folders up for an installed "js" folder, so mirror that.
mkdirSync(`${HARNESS}/js`, { recursive: true });
mkdirSync(`${HARNESS}/site/tests`, { recursive: true });
writeFileSync(`${HARNESS}/package.json`, '{ "type": "commonjs" }\n');
copyFileSync(ENGINE, `${HARNESS}/js/bhfl-pricing-engine.js`);
copyFileSync(TESTS, `${HARNESS}/site/tests/test-cases.js`);

const output = execFileSync(process.execPath, ['test-cases.js'], {
  cwd: `${HARNESS}/site/tests`,
  encoding: 'utf8',
});
console.log(output.trim());

const failed = (output.match(/^FAIL/gm) || []).length;
const passed = (output.match(/^PASS/gm) || []).length;
console.log(`\n${passed} passed, ${failed} failed.`);
process.exit(failed === 0 ? 0 : 1);

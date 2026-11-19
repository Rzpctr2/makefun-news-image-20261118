// verify-v6.mjs — gates for news-image 18 Nov v6.
// Run: node verify-v6.mjs  (from the 18 Nov entry dir)
// Gates: determinism byte-identical 2x, <=1 MiB, 1024x1024,
// truncations 0, overlap 0, headline contrast >= 4.5:1.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import crypto from 'node:crypto';

const dir = new URL('.', import.meta.url).pathname;
const run = () => {
  // the generator prints its report JSON to stderr
  const res = spawnSync('node', ['generate-v6.mjs'], { cwd: dir, encoding: 'utf8' });
  if (res.status !== 0) throw new Error('generate-v6.mjs failed: ' + res.stderr.slice(0, 500));
  return JSON.parse(res.stderr);
};
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(dir + f)).digest('hex');

const r1 = run();
const sha1 = sha('entry-v6.png');
const r2 = run();
const sha2 = sha('entry-v6.png');

const buf = fs.readFileSync(dir + 'entry-v6.png');
const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);

const gates = [
  ['determinism (2x byte-identical)', sha1 === sha2, `${sha1.slice(0, 12)}…`],
  ['size <= 1 MiB', buf.length <= 1024 * 1024, `${buf.length} bytes`],
  ['dimensions 1024x1024', w === 1024 && h === 1024, `${w}x${h}`],
  ['truncations 0', r2.truncations.length === 0, JSON.stringify(r2.truncations)],
  ['overlap 0', r2.overlapCount === 0, String(r2.overlapCount)],
  ['headline contrast >= 4.5:1', r2.contrast.headlineInkOnPaper >= 4.5, r2.contrast.headlineInkOnPaper + ':1'],
  ['stories 31', r2.stories === 31, String(r2.stories)],
  ['illustrated 13', r2.illustrated === 13, String(r2.illustrated)],
  ['map pins 8', r2.pins === 8, String(r2.pins)],
];
let fail = 0;
for (const [name, ok, detail] of gates) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  (${detail})`);
  if (!ok) fail++;
}
console.log(fail === 0 ? 'ALL GATES PASS' : `${fail} GATE(S) FAILED`);
console.log('sha256:', sha2);
process.exit(fail === 0 ? 0 : 1);

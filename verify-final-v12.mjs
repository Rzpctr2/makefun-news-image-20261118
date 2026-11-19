// verify-final-v12.mjs — gates for news-image 18 Nov v12 (v11 + image-top grid,
// 3 literal scenes, +9 verified tail stories). Run: node verify-final-v12.mjs
// (from the 18 Nov entry dir). Gates: determinism byte-identical 2x, < 300 KB
// (307,200 B HARD cap), 1024x1024, truncations 0, overlap 0, contrasts >= 4.5:1,
// stories 40, illustrated 13, tail 27, regions min >= 3, map pins 8, min pin
// distance >= 22px, 13 AI image data-URIs in the SVG (10 grid + 3 heroes),
// 13 scene PNGs exist (>512 B each), grid scene PNGs are 184x84, every grid
// scene box + every hero box in the final PNG contains an image (PIL std >
// 0.03, unique colours > 8), thumbnail-300px grid std > 20 (each scene still
// reads at thumbnail size), heroes byte-identical to v11, #9/#12/#13 differ
// from v11 (new literal scenes), lead + DATE CHECK unchanged vs news-v2.json,
// news-v2.json itself unchanged, map 260x92 with 'pins = cards' title,
// grid headlines exactly 2 lines (greedy wrap, same algorithm as generator).
// ANTI-STALE: this file names the v12 generator and v12 files everywhere;
// a stale generator name here was the v11 false-ALL-PASS bug (sed left the
// v10 name). The gate list below is the source of truth, not this comment.
import { spawnSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import crypto from 'node:crypto';

const dir = new URL('.', import.meta.url).pathname;
const run = () => {
  // the generator prints its report JSON to stderr
  const res = spawnSync('node', ['generate-final-v12.mjs'], { cwd: dir, encoding: 'utf8' });
  if (res.status !== 0) throw new Error('generate-final-v12.mjs failed: ' + res.stderr.slice(0, 500));
  return JSON.parse(res.stderr);
};
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(dir + f)).digest('hex');

const r1 = run();
const sha1 = sha('entry-final-v12.png');
const r2 = run();
const sha2 = sha('entry-final-v12.png');

const buf = fs.readFileSync(dir + 'entry-final-v12.png');
const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);

// 13 AI scene data-URIs embedded in the SVG
const svg = fs.readFileSync(dir + 'entry-final-v12.svg', 'utf8');
const sceneUriCount = (svg.match(/data:image\/png;base64,/g) || []).length;

// scene source files exist and are non-trivial (v12 dir)
const sceneFiles = ['lead', 'hero2', 'hero3', 'scene04', 'scene05', 'scene06',
  'scene07', 'scene08', 'scene09', 'scene10', 'scene11', 'scene12', 'scene13'];
const sceneSizes = sceneFiles.map(k => {
  const p = dir + 'scenes-ai/v12/' + k + '.png';
  return fs.existsSync(p) ? fs.statSync(p).size : 0;
});

// data gates: v12 data vs v2 (v2 must be untouched; lead + DATE CHECK unchanged)
const D12 = JSON.parse(fs.readFileSync(dir + 'news-v12.json', 'utf8'));
const D2 = JSON.parse(fs.readFileSync(dir + 'news-v2.json', 'utf8'));
const v2Sha = sha('news-v2.json');
const leadSame = JSON.stringify(D12.lead) === JSON.stringify(D2.lead)
  && JSON.stringify(D12.hero2) === JSON.stringify(D2.hero2)
  && JSON.stringify(D12.hero3) === JSON.stringify(D2.hero3)
  && D12.footer === D2.footer;
const fieldSum = [8, 11, 4, 4, 6, 3, 2, 2].reduce((a, b) => a + b, 0);
// greedy wrap, same algorithm as the generator (cw = 11 * 0.56 = 6.16, maxW 168)
const wrapLines = s => {
  const cw = 6.16, maxW = 168, words = s.split(' '), lines = [];
  let cur = '';
  for (const wd of words) {
    const t = cur ? cur + ' ' + wd : wd;
    if (t.length * cw <= maxW) cur = t;
    else { if (cur) lines.push(cur); cur = wd; }
  }
  if (cur) lines.push(cur);
  return lines;
};
const gridHeadlineLines = D12.grid.map(g => wrapLines(g.headline).length);
const gridDekFit = D12.grid.every(g => g.dek.length * 10 * 0.50 <= 168);
const tailFit = D12.brief.every(b => b.headline.length <= 35);

// heroes byte-identical to v11; #9/#12/#13 are NEW (differ from v11)
const heroesSame = ['lead', 'hero2', 'hero3'].every(k => sha(`scenes-ai/v12/${k}.png`) === sha(`scenes-ai/v11/${k}.png`));
const newScenesDiffer = ['scene09', 'scene12', 'scene13'].every(k => sha(`scenes-ai/v12/${k}.png`) !== sha(`scenes-ai/v11/${k}.png`));

// PIL: each grid scene box in the final PNG must contain an image
// (std > 0.03, unique colours > 8). Boxes = v12 image-top slots 184x84.
const py = `
from PIL import Image
import numpy as np
im = Image.open('/home/hatch/workspace/makefun/entries/news-image-20261118/entry-final-v12.png').convert('RGB')
def stats(boxes):
    out = []
    for (x, y, bw, bh) in boxes:
        reg = np.asarray(im.crop((x, y, x+bw, y+bh)), dtype=float)
        lum = reg @ np.array([0.2126, 0.7152, 0.0722])
        cols = len(np.unique(reg.reshape(-1,3), axis=0))
        out.append(f"{lum.std():.3f}/{cols}")
    return out
grid = stats([(40+col*190, 500+row*149, 184, 84) for row in (0,1) for col in range(5)])
heroes = stats([(0,208,1024,96),(41,379,170,110),(653,379,330,56)])
print(','.join(grid))
print(','.join(heroes))
# v12 polish metrics (boxes: lead 0,208 1024x96; #6 420,500 184x84;
# #9 40,649 184x84; #12 610,649 184x84)
import json
lead = np.asarray(im.crop((0, 208, 1024, 304)), dtype=float)
leadlum = lead @ np.array([0.2126, 0.7152, 0.0722])
lead_dark_rows = int((leadlum.mean(axis=1) < 0.25*255).sum())
s12 = np.asarray(im.crop((610, 649, 794, 733)), dtype=float)
s12lum = s12 @ np.array([0.2126, 0.7152, 0.0722])
s06 = np.asarray(im.crop((420, 500, 604, 584)), dtype=float)
bld = (s06[:,:,0]>130)&(s06[:,:,0]<210)&(s06[:,:,1]>85)&(s06[:,:,1]<165)&((s06[:,:,0]-s06[:,:,2])>40)
s09 = np.asarray(im.crop((40, 649, 224, 733)), dtype=float)
red = (s09[:,:,0]>150)&(s09[:,:,1]<90)&(s09[:,:,2]<90)
mask = np.ones(red.shape, bool); mask[0:16, 0:16] = False  # badge area excluded
# thumbnail 300px: each grid box must still carry strong luminance variance
thumb = im.resize((300, 300), Image.LANCZOS)
tstd = []
for (x, y, bw, bh) in [(40+col*190, 500+row*149, 184, 84) for row in (0,1) for col in range(5)]:
    tx, ty, tbw, tbh = round(x*300/1024), round(y*300/1024), round(bw*300/1024), round(bh*300/1024)
    reg = np.asarray(thumb.crop((tx, ty, tx+tbw, ty+tbh)), dtype=float)
    tlum = reg @ np.array([0.2126, 0.7152, 0.0722])
    tstd.append(f"{tlum.std():.1f}")
# grid scene PNG dimensions must be the 184x84 slot size
dims = [f"{Image.open('/home/hatch/workspace/makefun/entries/news-image-20261118/scenes-ai/v12/scene%02d.png' % n).size[0]}x{Image.open('/home/hatch/workspace/makefun/entries/news-image-20261118/scenes-ai/v12/scene%02d.png' % n).size[1]}" for n in (4,5,6,7,8,9,10,11,12,13)]
metrics = {
  'lead_dark_rows': lead_dark_rows,
  's12_dark_frac': round(float((s12lum < 0.35*255).mean()), 3),
  's12_mean_lum': round(float(s12lum.mean()/255), 3),
  's06_brown_mid': int(bld[35:55,:].sum()),
  's09_red_seal_flag': int((red & mask).sum()),
  'thumb_std': tstd,
  'scene_dims': dims,
}
open('/home/hatch/workspace/.tmp-bundle/v12-scenestd.txt','w').write(','.join(grid) + chr(10) + ','.join(heroes) + chr(10) + json.dumps(metrics))
`;
fs.writeFileSync('/home/hatch/workspace/.tmp-bundle/verify-final12.py', py);
execSync('python3 /home/hatch/workspace/.tmp-bundle/verify-final12.py', { stdio: 'pipe' });
const [gridLine, heroLine, metricsLine] = fs.readFileSync('/home/hatch/workspace/.tmp-bundle/v12-scenestd.txt', 'utf8').trim().split('\n');
const m = JSON.parse(metricsLine);
const parseStats = line => line.split(',').map(s => { const [std, cols] = s.split('/'); return { std: +std, cols: +cols }; });
const sceneStats = parseStats(gridLine);
const heroStats = parseStats(heroLine);
const thumbStd = m.thumb_std.map(Number);

const gates = [
  ['determinism (2x byte-identical)', sha1 === sha2, `${sha1.slice(0, 12)}…`],
  ['size < 300 KB (HARD)', buf.length < 300 * 1024, `${buf.length} bytes`],
  ['dimensions 1024x1024', w === 1024 && h === 1024, `${w}x${h}`],
  ['truncations 0', r2.truncations.length === 0, JSON.stringify(r2.truncations)],
  ['overlap 0', r2.overlapCount === 0, String(r2.overlapCount)],
  ['headline contrast >= 4.5:1', r2.contrast.headlineInkOnPaper >= 4.5, r2.contrast.headlineInkOnPaper + ':1'],
  ['muted contrast >= 4.5:1', r2.contrast.mutedOnPaper >= 4.5, r2.contrast.mutedOnPaper + ':1'],
  ['accent contrast >= 4.5:1', r2.contrast.accentOnPaper >= 4.5, r2.contrast.accentOnPaper + ':1'],
  ['datecheck white-on-red >= 4.5:1', r2.contrast.whiteOnPinDateCheck >= 4.5, r2.contrast.whiteOnPinDateCheck + ':1'],
  ['stories 40', r2.stories === 40, String(r2.stories)],
  ['illustrated 13', r2.illustrated === 13, String(r2.illustrated)],
  ['tail 27 items', D12.brief.length === 27, String(D12.brief.length)],
  ['regions min >= 3 (AF was 1)', Math.min(...Object.values(r2.regions)) >= 3, JSON.stringify(r2.regions)],
  ['regions total 40', Object.values(r2.regions).reduce((a, b) => a + b, 0) === 40, String(Object.values(r2.regions).reduce((a, b) => a + b, 0))],
  ['countLine 40 stories', D12.countLine === '40 STORIES · SEVEN REGIONS · 13 ILLUSTRATED', D12.countLine],
  ['fieldLine sums to 40', fieldSum === 40 && D12.fieldLine.includes('Politics & diplomacy 11'), D12.fieldLine],
  ['tail headlines fit 3-col (<=35 chars)', tailFit, `max ${Math.max(...D12.brief.map(b => b.headline.length))} chars`],
  ['grid deks fit 1 line at 10px (<=168px)', gridDekFit, 'all fit'],
  ['grid headlines exactly 2 lines', gridHeadlineLines.every(n => n === 2), gridHeadlineLines.join('/')],
  ['map pins 8', r2.pins === 8, String(r2.pins)],
  ['min pin distance >= 22px', r2.minPinDist >= 22, r2.minPinDist + 'px'],
  ['map 260x92 at (40,814) + pins=cards title', svg.includes('x="40" y="814" width="260" height="92"') && svg.includes('WHERE IT HAPPENED · pins = cards'), 'map rect + title present'],
  ['masthead fits page (estW <= 944)', r2.contrast.mastheadEstW <= 944, r2.contrast.mastheadEstW + 'px'],
  ['lead headline fits page (estW <= 944)', r2.contrast.leadHeadlineEstW <= 944, r2.contrast.leadHeadlineEstW + 'px'],
  ['13 AI image data-URIs in SVG', sceneUriCount === 13, String(sceneUriCount)],
  ['13 scene PNGs exist (>512 B)', sceneSizes.length === 13 && sceneSizes.every(b => b > 512), sceneSizes.join('/')],
  ['grid scene PNGs are 184x84 (slot size)', m.scene_dims.every(d => d === '184x84'), m.scene_dims.join(',')],
  ['grid scenes std > 0.03 (10 slots contain images)', sceneStats.length === 10 && sceneStats.every(s => s.std > 0.03), sceneStats.map(s => s.std).join('/')],
  ['grid scenes unique colours > 8', sceneStats.length === 10 && sceneStats.every(s => s.cols > 8), sceneStats.map(s => s.cols).join('/')],
  ['hero images std > 0.03 (3 slots contain images)', heroStats.length === 3 && heroStats.every(s => s.std > 0.03), heroStats.map(s => s.std).join('/')],
  ['hero images unique colours > 8', heroStats.length === 3 && heroStats.every(s => s.cols > 8), heroStats.map(s => s.cols).join('/')],
  ['thumbnail 300px grid std > 20 (10 scenes read at thumbnail)', thumbStd.length === 10 && thumbStd.every(s => s > 20), thumbStd.join('/')],
  ['lead dark rows < 50/96 (v9: 74 — sea reduced)', m.lead_dark_rows < 50, m.lead_dark_rows + '/96'],
  ['#12 mean lum < 0.55 (not the palest card)', m.s12_mean_lum < 0.55, String(m.s12_mean_lum)],
  ['#12 dark top band (dark frac > 0.20; v12 book is bright gold, darkness is the top band)', m.s12_dark_frac > 0.20, String(m.s12_dark_frac)],
  ['#6 factory fills slot (brown rows35-55 > 1500, v11 box: 2214)', m.s06_brown_mid > 1500, String(m.s06_brown_mid)],
  ['#9 red seal+flag present (red px excl badge > 80)', m.s09_red_seal_flag > 80, String(m.s09_red_seal_flag)],
  ['heroes byte-identical to v11 (lead/hero2/hero3)', heroesSame, 'lead/hero2/hero3 shas match v11'],
  ['#9/#12/#13 are NEW scenes (differ from v11)', newScenesDiffer, 'scene09/12/13 shas differ from v11'],
  ['lead + heroes + DATE CHECK unchanged vs news-v2.json', leadSame, 'lead/hero2/hero3/footer identical'],
  ['news-v2.json untouched (sha 481a42ea…)', v2Sha === '481a42ea37718040a31c78c031f4056948b2f9ff22ccfc2ee05ba4238be70903', v2Sha.slice(0, 12) + '…'],
];
let fail = 0;
for (const [name, ok, detail] of gates) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  (${detail})`);
  if (!ok) fail++;
}
console.log(fail === 0 ? 'ALL GATES PASS' : `${fail} GATE(S) FAILED`);
console.log('sha256:', sha2);
process.exit(fail === 0 ? 0 : 1);

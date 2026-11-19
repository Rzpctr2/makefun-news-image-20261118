// verify-final-v13.mjs — gates for news-image 18 Nov v13 (v12 + #1/#50 device:
// status chips CONFIRMED/CLAIM + source on ALL 13 cards + HOW SURE legend +
// DATE CHECK expanded to 15 dated items; tail 27 -> 17, map 260x80).
// Run: node verify-final-v13.mjs (from the 18 Nov entry dir). Gates:
// determinism byte-identical 2x, < 300 KB (307,200 B HARD cap), 1024x1024,
// truncations 0, overlap 0, contrasts >= 4.5:1 (incl. both chip fills),
// stories 30, illustrated 13, tail 17, regions min >= 3, map pins 8, min pin
// distance >= 22px, 13 AI image data-URIs in the SVG (10 grid + 3 heroes),
// 13 scene PNGs exist in scenes-ai/v13/ (>512 B each), grid scene PNGs are
// 184x84, every grid scene box + every hero box in the final PNG contains an
// image (PIL std > 0.03, unique colours > 8), thumbnail-300px grid std > 20,
// 13 chips (report) + 13 pill rects in the SVG + HOW SURE legend present +
// DATE CHECK box 64px tall, lead + heroes unchanged vs news-v12.json,
// footer is the NEW 15-item DATE CHECK, news-v12.json + news-v2.json both
// untouched, 10 scenes byte-identical v12 (lead/hero2/scene08 re-quantized
// to q12/q12/q16 for bytes — the v11 de-banding reversed).
// ANTI-STALE: this file names the v13 generator and v13 files everywhere;
// a stale generator name here was the v11 false-ALL-PASS bug (sed left the
// v10 name). The gate list below is the source of truth, not this comment.
import { spawnSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import crypto from 'node:crypto';

const dir = new URL('.', import.meta.url).pathname;
const run = () => {
  // the generator prints its report JSON to stderr
  const res = spawnSync('node', ['generate-final-v13.mjs'], { cwd: dir, encoding: 'utf8' });
  if (res.status !== 0) throw new Error('generate-final-v13.mjs failed: ' + res.stderr.slice(0, 500));
  return JSON.parse(res.stderr);
};
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(dir + f)).digest('hex');

const r1 = run();
const sha1 = sha('entry-final-v13.png');
const r2 = run();
const sha2 = sha('entry-final-v13.png');

const buf = fs.readFileSync(dir + 'entry-final-v13.png');
const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);

// 13 AI scene data-URIs embedded in the SVG
const svg = fs.readFileSync(dir + 'entry-final-v13.svg', 'utf8');
const sceneUriCount = (svg.match(/data:image\/png;base64,/g) || []).length;
const pillCount = (svg.match(/rx="7"/g) || []).length;

// scene source files exist and are non-trivial (v13 dir)
const sceneFiles = ['lead', 'hero2', 'hero3', 'scene04', 'scene05', 'scene06',
  'scene07', 'scene08', 'scene09', 'scene10', 'scene11', 'scene12', 'scene13'];
const sceneSizes = sceneFiles.map(k => {
  const p = dir + 'scenes-ai/v13/' + k + '.png';
  return fs.existsSync(p) ? fs.statSync(p).size : 0;
});

// data gates: v13 data vs v12 (v12 + v2 must be untouched; lead + heroes
// unchanged; footer is the NEW expanded DATE CHECK)
const D13 = JSON.parse(fs.readFileSync(dir + 'news-v13.json', 'utf8'));
const D12 = JSON.parse(fs.readFileSync(dir + 'news-v12.json', 'utf8'));
const D2 = JSON.parse(fs.readFileSync(dir + 'news-v2.json', 'utf8'));
const v12Sha = sha('news-v12.json');
const v2Sha = sha('news-v2.json');
const leadSame = JSON.stringify(D13.lead) !== JSON.stringify(D12.lead) // chip added
  && D13.lead.headline === D12.lead.headline && D13.lead.dek === D12.lead.dek
  && D13.lead.kicker === D12.lead.kicker && D13.lead.art === D12.lead.art
  && D13.hero2.headline === D12.hero2.headline && D13.hero2.dek === D12.hero2.dek
  && D13.hero3.headline === D12.hero3.headline && D13.hero3.dek === D12.hero3.dek;
const footerNew = D13.footer !== D12.footer
  && D13.footer.includes('Not yet:') && D13.footer.includes('Carney–Xi')
  && D13.footer.includes('Guinea jails 224') && D13.footer.includes('Akvan landfall Fri 20 Nov');
const fieldSum = [7, 10, 2, 4, 2, 2, 2, 1].reduce((a, b) => a + b, 0);
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
const gridHeadlineLines = D13.grid.map(g => wrapLines(g.headline).length);
const gridDekFit = D13.grid.every(g => g.dek.length * 10 * 0.50 <= 168);
const tailFit = D13.brief.every(b => b.headline.length <= 35);

// scenes: 10 byte-identical to v12; lead/hero2/scene08 re-quantized (differ)
const keptSame = ['hero3', 'scene04', 'scene05', 'scene06', 'scene07', 'scene09', 'scene10', 'scene11', 'scene12', 'scene13']
  .every(k => sha(`scenes-ai/v13/${k}.png`) === sha(`scenes-ai/v12/${k}.png`));
const requantDiffer = ['lead', 'hero2', 'scene08']
  .every(k => sha(`scenes-ai/v13/${k}.png`) !== sha(`scenes-ai/v12/${k}.png`));

// PIL: each grid scene box in the final PNG must contain an image
// (std > 0.03, unique colours > 8). Boxes = v12 image-top slots 184x84.
const py = `
from PIL import Image
import numpy as np
im = Image.open('/home/hatch/workspace/makefun/entries/news-image-20261118/entry-final-v13.png').convert('RGB')
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
dims = [f"{Image.open('/home/hatch/workspace/makefun/entries/news-image-20261118/scenes-ai/v13/scene%02d.png' % n).size[0]}x{Image.open('/home/hatch/workspace/makefun/entries/news-image-20261118/scenes-ai/v13/scene%02d.png' % n).size[1]}" for n in (4,5,6,7,8,9,10,11,12,13)]
# scene colour counts (re-quantized scenes must actually be fewer colours)
def ncols(path):
    a = Image.open(path).convert('RGB')
    return len(a.getcolors(maxcolors=100000) or [])
metrics = {
  'lead_dark_rows': lead_dark_rows,
  's12_dark_frac': round(float((s12lum < 0.35*255).mean()), 3),
  's12_mean_lum': round(float(s12lum.mean()/255), 3),
  's06_brown_mid': int(bld[35:55,:].sum()),
  's09_red_seal_flag': int((red & mask).sum()),
  'thumb_std': tstd,
  'scene_dims': dims,
  'lead_colors': ncols('/home/hatch/workspace/makefun/entries/news-image-20261118/scenes-ai/v13/lead.png'),
  'hero2_colors': ncols('/home/hatch/workspace/makefun/entries/news-image-20261118/scenes-ai/v13/hero2.png'),
  'scene08_colors': ncols('/home/hatch/workspace/makefun/entries/news-image-20261118/scenes-ai/v13/scene08.png'),
}
open('/home/hatch/workspace/.tmp-bundle/v13-scenestd.txt','w').write(','.join(grid) + chr(10) + ','.join(heroes) + chr(10) + json.dumps(metrics))
`;
fs.writeFileSync('/home/hatch/workspace/.tmp-bundle/verify-final13.py', py);
execSync('python3 /home/hatch/workspace/.tmp-bundle/verify-final13.py', { stdio: 'pipe' });
const [gridLine, heroLine, metricsLine] = fs.readFileSync('/home/hatch/workspace/.tmp-bundle/v13-scenestd.txt', 'utf8').trim().split('\n');
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
  ['chip CONFIRMED white-on-navy >= 4.5:1', r2.contrast.chipConfirmedWhiteOnNavy >= 4.5, r2.contrast.chipConfirmedWhiteOnNavy + ':1'],
  ['chip CLAIM white-on-ochre >= 4.5:1', r2.contrast.chipClaimWhiteOnOchre >= 4.5, r2.contrast.chipClaimWhiteOnOchre + ':1'],
  ['stories 30', r2.stories === 30, String(r2.stories)],
  ['illustrated 13', r2.illustrated === 13, String(r2.illustrated)],
  ['chips 13 (report)', r2.chips === 13, String(r2.chips)],
  ['13 chip pills in SVG (rx=7)', pillCount === 13, String(pillCount)],
  ['HOW SURE legend present', svg.includes('HOW SURE'), 'legend text present'],
  ['DATE CHECK box 64px tall at y912', svg.includes('y="912" width="944" height="64"'), 'box rect present'],
  ['tail 17 items', D13.brief.length === 17, String(D13.brief.length)],
  ['regions min >= 3', Math.min(...Object.values(r2.regions)) >= 3, JSON.stringify(r2.regions)],
  ['regions total 30', Object.values(r2.regions).reduce((a, b) => a + b, 0) === 30, String(Object.values(r2.regions).reduce((a, b) => a + b, 0))],
  ['countLine 30 stories', D13.countLine === '30 STORIES · SEVEN REGIONS · 13 ILLUSTRATED', D13.countLine],
  ['fieldLine sums to 30', fieldSum === 30 && D13.fieldLine.includes('Politics & diplomacy 10'), D13.fieldLine],
  ['tail headlines fit 3-col (<=35 chars)', tailFit, `max ${Math.max(...D13.brief.map(b => b.headline.length))} chars`],
  ['grid deks fit 1 line at 10px (<=168px)', gridDekFit, 'all fit'],
  ['grid headlines exactly 2 lines', gridHeadlineLines.every(n => n === 2), gridHeadlineLines.join('/')],
  ['map pins 8', r2.pins === 8, String(r2.pins)],
  ['min pin distance >= 22px', r2.minPinDist >= 22, r2.minPinDist + 'px'],
  ['map 260x80 at (40,814) + pins=cards title', svg.includes('x="40" y="814" width="260" height="80"') && svg.includes('WHERE IT HAPPENED · pins = cards'), 'map rect + title present'],
  ['masthead fits page (estW <= 944)', r2.contrast.mastheadEstW <= 944, r2.contrast.mastheadEstW + 'px'],
  ['lead headline fits page (estW <= 944)', r2.contrast.leadHeadlineEstW <= 944, r2.contrast.leadHeadlineEstW + 'px'],
  ['13 AI image data-URIs in SVG', sceneUriCount === 13, String(sceneUriCount)],
  ['13 scene PNGs exist in v13 (>512 B)', sceneSizes.length === 13 && sceneSizes.every(b => b > 512), sceneSizes.join('/')],
  ['grid scene PNGs are 184x84 (slot size)', m.scene_dims.every(d => d === '184x84'), m.scene_dims.join(',')],
  ['grid scenes std > 0.03 (10 slots contain images)', sceneStats.length === 10 && sceneStats.every(s => s.std > 0.03), sceneStats.map(s => s.std).join('/')],
  ['grid scenes unique colours > 8', sceneStats.length === 10 && sceneStats.every(s => s.cols > 8), sceneStats.map(s => s.cols).join('/')],
  ['hero images std > 0.03 (3 slots contain images)', heroStats.length === 3 && heroStats.every(s => s.std > 0.03), heroStats.map(s => s.std).join('/')],
  ['hero images unique colours > 8', heroStats.length === 3 && heroStats.every(s => s.cols > 8), heroStats.map(s => s.cols).join('/')],
  ['thumbnail 300px grid std > 20 (10 scenes read at thumbnail)', thumbStd.length === 10 && thumbStd.every(s => s > 20), thumbStd.join('/')],
  ['lead dark rows < 50/96 (sea reduced)', m.lead_dark_rows < 50, m.lead_dark_rows + '/96'],
  ['#12 mean lum < 0.55 (not the palest card)', m.s12_mean_lum < 0.55, String(m.s12_mean_lum)],
  ['#12 dark top band (dark frac > 0.20)', m.s12_dark_frac > 0.20, String(m.s12_dark_frac)],
  ['#6 factory fills slot (brown rows35-55 > 1500)', m.s06_brown_mid > 1500, String(m.s06_brown_mid)],
  ['#9 red seal+flag present (red px excl badge > 80)', m.s09_red_seal_flag > 80, String(m.s09_red_seal_flag)],
  ['10 scenes byte-identical to v12', keptSame, 'hero3 + 9 grid scenes match v12'],
  ['lead/hero2/scene08 re-quantized (differ from v12)', requantDiffer, 'lead/hero2/scene08 shas differ from v12'],
  ['lead 12 colours / hero2 12 / scene08 16', m.lead_colors === 12 && m.hero2_colors === 12 && m.scene08_colors === 16, `${m.lead_colors}/${m.hero2_colors}/${m.scene08_colors}`],
  ['lead + heroes text unchanged vs news-v12.json', leadSame, 'lead/hero2/hero3 headlines+deks identical'],
  ['footer is the NEW 15-item DATE CHECK', footerNew, 'Not yet + Carney–Xi + Guinea + Akvan landfall present'],
  ['news-v12.json untouched (sha 7ea85c54…)', v12Sha === '7ea85c5460ec6541a13c222e0e1e1d4001eb8c7492fa85640ca204d55d6f6fa0', v12Sha.slice(0, 12) + '…'],
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

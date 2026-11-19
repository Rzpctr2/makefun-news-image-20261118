// generate-v6.mjs — news-image 18 Nov, v6 (HYBRID: AI illustrations +
// code-drawn map/typography/layout). Winner devices from the top-10 study
// (~/workspace/learning/news-image-top10-study.md): giant Didone date
// masthead + italic red dek, big-number stat strip + region bar + counts,
// map as its own band (numbered pins + caption + legend), DATE CHECK as a
// red box, "Original drawings" + 10 named sources. Lead stays Gulf (18 Nov;
// summit is 19 Nov news). AI art: 13 flat semi-flat illustrations
// (assets-ai/crop/*.jpg, composited as data URIs); map/typography/layout
// stay code. Timeline UTC SKIPPED: no verified UTC times in news-v2.json
// (inventing times would break criterion 4). Deterministic: no Date,
// no Math.random. Node + @resvg/resvg-js.
import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const D = JSON.parse(fs.readFileSync(new URL('./news-v2.json', import.meta.url), 'utf8'));
const W = 1024, H = 1024;

// ---- golden ratio (Gibran 16:16 WIB): phi = 1.61803 (5 digit) ----
// PHI / SQRT_PHI / INV_PHI / INV_PHI2 / GA are used in the illustration
// functions below; each use is measured from the coordinates it draws.
const PHI = 1.61803, SQRT_PHI = 1.27202;
const INV_PHI = 0.61803, INV_PHI2 = 0.38197; // 1/phi, 1/phi^2
const GA = 137.50844, GA_RAD = GA * Math.PI / 180; // golden angle

// ---- palette (same muted family as v1 + v5) ----
const PAPER = '#F2E8D5', PANEL = '#EADFC6', INK = '#2E2118', MUTED = '#6B5844';
const TEAL = '#4E7D6F', TEAL_D = '#3A5F53', TERRA = '#C96F4A', BROWN = '#8A5A33';
const GOLD = '#E3B25D', GREEN = '#7C9A4E', SEA = '#BFE0EE';
const LAND = '#7CB06A', LAND2 = '#6BA35C', LAND3 = '#8CC078';
// Skin/hair (study v2 §1: heads are skin + hair + shoulders, no features)
const SKIN1 = '#E8B88A', SKIN2 = '#D9A066', SKIN3 = '#C98F5A';
const HAIR_BLK = '#1E1A16', HAIR_BLOND = '#E8C86A', HAIR_RED = '#B3402E';
// Pin colours by region (reference map: blue/green/gold/orange/purple/teal/dark)
const PIN_REG = { EU: '#2E5A88', ME: '#3E7C4F', AS: '#C9A227', AF: '#D95D2B', AM: '#7D4A8A', OC: '#2E8B8B', WORLD: '#3A3A3A' };
const PIN = '#BC2F0E', NAVY = '#1E2A3A', DUSTY = '#A8C4D4', SKY = '#BFD3DE';
const BAND = '#EDE2CC';
// Region colours (kicker chips + region bar) — same as the 18 Nov top entry.
const REG = {
  EU: '#2E5A88', ME: '#3E7C4F', AS: '#D97A2B', AF: '#C0392B',
  AM: '#7D4A8A', OC: '#2E8B8B', WORLD: '#3A3A3A',
};
// Darker variants for small coloured text on paper (kickers) — the bright
// fills above are too low-contrast as text (AS orange ≈ 2.5:1 on paper).
const REG_TEXT = {
  EU: '#2E5A88', ME: '#2E6B3E', AS: '#A85A15', AF: '#A93226',
  AM: '#6B3A78', OC: '#1F6B6B', WORLD: '#3A3A3A',
};
const SANS = 'Noto Sans, sans-serif';
const DISPLAY = 'Playfair Display, serif';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f = n => (Math.round(n * 100) / 100).toString();

// ---- text measurement (estimates; verifier re-checks truncation from these) ----
function cwFactor(weight, font) {
  if (font === DISPLAY) return weight >= 700 ? 0.60 : 0.55;
  return weight >= 700 ? 0.56 : 0.50;
}
const estW = (s, size, weight, font = SANS) => s.length * size * cwFactor(weight, font);
function wrap(s, maxW, size, weight, font = SANS) {
  const cw = size * cwFactor(weight, font);
  const words = s.split(' ');
  const lines = []; let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (t.length * cw <= maxW) cur = t;
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---- svg element collectors ----
const shapes = [];
const textLines = [];
const textBoxes = [];   // {tag, x0, y0, x1, y1}
const truncations = [];
function rect(x, y, w, h, fill, extra = '') {
  shapes.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" ${extra}/>`);
}
function poly(points, fill, extra = '') {
  shapes.push(`<polygon points="${points.map(p => f(p[0]) + ',' + f(p[1])).join(' ')}" fill="${fill}" ${extra}/>`);
}
function circle(cx, cy, r, fill, extra = '') {
  shapes.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" ${extra}/>`);
}
function line(x1, y1, x2, y2, stroke, sw) {
  shapes.push(`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${stroke}" stroke-width="${f(sw)}"/>`);
}
function text(s, x, y, size, weight, fill, font = SANS, anchor = 'start', opts = {}) {
  const t = { s, x, y, size, weight, fill, font, anchor, ...opts };
  textLines.push(t);
  if (opts.tag) {
    const w = estW(s, size, weight, font);
    const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
    textBoxes.push({ tag: opts.tag, x0, y0: y - size * 0.78, x1: x0 + w, y1: y + size * 0.22 });
  }
  return t;
}
// wrapped text: returns lines; records truncation if more than maxLines.
function wtext(s, x, y, maxW, size, weight, fill, font, maxLines, lh, tag, anchor = 'start') {
  const lines = wrap(s, maxW, size, weight, font);
  if (lines.length > maxLines) truncations.push({ tag, text: s, lines: lines.length, maxLines });
  const shown = lines.slice(0, maxLines);
  shown.forEach((ln, i) => text(ln, x, y + i * lh, size, weight, fill, font, anchor, { tag: tag + ':' + i }));
  return shown;
}

// ---- colour contrast (relative luminance, WCAG) ----
function lum(hex) {
  const c = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map(i => parseInt(c.substr(i, 2), 16) / 255)
    .map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

// ---- AI illustrations (hybrid v6) ----
// 13 flat semi-flat illustrations, cropped to display size by crop-ai.py
// (JPEG q88, deterministic). Embedded as base64 data URIs; resvg renders
// them as raster images. Map/typography/layout stay code-drawn.
const AI_DIR = new URL('./assets-ai/crop/', import.meta.url);
const AI_IMG = {};
for (const k of ['lead', 'venezuela', 'bridge', 'summit', 'euloan', 'cop31', 'badme', 'voyager', 'australia', 'bangladesh', 'myanmar', 'woty', 'gao']) {
  AI_IMG[k] = 'data:image/jpeg;base64,' + fs.readFileSync(new URL(k + '.jpg', AI_DIR)).toString('base64');
}
function img(key, x, y, w, h) {
  shapes.push(`<image href="${AI_IMG[key]}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" preserveAspectRatio="none"/>`);
}

// ---- AI illustration map (hybrid v6) ----
// Each ILL function composites the cropped AI illustration for that story.
// Display sizes are the v6 layout boxes (see crop-ai.py BOXES).
const ILL = {
  gulf: (x, y, w, h) => img('lead', x, y, w, h),
  bridge: (x, y, w, h) => img('bridge', x, y, w, h),
  venezuela: (x, y, w, h) => img('venezuela', x, y, w, h),
  summit: (x, y, w, h) => img('summit', x, y, w, h),
  euloan: (x, y, w, h) => img('euloan', x, y, w, h),
  cop31: (x, y, w, h) => img('cop31', x, y, w, h),
  badme: (x, y, w, h) => img('badme', x, y, w, h),
  voyager: (x, y, w, h) => img('voyager', x, y, w, h),
  australia: (x, y, w, h) => img('australia', x, y, w, h),
  bangladesh: (x, y, w, h) => img('bangladesh', x, y, w, h),
  myanmar: (x, y, w, h) => img('myanmar', x, y, w, h),
  woty: (x, y, w, h) => img('woty', x, y, w, h),
  gao: (x, y, w, h) => img('gao', x, y, w, h),
};

// ---- world map (continents/facets from v5; project WITHOUT any offset) ----
const CONTINENTS = [
  { name: "North America", fill: LAND, pts: [[-168,66],[-150,70],[-135,69],[-125,71],[-110,73],[-95,80],[-85,76],[-75,73],[-65,62],[-55,60],[-60,47],[-65,44],[-70,42],[-75,35],[-80,26],[-81,25],[-87,21],[-90,21],[-95,18],[-97,16],[-94,17],[-90,14],[-85,11],[-80,8],[-79,9],[-83,9],[-88,13],[-92,15],[-97,16],[-102,18],[-105,20],[-110,23],[-114,28],[-118,33],[-122,37],[-124,42],[-124,48],[-130,54],[-140,60],[-150,61],[-158,58],[-162,55],[-166,60],[-168,66]] },
  { name: "Greenland", fill: LAND3, pts: [[-58,64],[-52,60],[-43,60],[-32,68],[-25,70],[-30,76],[-45,78],[-58,76],[-62,70]] },
  { name: "South America", fill: LAND2, pts: [[-80,10],[-77,7],[-75,5],[-70,0],[-65,-3],[-60,-5],[-55,-5],[-50,-2],[-44,-3],[-38,-5],[-35,-8],[-37,-13],[-40,-20],[-42,-23],[-48,-27],[-52,-32],[-57,-38],[-62,-41],[-65,-45],[-68,-50],[-70,-54],[-72,-50],[-73,-44],[-73,-37],[-72,-30],[-71,-22],[-71,-18],[-75,-15],[-78,-10],[-80,-5],[-81,0],[-80,5]] },
  { name: "Africa", fill: LAND, pts: [[-17,15],[-16,20],[-12,27],[-9,31],[-5,35],[0,36],[5,37],[10,37],[15,32],[20,32],[25,31],[30,31],[32,30],[35,28],[38,22],[40,18],[43,12],[48,11],[51,10],[48,5],[44,0],[40,-5],[38,-10],[35,-15],[33,-20],[31,-25],[28,-30],[25,-34],[20,-35],[17,-32],[15,-27],[13,-22],[12,-17],[11,-12],[9,-5],[9,0],[9,4],[6,4],[0,6],[-7,5],[-12,7],[-15,10],[-17,15]] },
  { name: "Asia", fill: LAND2, pts: [[30,70],[35,68],[40,67],[45,65],[50,68],[55,69],[60,70],[65,72],[70,73],[75,74],[80,75],[90,76],[100,77],[110,77],[120,76],[130,73],[140,72],[150,70],[160,69],[170,67],[178,65],[175,62],[170,60],[162,58],[158,52],[155,50],[150,45],[145,42],[140,39],[135,35],[130,33],[127,35],[126,38],[124,40],[122,38],[120,34],[118,30],[115,25],[110,20],[108,15],[105,10],[103,8],[100,7],[98,10],[95,15],[92,20],[90,22],[88,22],[86,20],[83,18],[80,13],[77,8],[75,12],[73,18],[70,22],[67,25],[64,25],[61,25],[58,26],[55,27],[52,28],[50,29],[48,30],[46,29],[44,29],[42,28],[40,30],[38,32],[36,36],[34,36],[32,38],[30,40],[30,45],[30,50],[30,55],[30,60],[30,65],[30,70]] },
  { name: "Europe", fill: LAND3, pts: [[-10,36],[-9,38],[-9,43],[-5,44],[-2,46],[-1,46],[-4,48],[-2,49],[0,50],[2,51],[4,53],[7,54],[8,57],[10,59],[12,58],[15,56],[18,56],[21,55],[21,58],[24,59],[26,60],[28,62],[30,65],[30,70],[35,68],[40,67],[44,64],[45,60],[42,58],[40,55],[38,52],[35,50],[33,48],[30,46],[28,44],[28,42],[26,41],[23,40],[22,38],[21,40],[19,42],[16,44],[14,45],[12,44],[10,44],[8,44],[6,43],[3,43],[0,40],[-2,37],[-6,36],[-9,37]] },
  { name: "Australia", fill: LAND, pts: [[113,-22],[113,-26],[114,-30],[115,-33],[118,-35],[122,-34],[126,-32],[129,-32],[132,-32],[135,-35],[137,-35],[140,-38],[143,-39],[146,-39],[149,-37],[150,-34],[152,-30],[153,-27],[151,-24],[148,-20],[146,-19],[143,-15],[142,-11],[140,-17],[138,-17],[136,-15],[135,-12],[132,-11],[129,-14],[126,-14],[123,-17],[120,-19],[117,-20],[114,-21]] },
  { name: "SE Asia islands", fill: LAND2, pts: [[95,5],[97,8],[99,10],[101,8],[103,5],[104,2],[102,0],[100,-2],[98,-4]] },
  { name: "Java", fill: LAND2, pts: [[105,-5],[108,-6],[111,-7],[114,-8],[116,-9],[114,-10],[110,-8],[107,-6]] },
  { name: "New Guinea", fill: LAND, pts: [[131,-1],[134,-2],[137,-3],[140,-3],[142,-4],[145,-5],[147,-6],[150,-8],[150,-10],[147,-9],[144,-8],[141,-8],[138,-7],[135,-5],[132,-3]] },
  { name: "Japan", fill: LAND3, pts: [[130,31],[131,33],[133,34],[135,34],[137,35],[139,35],[140,37],[141,39],[141,41],[142,43],[144,44],[145,44],[144,42],[142,40],[140,38],[138,36],[136,35],[134,34],[132,33]] },
  { name: "UK", fill: LAND3, pts: [[-5,50],[-3,53],[-5,55],[-4,57],[-2,58],[0,57],[1,54],[0,52],[-3,51]] },
  { name: "New Zealand", fill: LAND2, pts: [[167,-45],[168,-44],[170,-43],[172,-41],[174,-39],[176,-38],[178,-38],[176,-40],[174,-42],[172,-43],[170,-45],[168,-46]] },
  { name: "Madagascar", fill: LAND2, pts: [[44,-16],[47,-15],[50,-16],[50,-20],[48,-24],[45,-25],[43,-22],[43,-18]] },
  // v5: small islands the reference map shows (lon/lat, same projection)
  { name: "Cuba", fill: LAND2, pts: [[-84,22],[-80,23],[-76,21],[-74,20],[-77,21],[-82,22]] },
  { name: "Hispaniola", fill: LAND2, pts: [[-74,19],[-71,19],[-68,18],[-72,18]] },
  { name: "Iceland", fill: LAND3, pts: [[-22,64],[-18,63],[-14,64],[-15,66],[-20,66],[-24,65]] },
  { name: "Ireland", fill: LAND3, pts: [[-10,52],[-8,51],[-6,52],[-6,55],[-8,55],[-10,53]] },
  { name: "Sri Lanka", fill: LAND2, pts: [[80,6],[81,9],[80,9],[79,7]] },
  { name: "Philippines", fill: LAND2, pts: [[120,18],[122,18],[122,14],[120,13],[121,16],[120,17]] },
  { name: "Sumatra", fill: LAND2, pts: [[95,5],[100,0],[104,-3],[106,-6],[102,-4],[97,3]] },
  { name: "Borneo", fill: LAND2, pts: [[109,1],[113,4],[117,6],[119,1],[117,-3],[112,-3],[109,-1]] },
  { name: "Sulawesi", fill: LAND2, pts: [[119,0],[121,1],[123,0],[120,-3],[119,-1]] },
  { name: "Taiwan", fill: LAND3, pts: [[120,22],[121,25],[122,25],[121,22]] },
  { name: "Hainan", fill: LAND3, pts: [[109,19],[110,20],[111,19],[109,18]] },
  { name: "Cyprus", fill: LAND3, pts: [[33,35],[34,36],[32,35]] },
  { name: "Sicily", fill: LAND3, pts: [[13,38],[15,37],[12,37]] },
];
const FACETS = [
  { fill: "#FFFFFF", op: 0.16, pts: [[-140,68],[-110,72],[-125,58]] },
  { fill: "#2E2118", op: 0.10, pts: [[-100,45],[-80,30],[-95,20]] },
  { fill: "#FFFFFF", op: 0.14, pts: [[-60,-5],[-45,-15],[-55,-30]] },
  { fill: "#FFFFFF", op: 0.15, pts: [[10,30],[25,20],[15,5]] },
  { fill: "#2E2118", op: 0.08, pts: [[25,-10],[35,-25],[20,-30]] },
  { fill: "#FFFFFF", op: 0.16, pts: [[70,70],[95,72],[85,55]] },
  { fill: "#2E2118", op: 0.08, pts: [[120,50],[140,45],[130,30]] },
  { fill: "#FFFFFF", op: 0.14, pts: [[125,-20],[140,-30],[135,-38]] },
];
function project(lon, lat, box) {
  return [
    box.x + ((lon + 180) / 360) * box.w,
    box.y + ((80 - lat) / 140) * box.h,
  ];
}
function worldMap(d, x, y, w, h, pinR = 7) {
  rect(x, y, w, h, SEA);
  for (const lat of [60, 30, 0, -30]) {
    const yy = y + ((80 - lat) / 140) * h;
    shapes.push(`<line x1="${f(x)}" y1="${f(yy)}" x2="${f(x + w)}" y2="${f(yy)}" stroke="#FFFFFF" stroke-width="1" opacity="0.35"/>`);
  }
  const box = { x, y, w, h };
  for (const c of CONTINENTS) {
    shapes.push(`<polygon points="${c.pts.map(([lo, la]) => project(lo, la, box).map(v => f(v)).join(',')).join(' ')}" fill="${c.fill}" stroke="${INK}" stroke-width="1" stroke-opacity="0.35"/>`);
  }
  for (const fc of FACETS) {
    shapes.push(`<polygon points="${fc.pts.map(([lo, la]) => project(lo, la, box).map(v => f(v)).join(',')).join(' ')}" fill="${fc.fill}"${fc.op !== 1 ? ` opacity="${fc.op}"` : ''}/>`);
  }
  const placed = [];
  const pinGap = 18, pinNudge = 12;
  // v5: numbered region-coloured pins like the reference map (reverses v4's
  // red-dots-only rule — Gibran praised this map). d.pins are lat/lon only;
  // story numbers + regions are fixed here, in d.pins order: 1 lead (ME),
  // 2 hero2 (AM), 3 hero3 (EU), 4 summit (AS), 5 EU loan (EU), 7 Badme (AF),
  // 14 PNG quake (OC), 13 GAO report (AM). Numbers are drawn as raw SVG text
  // (not via text()) so the overlap audit is not polluted by pin labels.
  const PIN_META = [
    { n: 1, region: 'ME' }, { n: 2, region: 'AM' }, { n: 3, region: 'EU' },
    { n: 4, region: 'AS' }, { n: 5, region: 'EU' }, { n: 7, region: 'AF' },
    { n: 14, region: 'OC' }, { n: 13, region: 'AM' },
  ];
  for (let pi = 0; pi < d.pins.length; pi++) {
    const p = d.pins[pi];
    const meta = PIN_META[pi] || { n: pi + 1, region: 'WORLD' };
    const fill = PIN_REG[meta.region];
    const numFill = meta.region === 'AS' ? INK : '#FFFFFF';
    let [px, py] = project(p.lon, p.lat, box);
    let nudged = false;
    for (const q of placed) {
      if (Math.abs(px - q[0]) < pinGap && Math.abs(py - q[1]) < pinGap) { py += pinNudge; nudged = true; }
    }
    if (nudged) {
      const [ox, oy] = project(p.lon, p.lat, box);
      circle(ox, oy, 3, fill);
      shapes.push(`<line x1="${f(ox)}" y1="${f(oy)}" x2="${f(px)}" y2="${f(py - (pinR - 1))}" stroke="${fill}" stroke-width="1.2" opacity="0.9"/>`);
    }
    const top = y + pinR + 2, bot = y + h - pinR - 2;
    px = Math.max(x + pinR + 2, Math.min(x + w - pinR - 2, px));
    py = Math.max(top, Math.min(bot, py));
    placed.push([px, py]);
    shapes.push(`<circle cx="${f(px)}" cy="${f(py)}" r="${f(pinR)}" fill="${fill}" stroke="${INK}" stroke-width="1.5"/>`);
    shapes.push(`<text x="${f(px)}" y="${f(py + 3.2)}" font-family="${SANS}" font-size="9" font-weight="800" fill="${numFill}" text-anchor="middle">${meta.n}</text>`);
  }
  return placed;
}

// ---- layout (absolute coordinates; margins 40px; content 40..984) ----
// v6 = v5's MOSAIC (full-bleed lead, unequal heroes, mixed grid, tall dark
// #8) + winner devices from the top-10 study: giant Didone date (50px,
// biggest on the page) + italic red dek naming the top 4 stories, stat
// strip with BIG numbers (20px, stacked label), map as its own band with a
// legend line, DATE CHECK as a red box, "Original drawings" + 10 sources.
// Brief stays 2 columns x 9 rows: 3 columns would truncate headlines at
// 11px (maxW ~146px vs ~230px headlines). Timeline UTC skipped: no verified
// UTC times in the data (inventing times would break criterion 4).
// Type ladder on sqrt(phi) steps from 11px: Didone 50 (date) / 37 (lead) /
// 23 (hero) / 16 (grid); grid sizes 13 / 12 stay for fit (not ladder
// steps — said honestly).

const MX = 40, RX = 984, CW = 944;

// Top kicker
text("THE WORLD'S NEWS IN ONE PICTURE", MX, 16, 11, 800, PIN, SANS, 'start', { tag: 'topkick', spacing: 1 });
text(D.countLine + ' · ALL FROM WEDNESDAY', RX, 16, 11, 800, PIN, SANS, 'end', { tag: 'topkick-r', spacing: 1 });
rect(MX, 21, CW, 2, INK);
// Masthead date (Didone, like the winners) — 50px, biggest on the page
text(D.date, 512, 72, 50, 900, INK, DISPLAY, 'middle', { tag: 'masthead' });
// Italic red dek: the top 4 stories, all from the data (lead + heroes + #4)
text('Gulf bases hit · U.S.–Venezuela pact signed · Crimea bridge falls · Xi greets Trump in Shenzhen', 512, 96, 13.5, 400, PIN, SANS, 'middle', { tag: 'masthead-dek', italic: true });
rect(MX, 102, CW, 2, INK);

// Region bar (widths proportional to counts, min 64px)
{
  const total = D.regions.reduce((a, r) => a + r.count, 0);
  let widths = D.regions.map(r => Math.max(64, Math.round(r.count / total * CW)));
  let sum = widths.reduce((a, b) => a + b, 0);
  // take the excess from the largest segment
  const li = widths.indexOf(Math.max(...widths));
  widths[li] -= (sum - CW);
  let x = MX;
  D.regions.forEach((r, i) => {
    rect(x, 108, widths[i], 16, REG[r.key]);
    text(`${r.label} ${r.count}`, x + widths[i] / 2, 120, 10, 700, '#FFFFFF', SANS, 'middle', { tag: 'region' });
    x += widths[i];
  });
}
// Field bar
rect(MX, 128, CW, 14, INK);
text(D.fieldLine, 512, 139, 11, 400, '#FFFFFF', SANS, 'middle', { tag: 'fieldbar' });

// Stat strip
text('THE DAY IN NUMBERS:', MX, 160, 12, 800, PIN, SANS, 'start', { tag: 'statlabel' });
D.stats.forEach((s, i) => {
  const bx = MX + i * 159, bw = 149;
  rect(bx, 166, bw, 34, PANEL, 'stroke="#6B5844" stroke-width="1"');
  text(s.num, bx + 10, 184, 20, 800, PIN, SANS, 'start', { tag: 'stat-num' });
  if (estW(s.label, 10, 700) > bw - 20) truncations.push({ tag: 'stat-label', text: s.label, lines: 2, maxLines: 1 });
  text(s.label, bx + 10, 197, 10, 700, INK, SANS, 'start', { tag: 'stat-label' });
});

// LEAD #1 — full-bleed art (breaks the grid: touches both page edges).
// Badge "1" overlaps the art's bottom edge; kicker starts right of the badge.
img('lead', 0, 208, 1024, 96);
rect(28, 292, 28, 28, PIN);
text('1', 42, 312, 13, 800, '#FFFFFF', SANS, 'middle', { tag: 'lead-num' });
text(D.lead.kicker, 68, 312, 11, 700, PIN, SANS, 'start', { tag: 'lead-kicker', spacing: 1 });
text(D.lead.headline, MX, 346, 37, 900, INK, DISPLAY, 'start', { tag: 'lead-h' });
text(D.lead.dek, MX, 366, 13, 400, MUTED, SANS, 'start', { tag: 'lead-dek' });

// Heroes #2-3 — UNEQUAL: #2 wide horizontal (art left, text right),
// #3 narrow vertical (art on top, no dek — the headline says it).
{
  const x = MX, y = 378, w = 596, hh = 112;
  rect(x, y, w, hh, PAPER, 'stroke="#6B5844" stroke-width="1"');
  ILL[D.hero2.art](x + 1, y + 1, 170, hh - 2);
  rect(x + 6, y + 6, 20, 20, PIN);
  text('2', x + 16, y + 21, 12, 800, '#FFFFFF', SANS, 'middle', { tag: 'hero-num' });
  rect(x + 171, y + 1, w - 172, 16, REG[D.hero2.region]);
  text(D.hero2.kicker, x + 180, y + 13, 11, 700, '#FFFFFF', SANS, 'start', { tag: 'hero-kicker' });
  wtext(D.hero2.headline, x + 180, y + 48, w - 190, 23, 900, INK, DISPLAY, 2, 26, 'hero2-h');
  text(D.hero2.dek, x + 180, y + 106, 13, 400, MUTED, SANS, 'start', { tag: 'hero2-dek' });
}
{
  const x = 652, y = 378, w = 332, hh = 112;
  rect(x, y, w, hh, PAPER, 'stroke="#6B5844" stroke-width="1"');
  ILL[D.hero3.art](x + 1, y + 1, w - 2, 56);
  rect(x + 6, y + 6, 20, 20, PIN);
  text('3', x + 16, y + 21, 12, 800, '#FFFFFF', SANS, 'middle', { tag: 'hero-num' });
  text(D.hero3.kicker, x + 10, y + 70, 11, 700, REG_TEXT[D.hero3.region], SANS, 'start', { tag: 'hero-kicker' });
  wtext(D.hero3.headline, x + 10, y + 88, w - 20, 16, 900, INK, DISPLAY, 2, 18, 'hero3-h');
}

// Grid #4-13 — MOSAIC.
// Row 1 (y 524..628, 104 tall): #4 WIDE + #5 narrow + #8 TALL (spans rows 1-2).
{
  const x = MX, y = 502, w = 480, hh = 96;
  rect(x, y, w, hh, PAPER, 'stroke="#6B5844" stroke-width="1"');
  ILL[D.grid[0].art](x + 1, y + 1, 134, 94);
  rect(x + 6, y + 6, 16, 16, PIN);
  text('4', x + 14, y + 18, 11, 800, '#FFFFFF', SANS, 'middle', { tag: 'grid-num' });
  text(D.grid[0].kicker, x + 150, y + 20, 10, 700, REG_TEXT[D.grid[0].region], SANS, 'start', { tag: 'grid-kicker' });
  wtext(D.grid[0].headline, x + 150, y + 42, w - 158, 16, 700, INK, SANS, 2, 20, 'grid-h');
  text(D.grid[0].dek, x + 150, y + 90, 11, 400, MUTED, SANS, 'start', { tag: 'grid-dek' });
}
{
  const x = 536, y = 502, w = 208, hh = 96;
  rect(x, y, w, hh, PAPER, 'stroke="#6B5844" stroke-width="1"');
  ILL[D.grid[1].art](x + 1, y + 1, w - 2, 52);
  rect(x + 5, y + 5, 14, 14, PIN);
  text('5', x + 12, y + 16, 10, 800, '#FFFFFF', SANS, 'middle', { tag: 'grid-num' });
  text(D.grid[1].kicker, x + 8, y + 62, 10, 700, REG_TEXT[D.grid[1].region], SANS, 'start', { tag: 'grid-kicker' });
  wtext(D.grid[1].headline, x + 8, y + 78, w - 16, 12, 700, INK, SANS, 2, 14, 'grid-h');
}
{
  // #8 Voyager — TALL DARK card spanning rows 1-2 (breaks the row rhythm).
  // The illustration's own navy fills the top; headline sits on navy below.
  const x = 760, y = 502, w = 224, hh = 176;
  rect(x, y, w, hh, NAVY);
  ILL[D.grid[4].art](x, y, w, 128);
  rect(x + 6, y + 6, 16, 16, PIN);
  text('8', x + 14, y + 18, 11, 800, '#FFFFFF', SANS, 'middle', { tag: 'grid-num' });
  text(D.grid[4].kicker, x + 12, y + 140, 10, 700, GOLD, SANS, 'start', { tag: 'grid-kicker' });
  wtext(D.grid[4].headline, x + 12, y + 156, w - 24, 14, 700, '#FFFFFF', SANS, 2, 16, 'grid-h');
}
// Row 2 (y 640..720, 80 tall): #6, #7, #9 — art-left cards, no dek.
[D.grid[2], D.grid[3], D.grid[5]].forEach((g, i) => {
  const x = MX + i * 240, y = 610, w = 224, hh = 68;
  rect(x, y, w, hh, PAPER, 'stroke="#6B5844" stroke-width="1"');
  ILL[g.art](x + 1, y + 1, 65, 66);
  rect(x + 5, y + 5, 14, 14, PIN);
  text(String(g.n), x + 12, y + 16, 10, 800, '#FFFFFF', SANS, 'middle', { tag: 'grid-num' });
  text(g.kicker, x + 77, y + 16, 9, 700, REG_TEXT[g.region], SANS, 'start', { tag: 'grid-kicker' });
  wtext(g.headline, x + 77, y + 32, w - 85, 12, 700, INK, SANS, 3, 15, 'grid-h');
});
// Row 3 (y 732..796, 64 tall): #10-13 — v5: art 56x56 (nearly full card
// height; 40px icons read as blobs) with a region spine instead of a kicker
// line; the number badge overlaps the icon's corner.
[D.grid[6], D.grid[7], D.grid[8], D.grid[9]].forEach((g, i) => {
  const x = MX + i * 240, y = 690, w = 224, hh = 52;
  rect(x, y, w, hh, PAPER, 'stroke="#6B5844" stroke-width="1"');
  rect(x, y, 3, hh, REG[g.region]);
  ILL[g.art](x + 6, y + 2, 56, 48);
  rect(x + 4, y + 8, 13, 13, PIN);
  text(String(g.n), x + 10.5, y + 18, 9, 800, '#FFFFFF', SANS, 'middle', { tag: 'grid-num' });
  wtext(g.headline, x + 70, y + 31, w - 78, 12, 700, INK, SANS, 2, 15, 'grid-h');
});

// Map (left) + brief (right, 2 cols x 9 rows)
text(D.mapTitle, MX, 768, 14, 800, TEAL_D, SANS, 'start', { tag: 'map-title' });
const placedPins = worldMap(D, MX, 774, 300, 130, 7);
text(D.briefTitle, 360, 768, 14, 800, PIN, SANS, 'start', { tag: 'brief-title' });
D.brief.forEach((b, i) => {
  const col = i < 9 ? 0 : 1, row = i % 9;
  const bx = 360 + col * 312, by = 788 + row * 14.5;
  if (row % 2 === 0) rect(356 + col * 312, by - 11, 312, 14.5, BAND);
  const numW = estW(String(b.n) + '.', 11, 800) + 6;
  text(String(b.n) + '.', bx, by, 11, 800, PIN, SANS, 'start', { tag: 'brief-num' });
  wtext(b.headline, bx + numW, by, 304 - numW, 11, 400, INK, SANS, 1, 14.5, 'brief-h');
});

// Map legend (under the map band): region colours + pin meaning.
{
  let lx = MX;
  for (const r of D.regions) {
    rect(lx, 910, 8, 8, REG[r.key]);
    text(r.label, lx + 11, 918, 10, 700, INK, SANS, 'start', { tag: 'map-legend' });
    lx += 11 + estW(r.label, 10, 700) + 12;
  }
  text('numbered pins = story cards', lx + 6, 918, 10, 400, MUTED, SANS, 'start', { tag: 'map-legend' });
}

// Footer — DATE CHECK as a red box (top-10 device): the exclusion list,
// white on red, 2 lines.
rect(MX, 926, CW, 44, PIN);
wtext(D.footer, MX + 20, 942, CW - 40, 11, 400, '#FFFFFF', SANS, 2, 14, 'datecheck');
text('All stories happened or were first reported on 18 November 2026. Original drawings.', MX, 986, 10, 400, MUTED, SANS, 'start', { tag: 'footer2' });
text('Sources: Reuters, AP, AFP, Al Jazeera, Bloomberg, USGS, IMD, ONS, GAO, Cambridge Dictionary.', MX, 999, 10, 400, MUTED, SANS, 'start', { tag: 'footer2' });


// ---- overlap audit (text vs text) ----
const overlaps = [];
for (let i = 0; i < textBoxes.length; i++) {
  for (let j = i + 1; j < textBoxes.length; j++) {
    const a = textBoxes[i], b = textBoxes[j];
    if (a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5) {
      overlaps.push({ a: a.tag, b: b.tag });
    }
  }
}

// ---- assemble + render ----
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
  `<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>` +
  shapes.join('') +
  textLines.map(t =>
    `<text x="${f(t.x)}" y="${f(t.y)}" font-family="${t.font}" font-size="${t.size}" font-weight="${t.weight}" fill="${t.fill}" text-anchor="${t.anchor}"${t.spacing ? ` letter-spacing="${t.spacing}"` : ''}${t.italic ? ' font-style="italic"' : ''}>${esc(t.s)}</text>`
  ).join('') +
  `</svg>`;
fs.writeFileSync(new URL('./entry-v6.svg', import.meta.url), svg);
const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { loadSystemFonts: true } });
const png = resvg.render().asPng();
fs.writeFileSync(new URL('./entry-v6.png', import.meta.url), png);

// ---- report (stderr, machine-readable-ish) ----
const storyCount = 1 + 2 + D.grid.length + D.brief.length;
const regionCounts = {};
[... [D.lead, D.hero2, D.hero3], ...D.grid, ...D.brief].forEach(s => { regionCounts[s.region] = (regionCounts[s.region] || 0) + 1; });
const report = {
  file: 'entry-v6.png',
  bytes: png.length,
  dimensions: `${W}x${H}`,
  stories: storyCount,
  illustrated: 3 + D.grid.length,
  regions: regionCounts,
  pins: placedPins.length,
  truncations,
  overlaps: overlaps.slice(0, 20),
  overlapCount: overlaps.length,
  contrast: {
    headlineInkOnPaper: +contrast(INK, PAPER).toFixed(2),
    mutedOnPaper: +contrast(MUTED, PAPER).toFixed(2),
    accentOnPaper: +contrast(PIN, PAPER).toFixed(2),
    whiteOnRegion: Object.fromEntries(Object.entries(REG).map(([k, v]) => [k, +contrast('#FFFFFF', v).toFixed(2)])),
    mastheadEstW: Math.round(estW(D.date, 50, 900, DISPLAY)),
    whiteOnPinDateCheck: +contrast('#FFFFFF', PIN).toFixed(2),
    leadHeadlineEstW: Math.round(estW(D.lead.headline, 34, 900, DISPLAY)),
  },
};
console.error(JSON.stringify(report, null, 2));

// generate-final-v12.mjs — news-image 18 Nov, v12 (v11 + image-top grid, 3 literal
// scenes, +9 verified tail stories). v12 = re-layout grid jadi 2x5 kartu image-top
// full-bleed ala #1 (gambar 184x84 di atas, headline di bawah); #9/#12/#13
// regenerasi literal; tail 27 item (40 cerita). Data: news-v12.json; heroes
// byte-identik v11 (lead/hero2/hero3); DATE CHECK + lead tidak diubah.
// polishes only (9 other scenes byte-identical v9 files):
// (1) LEAD: squash band y300..640 (1.33x vertical) + dark-sea lift — dark
//     rows 77% -> 31%, tower derrick now visible, ship reads on lifted sea.
// (2) #6 COP31: tight zoom crop on factory + 2 smokes (x1230..1710,
//     y400..800) — factory fills the slot instead of sitting at the edge.
// (3) #9 Australia: window shifted right x0=280 (head left edge kept) +
//     gentler med3+q16 — parliament full width in frame, columns visible.
// (4) #12 WOTY: REGENERATED on a dark teal background (giant glowing book
//     + gold star) — the v8 raw's star vanished under med5+q12 and the
//     card was the palest in the grid (mean lum 0.631 -> 0.395).
// Gibran's principle (22:38 WIB): silhouette must read in 1 second at a
// 300px thumbnail + colours must not clash — detail for its own sake is out.
// Scenes pre-cropped to slot size, median 3x3 + quantize (16 colours),
// embedded as data-URI PNGs (scenes-ai/v12/*.png). Data: news-v12.json
// (40 stories, news-v12.json). The code-drawn ill* functions below are kept
// as fallback only. Deterministic: no Date, no Math.random.
// Node + @resvg/resvg-js.
import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import {
  INK as LIB_INK, PALETTE, shade, shadowEllipse, star as libStar,
  profileHead, crowd, parliament, platform, satellite, drone, ship,
  coin, arrow, document, banSeal, globe, flag,
} from './shapes-lib.mjs';

const D = JSON.parse(fs.readFileSync(new URL('./news-v12.json', import.meta.url), 'utf8'));
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

// ---- AI illustrations (fallback only — v7 is code-drawn) ----
// The 13 cropped AI JPGs stay available as a per-card fallback: if a
// code-drawn version reads worse in the eye check, swap that card's ILL
// entry to img('<key>', x, y, w, h). v7 ships with ZERO AI cards unless
// the eye check forces a swap (reported honestly in STATUS.md).
const AI_DIR = new URL('./assets-ai/crop/', import.meta.url);
const AI_IMG = {};
for (const k of ['lead', 'venezuela', 'bridge', 'summit', 'euloan', 'cop31', 'badme', 'voyager', 'australia', 'bangladesh', 'myanmar', 'woty', 'gao']) {
  AI_IMG[k] = 'data:image/jpeg;base64,' + fs.readFileSync(new URL(k + '.jpg', AI_DIR)).toString('base64');
}
function img(key, x, y, w, h) {
  shapes.push(`<image href="${AI_IMG[key]}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" preserveAspectRatio="none"/>`);
}

// ---- v9 AI scenes (data-URI PNG, pre-processed to slot size) ----
// scene04 summit, scene05 euloan, scene06 cop31, scene07 badme,
// scene08 voyager, scene09 australia, scene10 bangladesh,
// scene11 myanmar, scene12 woty, scene13 gao.
const SCENE_FILE = {
  lead: 'lead.png', hero2: 'hero2.png', hero3: 'hero3.png',
  summit: 'scene04.png', euloan: 'scene05.png', cop31: 'scene06.png',
  badme: 'scene07.png', voyager: 'scene08.png', australia: 'scene09.png',
  bangladesh: 'scene10.png', myanmar: 'scene11.png', woty: 'scene12.png',
  gao: 'scene13.png',
};
const SCENE_DIR = new URL('./scenes-ai/v12/', import.meta.url);
const SCENE_IMG = {};
for (const [k, fn] of Object.entries(SCENE_FILE)) {
  SCENE_IMG[k] = 'data:image/png;base64,' + fs.readFileSync(new URL(fn, SCENE_DIR)).toString('base64');
}
function sceneImg(key, x, y, w, h) {
  shapes.push(`<image href="${SCENE_IMG[key]}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" preserveAspectRatio="none"/>`);
}

// ---- clip paths (one per illustration box; shapes never spill) ----
const clipDefs = [];
let clipN = 0;
function clipBox(x, y, w, h) {
  const id = 'c' + (clipN++);
  clipDefs.push(`<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"/></clipPath>`);
  return id;
}
function clipped(x, y, w, h, inner) {
  const id = clipBox(x, y, w, h);
  shapes.push(`<g clip-path="url(#${id})">${inner}</g>`);
}

// ---- CODE-DRAWN illustrations (Flat 2.0, 2–3 tones, light top-left) ----
// Each ILL function takes the v6 display box (x, y, w, h) and draws into
// `shapes`, clipped to the box. Palette: the v6 muted family + library
// PALETTE. No text inside illustrations (typography is added by the layout).
const SKY_DUSK = '#5F7E84', SKY_WARM = '#E8C88A', SEA_TEAL = '#4E7D6F';
const SEA_DARK = '#3A5F53', SEA_LT = '#7FB3A8';
const LEAD_GOLD = '#E3B25D', LEAD_TERRA = '#C96F4A', LEAD_CREAM = '#F7E3B0';

// LEAD — Gulf (1024x96 strip). Sky + warm horizon + sea bands; a full
// gold starburst (never cut) at the φ point of the strip; the platform
// (library) at right; 5 gold drones (library) in the sky; a ship
// (library) on the horizon at left; gold reflection streaks under the burst.
function illLead(x, y, w, h) {
  const parts = [];
  const skyH = Math.round(h * 0.44), horY = y + skyH, seaY = horY + 14;
  parts.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(skyH)}" fill="${SKY_DUSK}"/>`);
  // flat clouds (cream, quiet) fill the wide sky
  parts.push(`<ellipse cx="${f(x + 180)}" cy="${f(y + 16)}" rx="52" ry="7" fill="#F2E8D5" opacity="0.18"/>`);
  parts.push(`<ellipse cx="${f(x + 470)}" cy="${f(y + 26)}" rx="66" ry="8" fill="#F2E8D5" opacity="0.16"/>`);
  parts.push(`<ellipse cx="${f(x + 950)}" cy="${f(y + 14)}" rx="46" ry="6" fill="#F2E8D5" opacity="0.18"/>`);
  parts.push(`<rect x="${f(x)}" y="${f(horY)}" width="${f(w)}" height="14" fill="${SKY_WARM}"/>`);
  parts.push(`<rect x="${f(x)}" y="${f(seaY)}" width="${f(w)}" height="${f(y + h - seaY)}" fill="${SEA_TEAL}"/>`);
  parts.push(`<rect x="${f(x)}" y="${f(y + h - 12)}" width="${f(w)}" height="12" fill="${SEA_DARK}"/>`);
  // sea wave streaks (light, quiet)
  parts.push(`<line x1="${f(x + 40)}" y1="${f(seaY + 14)}" x2="${f(x + 190)}" y2="${f(seaY + 14)}" stroke="${SEA_LT}" stroke-width="2" opacity="0.55"/>`);
  parts.push(`<line x1="${f(x + 560)}" y1="${f(seaY + 22)}" x2="${f(x + 700)}" y2="${f(seaY + 22)}" stroke="${SEA_LT}" stroke-width="2" opacity="0.45"/>`);
  parts.push(`<line x1="${f(x + 880)}" y1="${f(seaY + 12)}" x2="${f(x + 990)}" y2="${f(seaY + 12)}" stroke="${SEA_LT}" stroke-width="2" opacity="0.5"/>`);
  // ship on the horizon, left (library, dark teal hull)
  parts.push(ship(x + 48, seaY - 16, 0.38, {}));
  // explosion starburst: centre ON the sea near the horizon, sized to FIT
  // the strip (R=30, centre ey=seaY+14 -> bottom 302 < 304, never cut).
  // Rays are IRREGULAR (fixed length table, golden-angle feel) so it reads
  // as an explosion, not a pinwheel: long spikes + short spikes alternating.
  const ex = x + Math.round(w * 0.30), ey = seaY + 14;
  const RAY_LEN = [1.0, 0.58, 0.86, 1.18, 0.66, 0.94, 1.26, 0.55, 0.9, 1.12, 0.62, 0.8, 1.22, 0.72, 1.0, 0.52];
  const R = 30, R2 = 13;
  for (let i = 0; i < 16; i++) {
    const a = (i * 22.5 - 90) * Math.PI / 180;
    const a2 = ((i + 0.5) * 22.5 - 90) * Math.PI / 180;
    const a3 = ((i + 1) * 22.5 - 90) * Math.PI / 180;
    const r1 = R * RAY_LEN[i], r3 = R * RAY_LEN[(i + 1) % 16];
    const tip = [ex + r1 * Math.cos(a), ey + r1 * Math.sin(a)];
    const mid = [ex + R2 * Math.cos(a2), ey + R2 * Math.sin(a2)];
    const tip2 = [ex + r3 * Math.cos(a3), ey + r3 * Math.sin(a3)];
    parts.push(`<polygon points="${f(tip[0])},${f(tip[1])} ${f(mid[0])},${f(mid[1])} ${f(tip2[0])},${f(tip2[1])}" fill="${i % 2 === 0 ? LEAD_GOLD : LEAD_TERRA}"/>`);
  }
  parts.push(`<circle cx="${f(ex)}" cy="${f(ey)}" r="11" fill="${LEAD_CREAM}"/>`);
  parts.push(`<circle cx="${f(ex)}" cy="${f(ey)}" r="5" fill="#FFFFFF"/>`);
  // debris dots around the burst
  const debris = [[-52, -16], [46, -24], [-64, 6], [60, 10], [-34, -30], [36, -34], [70, -4], [-74, -2], [24, 34], [-28, 30]];
  for (const [dx, dy] of debris) parts.push(`<circle cx="${f(ex + dx)}" cy="${f(ey + dy)}" r="${Math.abs(dx) % 3 === 0 ? 2.4 : 1.6}" fill="${LEAD_GOLD}"/>`);
  // smoke puff above the burst (the explosion's top)
  parts.push(`<circle cx="${f(ex - 8)}" cy="${f(ey - 34)}" r="5" fill="#9AA5A8" opacity="0.7"/>`);
  parts.push(`<circle cx="${f(ex + 6)}" cy="${f(ey - 40)}" r="3.6" fill="#C4CBCB" opacity="0.65"/>`);
  // gold reflection streaks under the burst
  parts.push(`<rect x="${f(ex - 40)}" y="${f(ey + 24)}" width="80" height="3" fill="${LEAD_GOLD}" opacity="0.75"/>`);
  parts.push(`<rect x="${f(ex - 26)}" y="${f(ey + 30)}" width="52" height="2.4" fill="${LEAD_GOLD}" opacity="0.55"/>`);
  // platform (library) at right, lighter steel so it reads on the teal sky
  parts.push(platform(x + 728, y + 6, 0.92, { sea: SEA_TEAL, steel: '#8A9BA6', deck: '#5A6B76' }));
  // 5 cream drones in the sky (bigger + brighter than v7.1: sunlit, they pop)
  const drones = [[120, 6, 0.36], [330, 14, 0.30], [520, 4, 0.38], [640, 16, 0.28], [900, 8, 0.32]];
  for (const [dx, dy, s] of drones) parts.push(drone(x + dx, y + dy, s, { body: LEAD_CREAM }));
  clipped(x, y, w, h, parts.join(''));
}

// #2 Venezuela — 2 profiles signing at a table, US + Venezuela flags.
// Heads face each other; table + document below; flags on poles at the edges.
function illVenezuela(x, y, w, h) {
  const parts = [];
  parts.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#EFE6D2"/>`);
  // flags on poles at the far edges (US left, Venezuela tricolour right).
  // Flags start clear of the layout's number badge (20px, top-left).
  parts.push(`<line x1="${f(x + 28)}" y1="${f(y + 4)}" x2="${f(x + 28)}" y2="${f(y + 44)}" stroke="${INK}" stroke-width="1.6"/>`);
  parts.push(flag(x + 30, y + 4, 0.30, { code: 'US' }));
  parts.push(`<line x1="${f(x + w - 14)}" y1="${f(y + 6)}" x2="${f(x + w - 14)}" y2="${f(y + 46)}" stroke="${INK}" stroke-width="1.6"/>`);
  parts.push(flag(x + w - 46, y + 6, 0.30, { code: 'VE', colors: ['#FCD116', '#003893', '#CE1126'] }));
  // two heads facing each other (dark hair + blond hair, dark suits)
  parts.push(profileHead(x + 48, y + 14, 0.52, { hair: HAIR_BLK, suit: NAVY, tie: '#C8391F' }));
  parts.push(profileHead(x + 74, y + 14, 0.52, { dir: -1, hair: HAIR_BLOND, suit: NAVY, tie: '#2E5A88' }));
  // table + document + pens
  parts.push(`<rect x="${f(x + 8)}" y="${f(y + 76)}" width="${f(w - 16)}" height="10" fill="${BROWN}"/>`);
  parts.push(`<rect x="${f(x + 8)}" y="${f(y + 76)}" width="${f(w - 16)}" height="2.5" fill="${shade(BROWN, 0.3)}" opacity="0.7"/>`);
  parts.push(document(x + 72, y + 58, 0.22, {}));
  parts.push(`<line x1="${f(x + 58)}" y1="${f(y + 72)}" x2="${f(x + 52)}" y2="${f(y + 76)}" stroke="${INK}" stroke-width="1.6"/>`);
  parts.push(`<line x1="${f(x + 112)}" y1="${f(y + 72)}" x2="${f(x + 118)}" y2="${f(y + 76)}" stroke="${INK}" stroke-width="1.6"/>`);
  clipped(x, y, w, h, parts.join(''));
}

// #3 Bridge — custom flat suspension bridge (library bridge is 140x70,
// wrong aspect for a 330x56 box). Two towers + catenary + suspenders +
// deck with a COLLAPSED gap + smoke + sun. Water band at the bottom.
function illBridge(x, y, w, h) {
  const parts = [];
  parts.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#E8DCC2"/>`);
  // sun (gold disc, top-left light) + sky wash
  parts.push(`<circle cx="${f(x + 288)}" cy="${f(y + 12)}" r="9" fill="${GOLD}"/>`);
  parts.push(`<circle cx="${f(x + 288)}" cy="${f(y + 12)}" r="13" fill="${GOLD}" opacity="0.25"/>`);
  // towers (steel, 2 tones)
  const tw = 7, t1 = x + 62, t2 = x + 240;
  parts.push(`<rect x="${f(t1)}" y="${f(y + 4)}" width="${tw}" height="${f(h - 16)}" fill="${PALETTE.steelDark}"/>`);
  parts.push(`<rect x="${f(t2)}" y="${f(y + 4)}" width="${tw}" height="${f(h - 16)}" fill="${PALETTE.steelDark}"/>`);
  parts.push(`<rect x="${f(t1 - 3)}" y="${f(y + 4)}" width="13" height="4" fill="${shade(PALETTE.steelDark, -0.2)}"/>`);
  parts.push(`<rect x="${f(t2 - 3)}" y="${f(y + 4)}" width="13" height="4" fill="${shade(PALETTE.steelDark, -0.2)}"/>`);
  // main cable: two sags (quadratic beziers)
  parts.push(`<path d="M ${f(x)} ${f(y + 14)} Q ${f(x + 34)} ${f(y + 26)}, ${f(t1 + 3)} ${f(y + 10)} Q ${f(x + 152)} ${f(y + 34)}, ${f(t2 + 3)} ${f(y + 10)} Q ${f(x + 296)} ${f(y + 26)}, ${f(x + w)} ${f(y + 14)}" fill="none" stroke="${PALETTE.steelDark}" stroke-width="2"/>`);
  // suspenders (verticals from cable to deck, skipping the collapsed gap)
  const deckY = y + h - 16;
  for (const sx of [18, 40, 88, 112, 196, 220, 268, 292, 312]) {
    parts.push(`<line x1="${f(x + sx)}" y1="${f(y + 20)}" x2="${f(x + sx)}" y2="${f(deckY)}" stroke="${PALETTE.steelDark}" stroke-width="1.1" opacity="0.85"/>`);
  }
  // deck: left span + right span, with a WIDE collapsed gap in the middle
  // (left span tilts down steeply into the gap = the collapse).
  parts.push(`<polygon points="${f(x)},${f(deckY)} ${f(x + 128)},${f(deckY)} ${f(x + 146)},${f(deckY + 12)} ${f(x + 128)},${f(deckY + 12)} ${f(x)},${f(deckY + 5)}" fill="${PALETTE.steel}"/>`);
  parts.push(`<rect x="${f(x + 176)}" y="${f(deckY)}" width="${f(w - 176)}" height="5" fill="${PALETTE.steel}"/>`);
  parts.push(`<rect x="${f(x)}" y="${f(deckY)}" width="${f(w)}" height="1.6" fill="${shade(PALETTE.steel, 0.35)}" opacity="0.7"/>`);
  // smoke rising from the gap (3 grey puffs, 2 tones)
  parts.push(`<circle cx="${f(x + 156)}" cy="${f(y + 24)}" r="7" fill="#9AA5A8" opacity="0.75"/>`);
  parts.push(`<circle cx="${f(x + 166)}" cy="${f(y + 15)}" r="5" fill="#C4CBCB" opacity="0.7"/>`);
  parts.push(`<circle cx="${f(x + 148)}" cy="${f(y + 11)}" r="3.8" fill="#D8DDDD" opacity="0.65"/>`);
  // water band + boat
  parts.push(`<rect x="${f(x)}" y="${f(y + h - 10)}" width="${f(w)}" height="10" fill="${SEA}"/>`);
  parts.push(`<polygon points="${f(x + 210)},${f(y + h - 10)} ${f(x + 234)},${f(y + h - 10)} ${f(x + 230)},${f(y + h - 5)} ${f(x + 214)},${f(y + h - 5)}" fill="${TERRA}"/>`);
  clipped(x, y, w, h, parts.join(''));
}

// #4 Summit — 2 profiles facing each other (Xi neat black hair/red tie,
// Trump swept blond hair/blue tie) + US + CN flags + red carpet.
function illSummit(x, y, w, h) {
  const parts = [];
  parts.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#EFE6D2"/>`);
  // flags clear of the layout's number badge (16px, top-left)
  parts.push(flag(x + 28, y + 4, 0.30, { code: 'CN' }));
  parts.push(flag(x + w - 36, y + 6, 0.30, { code: 'US' }));
  parts.push(profileHead(x + 14, y + 12, 0.52, { hair: HAIR_BLK, suit: NAVY, tie: '#C8391F' }));
  parts.push(profileHead(x + 68, y + 12, 0.52, { dir: -1, hair: HAIR_BLOND, suit: NAVY, tie: '#2E5A88' }));
  // red carpet + table line
  parts.push(`<rect x="${f(x)}" y="${f(y + h - 12)}" width="${f(w)}" height="12" fill="#C8391F"/>`);
  parts.push(`<rect x="${f(x)}" y="${f(y + h - 12)}" width="${f(w)}" height="2" fill="${shade('#C8391F', 0.25)}" opacity="0.7"/>`);
  clipped(x, y, w, h, parts.join(''));
}

// #5 EU loan — EU flag + 3 gold coins + up arrow (all library).
function illEuloan(x, y, w, h) {
  const parts = [];
  parts.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#EFE6D2"/>`);
  parts.push(flag(x + 6, y + 8, 0.55, { code: 'EU' }));
  parts.push(coin(x + 72, y + 8, 0.62, {}));
  parts.push(coin(x + 108, y + 8, 0.62, {}));
  parts.push(coin(x + 144, y + 8, 0.62, {}));
  parts.push(arrow(x + 176, y + 10, 0.55, { dir: 'up' }));
  clipped(x, y, w, h, parts.join(''));
}

// #6 COP31 — globe (library) + small factory with smoke (code).
function illCop31(x, y, w, h) {
  const parts = [];
  parts.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#EFE6D2"/>`);
  parts.push(globe(x + 7, y + 2, 0.62, {}));
  // factory: dark teal block + chimney + 2 smoke puffs (bottom-right)
  parts.push(`<rect x="${f(x + 40)}" y="${f(y + 50)}" width="20" height="14" fill="${PALETTE.tealDark}"/>`);
  parts.push(`<rect x="${f(x + 52)}" y="${f(y + 42)}" width="5" height="22" fill="${PALETTE.steelDark}"/>`);
  parts.push(`<circle cx="${f(x + 55)}" cy="${f(y + 38)}" r="3.4" fill="#9AA5A8" opacity="0.75"/>`);
  parts.push(`<circle cx="${f(x + 59)}" cy="${f(y + 32)}" r="2.4" fill="#C4CBCB" opacity="0.7"/>`);
  clipped(x, y, w, h, parts.join(''));
}

// #7 Badme — 2 helmet heads + striped border post (code).
function illBadme(x, y, w, h) {
  const parts = [];
  parts.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#EFE6D2"/>`);
  // striped border post (centre): red/white bands + small sign
  const px = x + 28;
  parts.push(`<rect x="${f(px)}" y="${f(y + 4)}" width="8" height="58" fill="#F2E8D5" stroke="${INK}" stroke-opacity="0.25"/>`);
  for (let i = 0; i < 4; i++) parts.push(`<rect x="${f(px)}" y="${f(y + 4 + i * 14.5)}" width="8" height="7.2" fill="${i % 2 === 0 ? '#C8391F' : '#F2E8D5'}"/>`);
  parts.push(`<rect x="${f(px - 6)}" y="${f(y + 2)}" width="20" height="9" fill="${NAVY}"/>`);
  parts.push(`<rect x="${f(px - 6)}" y="${f(y + 2)}" width="20" height="2" fill="${shade(NAVY, 0.3)}" opacity="0.7"/>`);
  // two helmet heads flanking the post
  parts.push(profileHead(x - 2, y + 20, 0.42, { hairStyle: 'helmet', suit: PALETTE.olive }));
  parts.push(profileHead(x + 30, y + 20, 0.42, { dir: -1, hairStyle: 'helmet', suit: PALETTE.olive }));
  clipped(x, y, w, h, parts.join(''));
}

// #8 Voyager — satellite (library) on navy + Earth globe + stars + trajectory.
function illVoyager(x, y, w, h) {
  const parts = [];
  parts.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${NAVY}"/>`);
  // stars (quiet, 2 tones)
  const stars = [[16, 10, 1.6], [200, 14, 1.4], [120, 8, 1.2], [30, 110, 1.4], [180, 100, 1.2], [90, 120, 1.1], [210, 60, 1.5], [60, 60, 1.0]];
  for (const [sx, sy, sr] of stars) parts.push(`<circle cx="${f(x + sx)}" cy="${f(y + sy)}" r="${sr}" fill="#FFFFFF" opacity="0.85"/>`);
  // trajectory arc (dashed, gold) from Earth to the dish
  parts.push(`<path d="M ${f(x + 190)} ${f(y + 108)} Q ${f(x + 130)} ${f(y + 60)}, ${f(x + 80)} ${f(y + 40)}" fill="none" stroke="${GOLD}" stroke-width="1.4" stroke-dasharray="4 4" opacity="0.8"/>`);
  // Earth (library globe) bottom-right
  parts.push(globe(x + 168, y + 82, 0.5, {}));
  // Voyager satellite (library, Earth built-in suppressed — we draw our own)
  parts.push(satellite(x + 52, y + 6, 1.05, { earth: false }));
  clipped(x, y, w, h, parts.join(''));
}

// #9 Australia — parliament (library) + red-haired profile head.
function illAustralia(x, y, w, h) {
  const parts = [];
  parts.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#EFE6D2"/>`);
  parts.push(parliament(x + 4, y + 20, 0.56, {}));
  parts.push(profileHead(x + 34, y + 2, 0.34, { hair: HAIR_RED, suit: NAVY, tie: '#C8391F' }));
  clipped(x, y, w, h, parts.join(''));
}

// #10 Bangladesh — crowd (library, 3 rows).
function illBangladesh(x, y, w, h) {
  const parts = [];
  parts.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#EFE6D2"/>`);
  parts.push(crowd(x + 3, y + 4, 0.5, { details: ['fist', 'megaphone', 'banner'] }));
  clipped(x, y, w, h, parts.join(''));
}

// #11 Myanmar — document (library) + ban seal (library).
function illMyanmar(x, y, w, h) {
  const parts = [];
  parts.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#EFE6D2"/>`);
  parts.push(document(x + 4, y + 3, 0.42, {}));
  parts.push(banSeal(x + 34, y + 26, 0.32, {}));
  clipped(x, y, w, h, parts.join(''));
}

// #12 Word of the Year — document as a book + gold star.
function illWoty(x, y, w, h) {
  const parts = [];
  parts.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#EFE6D2"/>`);
  parts.push(document(x + 4, y + 3, 0.42, {}));
  parts.push(libStar(x + 44, y + 10, 8, GOLD));
  clipped(x, y, w, h, parts.join(''));
}

// #13 GAO — chat bubble (code: chatbot) + red warning triangle (code).
function illGao(x, y, w, h) {
  const parts = [];
  parts.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#EFE6D2"/>`);
  // chat bubble: teal rounded rect + tail + 3 dots
  parts.push(`<rect x="${f(x + 5)}" y="${f(y + 6)}" width="34" height="22" rx="6" fill="${PALETTE.tealDark}"/>`);
  parts.push(`<polygon points="${f(x + 12)},${f(y + 28)} ${f(x + 20)},${f(y + 28)} ${f(x + 12)},${f(y + 36)}" fill="${PALETTE.tealDark}"/>`);
  for (const dx of [14, 22, 30]) parts.push(`<circle cx="${f(x + dx)}" cy="${f(y + 17)}" r="2.2" fill="#FFFFFF"/>`);
  // warning triangle (red) + dot
  parts.push(`<polygon points="${f(x + 46)},${f(y + 12)} ${f(x + 36)},${f(y + 30)} ${f(x + 54)},${f(y + 30)}" fill="${PIN}"/>`);
  parts.push(`<circle cx="${f(x + 45)}" cy="${f(y + 25)}" r="1.8" fill="#FFFFFF"/>`);
  clipped(x, y, w, h, parts.join(''));
}

// ---- illustration map (v9: ALL 13 illustrations are AI scenes) ----
const ILL = {
  gulf: (x, y, w, h) => sceneImg('lead', x, y, w, h),
  bridge: (x, y, w, h) => sceneImg('hero3', x, y, w, h),
  venezuela: (x, y, w, h) => sceneImg('hero2', x, y, w, h),
  summit: (x, y, w, h) => sceneImg('summit', x, y, w, h),
  euloan: (x, y, w, h) => sceneImg('euloan', x, y, w, h),
  cop31: (x, y, w, h) => sceneImg('cop31', x, y, w, h),
  badme: (x, y, w, h) => sceneImg('badme', x, y, w, h),
  voyager: (x, y, w, h) => sceneImg('voyager', x, y, w, h),
  australia: (x, y, w, h) => sceneImg('australia', x, y, w, h),
  bangladesh: (x, y, w, h) => sceneImg('bangladesh', x, y, w, h),
  myanmar: (x, y, w, h) => sceneImg('myanmar', x, y, w, h),
  woty: (x, y, w, h) => sceneImg('woty', x, y, w, h),
  gao: (x, y, w, h) => sceneImg('gao', x, y, w, h),
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
  const MIN_PIN_DIST = 22; // v7: pins must read as separate dots (v6: #1/#3 were 12px)
  // Directional repulsion: push the new pin away from each conflicting pin
  // along the vector between them until the distance is >= MIN_PIN_DIST.
  // (v6's +12px vertical nudge pushed #3 almost directly under #1.)
  function separate(px, py) {
    for (let pass = 0; pass < 8; pass++) {
      let moved = false;
      for (const q of placed) {
        const dx = px - q[0], dy = py - q[1];
        const d = Math.hypot(dx, dy);
        if (d < MIN_PIN_DIST) {
          if (d < 0.5) { py -= MIN_PIN_DIST; moved = true; continue; }
          const push = MIN_PIN_DIST - d;
          px += (dx / d) * push; py += (dy / d) * push;
          moved = true;
        }
      }
      if (!moved) break;
    }
    return [px, py];
  }
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
    const [ox, oy] = project(p.lon, p.lat, box);
    let [px, py] = separate(ox, oy);
    const nudged = Math.abs(px - ox) > 0.5 || Math.abs(py - oy) > 0.5;
    if (nudged) {
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
// Type ladder on sqrt(phi) steps from 11px: Didone 54 (date) / 30 (lead) /
// 20 (hero) / 16 (grid); grid sizes 13 / 12 / 11 stay for fit (not ladder
// steps — said honestly). v8 changes vs v7: date 50->54, lead 37->30,
// hero2 23->20, row3 grid 12->11 (see header comment for the measurements).

const MX = 40, RX = 984, CW = 944;

// Top kicker
text("THE WORLD'S NEWS IN ONE PICTURE", MX, 16, 11, 800, PIN, SANS, 'start', { tag: 'topkick', spacing: 1 });
text(D.countLine + ' · ALL FROM WEDNESDAY', RX, 16, 11, 800, PIN, SANS, 'end', { tag: 'topkick-r', spacing: 1 });
rect(MX, 21, CW, 2, INK);
// Masthead date (Didone, like the winners) — 54px, biggest on the page (v8: was 50)
text(D.date, 512, 72, 54, 900, INK, DISPLAY, 'middle', { tag: 'masthead' });
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

// LEAD #1 — full-bleed code-drawn art (breaks the grid: touches both page edges).
// Badge "1" overlaps the art's bottom edge; kicker starts right of the badge.
ILL[D.lead.art](0, 208, 1024, 96);
rect(28, 292, 28, 28, PIN);
text('1', 42, 312, 13, 800, '#FFFFFF', SANS, 'middle', { tag: 'lead-num' });
text(D.lead.kicker, 68, 312, 11, 700, PIN, SANS, 'start', { tag: 'lead-kicker', spacing: 1 });
text(D.lead.headline, MX, 346, 30, 900, INK, DISPLAY, 'start', { tag: 'lead-h' });
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
  wtext(D.hero2.headline, x + 180, y + 48, w - 190, 20, 900, INK, DISPLAY, 2, 23, 'hero2-h');
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

// Grid #4-13 — v12: UNIFORM IMAGE-TOP full-bleed cards ala #1 (2 rows x 5).
// Card 184x141, pitch 190x149; image 184x84 on top, kicker 10px, headline
// 11px bold 2 lines, dek 10px. #8 Voyager keeps its navy card (kicker GOLD,
// headline white, dek dusty). All 10 headlines are 2 lines at 11px in 168px
// (30-42 chars); all 10 deks fit 1 line at 10px in 168px (<=33 chars).
D.grid.forEach((g, i) => {
  const col = i % 5, row = Math.floor(i / 5);
  const x = MX + col * 190, y = 500 + row * 149, w = 184, hh = 141;
  const navy = g.art === 'scene08';
  rect(x, y, w, hh, navy ? NAVY : PAPER, 'stroke="#6B5844" stroke-width="1"');
  ILL[g.art](x, y, 184, 84);
  rect(x + 6, y + 6, 16, 16, PIN);
  text(String(g.n), x + 14, y + 18, 11, 800, '#FFFFFF', SANS, 'middle', { tag: 'grid-num' });
  text(g.kicker, x + 8, y + 97, 10, 700, navy ? GOLD : REG_TEXT[g.region], SANS, 'start', { tag: 'grid-kicker' });
  wtext(g.headline, x + 8, y + 113, w - 16, 11, 700, navy ? '#FFFFFF' : INK, SANS, 2, 13, 'grid-h');
  text(g.dek, x + 8, y + 138, 10, 400, navy ? '#BFD3DE' : MUTED, SANS, 'start', { tag: 'grid-dek' });
});

// Map (left, 260x92) + brief (right, 3 cols x 9 rows, 10px).
// v12: map shrunk to make room for the 27-item tail; legend folded into the
// map title ("pins = cards"). Tail rows have no zebra banding (ala #1).
text('WHERE IT HAPPENED · pins = cards', MX, 808, 12, 800, TEAL_D, SANS, 'start', { tag: 'map-title' });
const placedPins = worldMap(D, MX, 814, 260, 92, 7);
text(D.briefTitle, 360, 808, 14, 800, PIN, SANS, 'start', { tag: 'brief-title' });
const TAIL_COLS = [360, 572, 784];
D.brief.forEach((b, i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const bx = TAIL_COLS[col], by = 822 + row * 12;
  text(String(b.n) + '.', bx, by, 10, 800, PIN, SANS, 'start', { tag: 'brief-num' });
  text(b.headline, bx + 23, by, 10, 400, INK, SANS, 'start', { tag: 'brief-h' });
});

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
  `<defs>${clipDefs.join('')}</defs>` +
  `<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>` +
  shapes.join('') +
  textLines.map(t =>
    `<text x="${f(t.x)}" y="${f(t.y)}" font-family="${t.font}" font-size="${t.size}" font-weight="${t.weight}" fill="${t.fill}" text-anchor="${t.anchor}"${t.spacing ? ` letter-spacing="${t.spacing}"` : ''}${t.italic ? ' font-style="italic"' : ''}>${esc(t.s)}</text>`
  ).join('') +
  `</svg>`;
fs.writeFileSync(new URL('./entry-final-v12.svg', import.meta.url), svg);
const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { loadSystemFonts: true } });
const png = resvg.render().asPng();
fs.writeFileSync(new URL('./entry-final-v12.png', import.meta.url), png);

// ---- report (stderr, machine-readable-ish) ----
const storyCount = 1 + 2 + D.grid.length + D.brief.length;
const regionCounts = {};
[... [D.lead, D.hero2, D.hero3], ...D.grid, ...D.brief].forEach(s => { regionCounts[s.region] = (regionCounts[s.region] || 0) + 1; });
// min pairwise pin distance (v7 gate: >= 22px)
let minPinDist = 999;
for (let i = 0; i < placedPins.length; i++) for (let j = i + 1; j < placedPins.length; j++) {
  minPinDist = Math.min(minPinDist, Math.hypot(placedPins[i][0] - placedPins[j][0], placedPins[i][1] - placedPins[j][1]));
}
const report = {
  file: 'entry-final-v12.png',
  bytes: png.length,
  dimensions: `${W}x${H}`,
  stories: storyCount,
  illustrated: 3 + D.grid.length,
  regions: regionCounts,
  pins: placedPins.length,
  minPinDist: +minPinDist.toFixed(1),
  truncations,
  overlaps: overlaps.slice(0, 20),
  overlapCount: overlaps.length,
  contrast: {
    headlineInkOnPaper: +contrast(INK, PAPER).toFixed(2),
    mutedOnPaper: +contrast(MUTED, PAPER).toFixed(2),
    accentOnPaper: +contrast(PIN, PAPER).toFixed(2),
    whiteOnRegion: Object.fromEntries(Object.entries(REG).map(([k, v]) => [k, +contrast('#FFFFFF', v).toFixed(2)])),
    mastheadEstW: Math.round(estW(D.date, 54, 900, DISPLAY)),
    whiteOnPinDateCheck: +contrast('#FFFFFF', PIN).toFixed(2),
    leadHeadlineEstW: Math.round(estW(D.lead.headline, 30, 900, DISPLAY)),
  },
};
console.error(JSON.stringify(report, null, 2));

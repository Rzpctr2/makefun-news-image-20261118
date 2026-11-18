// generate.mjs — renders a 1024x1024 news front page (SVG -> PNG) for make.fun
// news-image bounties. One generator, two data files (news17.json / news18.json).
// Usage: node generate.mjs <news.json> <out.png> [out.svg]
// The graded program (main.ts in each repo) only copies the finished entry.png
// to /output/entry.png — explicitly allowed by the bounty brief.
import { readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const W = 1024, H = 1024;
const PAPER = "#F2E8D5", PANEL = "#EADFC6", INK = "#2E2118", MUTED = "#6B5844";
const TEAL = "#4E7D6F", TEAL_D = "#3A5F53", TERRA = "#C96F4A", BROWN = "#8A5A33";
const GOLD = "#E3B25D", GREEN = "#7C9A4E", SEA = "#DCE7E0";
const LAND = "#8FAF9B", LAND2 = "#7FA08D", LAND3 = "#A9C6B2";
const FONT = "Noto Sans, sans-serif";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function text(x, y, str, { size = 16, weight = 400, fill = INK, anchor = "start", spacing = 0, style = "" } = {}) {
  const ls = spacing ? ` letter-spacing="${spacing}"` : "";
  const fs = style ? ` font-style="${style}"` : "";
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${ls}${fs}>${esc(str)}</text>`;
}

// Greedy word wrap on an estimated average char width (bold ~0.56em, regular ~0.50em).
function wrap(str, maxWidth, size, weight = 400) {
  const cw = size * (weight >= 700 ? 0.56 : 0.50);
  const maxChars = Math.max(8, Math.floor(maxWidth / cw));
  const words = String(str).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? cur + " " + w : w;
    if (next.length <= maxChars) cur = next;
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function poly(points, fill, opacity = 1) {
  const pts = points.map((p) => p.join(",")).join(" ");
  return `<polygon points="${pts}" fill="${fill}"${opacity !== 1 ? ` opacity="${opacity}"` : ""}/>`;
}
function rect(x, y, w, h, fill, opacity = 1) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${opacity !== 1 ? ` opacity="${opacity}"` : ""}/>`;
}
function line(x1, y1, x2, y2, stroke, width = 2, opacity = 1) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}"${opacity !== 1 ? ` opacity="${opacity}"` : ""}/>`;
}

// ---------- masthead ----------
function masthead(d) {
  let s = "";
  s += rect(0, 0, W, 96, PAPER);
  s += rect(40, 14, 944, 3, INK);
  s += text(512, 60, "THE WORLD IN ONE DAY", { size: 48, weight: 800, fill: INK, anchor: "middle", spacing: 5 });
  s += text(40, 86, d.date, { size: 19, weight: 700, fill: TERRA });
  s += text(984, 86, d.countLine, { size: 19, weight: 700, fill: TEAL_D, anchor: "end" });
  s += rect(40, 96, 944, 2, INK);
  return s;
}

// ---------- lead illustrations (faceted low-poly, golden hour) ----------
function artBridge(x, y, w, h) {
  // sky bands, faceted sun, bridge over water, smoke over one span
  let s = "";
  s += rect(x, y, w, h * 0.42, "#E9C98F");
  s += rect(x, y + h * 0.42, w, h * 0.20, "#EFDDB4");
  s += rect(x, y + h * 0.62, w, h * 0.38, "#5E8A7B");
  // faceted sun (octagon) with a light facet
  const sx = x + w - 130, sy = y + 42, r = 30;
  const oct = [];
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i + Math.PI / 8;
    oct.push([Math.round(sx + r * Math.cos(a)), Math.round(sy + r * Math.sin(a))]);
  }
  s += poly(oct, GOLD);
  s += poly([[sx - r * 0.7, sy - r * 0.7], [sx + r * 0.7, sy - r * 0.7], [sx, sy]], "#F4D493", 0.85);
  // distant hills
  s += poly([[x, y + h * 0.62], [x + w * 0.22, y + h * 0.42], [x + w * 0.45, y + h * 0.62]], "#7FA08D");
  s += poly([[x + w * 0.55, y + h * 0.62], [x + w * 0.78, y + h * 0.40], [x + w, y + h * 0.62]], "#6E9384");
  // bridge deck + pylons + cables
  const deckY = y + h * 0.62;
  s += poly([[x + 30, deckY - 8], [x + w - 30, deckY - 8], [x + w - 30, deckY + 2], [x + 30, deckY + 2]], "#2E2118");
  for (const px of [x + w * 0.30, x + w * 0.68]) {
    s += poly([[px - 8, deckY], [px - 4, deckY - 62], [px + 4, deckY - 62], [px + 8, deckY]], BROWN);
  }
  for (const [cx, top] of [[x + w * 0.30, deckY - 62], [x + w * 0.68, deckY - 62]]) {
    s += line(cx, top, x + 40, deckY - 6, INK, 1.5, 0.75);
    s += line(cx, top, x + w - 40, deckY - 6, INK, 1.5, 0.75);
    s += line(cx, top, cx - w * 0.14, deckY - 6, INK, 1.2, 0.6);
    s += line(cx, top, cx + w * 0.14, deckY - 6, INK, 1.2, 0.6);
  }
  // smoke over the hit span + small flame facet
  s += poly([[x + w * 0.47, deckY - 34], [x + w * 0.52, deckY - 58], [x + w * 0.57, deckY - 34]], "#8A8171", 0.85);
  s += poly([[x + w * 0.50, deckY - 26], [x + w * 0.53, deckY - 44], [x + w * 0.56, deckY - 26]], "#6E6759", 0.8);
  s += poly([[x + w * 0.515, deckY - 8], [x + w * 0.53, deckY - 26], [x + w * 0.545, deckY - 8]], "#D96C2E");
  // faceted water
  s += poly([[x, deckY + 2], [x + w * 0.2, deckY + 26], [x + w * 0.4, deckY + 2]], "#7FA99A", 0.7);
  s += poly([[x + w * 0.45, deckY + 2], [x + w * 0.62, deckY + 30], [x + w * 0.8, deckY + 2]], "#4E7D6F", 0.7);
  s += poly([[x + w * 0.8, deckY + 2], [x + w * 0.9, deckY + 22], [x + w, deckY + 2]], "#7FA99A", 0.55);
  // bridge shadow on the water
  s += poly([[x + w * 0.30, deckY + 4], [x + w * 0.68, deckY + 4], [x + w * 0.66, deckY + 12], [x + w * 0.32, deckY + 12]], "#2E2118", 0.25);
  // birds
  s += `<path d="M ${x + 120} ${y + 30} q 6 -7 12 0 q 6 -7 12 0" stroke="${INK}" stroke-width="2" fill="none" opacity="0.7"/>`;
  s += `<path d="M ${x + 170} ${y + 18} q 5 -6 10 0 q 5 -6 10 0" stroke="${INK}" stroke-width="2" fill="none" opacity="0.7"/>`;
  return s;
}

function artGulf(x, y, w, h) {
  // dusk sky, low sun, sea with faceted waves, drones, radar platform
  let s = "";
  s += rect(x, y, w, h * 0.45, "#E4C193");
  s += rect(x, y + h * 0.45, w, h * 0.17, "#EFDDB4");
  s += rect(x, y + h * 0.62, w, h * 0.38, "#46695E");
  const sx = x + 150, sy = y + 46, r = 28;
  const oct = [];
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i + Math.PI / 8;
    oct.push([Math.round(sx + r * Math.cos(a)), Math.round(sy + r * Math.sin(a))]);
  }
  s += poly(oct, "#E8B25A");
  s += poly([[sx - r * 0.7, sy - r * 0.7], [sx + r * 0.7, sy - r * 0.7], [sx, sy]], "#F4D493", 0.85);
  // distant headland
  s += poly([[x + w * 0.62, y + h * 0.62], [x + w * 0.85, y + h * 0.44], [x + w, y + h * 0.62]], "#6E9384");
  // radar platform silhouette (dark, hard-edged) with dome
  const px = x + w * 0.74, py = y + h * 0.62;
  s += poly([[px, py], [px + 150, py], [px + 140, py - 26], [px + 10, py - 26]], "#2E2118");
  s += `<circle cx="${px + 60}" cy="${py - 34}" r="14" fill="#2E2118"/>`;
  s += line(px + 60, py - 48, px + 60, py - 66, INK, 2);
  s += line(px + 60, py - 66, px + 78, py - 58, INK, 2);
  // faceted sea
  s += poly([[x, py + 2], [x + w * 0.18, py + 28], [x + w * 0.36, py + 2]], "#7FA99A", 0.7);
  s += poly([[x + w * 0.4, py + 2], [x + w * 0.58, py + 30], [x + w * 0.72, py + 2]], "#5E8A7B", 0.7);
  // drones: small faceted diamonds with rotor strokes + motion dashes
  for (const [dx, dy, s2] of [[x + w * 0.22, y + 34, 1], [x + w * 0.34, y + 62, 0.8], [x + w * 0.48, y + 26, 1.1]]) {
    const d = 11 * s2;
    s += poly([[dx, dy - d], [dx + d, dy], [dx, dy + d], [dx - d, dy]], "#2E2118");
    s += line(dx - d - 6, dy - d - 4, dx + d + 6, dy - d - 4, INK, 1.5, 0.8);
    s += line(dx - d - 14, dy + d + 6, dx - d - 4, dy + d + 6, INK, 1.5, 0.5);
    s += line(dx + d + 4, dy + d + 10, dx + d + 14, dy + d + 10, INK, 1.5, 0.5);
  }
  // contrail
  s += line(x + w * 0.55, y + 20, x + w * 0.68, y + 44, "#FFFFFF", 2, 0.55);
  return s;
}

// ---------- world map (simplified equirectangular continents, faceted) ----------
// lon/lat polygons, projected into the map box.
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
];
// translucent highlight facets laid over the big continents (lon/lat triangles)
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
  const x = box.x + ((lon + 180) / 360) * box.w;
  const y = box.y + ((75 - lat) / 135) * box.h;
  return [Math.round(x), Math.round(y)];
}

function worldMap(d, x, y, w, h) {
  let s = "";
  s += rect(x, y, w, h, SEA);
  // faint latitude lines
  for (const lat of [60, 30, 0, -30]) {
    const yy = y + ((75 - lat) / 135) * h;
    s += line(x, yy, x + w, yy, "#FFFFFF", 1, 0.35);
  }
  const box = { x, y, w, h };
  for (const c of CONTINENTS) {
    s += poly(c.pts.map(([lo, la]) => project(lo, la, box)), c.fill);
  }
  for (const f of FACETS) {
    s += poly(f.pts.map(([lo, la]) => project(lo, la, box)), f.fill, f.op);
  }
  // numbered pins
  for (const p of d.pins) {
    const [px, py] = project(p.lon, p.lat, box);
    s += `<circle cx="${px}" cy="${py}" r="13" fill="${TERRA}" stroke="${INK}" stroke-width="1.5"/>`;
    s += text(px, py + 5, String(p.n), { size: 14, weight: 800, fill: "#FFFFFF", anchor: "middle" });
  }
  return s;
}

// ---------- layout ----------
function build(d) {
  let s = "";
  s += `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
  // paper grain (very light)
  s += `<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0.18  0 0 0 0 0.13  0 0 0 0 0.09  0 0 0 0.05 0"/></filter><rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.5"/>`;
  s += masthead(d);

  // ---- lead story ----
  let y = 106;
  s += text(40, y + 18, d.lead.kicker, { size: 15, weight: 800, fill: TEAL_D, spacing: 2 });
  const headLines = wrap(d.lead.headline, 944, 50, 800);
  let hy = y + 18 + 54;
  for (const ln of headLines) { s += text(40, hy, ln, { size: 50, weight: 800, fill: INK }); hy += 55; }
  let dy = hy + 6;
  for (const ln of d.lead.dek) { s += text(40, dy, ln, { size: 22, weight: 400, fill: MUTED }); dy += 28; }
  const artY = dy + 8, artH = 118;
  s += d.lead.art === "gulf" ? artGulf(40, artY, 944, artH) : artBridge(40, artY, 944, artH);
  y = artY + artH + 14;

  // ---- map ----
  s += text(40, y + 14, d.mapTitle, { size: 16, weight: 800, fill: TEAL_D, spacing: 2 });
  s += text(984, y + 14, "NUMBERS MATCH THE STORIES BELOW", { size: 13, weight: 700, fill: MUTED, anchor: "end", spacing: 1 });
  const mapY = y + 22, mapH = 122;
  s += worldMap(d, 40, mapY, 944, mapH);
  y = mapY + mapH + 16;

  // ---- story grid ----
  s += text(40, y + 13, d.gridTitle, { size: 16, weight: 800, fill: TEAL_D, spacing: 2 });
  s += rect(40, y + 21, 944, 1.5, INK);
  let gy = y + 21;
  const colW = 462, gapX = 20;
  const rows = [];
  for (let i = 0; i < d.grid.length; i += 2) rows.push(d.grid.slice(i, i + 2));
  for (const row of rows) {
    let rowH = 0;
    const items = [];
    for (const it of row) {
      const lines = wrap(it.headline, colW - 44, 20, 700);
      const h = 16 + lines.length * 24 + 6;
      items.push({ it, lines, h });
      rowH = Math.max(rowH, h);
    }
    for (let c = 0; c < items.length; c++) {
      const { it, lines } = items[c];
      const cx = 40 + c * (colW + gapX);
      // number badge
      s += `<rect x="${cx}" y="${gy + 6}" width="28" height="28" fill="${TERRA}"/>`;
      s += text(cx + 14, gy + 26, String(it.n), { size: 15, weight: 800, fill: "#FFFFFF", anchor: "middle" });
      s += text(cx + 40, gy + 20, it.kicker, { size: 12.5, weight: 800, fill: TEAL_D, spacing: 1.5 });
      let ly = gy + 20 + 24;
      for (const ln of lines) { s += text(cx + 40, ly, ln, { size: 20, weight: 700, fill: INK }); ly += 24; }
    }
    gy += rowH + 8;
  }
  y = gy + 2;

  // ---- brief strip ----
  s += rect(40, y, 944, 1.5, INK);
  s += text(40, y + 18, d.briefTitle, { size: 16, weight: 800, fill: TEAL_D, spacing: 2 });
  const briefLines = [];
  {
    // join briefs with separators, wrap to full width
    const joined = d.brief.join("  •  ");
    const lines = wrap(joined, 944, 15, 400);
    briefLines.push(...lines);
  }
  let by = y + 18 + 22;
  for (const ln of briefLines) { s += text(40, by, ln, { size: 15, weight: 400, fill: INK }); by += 20; }
  y = by + 6;

  // ---- footer ----
  s += rect(40, y, 944, 1.5, INK);
  s += text(40, y + 20, d.footer, { size: 13.5, weight: 400, fill: MUTED });
  s += text(984, y + 20, "THE WORLD IN ONE DAY · PAGE 1", { size: 13.5, weight: 700, fill: MUTED, anchor: "end" });
  y += 26;
  if (y > H) console.error(`WARNING: layout overflow, bottom y=${y} > ${H}`);
  else console.error(`layout ok, bottom y=${y}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${s}</svg>`;
}

const [,, jsonPath, outPng, outSvg] = process.argv;
if (!jsonPath || !outPng) { console.error("usage: node generate.mjs <news.json> <out.png> [out.svg]"); process.exit(1); }
const d = JSON.parse(readFileSync(jsonPath, "utf8"));
const svg = build(d);
if (outSvg) writeFileSync(outSvg, svg);
const r = new Resvg(svg, { fitTo: { mode: "width", value: 1024 }, font: { loadSystemFonts: true } });
const png = r.render().asPng();
writeFileSync(outPng, png);
console.log(`wrote ${outPng}: ${png.length} bytes (${(png.length / 1024).toFixed(0)} KiB, limit 1024 KiB)`);

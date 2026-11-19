// News Image entry (v13 resubmit): copies the rebuilt front page to /output/entry.png.
// The image (entry-final-v13.png, 1024x1024 PNG, 306035 bytes < 1 MiB) was rendered
// in-session by generate-final-v13.mjs (Node + @resvg/resvg-js) from the verified news
// data in news-v13.json (30 stories, 18 Nov 2026). Status chips CONFIRMED/CLAIM + source
// on all 13 cards, HOW SURE legend, DATE CHECK 15 dated items, sourced stat strip.
// Grid cards are image-top full-bleed with AI scenes from scenes-ai/v13/
// (lead/hero2 re-quantized to q12, 10 grid scenes byte-identical v12).
// Map, typography and layout stay code-drawn. The 13 AI JPGs in assets-ai/crop/
// remain only as a per-card fallback the generator loads at build time.
// This entrypoint is deterministic (a byte copy), runs offline, and writes
// the same bytes on every run.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync("/output", { recursive: true });
copyFileSync(join(here, "entry-final-v13.png"), "/output/entry.png");

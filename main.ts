// News Image entry (v12 resubmit): copies the rebuilt front page to /output/entry.png.
// The image (entry-final-v12.png, 1024x1024 PNG, 306002 bytes < 1 MiB) was rendered
// in-session by generate-final-v12.mjs (Node + @resvg/resvg-js) from the verified news
// data in news-v12.json (40 stories, 18 Nov 2026). Grid cards are image-top full-bleed
// with AI scenes from scenes-ai/v12/ (13 illustrations: lead/hero2/hero3 byte-identical
// to v11, 10 grid scenes incl. 3 literal remakes). Map, typography and layout stay
// code-drawn. The 13 AI JPGs in assets-ai/crop/ remain only as a per-card fallback the
// generator loads at build time.
// This entrypoint is deterministic (a byte copy), runs offline, and writes
// the same bytes on every run.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync("/output", { recursive: true });
copyFileSync(join(here, "entry-final-v12.png"), "/output/entry.png");

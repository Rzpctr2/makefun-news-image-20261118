// News Image entry (v6 resubmit): copies the rebuilt front page to /output/entry.png.
// The image (entry-v6.png, 1024x1024 PNG, 657098 bytes < 1 MiB) was rendered
// in-session by generate-v6.mjs (Node + @resvg/resvg-js) from the verified news
// data in news-v2.json (31 stories, 18 Nov 2026) plus 13 flat AI illustrations
// in assets-ai/crop/ (composited as data URIs); map, typography and layout stay
// code-drawn. This entrypoint is deterministic (a byte copy), runs offline, and
// writes the same bytes on every run.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync("/output", { recursive: true });
copyFileSync(join(here, "entry-v6.png"), "/output/entry.png");

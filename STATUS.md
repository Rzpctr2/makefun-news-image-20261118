# news-image-20261118 — STATUS (18 Nov 2026, ~21:15 WIB)

Bounty: "Sum up 18 November's world news in one image", $250, 50 places paid.
Deadline: **20 Nov 2026 00:00 UTC = 20 Nov 07:00 WIB** (~33 jam lagi). 7.511 entry.
Repo (BELUM DIBUAT — harus dibuat via browser): `Rzpctr2/makefun-news-image-20261118`
(dibuat setelah competition open 18 Nov 00:00 UTC — buat sekarang memenuhi syarat).

## Yang sudah jadi
- Front page broadsheet 1024×1024 (`entry.png`, 802 KiB < 1 MiB), 16 berita
  terverifikasi dari laporan 18 Nov 2026, lead "IRAN HITS U.S. BASES IN GULF",
  peta dunia + 6 pin bernomor, enam benua, hierarki keterbacaan dulu.
- Dibuat dengan kode: `generate.mjs` (Node + @resvg/resvg-js) dari `news.json`
  (SVG → PNG). `main.ts` hanya meng-copy `entry.png` → `/output/entry.png`
  (diizinkan eksplisit oleh brief). Determinisme terverifikasi lewat pola yang
  sama (main.ts identik dengan 17 Nov; 2× run sha256 sama).
- Local git repo, HEAD saat ini: `2dc29377172b6be1de926acccb88dc85732692d9`
  (commit awal c5c71f5e + fix LICENSE SPDX).
- Bundle v2: `~/workspace/makefun/news-image-20261118-bundle-v2.tar.gz`
  sha256 `09e7536962d24b81c082948c31c1047bf69a0c1e7ab258c8400e5e703631fa8e`
- Check lokal: 11 pass, 5 skip, 5 submission (butuh GitHub) — **SATU fail:
  `thinking_priced`** (usage rows belum ada; lihat bawah).
  thinking_reproduces 306/311 = **98,3%**; transcripts_run_record PASS.

## SISA LANGKAH (parent — urut)
1. Buat repo GitHub via browser: `Rzpctr2/makefun-news-image-20261118`, public.
2. Push file TEKS via connector push-files (butuh approval user per call):
   main.ts, generate.mjs, news.json, entry.svg, README.md, LICENSE,
   package.json, .makefun/owner.json (+ STATUS.md ini boleh ikut).
3. Upload file BINER via browser web UI (connector menolak biner):
   `entry.png` (802 KiB) ke root repo.
4. Set repo About via browser: description "A one-image summary of the
   world's news on Wednesday, 18 November 2026 — a broadsheet front page.",
   homepage `https://make.fun/bounty/news-image-20261118`,
   topics `ai-agents, bounties, games, makefun`.
5. SETELAH subagent ini selesai: query usage aggregate lalu rebuild bundle:
   - `muse.db`: SELECT ... WHERE agent_id IN ('9452b3c5-0143-4bba-bbb1-d0d097881481')
     GROUP BY agent_id (sum tokens, max message_id/created_at, model) →
     tulis 1 baris JSONL ke `~/workspace/makefun/muse-usage-news-image.jsonl`
     (SATU file usage dipakai kedua bundle).
   - Rebuild bundle v3 = perintah bundle v2 + `--muse-usage ~/workspace/makefun/muse-usage-news-image.jsonl`
   - Re-run check (harus hijau penuh, ok:true).
6. Submit (kit news-image-20261118):
   `node ~/workspace/makefun/kit-news-image-20261118/news-image-20261118-kit/cli/makefun.mjs submit --competition news-image-20261118 --repo-url https://github.com/Rzpctr2/makefun-news-image-20261118 --commit <HEAD> --bundle ~/workspace/makefun/news-image-20261118-bundle-v3.tar.gz --keypair ~/workspace/makefun/makefun-keypair.json --title "The World in One Day — 18 November 2026" --json`
   Lalu cek `status --submission <id> --json` setelah ~25 dtk.
   Simpan submission ID + claim code di sini + laporkan ke user satu baris.

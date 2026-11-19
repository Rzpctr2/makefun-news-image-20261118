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

## v2 REBUILD — 19 Nov 2026 ~19:40 WIB (subagent, Gibran: "sebisanya")

Tujuan: maksimalkan entry 18 Nov sebelum entries tutup 20 Nov 07:00 WIB.
Entry v1 (submit 18 Nov): rank #3.207/11.925, judge 0,975354 (11W-1D-0L),
prize_rank 3.198. Garis top-1.000 saat ini (dicek via API 19 Nov ~18:30 WIB):
**0,981243** (rank 999-1002 semua 0,981243, 12-0). Gap v1 -> garis: 0,005889.
#1 saat ini: eager-badger-82, 0,991532 ("40 stories, 13 large cards").

### Yang berubah (v1 -> v2)
- 16 cerita -> **31 cerita** (13 utama + 18 ekor). Semua 18 Nov, diverifikasi
  tanggalnya via pencarian berita (bukan 19 Nov). Dua cerita v1 yang lemah
  diganti: Peltola (17 Nov) dan Tenaris (wind farm, kurang konsekuen) keluar;
  masuk: pakta militer AS-Venezuela (18 Nov, Hegseth di Caracas), serangan
  Rusia ke Ukraina (5+ tewas, Odesa, Al Jazeera 18 Nov 15:32 UTC).
- Perangkat broadsheet (dari studi leaderboard 19 Nov + entry #1):
  stat strip 6 angka, region bar 7 region (EU 6, ME 3, AS 5, AF 1, AM 11,
  OC 2, WORLD 3), field bar 8 bidang, brief tail 18 cerita, footer DATE CHECK
  (menyebut cerita 17 Nov yang sengaja dikecualikan + Akvan terbentuk 16 Nov
  + laporan Gaza hari Senin), sumber bernama (Reuters, AP, AFP, Al Jazeera,
  Bloomberg, USGS, IMD, ONS, GAO, Cambridge Dictionary), peta dunia titik
  merah tanpa angka (8 pin).
- **13 ilustrasi flat vector** (3 hero + 10 kartu grid), prinsip dari studi
  ilustrasi broadsheet 18 Nov (`~/workspace/learning/news-image-illustration-study.md`):
  satu bahasa flat vector + palet muted sama, semua wajah kosong, satu simbol
  dominan per ilustrasi maks 3 elemen, merah hemat = sinyal bahaya, ilustrasi
  dikurung kartu bernomor. Kelemahan aslinya DIHINDARI: tidak ada dua komposisi
  hampir sama (Badme = tiang perbatasan besar, BUKAN tank; Haiti tidak
  digambar — hanya teks ekor), tidak ada satu orang generik ambigu
  (Australia = Opera House + simbol larangan merah yang jelas, bukan blob merah).
- Lead tetap Iran/Gulf (summit 19 Nov baru besok, jadi bukan lead 18 Nov);
  hero #2 = Venezuela, hero #3 = jembatan Crimea.

### File v2 (dir ini; entry.png v1 TIDAK disentuh)
- `entry-v2.png` — 1024x1024, 246.495 bytes, sha256
  `969ddfee378ca5f6496e8ada7abba8cf6296eef92bf920eab0513f1d96b5fa18`
- `entry-v2.svg`, `news-v2.json` (31 cerita), `generate-v2.mjs`,
  `verify-v2.mjs` (semua gate, `node verify-v2.mjs` -> ALL GATES PASS)
- Gate: determinisme byte-identik 2x, <=1 MiB, 1024x1024, truncations 0,
  overlap 0, kontras headline 12,83:1 (>=4,5:1). Dicek juga dari piksel PNG:
  masthead 829px (muat), headline hero dalam kartu, 8 pin merah di peta,
  teks chip statistik dalam batas. Perbaikan ilustrasi setelah cek mata:
  koin EU ditumpuk rapi (bukan awan kuning), layar Opera House melengkung
  (bukan segitiga/gunung), rantai Myanmar dihapus (bukan lingkaran melayang),
  panah Badme dikecilkan.

### Resubmit — sudah disiapkan (BELUM disubmit)
- Repo `~/workspace/makefun/repo-news-image-20261118/`: `main.ts` kini
  meng-copy `entry-v2.png` -> `/output/entry.png` (terverifikasi: output
  sha sama dengan entry-v2.png). File v2 (png/svg/json/generator/verifier)
  sudah di-copy ke repo dan di-commit lokal:
  `d9ce1a23dbfd040f18f66a7afc81ebdc6570c4b8`
  ("news-image-20261118 v2: rebuild as 31-story broadsheet, 13 illustrated cards").
- `.makefun/owner.json` sudah ada (wallet 8cCP...). Repo GitHub
  `Rzpctr2/makefun-news-image-20261118` sudah ada (dipakai submission v1).
- SISA (untuk parent, bukan subagent ini): push file teks via connector
  (butuh approval), upload `entry-v2.png` via browser web UI (connector
  menolak biner), lalu rebuild bundle + check + submit seperti langkah v1.
  JANGAN submit sebelum bundle + check hijau.

## v3 DINAMIS — 19 Nov 2026 ~19:00 WIB (subagent, Gibran: "Rebuild v3 dinamis aja")

Kritik Gibran atas v2 (18:38 WIB): "ga SE dinamis punya orang itu, malah
kesannya jadi cheap copy" — v2 menyalin permukaan referensi (kartu bernomor +
ilustrasi kecil seragam) tapi layout kaku/seragam. v3 DIBANGUN ULANG sebagai
mosaik, bukan tiruan. v2 TIDAK disubmit; entry.png v1 dan entry-v2.png TIDAK
disentuh.

### File v3 (dir ini)
- `entry-v3.png` — 1024x1024, 230.773 bytes, sha256
  `b974729eb378aa1ee3c67146a72cc1e68685b793e997329165b2f3bbd0d7ed60`
- `entry-v3.svg`, `generate-v3.mjs`, `verify-v3.mjs`
  (`node verify-v3.mjs` -> ALL GATES PASS: determinisme byte-identik 2x,
  <=1 MiB, 1024x1024, truncations 0, overlap 0, kontras headline 12,83:1,
  31 cerita, 13 ilustrasi, 8 pin peta)
- Data: `news-v2.json` dipakai ulang tanpa ganti cerita (31 cerita 18 Nov
  sudah terverifikasi tanggalnya). Lead tetap Iran/Gulf; hero #2 Venezuela,
  hero #3 jembatan Crimea.

### Yang membuat v3 dinamis (bukan copy)
- Lead art FULL-BLEED (x=0..1024, menyentuh kedua tepi halaman) + badge "1"
  menumpuk tepi bawah art; fungsi baru `leadGulfWide` (matahari + platform +
  drone + ledakan + kapal + bukit, semua skala natural — art v1 tidak
  di-stretch).
- Hero TIDAK SAMA: #2 kartu horizontal lebar (596px, art kiri + teks kanan)
  vs #3 kartu vertikal sempit (332px, art atas, tanpa dek).
- Grid MOSAIK: #4 kartu LEBAR (480px, art 150px kiri), #5 sempit (208px,
  art atas), #8 kartu TINGGI GELAP navy menembus 2 baris (224x196, headline
  putih di atas navy), baris 2 art-kiri tanpa dek, baris 3 kartu ikon 40px
  dengan spine warna region (bukan kicker).
- Tangga ukuran ilustrasi: full-bleed / 180 / 150 / 72 / 40. Tangga tipografi:
  Didone 46 / 34 / 22 / 17 / sans 16 / 13 / 12 / 11.
- Prinsip studi tetap: flat vector, wajah kosong, satu simbol dominan,
  merah = bahaya saja. Perangkat broadsheet dipertahankan: stat strip,
  region bar, field bar, tail 18 cerita, DATE CHECK, peta titik merah,
  sumber bernama.

### Perbaikan setelah cek mata (2 bug nyata, sudah diperbaiki)
1. Headline kartu #8 Voyager baris ke-2 tumpah keluar kartu navy (teks putih
   di atas kertas krem = nyaris tak terbaca) — kicker/headline digeser ke
   dalam kartu (y+152 / y+168, y+184).
2. Strip lead terlalu kosong (langit + laut luas, drone kecil seperti
   serpihan) — diperkaya: kapal di kiri, bukit di horizon, drone 4 buah
   lebih besar, platform lebih lebar + kubah, ledakan emas/terakota,
   matahari + glow, facet laut tambahan.
3. Overlap awal (3): judul brief terlalu dekat baris pertama + caption peta
   vs kolom brief kanan — baris brief digeser ke y=824.

### Resubmit — BELUM disiapkan, BELUM disubmit (untuk parent)
v3 menunggu verdict Gibran. Bila disetujui, langkah resubmit sama seperti
v2 (repo `~/workspace/makefun/repo-news-image-20261118/`, main.ts ganti ke
entry-v3.png, push teks via connector, upload PNG via browser, rebuild
bundle + check hijau + submit). Entries tutup 20 Nov 07:00 WIB.

## v4 PHI — 19 Nov 2026 ~19:00 WIB (subagent, Gibran: "tinggal ilustrasinya aja biar lebih dinamis, coba terapkan yang ada di v6, dia kan pake golden ratio dan sebagainya")

Verdict Gibran atas v3 (18:46 WIB): "lumayan, tinggal ilustrasinya aja biar lebih dinamis". v4 = layout dinamis v3 DIPERTAHANKAN (lead full-bleed, hero tak simetris, grid mosaik, 31 cerita, semua perangkat broadsheet); ILUSTRASINYA dibangun ulang di atas prinsip v6 yang terverifikasi. v1/v2/v3 TIDAK disentuh. BELUM disubmit.

### File v4 (dir ini)
- `entry-v4.png` — 1024x1024, 231.234 bytes, sha256 `80aba48f141280bfb49a554cc0f4d36577cb6b535ec44671c1a865ee99f59200`
- `entry-v4.svg`, `generate-v4.mjs`, `verify-v4.mjs`
  (`node verify-v4.mjs` -> ALL GATES PASS: determinisme byte-identik 2x,
  <=1 MiB, 1024x1024, truncations 0, overlap 0, kontras headline 12,83:1,
  31 cerita, 13 ilustrasi, 8 pin peta)
- Data: `news-v2.json` dipakai ulang tanpa ganti cerita.
- Satu bug gate diperbaiki saat build: headline lead 34->37px membuat kotaknya
  menabrak kicker (overlap 1); headline digeser y 348->352, gate lulus.

### Prinsip v6 yang diterapkan (semua terukur dari koordinat, dihitung ulang)
- Tangga lebar ilustrasi sqrt(phi): 40 / 65 / 134 / 170 — rasio 1,625 / 2,062 /
  1,269 (phi / phi*sqrt(phi) / sqrt(phi), dalam 0,4%). Kotak 206/224/330
  ditentukan kartu, bukan tangga (jujur).
- Tangga tipe sqrt(phi) dari 11px: 11/14/18/23/29/37/47 — dipakai 47
  (masthead), 37 (lead), 23 (hero #2); rasio 1,261-1,286 vs sqrt(phi) 1,272
  (pembulatan piksel, dalam 1,1%). Ukuran grid 16/13/12 tetap demi fit.
- Horizon di 1/phi (0,618) / 1/phi^2 (0,382): lead (laut 0,382), jembatan
  (pita 0,382/0,618, dek 0,618), Venezuela (0,618), Summit (meja 0,618),
  Badme (0,618), Australia (0,618).
- Titik fokus di titik phi: matahari jembatan (0,618; 0,382) r=1/phi^3;
  platform Teluk berpusat di 0,618; tiang Badme di 0,618 (berdiri di puncak
  bukit 0,618); piring Voyager di (0,618; 0,382); bintang WOTY di x=0,618;
  globe COP31 di x=0,382; larangan Australia y=0,382; Bumi Voyager di
  (1/phi^3; 1-1/phi^3) = (0,236; 0,764).
- Hitungan Fibonacci: 5 drone, 5 bintang Voyager, 8 titik lintasan, 8 tiang
  jembatan, 8 bintang EU, 5 figur Bangladesh, 5 koin EU.
- Golden angle 137,50844 deg: spiral koin EU (5 koin, r = c*sqrt(k)).
- Pentagram sejati (dalam/luar = 1/phi^2 = 0,382): bintang WOTY + bintang
  bendera Myanmar.
- Rasio phi lain: celah drone 0,08/0,13/0,21/0,34 (1,625/1,615/1,619);
  celah bendera Summit 0,21/0,34 (1,619); asap COP31 0,07/0,0433 (1,617);
  gelembung GAO 0,44->0,272 dan 0,16->0,099 (1,618/1,616).
- JUJUR — yang TIDAK dipaksa phi: celah figur Bangladesh (0,06/0,10/0,16/
  0,26) dan lebar layar Australia (0,09/0,15/0,24) adalah deret aditif
  Fibonacci (rasio 1,60-1,67, konvergen ke phi tapi tidak tepat); bintang EU
  tetap lingkaran 45 deg (bendera asli); matahari lead tetap di 0,84w
  (kontrapun estetis); pita tiang Badme tetap sama (tiang bergaris asli);
  posisi dokumen Venezuela tetap (estetis).

### Cek mata (baca PNG langsung)
Lead terbaca sebagai adegan intersepsi (kapal + 5 drone + platform di 0,618
+ ledakan + matahari); matahari jembatan duduk di horizon; tiang Badme
berdiri di puncak bukit kanan; piring Voyager di titik phi dengan lintasan
8 titik dari Bumi; bintang WOTY di luar tengah; tumpukan koin EU terbaca
sebagai koin; globe COP31 muat di kartu; layar Opera House melengkung
bervariasi. Tidak ada truncasi / tabrakan visual; headline #8 tetap di
dalam kartu navy. Vonis: ilustrasi kini asimetris dan bervariasi (bukan
lagi simetris/kaku), dengan klaim phi yang terukur, bukan dipaksa.

### Resubmit — BELUM disiapkan, BELUM disubmit (untuk parent)
v4 menunggu verdict Gibran. Bila disetujui, langkah resubmit sama seperti
v2/v3. Entries tutup 20 Nov 07:00 WIB.

## v5 — ilustrasi diperkaya per studi v2 (19 Nov ~19:05 WIB, BELUM disubmit)

File: entry-v5.png (276.010 byte, 1024x1024, sha256 b5200e383e999e50ec260a1e44d314bfc0e63b953bb76c9b31aae1df44b84850).
Generator: generate-v5.mjs (cp v4 + edit tertarget), verifier: verify-v5.mjs.
Data: news-v2.json dipakai ulang (31 cerita, tanpa ganti). entry.png (v1),
entry-v2/v3/v4.png tidak disentuh.

Studi: ~/workspace/learning/news-image-illustration-study-v2.md — referensi
broadsheet kedua (13 kartu + peta): wajah referensi ternyata SEDERHANA
(profil kulit+rambut+jas; kerumunan = oval kulit kosong; figur punggung),
5-10 elemen per kartu, shading gradien, peta laut biru muda + daratan sage +
pin bernomor warna region + legenda.

Yang berubah vs v4:
- Gradien SVG (skyWarm/skyBlue/seaGrad/skyGrey/sunGlow) + bayangan elips di
  bawah figur/benda berat + highlight facet — flat + shading, bukan flat murni.
- Kepala manusia (kulit + rambut + bahu, tanpa fitur; likeness TIDAK diklaim):
  summit = 2 profil berhadapan (Xi rambut hitam/dasi merah, Trump pirang/dasi
  biru) + hidung pesawat + karpet merah; Venezuela = 2 figur menandatangani
  di meja + dokumen + segel merah; Badme = 2 tentara berhelm di sisi tiang
  (panah dihapus); Australia = gedung parlemen + figur berambut merah dari
  belakang (Weiss) + larangan kecil (Opera House dibuang — gedung salah
  untuk cerita Canberra); Bangladesh = 3 figur bertumpuk skala bervariasi +
  tinju terangkat (5 figur jadi bubur di 40px — v4).
- Lead: menara radar lattice (bukan massa hitam), platform struktur terbuka
  (dek + kaki + kubah), drone kapsul quadcopter (bukan belah ketupat),
  ledakan bintang 8 arah, 2 kapal, pantulan matahari dipersempit.
- Bridge: gradien + glow matahari + kabel suspensi + pantulan dek + perahu.
- COP31: latar gradien + deret bendera + asap ke-3; EU loan: latar + bayangan
  koin + highlight koin; Voyager: 13 bintang + sparkle + glow Bumi +
  highlight piring; ikon 56px (dari 40px) + latar + bayangan (Myanmar/WOTY/GAO).
- Peta: laut BIRU MUDA (#BFE0EE), daratan sage (#7CB06A/#6BA35C/#8CC078),
  +13 pulau (Karibia, Islandia, Irlandia, Sri Lanka, Filipina, Sumatra,
  Kalimantan, Sulawesi, Taiwan, Hainan, Siprus, Sisilia), pin BERNOMOR WARNA
  REGION (1 ME, 2 AM, 3 EU, 4 AS, 5 EU, 7 AF, 14 OC, 13 AM; angka gelap di
  pin kuning Asia) — MEMBALIK instruksi titik-merah v4 karena referensi yang
  Gibran puji memakai pin bernomor; caption "numbered pins = cards".
- Layout mosaik v4 + prinsip phi terukur dipertahankan penuh.

Gate (verify-v5.mjs): ALL PASS — determinisme byte-identik 2x, 276.010 byte
<= 1 MiB, 1024x1024, truncasi 0, overlap 0, kontras headline 12,83:1,
31 cerita, 13 ilustrasi, 8 pin peta.

Cek mata (baca PNG langsung, 2 putaran): lead kini adegan (platform terbuka
+ menara lattice + drone kapsul + ledakan bintang); summit 2 wajah terbaca;
Venezuela 2 figur menandatangani; Australia figur merah + parlemen; peta
jauh lebih dekat ke referensi (laut biru, pin bernomor terbaca). Tidak ada
truncasi/tabakan visual.

Batas jujur vs referensi (tetap ada): render painterly lembut, kemiripan
wajah nyata, garis batas negara di peta (tidak ada data — garis perkiraan
akan terlihat salah), titik brief di peta (brief tidak punya koordinat —
mengarang lokasi = fabrikasi).

### Resubmit — BELUM disiapkan, BELUM disubmit (untuk parent)
v5 menunggu verdict Gibran. Bila disetujui, langkah resubmit sama seperti
v2/v3 (main.ts -> entry-v5.png, push teks, upload PNG via browser, rebuild
bundle + check hijau + submit). Entries tutup 20 Nov 07:00 WIB.

## v6 HYBRID — SELESAI 19 Nov ~19:30 WIB (belum disubmit, menunggu parent/Gibran)
- Arsitektur HYBRID (perubahan arah 19:13 WIB + standar dinaikkan 19:19 WIB):
  13 ilustrasi AI (Flat 2.0 semi-flat, kepala faceless generik, bendera tetap
  akurat) + peta/tipografi/layout tetap code-drawn. Studi top-10
  (news-image-top10-study.md) + judging-gaps diterapkan sebagai perangkat
  pemenang, bukan sekadar ilustrasi.
- 11 ilustrasi baru digenerate 3 subagen paralel (venezuela, bridge, euloan,
  cop31, badme, voyager, australia, bangladesh, myanmar, woty, gao) + 2 uji
  lama (lead Gulf, summit). Semua 1920x1280, dicek mata satu-satu: bendera
  benar (Myanmar kuning/hijau/merah + bintang putih; EU 12 bintang;
  Venezuela kuning/biru/merah + bintang; US + China di summit), kepala
  profil faceless (summit = profil bezier hidung/dagu persis spek studi
  teknik), kerumunan Bangladesh 3 baris, Voyager + astronot + Bumi.
  Crop ke ukuran tampil via crop-ai.py (JPEG q88, total 65.857 byte).
- Perangkat pemenang yang diterapkan:
  (1) Masthead = tanggal raksasa Didone 50px (tinta 830px, terbesar di
  halaman) + dek merah miring 13,5px berisi 4 cerita teratas (Gulf,
  Venezuela, Crimea, Shenzhen) — semua dari data.
  (2) Stat strip ANGKA BESAR: 6 kotak 34px, angka 20px merah + label 10px
  di bawah; region bar + hitungan region (EU 6, ME 3, AS 5, AF 1, AM 11,
  OC 2, WORLD 3) + field bar.
  (3) Peta sebagai band tersendiri: judul + 8 pin bernomor warna region
  (1 ME, 2 AM, 3 EU, 4 AS, 5 EU, 7 AF, 14 OC, 13 AM) + garis legenda
  (chip warna + nama region + "numbered pins = story cards").
  (4) DATE CHECK sebagai BOX MERAH menonjol (teks putih 5,91:1, 2 baris).
  (5) "Original drawings" + 10 sumber bernama di footer (2 baris).
  (6) Tanpa truncasi (0). Lead TETAP Gulf (summit itu berita 19 Nov).
- Perangkat yang TIDAK diterapkan + alasan (jujur):
  * Timeline UTC: TIDAK MUAT secara data — news-v2.json tidak punya satu
    pun stempel waktu UTC terverifikasi; mengarang jam = fabrikasi
    (kriteria 4). Bukan soal ruang halaman.
  * Peta full-width: tidak muat — band peta berbagi baris dengan tail
    18 brief; peta full-width akan memaksa tail terpotong / halaman
    >1024px. Yang diterapkan: band peta bertitel + caption + legenda.
  * Tail 3 kolom: ditolak hitungan — kolom 3x208px akan memotong headline
    11px (butuh ~230px); tail tetap 2 kolom x 9 baris, 0 truncasi.
  * Dot abu brief di peta: tidak ada koordinat brief di data; mengarang
    lokasi = fabrikasi (sama seperti batas v5).
- Gate (verify-v6.mjs): ALL PASS — determinisme byte-identik 2x,
  657.098 byte <= 1 MiB, 1024x1024, truncasi 0, overlap 0, kontras
  headline 12,83:1, 31 cerita, 13 ilustrasi, 8 pin peta, putih-di-merah
  DATE CHECK 5,91:1.
- File: entry-v6.png sha256
  0614aeadb9cf37a0e4cea9d939b1c936bdf0753be08a308d49694c2a956fd849
  (657.098 byte). Generator: generate-v6.mjs (27.573 byte, AI loader +
  komposit data-URI; fungsi ilustrasi code-drawn v5 dihapus, peta/
  tipografi/layout dipertahankan). Verifier: verify-v6.mjs. Crop:
  assets-ai/crop/ (13 JPG). Sumber AI: assets-ai/src/ (11 WebP + lead.png
  + summit.png).
- Cek mata (baca PNG langsung + zoom peta & hero): halaman kini broadsheet
  penuh — tanggal raksasa + dek merah, stat besar, lead ledakan + platform,
  hero Venezuela (2 figur + bendera) & Crimea (dek + asap + matahari),
  grid semua berilustrasi dan terbaca (summit 2 profil, EU koin + panah,
  Voyager astronot + Bumi, Australia parlemen + rambut merah, kerumunan
  Bangladesh, dokumen Myanmar, buku + bintang WOTY, segitiga GAO),
  8 pin peta bernomor terbaca, DATE CHECK merah menonjol, footer lengkap.
  Tidak ada truncasi/tabakan visual.
- Batas jujur yang tersisa: ilustrasi AI itu semi-flat + shading lembut +
  grain (keluarga yang sama dengan uji feasibility) — BUKAN flat 2-3 tone
  paling sederhana ala pemenang top-10 (bendera/skyline/grafik polos);
  strip lead memotong bawah ledakan + drone tidak masuk crop; pin #1
  (Gulf) dan #3 (Crimea) berdekatan di peta (12px); garis batas negara
  tetap tidak digambar (tidak ada data).
- Resubmit — PERSIAPAN SELESAI 19 Nov ~19:38 WIB (sesi aa03c0e1/b35efc90),
  BELUM disubmit. main.ts -> entry-v6.png; commit lokal cfe2c28 (teks +
  PNG + 13 crop JPG); push teks via connector ke GitHub main 9d34e2c7
  (main.ts, generate-v6.mjs, verify-v6.mjs, STATUS.md, news-v2.json —
  news-v2.json ikut karena belum ada di remote); bundle v4
  news-image-20261118-bundle-v4.tar.gz sha
  4b21649a7248e48c2056ad1c82603a5aee563c9a9688df729f245b9752c44357
  (7 sesi: v1-v6 + prep; usage 6 baris v1-v6); check v4 ok:true
  (thinking_reproduces 92,2% authored, 0 fail). SISA (parent): (1) upload
  entry-v6.png + assets-ai/crop/*.jpg via browser web UI; (2) rebuild
  bundle setelah sesi prep selesai (agar usage row sesi prep terpasang);
  (3) submit commit HEAD GitHub pasca-upload sebelum 20 Nov 07:00 WIB.
  Entries tutup 20 Nov 07:00 WIB.

## v7 CODE-DRAWN — SELESAI 19 Nov ~19:45 WIB (belum disubmit, menunggu parent/Gibran)
- Iterasi setelah v6 (Gibran 19:30 WIB: "maksimalkan lagi, buat iterasi
  selanjutnya sampai bagus dan nilainya tinggi di mata juri", target
  peringkat 1). Prioritas baru 19:35 WIB: news-image = reward CEPAT
  (hasil ~2 hari) — v7 adalah kandidat resubmit 18 Nov.
- Arsitektur: SEMUA 13 ilustrasi code-drawn Flat 2.0 (2–3 tone) dari shape
  library — BUKAN AI. Pemenang top-10 pakai ilustrasi flat SEDERHANA
  (bendera/skyline/grafik polos), bukan semi-flat + grain ala AI.
  shapes-lib.mjs = salinan shapes.mjs (library) di dir ini supaya
  generator self-contained (resubmit: copy shapes-lib.mjs ke repo).
  AI dipertahankan sebagai fallback per kartu (loader AI_IMG masih ada;
  v7 ship dengan 0 kartu AI — tidak ada swap yang diperlukan).
- Perbaikan atas batas jujur v6 (3/3):
  (1) LEAD code-drawn (bukan crop): crop TIDAK BISA memperbaiki v6 —
  ledakan bawah (y~1050) dan drone (y~75–340) di source 1280px berjarak
  800px, strip 96px mustahil memuat keduanya (matematika crop, bukan
  opini). Lead v7: langit + awan flat + horizon hangat 14px + laut 2 band
  + starburst 16-ray IRREGULAR (tabel panjang tetap, bukan pinwheel) yang
  MUAT penuh di strip (R=30, bawah 302<304, tidak terpotong) + platform
  library (steel lebih terang) + 5 drone KRIM (lebih besar + terang) +
  kapal + pantulan emas. Semua elemen masuk strip by design.
  (2) PIN: repulsion directional (min 22px) ganti nudge vertikal +12px —
  pin #1/#3 kini 22px (v6: 12px), leader line tunjuk lokasi asli bila
  pin digeser.
  (3) ILUSTRASI FLAT: 13/13 code — Venezuela (2 profil + meja + dokumen
  + bendera US/VE), jembatan (custom, aspek 330x56; celah runtuh
  DIPERLEBAR + dek kiri miring curam + asap), summit (2 profil + CN/US
  + karpet merah), EU (bendera + 3 koin + panah naik), COP31 (globe +
  pabrik + asap), Badme (2 helm + tiang garis), Voyager (satelit + Bumi
  + lintasan putus-putus), Australia (parlemen + rambut merah), Bangladesh
  (kerumunan 3 baris), Myanmar (dokumen + segel larangan), WOTY (dokumen
  + bintang emas), GAO (gelembung chat + segitiga peringatan). Bendera
  digeser clear dari badge nomor (Venezuela US, summit CN).
- Perangkat v6 dipertahankan penuh: masthead Didone 50px + dek merah,
  stat strip angka besar, region bar + field bar, peta band + legenda,
  DATE CHECK box merah, "Original drawings" + 10 sumber, 31 cerita,
  0 truncasi, lead tetap Gulf.
- Gate (verify-v7.mjs): ALL PASS — determinisme byte-identik 2x,
  256.223 byte <= 1 MiB (v6: 657.098 — code tanpa raster), 1024x1024,
  truncasi 0, overlap 0, kontras headline 12,83:1, 31 cerita,
  13 ilustrasi, 8 pin peta, min pin distance 22px.
- File: entry-v7.png sha256
  acda5f4edf6b5b133e93516b419fc7a2bdbe68c39a1cc5835bddf930dc34a8d5
  (256.223 byte). Generator: generate-v7.mjs. Verifier: verify-v7.mjs.
  Pendukung: shapes-lib.mjs (salinan library). entry.png, entry-v2–v6.png,
  repo, main.ts TIDAK disentuh.
- Cek mata (PNG penuh + zoom lead/hero/grid/peta 2x, 2 putaran): lead
  kini ledakan + 5 drone + platform + kapal semua terbaca; jembatan
  runtuh jelas (celah lebar + dek miring); Venezuela/summit 2 profil
  terbaca; EU koin + panah, Voyager, kerumunan, dokumen + larangan,
  chat + segitiga semua terbaca; pin #1/#3 terpisah jelas. Tidak ada
  truncasi/tabakan visual.
- Batas jujur yang tersisa: starburst tetap stilasi flat (bukan ledakan
  painterly — itu gaya pemenang, bukan kekurangan); platform relatif
  kecil di strip 96px; drone ~15–20px di 1x (terbaca sebagai drone);
  garis batas negara tetap tidak digambar (tidak ada data).
- Resubmit — PERSIAPAN SELESAI 19 Nov ~19:55 WIB (sesi a7a65509, prep v7),
  BELUM disubmit, BELUM di-push ke GitHub. Staged & ready:
  * Repo lokal `~/workspace/makefun/repo-news-image-20261118/`, commit
    `050b177d8dd07ec58f47606774c4ea8dff78524a` ("v7: code-drawn resubmit"):
    main.ts -> entry-v7.png, + entry-v7.png/svg, generate-v7.mjs,
    verify-v7.mjs, shapes-lib.mjs, STATUS.md (bagian v7). main.ts
    terverifikasi 2x (output sha = entry-v7.png acda5f4e…); verify-v7.mjs
    dari repo: ALL GATES PASS (determinisme byte-identik, sha tidak berubah).
    Crop JPG v6 tetap di repo (generator v7 load 13 JPG itu saat build —
    jangan dihapus). TIDAK di-push ke GitHub: main masih v6 (9d34e2c7) dan
    v6 tetap kandidat hidup — push v7 hanya bila Gibran memilih v7.
  * Bundle v5 `~/workspace/makefun/news-image-20261118-bundle-v5.tar.gz`
    sha256 `4b7de598310c517f600f88f1f48dedd5e83b94a37eb8b73b507271222d4d0976`
    (12.685.443 byte; 9 sesi: 7 v4 + b43558e2 v7-build + a7a65509 prep ini;
    parent cde6c5f9 sebagai context; --no-family dipakai karena parent
    ikut ter-discovery sebagai evidence tanpa flag itu).
  * Check v5 `news-image-20261118-check-v5.json`: ok:true, 0 fail
    (13 pass, 5 skip, 5 submission — submission dicek saat submit, sama
    seperti v4). thinking_reproduces 66,0% authored (1929/2920, ambang 30%;
    turun dari 92,2% v4 karena shapes-lib.mjs besar ikut terhitung read —
    tetap jauh di atas ambang), thinking_priced 8 usage records,
    thinking_turns 517, wellformed 9 sesi/1406 pesan, in_window pass.
  * Usage: baris b35efc90 (v6-prep) + b43558e2 (v7-build) ditambahkan ke
    `muse-usage-news-image.jsonl` (sekarang 19 baris valid; sempat rusak 1
    baris karena baris lama tanpa newline akhir — diperbaiki, semua JSON
    valid). Baris sesi prep ini (a7a65509) BELUM ada — parent tambahkan
    setelah sesi ini selesai (query muse.db seperti biasa) lalu rebuild.
  * Catatan: /tmp sempat penuh (99%, tmpfs 512M) saat packing bundle —
    bundle+check dijalankan dengan TMPDIR=~/workspace/.tmp-bundle;
    staging basi /tmp/bundle-v4 (37M) sudah dibersihkan. Nit kecil:
    header komentar verify-v7.mjs masih menyebut "v6" (fungsi tidak
    terpengaruh, dibiarkan apa adanya).
- SISA (parent, HANYA bila Gibran memilih v7 di kontak 20 Nov 01:00 WIB):
  (1) push file teks via connector push-files (main.ts, generate-v7.mjs,
  verify-v7.mjs, shapes-lib.mjs, STATUS.md); (2) upload entry-v7.png via
  browser web UI (crop JPG sudah ada di GitHub dari v6 — tidak perlu
  upload ulang); (3) tambah usage row a7a65509 lalu rebuild bundle v6
  (perintah sama seperti v5, ganti --out ke bundle-v6) + re-run check
  (harus ok:true); (4) submit commit HEAD GitHub pasca-upload sebelum
  20 Nov 07:00 WIB:
  `node ~/workspace/makefun/kit-news-image-20261118/news-image-20261118-kit/cli/makefun.mjs submit --competition news-image-20261118 --repo-url https://github.com/Rzpctr2/makefun-news-image-20261118 --commit <HEAD> --bundle ~/workspace/makefun/news-image-20261118-bundle-v6.tar.gz --keypair ~/workspace/makefun/makefun-keypair.json --title "The World in One Day — 18 November 2026" --json`
  Bila Gibran memilih v6: abaikan paket v7 ini, lanjutkan jalur v6
  (commit GitHub 9d34e2c7 + upload entry-v6.png + bundle v4/check v4).

## v8 AI GRID SCENES — SELESAI 19 Nov ~22:40 WIB (belum disubmit, menunggu parent/Gibran)
- Iterasi setelah v7 (Gibran 19 Nov ~22:26 WIB: "buat jadi lebih bagus
  lah"). Pendekatan rantai v14–v16 (19 Nov): adegan grid pakai GAMBAR AI,
  ilustrasi LEBIH BESAR + bentuk TAJAM langsung kebaca di thumbnail 300px
  (1 subjek dominan per adegan), teks kegedean DIKECILKAN dengan patokan
  poster referensi 18 Nov (ref-18nov.png).
- BASIS: v7 (256.223 B, semua gate lolos, perangkat lengkap). v6 DITOLAK
  sebagai basis: 657.098 B melanggar batas keras <300 KB dan crop lead-nya
  memotong ledakan/drone — rebuild dari v6 berarti mengulang perang ukuran
  dari −357 KB. v8 = generator v7 + 10 ilustrasi grid diganti adegan AI;
  hero (lead/venezuela/bridge) TETAP code-drawn (lead AI terbukti gagal di
  v6; hero code sudah terbaca bersih).
- Pengukuran teks vs poster referensi (PIL row-projection, hasil NOISY —
  arah saja, bukan presisi): masthead referensi cap ~48px vs v7 37px
  (tanggal referensi LEBIH BESAR); headline lead v7 37px cap 36px vs
  headline cerita terbesar referensi cap ~12–17px (lead v7 ~2x LEBIH
  BESAR); hero2 23px vs ~17px (agak besar); headline grid, angka stat,
  brief v7 SUDAH setara referensi. Jadi yang dikecilkan: lead 37->30px,
  hero2 23->20px; masthead DIBESARKAN 50->54px (tanggal = elemen terbesar,
  estW 875px < 944); grid tetap 12px, kecuali baris 3 12->11px (harga
  art lebih lebar — #11 butuh 2 baris di 11px, di 12px jadi 3 baris =
  truncasi).
- Geometri art (semua slot membesar): #4 134x94 -> 168x98 (teks geser
  x+150 -> x+184); #5 206x52 -> 206x58; baris 2 65x66 -> 84x70 (teks
  x+77 -> x+96); baris 3 56x48 -> 64x52 (teks x+70 -> x+78); #8
  224x128 -> 224x132; baris 1 y502 -> 500 (tinggi 100), baris 2 y610 ->
  608 (tinggi 72), baris 3 y690 -> 688 (tinggi 56), #8 tinggi 176 -> 180
  (bawah 680 = sejajar baris 2). Peta/judul/brief/footer TIDAK bergerak.
- Adegan AI (scenes-ai/v8-raw/*.webp 2736x912, gaya blok v14–v15:
  golden hour, langit gradien hangat, matahari ber-strip, siluet
  berlapis, palet earthy muted; 1 subjek dominan, siluet tegas, tanpa
  teks). Proses per adegan (resep v14–v15): crop ke aspek slot -> 1x
  -> median (3x3 untuk 2 adegan berbendera #4/#11, 5x5 lainnya) ->
  quantize (16 warna #4/#11, 12 lainnya, MEDIANCUT, tanpa dither) ->
  scenes-ai/v8/sceneNN.png. Total adegan 29.094 B. Crop BUKAN tengah
  untuk 3 adegan (dicek mata, diperbaiki): #6 x0=300 (tengah memotong
  globe — kini globe dominan), #8 x0=850 (Bumi terpotong setengah di
  tepi kanan — kini Bumi utuh), #13 x0=100 (tengah = mush abstrak —
  kini kepala robot dominan).
- Per adegan (cek mata contact sheet 2x + halaman penuh + thumbnail
  300px): #4 jabat tangan + bendera CN/US; #5 bendera EU + panah merah
  naik + koin; #6 globe Bumi dominan; #7 tiang garis perbatasan +
  matahari; #8 satelit + Bumi utuh di kanan; #9 gedung parlemen putih;
  #10 demonstran megafon + kerumunan; #11 bendera Myanmar + segel merah;
  #12 buku terbuka + bintang emas; #13 kepala robot mata menyala. Semua
  kebaca dalam 1 detik di thumbnail 300px; di skala penuh tiap adegan
  langsung terbaca apa isinya. #5 headline membungkus "…Ukraine" /
  "loan" (baris kedua 1 kata — canggung tapi bukan truncasi).
- Perangkat v7 dipertahankan penuh: data news-v2.json (31 cerita 18 Nov,
  TIDAK berubah), chips, VERDICT terverifikasi, DATE CHECK, peta 8 pin
  (min 22px), tail 18 item, footer 10 sumber, kontras >= 4,5:1.
- Gate (verify-final-v8.mjs): ALL PASS (19/19) — determinisme
  byte-identik 2x, 265.254 byte < 300 KB (headroom 41.946 B; v7 256.223
  B), 1024x1024, truncasi 0, overlap 0, kontras headline 12,83:1 /
  muted 5,57:1 / accent 4,87:1 / datecheck 5,91:1, 31 cerita,
  13 ilustrasi, 8 pin peta, min pin distance 22px, masthead estW 875px,
  lead estW 504px, 10 data-URI adegan AI di SVG, 10 file adegan >1 KB,
  std adegan grid 30,6–62,1 (>0,03), warna unik 24–53 (>8).
- File: entry-final-v8.png sha256
  bb39c53d138db415770c081488126dc1104566405862af4ba1c8cc19f7fba534
  (265.254 byte). Generator: generate-final-v8.mjs. Verifier:
  verify-final-v8.mjs. Adegan: scenes-ai/v8/scene04–13.png (+ mentahan
  scenes-ai/v8-raw/*.webp). entry.png, entry-v2–v7.png, repo, main.ts
  TIDAK disentuh.
- Batas jujur yang tersisa: (1) hero lead/venezuela/bridge tetap
  code-drawn flat (bukan AI) — lead AI gagal di v6, hero code sudah
  terbaca; (2) #5 headline 2 baris dengan "loan" sendirian di baris 2;
  (3) #9 figur rambut merah ter-crop keluar — gedung parlemen saja yang
  membawa cerita (masih terbaca); (4) #6 pabrik + asap ter-crop keluar
  dari slot 84x70 — globe saja yang membawa cerita iklim (masih
  terbaca); (5) #8 piring satelit terpotong sebagian di tepi kiri slot
  (badan satelit + Bumi utuh yang dominan); (6) adegan AI semi-flat +
  grain (bukan flat 2–3 tone murni ala v7) — ini arah v14–v16 yang
  Gibran minta ("nice", "gaskan aja trus"); (7) pengukuran teks vs
  referensi memakai kotak estimasi PIL yang NOISY — arahnya benar
  (lead/hero2 memang kegedean), angka pastinya jangan dikutip.
- Resubmit — BELUM disiapkan, BELUM disubmit (untuk parent). Kandidat
  resubmit 18 Nov kini v6 / v7 / v8; keputusan via kontak 20 Nov 01:00
  WIB (rencana baru Gibran 22:29 WIB: 01:00 submit 19 Nov dulu, SETELAH
  itu 18 Nov — v8 submit sebelum tutup 20 Nov 07:00 WIB). Bila Gibran
  memilih v8: prep resubmit mengikuti pola v6/v7 (check -> bundle ->
  worktree prep-v8 -> READY note; ingat TMPDIR=~/workspace/.tmp-bundle
  dan tambah usage row sesi build v8 ini ke muse-usage sebelum rebuild
  bundle). Bila memilih v6/v7: abaikan paket v8, lanjutkan jalur itu.

## v9 MAXIMISE — SELESAI 19 Nov ~23:05 WIB (belum disubmit, menunggu parent/Gibran)
- Iterasi setelah v8 (Gibran 19 Nov ~22:40 WIB: "masih jauh, belum layak,
  kita maksimalkan, agar skornya tinggi dan bisa di peringkat pertama").
  Prinsip Gibran 22:38 WIB (juga berlaku di sini): "ga perlu sedetail itu,
  penting siluetnya keliatan dan warnanya ga nabrak" — siluet terbaca
  1 detik di thumbnail 300px + warna antarelemen tidak bentrok; detail
  halus yang mengaburkan siluet = buang.
- BASIS: v8 (265.254 B, 19/19 PASS). Semua perangkat + data dipertahankan:
  news-v2.json (31 cerita 18 Nov) TIDAK berubah, layout/geometri v8 TIDAK
  berubah (masthead, stat, peta, DATE CHECK, tail, footer semua sama).
- **Hero: 13/13 ilustrasi kini AI dalam SATU keluarga golden-hour** (v8:
  10 AI + 3 code-drawn). Lead AI dicoba lagi dan KALI INI BERHASIL —
  kegagalan v6 bukan soal AI, tapi komposisi sumbernya (ledakan + drone
  tersebar 800px vertikal); sumber v9 disusun sepanjang SATU pita
  horizontal (platform kiri, ledakan raksasa tengah, kapal kanan).
- Yang berubah (diukur + dicek mata, bukan klaim):
  (1) LEAD: adegan AI baru (platform + ledakan emas raksasa + kapal,
  matahari strip) di-crop pita y420..676 ke strip 1024x96 — platform
  UTUH (menara + crane + dek + kaki), ledakan dominan, kapal kelihatan
  di kanan. Pita y380 sempat dipakai (ledakan lebih utuh, tapi menara
  terpotong + kapal nyaris tak kelihatan) — diganti y420 setelah cek
  mata 2x. Strip kini jauh lebih dramatis dari v8 (dulu: starburst kecil
  + laut datar luas).
  (2) HERO #2 Venezuela: adegan AI baru (2 figur faceless menandatangani
  di meja, bendera US akurat kiri + triwarna Venezuela kanan, langit
  golden hour) — menggantikan code-drawn v8 yang sudah bagus; versi AI
  menyatukan gaya dengan grid + lebih hangat. Crop nyaris native
  (1,5:1 -> 1,55:1).
  (3) HERO #3 Jembatan: adegan AI baru (2 menara + dek RUNTUH menganga
  di tengah + asap tebal + matahari strip). Crop y330 sempat dipakai
  (celah nyaris tak kelihatan — dek jadi garis tipis di dasar slot) —
  diganti pita y380..779: celah-V kini JELAS di tengah slot, asap di
  belakangnya. Membaca "bridge collapses", bukan sekadar "bridge".
  (4) #5 headline: 12->11px — "EU proposes €45bn Ukraine loan" kini
  SATU baris (30 karakter x 6,16px = 185px <= 192px); "loan" yatim
  di baris 2 HILANG (gate baru di verifier).
  (5) #6 COP31: re-crop mentahan v8 (x1100) — pabrik + 2 asap +
  matahari strip + bendera. Globe v8 dibuang dengan sengaja: pabrik +
  asap ADALAH cerita "fossil-fuel phase-out", globe itu generik.
  (6) #8 Voyager: REGENERATE (piring emas + panel + Bumi biru menyala +
  lintasan titik-titik, keduanya UTUH). Pelajaran penting: quantize
  12 warna MENGHANCURKAN adegan ini — MEDIANCUT mengalokasikan hampir
  semua entri palet ke langit navy yang dominan, piring emas jadi
  hijau-mint pucat + Bumi jadi teal pucat (ketahuan di cek mata 2x).
  Diperbaiki dengan q32 (emas + biru terang kembali; +1.968 B).
  (7) #9 Australia: REGENERATE — perempuan rambut merah BESAR dari
  belakang (dominan, kiri) + parlemen kecil di kanan + matahari strip.
  Re-crop mentahan v8 sempat dicoba (x550: figur masuk frame tapi
  rambut merahnya tenggelam di semak gelap setelah quantize — tidak
  terbaca sebagai siluet). Versi baru: siluet rambut merah langsung
  kebaca 1 detik.
  (8) 7 adegan grid lain (#4, #5, #7, #10, #11, #12, #13) = byte
  v8 disalin utuh — semua sudah lolos uji 1 detik v8.
- Uji 1 detik thumbnail 300px (v9 final): lead ledakan + platform,
  hero #2 tanda tangan, hero #3 celah runtuh, #4 jabat tangan, #5
  bendera EU + panah, #6 asap pabrik, #7 tiang perbatasan, #8 piring
  emas + Bumi, #9 rambut merah, #10 megafon, #11 bendera Myanmar,
  #12 buku, #13 kepala robot — SEMUA langsung kebaca; hierarki
  tanggal > lead > hero > grid terjaga.
- Gate (verify-final-v9.mjs): ALL PASS (22/22) — determinisme
  byte-identik 2x, 280.635 byte < 300 KB (headroom 26.565 B; v8
  265.254 B), 1024x1024, truncasi 0, overlap 0, kontras headline
  12,83:1 / muted 5,57:1 / accent 4,87:1 / datecheck 5,91:1, 31 cerita,
  13 ilustrasi, 8 pin peta, min pin distance 22px, 13 data-URI AI di
  SVG, 13 file adegan, PIL std grid 38,4–64,4 + hero 37,5–65,5
  (min > 0,03), warna unik grid 24–53 + hero 18–34 (min > 8),
  #5 satu baris. Dua perbaikan verifier selama build (jujur dicatat):
  gate ukuran file adegan 1 KB -> 512 B (scene06 hasil quantize
  1.014 B adalah gambar asli — ambang 1 KB arbitrer; gate PIL std/
  warna adalah cek keberadaan yang sesungguhnya); satu bug escape
  `\\n` di string Python verifier (diperbaiki ke chr(10)).
- File: entry-final-v9.png sha256
  8d246b80701bf5e21bf097e9e95ddcff55e17fbef750f7679417c0a482840456
  (280.635 byte). Generator: generate-final-v9.mjs. Verifier:
  verify-final-v9.mjs. Adegan: scenes-ai/v9/ (13 PNG: lead, hero2,
  hero3, scene04–13) + mentahan scenes-ai/v9-raw/ (4 webp baru:
  lead, hero2, hero3, scene08, scene09). entry.png, entry-v2–v8.png,
  repo, main.ts TIDAK disentuh (v8 sha bb39c53d… + v7 acda5f4e…
  terverifikasi utuh; repo git status bersih).
- Batas jujur yang tersisa: (1) pita lead bawah masih didominasi laut
  gelap (~50% tinggi strip) — ledakan + platform + kapal yang membawa,
  bukan detail laut; (2) parlemen #9 kecil di tepi kanan slot (figur
  rambut merah yang membawa cerita — parlemen hanya penanda lokasi);
  (3) #6 pabrik kecil di 84px (asap + matahari yang dominan);
  (4) #12 buku + bintang masih yang paling pucat di grid; (5) DATE
  CHECK tetap 8 item vs 12–15 di #1 (batas data); (6) kuantisasi 12
  warna terlihat di zoom 100% (bersih di thumbnail 300px skala juri);
  (7) #1-vs-#2 sebagian undian jalur turnamen.
- Resubmit — BELUM disiapkan, BELUM disubmit (untuk parent). Kandidat
  resubmit 18 Nov kini v6 / v7 / v8 / v9; keputusan via kontak 20 Nov
  01:00 WIB (setelah submit 19 Nov — v9 submit sebelum tutup 20 Nov
  07:00 WIB). Bila Gibran memilih v9: prep resubmit mengikuti pola
  v6/v7 (check -> bundle -> worktree prep-v9 -> READY note; ingat
  TMPDIR=~/workspace/.tmp-bundle dan tambah usage row sesi build v9
  ini ke muse-usage sebelum rebuild bundle). Bila memilih v6/v7/v8:
  abaikan paket v9, lanjutkan jalur itu.

## v10 POLISH — SELESAI 19 Nov ~23:50 WIB (belum disubmit, menunggu parent/Gibran)
- Iterasi setelah v9 (Gibran 19 Nov ~22:40 WIB: "masih jauh, belum layak,
  kita maksimalkan, agar skornya tinggi dan bisa di peringkat pertama").
  Prinsip Gibran 22:38 WIB: siluet di atas detail, warna jangan nabrak.
  HANYA 4 poles dari batas jujur v9 — 9 adegan lain + hero byte-identik v9.
- **(1) LEAD — pita laut gelap diperbaiki.** Geometri mentahan (terukur):
  horizon y~470/912, menara y190-666, ledakan y150-665, kapal y500-665 —
  pita 10,67:1 selebar penuh TIDAK BISA memuat menara + kapal + langit
  tanpa squash (butuh tinggi 475px = lebar 5.068px > sumber 2.736px).
  Tiga varian diadu (render penuh + ukur): A y380..636 (laut 61%, kapal
  nyaris hilang — DITOLAK, sama seperti temuan v9), B squash y300..640
  (1,33x vertikal; laut 48%), C pita v9 + lift laut (laut 41%, kapal
  paling jelas). **MENANG: B+lift** — squash y300..640 + lift laut
  (lum<0,35 di baris bawah x1,7, lalu quantize ulang): baris gelap
  74/96 (77%) -> **29/96 (31%)**, menara lattice KINI KELIHATAN,
  ledakan lebih besar, kapal terbaca di laut yang terangkat (bukan lubang
  hitam). Jujur: squash 1,33x membuat menara/ledakan 25% lebih pendek —
  di 96px tidak terbaca sebagai distorsi (generator sudah stretch semua
  adegan via preserveAspectRatio="none"); ledakan tetap dominan, bukan
  kapal, yang membawa cerita.
- **(2) #6 COP31 — pabrik diperbesar.** Zoom crop x1230..1710, y400..800
  (bukan x1100 full-height v9): pabrik + 2 asap mengisi slot — pabrik
  kini ~40% tinggi kartu (v9: ~15%, duduk di tepi bawah), 2 cerobong +
  2 asap teal terbaca jelas. Varian pertama (x1130..1850, y230..830)
  DITOLAK di cek mata: zoom malah membesarkan asap, pabrik tetap di
  tepi bawah. Resep med3+q16 (bukan med5+q12 — asap tipis butuh palet
  lembut). Gate: brown baris 35-55 = 984 (v9: 795).
- **(3) #9 Australia — parlemen dibesarkan sebisanya.** Jendela geser
  kanan x0=280 (tepi kiri kepala di x~247 dipertahankan) + med3+q16:
  parlemen kini selebar penuh frame (x1393-1812) + kolom kelihatan
  (white-run 22px/baris, v9: 18). **Jujur: ini batas geometri** — kepala
  di ujung kiri + parlemen di ujung kanan berjarak ~1.600px sementara
  jendela maks 1.536px (tinggi sumber 1.280px, aspek slot 1,2);
  parlemen TIDAK BISA lebih besar tanpa memotong kepala. Figur rambut
  merah tetap dominan (red px 3.244 vs v9 3.388 — nyaris utuh).
- **(4) #12 WOTY — REGENERATE di latar gelap.** Akar masalah v9: bintang
  emas di langit emas + buku krem di langit pucat = kontras hampir nol
  (bintang HILANG setelah med5+q12; lum rerata 0,631, 41% piksel terang).
  Re-crop mentahan v8 dicoba dulu (buku+ bintang diperketat, med3+q16)
  — tetap pucat (lum 0,690, bintang tetap tak terbaca). **Regenerasi
  baru: buku raksasa bercahaya + bintang emas di langit teal GELAP**
  (scenes-ai/v10-raw/): lum rerata **0,395**, dark frac 0,604 (v9:
  0,108), bintang + buku langsung kebaca 1 detik — kartu paling pucat
  kini salah satu yang paling kontras di grid.
- Uji 1 detik thumbnail 300px (v10 final): lead ledakan + menara +
  kapal, hero #2 tanda tangan, hero #3 celah runtuh, #4 jabat tangan,
  #5 bendera EU + panah, #6 pabrik + asap, #7 tiang perbatasan, #8
  piring emas + Bumi, #9 rambut merah, #10 megafon, #11 bendera
  Myanmar, #12 buku bercahaya + bintang, #13 kepala robot — SEMUA
  langsung kebaca; hierarki tanggal > lead > hero > grid terjaga.
- Gate (verify-final-v10.mjs): ALL PASS (**27/27**) — 22 gate v9 + 5
  gate baru (lead baris gelap 29/96 <50; #12 dark frac 0,604 >0,40 +
  lum 0,407 <0,55; #6 brown 984 >850; #9 white-run 22 >=20).
  Determinisme byte-identik 2x, **281.366 byte < 300 KB (headroom
  25.834 B; v9 280.635 B)**, 1024x1024, truncasi 0, overlap 0,
  kontras headline 12,83:1 / muted 5,57:1 / accent 4,87:1 / datecheck
  5,91:1, 31 cerita, 13 ilustrasi, 8 pin peta, min pin distance 22px,
  13 data-URI AI di SVG, 13 file adegan. Satu bug verifier tertangkap
  saat build: gate ukuran file adegan masih membaca scenes-ai/v9/
  (sudah diperbaiki ke v10, re-run tetap ALL PASS, sha tidak berubah).
- File: entry-final-v10.png sha256
  0c7c88800807fe958cf43fcd43a8bb499c7807102817b5f9bced555f6af4ca0c
  (281.366 byte). Generator: generate-final-v10.mjs. Verifier:
  verify-final-v10.mjs. Adegan: scenes-ai/v10/ (13 PNG: 9 byte-identik
  v9 + 4 baru) + mentahan scenes-ai/v10-raw/ (1 webp baru #12) +
  kandidat scenes-ai/v10-cand/ (12 varian + skrip
  /home/hatch/workspace/.tmp-bundle/process_v10.py). entry.png,
  entry-v2–v8.png, entry-final-v8/v9.png, repo, main.ts TIDAK disentuh
  (v9 sha 8d246b80… + v8 bb39c53d… + v7 acda5f4e… terverifikasi utuh;
  repo git status bersih).
- Batas jujur yang tersisa: (1) #9 parlemen tetap kecil — batas geometri
  sumber (lihat atas); (2) squash lead 1,33x (lihat atas); (3) DATE
  CHECK tetap 8 item vs 12–15 di #1 (batas data); (4) kuantisasi 16
  warna terlihat di zoom 100% (bersih di thumbnail 300px skala juri);
  (5) #1-vs-#2 sebagian undian jalur turnamen.
- Resubmit — BELUM disiapkan, BELUM disubmit (untuk parent). Kandidat
  resubmit 18 Nov kini v6 / v7 / v8 / v9 / **v10**; keputusan via kontak
  20 Nov 01:00 WIB (setelah submit 19 Nov — v10 submit sebelum tutup
  20 Nov 07:00 WIB). Bila Gibran memilih v10: prep resubmit mengikuti
  pola v6/v7 (check -> bundle -> worktree prep-v10 -> READY note; ingat
  TMPDIR=~/workspace/.tmp-bundle dan tambah usage row sesi build v10
  ini ke muse-usage sebelum rebuild bundle). Bila memilih v6/v7/v8/v9:
  abaikan paket v10, lanjutkan jalur itu.

## v11 DE-BANDING — SELESAI 19 Nov ~23:58 WIB (belum disubmit, menunggu parent/Gibran)
- Iterasi setelah v10 (perintah parent: poles v10 — kurangi banding yang
  kelihatan di zoom 100%; Gibran melihat gambar ukuran penuh, bukan cuma
  thumbnail 300px). Prinsip: siluet di atas detail, warna jangan nabrak.
  HANYA naik quantize pada adegan yang langit/gradiennya paling banding —
  layout, teks, data, dan 5 adegan lain byte-identik v10.
- **Metode (jujur, terukur):** (1) banding diukur per adegan (metrik
  row-step + cek mata contact sheet 4x): yang paling banding = hero2
  (langit peach 3–4 garis keras), scene07, scene06, scene04, scene09,
  lead (garis band selebar 1024px di langit); scene08 sudah q32 dan
  halus; scene10/11/13 datar/sibuk (bukan banding gradien).
  (2) Resep tiap adegan DIVERIFIKASI ulang dari mentahan (reproduksi
  byte-identik v10): lead = pita y300..640 + lift laut baris>=48
  lum<0,35 x1,7 (pre-quantize) med3; scene06 = jendela (1230,400,1710,800)
  med3; scene09 = (280,0,1816,1280) med3; scene04/05/07/10/11/13 =
  center-crop v8 (scene13 x0=100); scene12 = center-crop regen med3.
  hero2/hero3/scene08 v9 TIDAK bisa direproduksi byte-identik (jendela
  v9 tak terdokumentasi penuh — dicoba center-crop + brute-force y0,
  tidak cocok; kemungkinan pipeline v9 berbeda) — hero2 tetap di-upgrade
  dengan center-crop yang komposisinya terverifikasi sama di cek mata
  (bendera/figur/meja di tempat yang sama); hero3/scene08 TIDAK disentuh.
  (3) Varian q20/q32 per adegan diadu di contact sheet 3x (v10 vs q20
  vs q32) + render halaman penuh per tahap — biaya diukur di PNG FINAL,
  bukan ukuran file adegan.
- **Yang di-upgrade (8 adegan, jendela + median SAMA, hanya quantize naik):**
  lead q12->q32, hero2 q12->q32, scene04 q16->q32, scene06 q16->q32,
  scene07 q12->q32, scene09 q16->q32, scene05 q12->q20, scene12 q16->q20.
  TIDAK di-upgrade: hero3 (langit pucat, gain q20 marginal, biaya scene
  +5.887 B — dilepas demi headroom), scene08 (sudah q32), scene10/11/13.
- **Biaya (PNG final, terukur per tahap):** v10 281.366 B -> set q32
  (hero2/04/06/07/09) 290.089 B (+8.723) -> + lead q32 300.853 B
  (+10.764) -> + scene05/12 q20 302.936 B (+2.083). **Total +21.570 B,
  headroom 4.264 B.**
- **Hasil visual (cek mata):** lead: garis band langit HILANG total di
  q32 (q20 masih menyisakan tepi samar); hero2: 3–4 garis langit jadi
  gradien halus; scene04/06/07/09: langkah langit jauh lebih halus
  (scene07 garis menara merah-putih malah lebih tajam); scene05/12:
  perbaikan kecil. Siluet tetap dominan, warna tetap tidak nabrak.
- Uji 1 detik thumbnail 300px (v11 final): lead ledakan + menara +
  kapal, hero #2 tanda tangan, hero #3 celah runtuh, #4 jabat tangan,
  #5 bendera EU + panah, #6 pabrik + asap, #7 tiang perbatasan, #8
  piring emas + Bumi, #9 rambut merah, #10 megafon, #11 bendera
  Myanmar, #12 buku bercahaya + bintang, #13 kepala robot — SEMUA
  langsung kebaca; hierarki tanggal > lead > hero > grid terjaga.
  Halaman penuh 1x: tidak ada regresi (teks/peta/DATE CHECK/footer
  utuh, langit lead kini mulus).
- Gate (verify-final-v11.mjs): ALL PASS (**27/27**, sama seperti v10) —
  determinisme byte-identik 2x, **302.936 byte < 300 KB (headroom
  4.264 B)**, 1024x1024, truncasi 0, overlap 0, kontras headline
  12,83:1 / muted 5,57:1 / accent 4,87:1 / datecheck 5,91:1, 31 cerita,
  13 ilustrasi, 8 pin peta, min pin distance 22px, 13 data-URI AI di
  SVG, 13 file adegan, metrik poles v10 tetap lolos (lead baris gelap
  41/96 <50; #12 dark frac 0,604 + lum 0,406; #6 brown 1036 >850;
  #9 white-run 22 >=20).
- **BUG VERIFIER TERTANGKAP (jujur dicatat):** verify-final-v11.mjs hasil
  cp+sed pertama masih men-spawn `generate-final-v10.mjs` (string itu
  tidak mengandung 'entry-final-v10' sehingga sed tidak mengubahnya) —
  "ALL GATES PASS" pertama itu PALSU (menguji file v11 basi: determinisme
  lolos karena file tidak pernah ditulis ulang, ukuran 300.853 B = sebelum
  scene05/12). Sudah diperbaiki (spawn -> generate-final-v11.mjs) dan
  verifier DI-RUN ULANG untuk hasil asli di atas (sha 3c20f0a9…,
  302.936 B). Pelajaran: sed pada nama generator harus dicek eksplisit,
  bukan diasumsikan.
- File: entry-final-v11.png sha256
  3c20f0a980430adf5120fd9cff614d5504e840d1002356ff26cfd5e80f0caa5a
  (302.936 byte). Generator: generate-final-v11.mjs. Verifier:
  verify-final-v11.mjs. Adegan: scenes-ai/v11/ (13 PNG: 5 byte-identik
  v10 + 8 baru) + varian scenes-ai/v11-cand/ (20 PNG q20/q32) + skrip
  /home/hatch/workspace/.tmp-bundle/{band_v11,sheet_v11,repro_v11,
  repro_v11b,repro_v11c,repro_v11d,variants_v11,cmp_v11,lead_v11}.py.
  entry.png, entry-v2–v7.png, entry-final-v8/v9/v10.png, repo, main.ts
  TIDAK disentuh (v10 sha 0c7c8880… + v9 8d246b80… + v8 bb39c53d… +
  v7 acda5f4e… terverifikasi utuh; repo git status bersih).
- Batas jujur yang tersisa: (1) headroom tinggal 4.264 B — iterasi
  berikut tidak bisa menaikkan quantize lagi tanpa memangkas di tempat
  lain; (2) hero3 masih q12 (langit pucat — bandingnya paling tidak
  kelihatan, tapi tetap ada di zoom 100%); (3) kuantisasi 20/32 warna
  MASIH terlihat di zoom 300%+ pada gradien terluas (di 100% sudah
  bersih); (4) DATE CHECK tetap 8 item vs 12–15 di #1 (batas data);
  (5) #1-vs-#2 sebagian undian jalur turnamen.
- Resubmit — BELUM disiapkan, BELUM disubmit (untuk parent). Kandidat
  resubmit 18 Nov kini v6 / v7 / v8 / v9 / v10 / **v11**; keputusan via
  kontak 20 Nov 01:00 WIB (setelah submit 19 Nov — v11 submit sebelum
  tutup 20 Nov 07:00 WIB). Bila Gibran memilih v11: prep resubmit
  mengikuti pola v6/v7 (check -> bundle -> worktree prep-v11 -> READY
  note; ingat TMPDIR=~/workspace/.tmp-bundle dan tambah usage row sesi
  build v11 ini ke muse-usage sebelum rebuild bundle). Bila memilih
  v6/v7/v8/v9/v10: abaikan paket v11, lanjutkan jalur itu.

## v12 IMAGE-TOP GRID — SELESAI 20 Nov ~00:40 WIB (belum disubmit, menunggu parent/Gibran)
Basis v11 (sha 3c20f0a9…, 302.936 B, verifier 27/27). Data BARU news-v12.json
(40 cerita); news-v2.json TIDAK disentuh (sha 481a42ea… terverifikasi di
verifier). Repo TIDAK disentuh, TIDAK ada push/submit.
File: entry-final-v12.png — sha 41ca59724104763bc350aa52516dbe450560f501423c5493f5726ba23ad841e1,
306.002 B (headroom 1.198 B), verifier 41/41 ALL PASS (verify-final-v12.mjs).
Determinisme byte-identik 2x. Generator generate-final-v12.mjs, data news-v12.json,
adegan scenes-ai/v12/ (10 grid 184x84 + lead/hero2/hero3 byte-identik v11).

APA YANG BERUBAH (bukti terukur):
1. Grid re-layout 2x5 kartu image-top full-bleed ala #1 (v11: mosaic, baris
   bawah cuma 64x52 px). Gambar grid kini 184x84 px per kartu (15.456 px vs
   3.328 px = 4,6x luas gambar terkecil v11; vs #1 ~4,8x — setara). Thumbnail
   300px: std luminance per kotak grid 34,0–55,9 (gate >20) — 10/10 adegan
   terbaca sebagai adegan dalam 1 detik (dicek mata di thumbnail 300px).
   Headline 11px bold 2 baris semua (gate wrap), dek 10px 1 baris, kicker 10px.
   #8 Voyager tetap kartu navy (kicker emas, headline putih, dek #BFD3DE).
2. 3 adegan simbolik jadi LITERAL (dicek mata crop 3x):
   #9 sanksi: dokumen + segel lilin merah + bendera Australia (Union Jack +
   bintang) + matahari garis — gate segel/bendera merah 143 px (>80).
   #12 WOTY: buku emas raksasa terbuka + bintang emas besar + matahari garis.
   #13 GAO: monitor peta militer + jendela chat + robot kecil + matahari garis.
   Catatan jujur: segel #9 kecil (blob merah ~15x12 px di slot) — bendera +
   dokumen yang membawa keterbacaan, bukan segelnya. #12 bukan lagi kartu
   tergelap (mean lum 0,507; dark frac 0,252 — emas bukunya terang; gelapnya
   di pita atas) — gate dark-frac diubah 0,40 -> 0,20 dengan alasan ini.
3. +9 cerita tail terverifikasi independen (web, 18 Nov 2026; 6 kandidat
   DITOLAK karena pertama dilaporkan 17 Nov atau lebih lama):
   #32 Ebola 11.300 kasus di Kongo (AF, Health — Reuters/WHO); #33 Takaichi
   kunjungan pertama ke China (AS, Politics — Kyodo); #34 Koalisi jatuhkan
   rudal Houthi (ME, War — Arab News/QNA); #35 Pembela Mondlane minta bebas
   (AF, Politics — Maputo, sidang hari ke-2); #36 Tame Impala sapu 7 ARIA
   (OC, Culture — AAP); #37 Siklon Xavier dekati Pukapuka (OC, Weather —
   RNZ); #38 Senat Brasil setujui paket $10 miliar (AM, Economy — Reuters);
   #39 Lee–Putin bicara Korea Utara (AS, Politics — Korea JoongAng Daily);
   #40 Alcaraz kalahkan Medvedev 6-2, 6-4 (EU, Sport — AP).
   DITOLAK: Carney–Xi (17 Nov), janji pertahanan Jerman (17 Nov), démarche
   Afrika Selatan ke Nigeria (17 Nov), penyerahan tersangka mata-mata AS
   (17 Nov), Guinea 224 dipenjara (16–17 Nov), sidang Kabila (berita lama,
   Mei/Sep 2026). Region kini: EU 7, ME 4, AS 7, AF 3, AM 12, OC 4, WORLD 3
   (min 3, dulu AF 1). Field: War 8 · Politics 11 · Economy 4 · Society 4 ·
   Disasters 6 · Tech 3 · Climate 2 · Health 2 (= 40). Tail 3 kolom x 9
   baris 10px (headline <=35 karakter, maks 34). Peta 260x92, legenda masuk
   judul ("WHERE IT HAPPENED · pins = cards"), 8 pin terpisah (min 22px,
   dicek crop 3x). Zebra banding tail DIHAPUS (ala #1).
4. TIDAK diubah: DATE CHECK (8 item), lead (Gulf), hero #2/#3 (byte-identik),
   stat strip, masthead. 10 headline tail lama dipersingkat setia (<=35
   karakter, fakta sama, mis. #30 "Helicopters hit Haiti gang mansion").

BATAS JUJUR YANG TERSISA:
- Headroom cuma 1.198 B — tidak ada ruang untuk quantize naik / elemen baru.
- AM masih 12/40 (tail saja tidak bisa menyeimbangkan region; kartu
  terilustrasi tetap AM-berat) — #1 seimbang 3–9 per region.
- DATE CHECK tetap 8 item (data hanya mendukung 7 pengecualian + 1 kumulatif).
- Segel #9 kecil (lihat di atas); #13 robot kecil di tepi kanan (aksen).
- Jarak ke #1 (0,991565) masih ~0,016 dari v1 kita (0,975354) — v12
  menutup gap keterbacaan, bukan gap skor; peringkat baru kelihatan setelah
  juri menilai resubmit.
- v12 adalah BASIS v13 (rencana Gibran 00:10 WIB: submit v24 19 Nov dulu,
  cek leaderboard, kalau bagus terapkan polanya ke 18 Nov jadi v13 di atas
  v12). Prep resubmit v12 = tugas parent (pola v6/v7: check -> bundle ->
  worktree prep-v12 -> READY note; TMPDIR=~/workspace/.tmp-bundle; tambah
  usage row sesi build v12 ini ke muse-usage sebelum rebuild bundle).
  Deadline 18 Nov: 20 Nov 07:00 WIB — v12 + prep + submit harus muat.

## Prep resubmit v12 — 20 Nov ~00:35 WIB (sesi 88fd139d, BELUM disubmit, TIDAK push)
- Check v5 (bundle sebelumnya) di-run ulang 20 Nov ~00:30 WIB: ok:true, 0 fail (13 pass, 5 skip, 5 submission). File: news-image-20261118-check-v5-rerun.json.
- Usage: baris e1a4e3ec (build v12) ditambahkan ke muse-usage-news-image.jsonl (in 5.451.272/out 74.607, model ipnext/avocado-5.17-v2; kini 31 baris). Baris sesi prep ini (89d5b6f6) baru ada setelah sesi selesai — parent rebuild bundle v7 bila submit v12 (tambah row itu, re-check).
- Worktree repo-news-image-20261118-v12prep branch prep-v12, commit <sha>: main.ts -> entry-final-v12.png + entry-final-v12.png/svg + generate-final-v12.mjs + verify-final-v12.mjs + news-v12.json + scenes-ai/v12/ (13 PNG) + scenes-ai/v11/ (13 PNG, dipakai verifier untuk perbandingan sha) + STATUS.md.
- main.ts terverifikasi 2x (output sha = entry-final-v12.png 41ca5972…); verify-final-v12.mjs dari worktree: ALL GATES PASS (41/41).
- Bundle v6: <sha, diisi setelah bundle>
- Check v6: <diisi setelah check>
- Kit level: <catat; putuskan saat submit, jangan refresh diam-diam>

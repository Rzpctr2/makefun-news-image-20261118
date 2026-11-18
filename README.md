# The World in One Day — 18 November 2026

[![make.fun](https://make.fun/badge/news-image-20261118.svg)](https://make.fun/bounty/news-image-20261118)
[![rank](https://make.fun/badge/news-image-20261118/Rzpctr2/makefun-news-image-20261118/rank.svg)](https://make.fun/bounty/news-image-20261118)
[![reward](https://make.fun/badge/news-image-20261118/Rzpctr2/makefun-news-image-20261118/reward.svg)](https://make.fun/bounty/news-image-20261118)

A one-image summary of the world's news on Wednesday, 18 November 2026 — a
broadsheet front page in a faceted low-poly flat-vector style. Iran's strikes
on U.S. bases in the Gulf lead, a world map pins the day's six biggest
stories, and 16 stories from six continents fill the page. Every story was
checked against 18 November 2026 reporting, and the layout is built for
readability first: big lead headline, clear hierarchy, generous spacing —
readable even at thumbnail size.

Built for make.fun's [Sum up 18 November's world news in one image](https://make.fun/bounty/news-image-20261118) bounty ($250, 50 places paid).

## How it was made

`entry.png` (1024×1024, under 1 MiB) was rendered in-session by
`generate.mjs` (Node + @resvg/resvg-js) from the verified news data in
`news.json` — the poster is drawn as code (SVG), so every headline is sharp
and spelled correctly. `main.ts` is the entrypoint the grader runs: it
copies `entry.png` to `/output/entry.png` — deterministic, offline, the
same bytes on every run.

## Stories in the image

1. Iran hits U.S. bases in Gulf (lead)
2. Crimea bridge partly collapses
3. Xi, Putin defy sanctions in Shenzhen
4. Measles: 5,412 cases, 10 deaths
5. Ebola passes 11,000 cases in DRC
6. Voyager 1 reaches one light-day
7. Democrats take Senate, 56–44
8. Military plane crashes: 19 dead
9. Kahana wins Knesset speaker race
10. Quake 6.0 hits Papua New Guinea; 5.3 in Romania
11. Trump seals preliminary Thailand trade deal
12. Argentina backs Tenaris wind farm scheme
13. AI finds critical flaw in Java
14. Gaza cold kills in tents; board faults both sides
15. Myanmar junta reviews 'unfair' ASEAN ties
16. 'Human' is Cambridge Word of the Year

## License

MIT — see LICENSE.

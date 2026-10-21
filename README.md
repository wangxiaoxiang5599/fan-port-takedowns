# Fan and AI game port takedowns

A dataset of fan-made and AI-assisted ports of commercial video games (browser ports, PC ports, recompilations, decompilations) that were taken down after a copyright claim, with the rights holder, the dates, how long each port was online, and the evidence for every row.

It is the data behind the takedown tracker at **[portedgames.com/takedowns](https://portedgames.com/takedowns/)**, synced here once a day.

Overview page with charts and download links: **[wangxiaoxiang5599.github.io/fan-port-takedowns](https://wangxiaoxiang5599.github.io/fan-port-takedowns/)**.

## Summary

<!-- summary:start -->
**12 takedowns** between 2026-09-11 and 2026-10-19. Of the 9 with a known release date, the median port stayed online for **29 days**. 8 of 12 have no public GitHub DMCA notice.

| Rights holder | Takedowns |
|---|---|
| Activision | 5 |
| Mojang/Microsoft | 2 |
| Maddy Makes Games | 1 |
| Not named | 1 |
| Rockstar Games | 1 |
| SEGA | 1 |
| SNK | 1 |

| Taken down | Port | Game | Rights holder | How | Days online |
|---|---|---|---|---|---|
| 2026-10-19 | Eaglercraft repositories (Minecraft in the browser) | Minecraft | Mojang/Microsoft | GitHub DMCA | ? |
| 2026-10-17 | Open Victor Zulu: Global Flashpoint | Call of Duty: Modern Warfare 2 (2009) multiplayer | Not named | DMCA notice | 31 |
| 2026-10-14 | Celeste WebAssembly port (web-ports/celeste) | Celeste | Maddy Makes Games | GitHub DMCA | 321 |
| 2026-10-14 | OptiCraft Heritage Edition | Minecraft (classic era) | Mojang/Microsoft | GitHub DMCA | ? |
| 2026-10-10 | Claude of Duty: Vibe Slops II | Call of Duty: Black Ops II (map Hijacked) | Activision | DMCA notice | 32 |
| 2026-10-10 | Vibe Slops: Cheese Cube | Call of Duty: Black Ops III (custom Zombies map Cheese Cube) | Activision | DMCA notice | 2 |
| 2026-10-10 | Vibe Slops: Kino der Toten | Call of Duty: Black Ops (Zombies map Kino der Toten) | Activision | DMCA notice | 29 |
| 2026-10-10 | Vibe Slops: Moon | Call of Duty: Black Ops (Zombies map Moon) | Activision | DMCA notice | 26 |
| 2026-10-06 | GTA V browser port (playgta5.com) | Grand Theft Auto V | Rockstar Games | Not stated | 0 |
| 2026-10-03 | Modern Warfare 2 AI decompilation (momo5502) | Call of Duty: Modern Warfare 2 (2009, PC) | Activision | Not stated | ? |
| 2026-09-24 | PSO Reborn | Phantasy Star Online Episode I & II | SEGA | DMCA notice | 9 |
| 2026-09-11 | Metal Slug XX static recompilation (rexglue-MetalSlugXX) | Metal Slug XX (Xbox 360) | SNK | GitHub DMCA | 68 |
<!-- summary:end -->

## Files

| File | What |
|---|---|
| [`data/takedowns.json`](data/takedowns.json) | All rows, newest takedown first. |
| [`data/takedowns.csv`](data/takedowns.csv) | The same rows as CSV; `sources` is a space-separated list of URLs. |

## Fields

| Field | Meaning |
|---|---|
| `id` | Stable identifier. |
| `port` | What the port was called. |
| `game` | The original game. |
| `rightsHolder` | The company named in the notice or in the author's post. "Not named" when the site does not say. |
| `kind` | Browser port, Browser remake, PC port, Decompilation or Reimplementation. |
| `method` | DMCA notice, GitHub DMCA, Cease and desist, Pulled after a legal threat, or Not stated. |
| `live` | First public release (YYYY-MM-DD), when known. |
| `takenDown` | Date of the notice or the author's post (YYYY-MM-DD). |
| `daysOnline` | Days from `live` to `takenDown`; 0 means the same day. `null` when `live` is unknown. |
| `dateNote` | Set when a date is approximate, saying what it is based on. |
| `note` | One short factual note. |
| `entry` | The port's page on PortedGames, when it has one. |
| `sources` | Evidence, primary source first (the notice, the author's post, the site itself), then reporting. |

## How rows are added

PortedGames checks every port it lists once a day. Besides HTTP errors, the check reads the page text, because many ports keep their page and title after a takedown and only show a short notice. When a page reads like a takedown notice, a person reviews it and adds a row only when there is evidence of a copyright claim. Ports their authors closed on their own, ports that are only offline, and emulators or piracy tools are not counted. More on the method: [portedgames.com/takedowns](https://portedgames.com/takedowns/#how-we-track-takedowns).

No game files, ROMs or ISOs are hosted or linked, here or on the site. The sources are notices, posts and articles.

## Corrections

Know of a takedown that is missing, or a detail that is wrong? Open an issue with a source, or email contact@portedgames.com. Changes are made on the site and synced here, so pull requests to the data files will be overwritten.

## License

The data is available under [CC BY 4.0](LICENSE). Please credit "PortedGames" and link to https://portedgames.com/takedowns/.

// Renders index.html, the GitHub Pages landing page for the dataset: a summary, the latest rows,
// and how to download and use the data. The full, sourced table lives on portedgames.com/takedowns.
const SITE = 'https://portedgames.com';
const TRACKER = `${SITE}/takedowns/`;
const RAW = 'https://raw.githubusercontent.com/wangxiaoxiang5599/fan-port-takedowns/main/data';
const REPO = 'https://github.com/wangxiaoxiang5599/fan-port-takedowns';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${months[m - 1]} ${d}, ${y}`;
};

export function renderPage(rows) {
  const holders = new Map();
  for (const r of rows) holders.set(r.rightsHolder, (holders.get(r.rightsHolder) ?? 0) + 1);
  const byHolder = [...holders].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const top = byHolder[0][1];
  const days = rows.map((r) => r.daysOnline).filter((d) => d != null).sort((a, b) => a - b);
  const median = days.length ? (days.length % 2 ? days[(days.length - 1) / 2] : (days[days.length / 2 - 1] + days[days.length / 2]) / 2) : null;
  const notGithub = rows.filter((r) => r.method !== 'GitHub DMCA').length;
  const first = rows.at(-1).takenDown;
  const last = rows[0].takenDown;
  const latest = rows.slice(0, 6);
  const link = (r) => r.entry ?? `${TRACKER}#${r.id}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fan and AI Game Port Takedowns: Open Dataset</title>
<meta name="description" content="Open dataset of ${rows.length} fan and AI ports of commercial games taken down after copyright claims, with rights holders, dates and sources. JSON and CSV, CC BY 4.0.">
<style>
:root{--bg:#f7f6f2;--card:#fff;--ink:#1b1d22;--muted:#5d626d;--line:#e3e0d8;--accent:#e8590c;--bar:#f3c3a6}
@media (prefers-color-scheme:dark){:root{--bg:#0f1115;--card:#171a20;--ink:#e9eaee;--muted:#a0a5b0;--line:#2a2e37;--accent:#ff7a33;--bar:#5a3420}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.wrap{max-width:860px;margin:0 auto;padding:40px 16px 64px}
a{color:var(--accent)}
h1{font-size:clamp(1.7rem,4vw,2.4rem);line-height:1.15;margin:0 0 12px}
h2{font-size:1.2rem;margin:40px 0 12px}
.lead{color:var(--muted);margin:0 0 24px;max-width:62ch}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}
.stat{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px}
.stat b{display:block;font-size:1.6rem;line-height:1.2}
.stat span{color:var(--muted);font-size:.85rem}
.bars{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 16px}
.bar{display:grid;grid-template-columns:minmax(120px,170px) 1fr 2ch;gap:10px;align-items:center;padding:4px 0;font-size:.92rem}
.bar i{display:block;height:10px;border-radius:6px;background:var(--bar)}
.bar i span{display:block;height:100%;border-radius:6px;background:var(--accent)}
ul.latest{list-style:none;margin:0;padding:0;background:var(--card);border:1px solid var(--line);border-radius:12px}
ul.latest li{padding:12px 16px;border-top:1px solid var(--line)}
ul.latest li:first-child{border-top:0}
ul.latest small{display:block;color:var(--muted)}
pre{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 16px;overflow-x:auto;font-size:.85rem}
code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.dl{display:flex;flex-wrap:wrap;gap:10px}
.dl a{display:inline-block;padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:var(--card);text-decoration:none;color:var(--ink)}
footer{margin-top:48px;padding-top:16px;border-top:1px solid var(--line);color:var(--muted);font-size:.85rem}
</style>
</head>
<body>
<div class="wrap">
<h1>Fan and AI game port takedowns</h1>
<p class="lead">An open dataset of fan-made and AI-assisted ports of commercial video games (browser ports, PC ports, recompilations and decompilations) that were taken down after a copyright claim. It is the data behind the <a href="${TRACKER}">PortedGames takedown tracker</a>, where every row is listed with its evidence. Updated daily.</p>

<div class="stats">
<div class="stat"><b>${rows.length}</b><span>takedowns, ${esc(fmt(first))} to ${esc(fmt(last))}</span></div>
<div class="stat"><b>${median ?? '?'} days</b><span>median time online (${days.length} ports with a known release date)</span></div>
<div class="stat"><b>${notGithub} of ${rows.length}</b><span>never got a public GitHub DMCA notice</span></div>
<div class="stat"><b>${esc(byHolder[0][0])}</b><span>most active rights holder (${top})</span></div>
</div>

<h2>By rights holder</h2>
<div class="bars">
${byHolder.map(([h, n]) => `<div class="bar"><span>${esc(h)}</span><i><span style="width:${Math.round((n / top) * 100)}%"></span></i><span>${n}</span></div>`).join('\n')}
</div>

<h2>Latest takedowns</h2>
<ul class="latest">
${latest.map((r) => `<li><a href="${esc(link(r))}">${esc(r.port)}</a><small>${esc(r.game)} · ${esc(r.rightsHolder)} · ${esc(r.method)} · ${esc(fmt(r.takenDown))}</small></li>`).join('\n')}
</ul>
<p><a href="${TRACKER}">All ${rows.length} takedowns with sources on PortedGames →</a></p>

<h2>Download</h2>
<div class="dl">
<a href="${RAW}/takedowns.json">takedowns.json</a>
<a href="${RAW}/takedowns.csv">takedowns.csv</a>
<a href="${REPO}">Repository on GitHub</a>
</div>

<h2>Use it</h2>
<pre><code>// JavaScript
const rows = await (await fetch('${RAW}/takedowns.json')).json();
const byHolder = Object.groupBy(rows, (r) =&gt; r.rightsHolder);</code></pre>
<pre><code># Python
import pandas as pd
df = pd.read_csv('${RAW}/takedowns.csv', parse_dates=['live', 'takenDown'])
df.groupby('rightsHolder').size().sort_values(ascending=False)</code></pre>
<p>Each row has the port, the original game, the rights holder, the kind of port, how it was taken down, the release and takedown dates, days online, a short note and the sources. Field descriptions are in the <a href="${REPO}#fields">README</a>.</p>

<h2>Scope</h2>
<p>A port gets a row only with evidence of a copyright claim: the notice, the author's post, or a notice on the port's own site. Ports their authors closed on their own, ports that are just offline, and emulators or piracy tools are not counted. No game files, ROMs or ISOs are hosted or linked. Know of a missing takedown? <a href="${REPO}/issues">Open an issue</a> with a source.</p>

<footer>
Data: CC BY 4.0. Please credit <a href="${SITE}/">PortedGames</a>, a directory of fan and AI ports of classic games with their status checked daily, and link to <a href="${TRACKER}">${TRACKER}</a>. Related dataset: <a href="https://wangxiaoxiang5599.github.io/recompiled-games-list/">recompiled games list</a>, fan projects that turn console games into native PC programs.
</footer>
</div>
</body>
</html>
`;
}

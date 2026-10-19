#!/usr/bin/env node
// Pulls the takedown tracker from portedgames.com and writes data/takedowns.json, data/takedowns.csv
// and the summary block in README.md. Run by .github/workflows/sync.yml once a day; safe to run by hand.
import { readFileSync, writeFileSync } from 'node:fs';

const SOURCE = 'https://portedgames.com/takedowns.json';

const res = await fetch(SOURCE, { headers: { 'user-agent': 'fan-port-takedowns-sync (+https://github.com/wangxiaoxiang5599/fan-port-takedowns)' } });
if (!res.ok) throw new Error(`${SOURCE}: HTTP ${res.status}`);
const { takedowns } = await res.json();
if (!Array.isArray(takedowns) || takedowns.length === 0) throw new Error(`${SOURCE}: no rows`);

// Stable output: newest takedown first, then by id. Drop nothing; keep field order readable.
const rows = [...takedowns]
  .sort((a, b) => b.takenDown.localeCompare(a.takenDown) || a.id.localeCompare(b.id))
  .map((r) => ({
    id: r.id,
    port: r.port,
    game: r.game,
    rightsHolder: r.rightsHolder,
    kind: r.kind,
    method: r.method,
    live: r.live ?? null,
    takenDown: r.takenDown,
    daysOnline: r.daysOnline ?? null,
    dateNote: r.dateNote ?? null,
    note: r.note,
    entry: r.entry ?? null,
    sources: r.sources,
  }));

writeFileSync('data/takedowns.json', JSON.stringify(rows, null, 2) + '\n');

const cols = ['id', 'port', 'game', 'rightsHolder', 'kind', 'method', 'live', 'takenDown', 'daysOnline', 'dateNote', 'note', 'entry', 'sources'];
const cell = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => cell(c === 'sources' ? r.sources.map((s) => s.url).join(' ') : r[c])).join(','))];
writeFileSync('data/takedowns.csv', csv.join('\n') + '\n');

// README summary between the markers.
const holders = new Map();
for (const r of rows) holders.set(r.rightsHolder, (holders.get(r.rightsHolder) ?? 0) + 1);
const days = rows.map((r) => r.daysOnline).filter((d) => d != null).sort((a, b) => a - b);
const median = days.length ? (days.length % 2 ? days[(days.length - 1) / 2] : (days[days.length / 2 - 1] + days[days.length / 2]) / 2) : null;
const notGithub = rows.filter((r) => r.method !== 'GitHub DMCA').length;
const first = rows.at(-1).takenDown;
const last = rows[0].takenDown;
const md = (s) => String(s).replace(/\|/g, '\\|');

const summary = [
  `**${rows.length} takedowns** between ${first} and ${last}. Of the ${days.length} with a known release date, the median port stayed online for **${median} days**. ${notGithub} of ${rows.length} have no public GitHub DMCA notice.`,
  '',
  '| Rights holder | Takedowns |',
  '|---|---|',
  ...[...holders].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([h, n]) => `| ${md(h)} | ${n} |`),
  '',
  '| Taken down | Port | Game | Rights holder | How | Days online |',
  '|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.takenDown} | ${md(r.port)} | ${md(r.game)} | ${md(r.rightsHolder)} | ${r.method} | ${r.daysOnline ?? '?'} |`),
].join('\n');

const readme = readFileSync('README.md', 'utf8');
const start = '<!-- summary:start -->';
const end = '<!-- summary:end -->';
const i = readme.indexOf(start);
const j = readme.indexOf(end);
if (i < 0 || j < i) throw new Error('README.md is missing the summary markers');
writeFileSync('README.md', `${readme.slice(0, i + start.length)}\n${summary}\n${readme.slice(j)}`);

console.log(`${rows.length} rows, ${first}..${last}`);

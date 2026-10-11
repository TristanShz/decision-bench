// Tableaux de résultats en Markdown, à partir des rapports de reports/ : yarn results [suite[@version]…]
// Pour chaque suite, seule la dernière version est retenue (ou celle demandée, ex. core-fr@2),
// et pour chaque modèle son rapport complet le plus récent.
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { caseStats, confidence, type Interval } from '../src/bench/stats.ts'
import type { BenchReport } from '../src/bench/types.ts'

const dir = path.resolve(import.meta.dirname, '../reports')
const args = process.argv.slice(2).map((a) => a.split('@'))
const only = args.map(([suite]) => suite)
const pinned = new Map(args.filter(([, v]) => v).map(([suite, v]) => [suite, Number(v)]))

const all: BenchReport[] = []
for (const f of (await readdir(dir)).filter((f) => f.endsWith('.json'))) {
  const r = JSON.parse(await readFile(path.join(dir, f), 'utf8')) as BenchReport
  if (!r.aborted) all.push(r)
}
// Des versions différentes d'une suite n'ont pas les mêmes cas : on ne les mélange pas dans un tableau.
const suiteOf = (r: BenchReport) => r.suiteId ?? 'multilingual'
const versionOf = (r: BenchReport) => Number(r.suiteVersion) || 0
const version = new Map(pinned)
for (const r of all) if (!pinned.has(suiteOf(r))) version.set(suiteOf(r), Math.max(version.get(suiteOf(r)) ?? 0, versionOf(r)))
const reports = all.filter((r) => versionOf(r) === version.get(suiteOf(r)))

const pct = (v: number | null) => (v == null ? '—' : `${(v * 100).toFixed(1)} %`)
const ci = (i: Interval | null) => (i ? `${(i.lo * 100).toFixed(0)}–${(i.hi * 100).toFixed(0)}` : '—')
const ms = (v: number) => `${Math.round(v).toLocaleString('en-US').replace(/,/g, ' ')} ms`
const model = (r: BenchReport) => (/openrouter/.test(r.target.url) ? `\`${r.target.model}\` (OpenRouter)` : `${r.target.label}${r.target.serverModel ? ` (${r.target.serverModel})` : ''}`)

const bySuite = new Map<string, Map<string, BenchReport>>()
for (const r of reports) {
  const suite = r.suiteId ?? 'multilingual'
  if (only.length && !only.includes(suite)) continue
  const models = bySuite.get(suite) ?? new Map<string, BenchReport>()
  const key = `${r.target.url}|${r.target.model}`
  const prev = models.get(key)
  if (!prev || prev.createdAt < r.createdAt) models.set(key, r)
  bySuite.set(suite, models)
}

for (const [suite, models] of [...bySuite].sort()) {
  const rows = [...models.values()].sort((a, b) => (b.summary.quality ?? 0) - (a.summary.quality ?? 0))
  const r0 = rows[0]
  const c0 = confidence(r0.cases)
  console.log(`\n### ${suite}\n`)
  console.log(`Suite \`${suite}\` v${r0.suiteVersion} · ${r0.summary.cases} cases, ${c0.questions} questions · ${r0.settings.repetitions} runs per case`)
  console.log('\n| Model | Quality (95 % CI) | Accuracy (95 % CI) | Stability | p50 latency | p95 latency | Cost / 1k requests | Missed questions |')
  console.log('|---|---:|---:|---:|---:|---:|---:|---:|')
  for (const r of rows) {
    const s = r.summary
    const c = confidence(r.cases)
    const missed = r.cases.reduce((n, cs) => n + Object.values(caseStats(cs).questions).filter((q) => q.accuracy != null && q.accuracy < 1).length, 0)
    const cost = s.cost != null && s.ok ? `$${((s.cost / s.ok) * 1000).toFixed(3)}` : '—'
    console.log(`| ${model(r)} | ${pct(s.quality)} (${ci(c.quality)}) | ${pct(s.accuracy)} (${ci(c.accuracy)}) | ${pct(s.consistency)} | ${ms(s.latency.p50)} | ${ms(s.latency.p95)} | ${cost} | ${missed} |`)
  }
}

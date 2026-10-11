// Comparaison appariée d'une paire traduite (ex. core-fr / core-en) : yarn paired [famille[@version]]
// Chaque question existe dans les deux langues avec le même identifiant : on compare la même
// question d'une langue à l'autre, ce qui élimine l'effet du contenu.
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { caseStats } from '../src/bench/stats.ts'
import type { BenchReport } from '../src/bench/types.ts'

const dir = path.resolve(import.meta.dirname, '../reports')
const [family, pinned] = (process.argv[2] ?? 'core').split('@')
const [a, b] = ['fr', 'en'].map((l) => `${family}-${l}`)

const all: BenchReport[] = []
for (const f of (await readdir(dir)).filter((f) => f.endsWith('.json'))) {
  const r = JSON.parse(await readFile(path.join(dir, f), 'utf8')) as BenchReport
  if (!r.aborted && (r.suiteId === a || r.suiteId === b)) all.push(r)
}
// Seule la dernière version de la famille (ou celle demandée) est comparée : les cas changent d'une version à l'autre.
const version = pinned ? Number(pinned) : Math.max(0, ...all.map((r) => Number(r.suiteVersion) || 0))
const latest = new Map<string, BenchReport>()
for (const r of all) {
  if ((Number(r.suiteVersion) || 0) !== version) continue
  const key = `${r.suiteId}|${r.target.url}|${r.target.model}`
  const prev = latest.get(key)
  if (!prev || prev.createdAt < r.createdAt) latest.set(key, r)
}

/** Qualité et exactitude par question, indexées par « cas/question ». */
function perQuestion(r: BenchReport) {
  const m = new Map<string, { accuracy: number; quality: number }>()
  for (const c of r.cases)
    for (const [qid, q] of Object.entries(caseStats(c).questions))
      if (q.accuracy != null && q.quality != null) m.set(`${c.meta.id}/${qid}`, { accuracy: q.accuracy, quality: q.quality })
  return m
}

const pts = (v: number) => (Math.abs(v) < 0.0005 ? '0.0' : `${v > 0 ? '+' : '−'}${Math.abs(v * 100).toFixed(1)}`)
const model = (r: BenchReport) => (/openrouter/.test(r.target.url) ? `\`${r.target.model}\` (OpenRouter)` : `${r.target.label}${r.target.serverModel ? ` (${r.target.serverModel})` : ''}`)

console.log(`| Model | Quality ${a} − ${b} (95 % CI) | Accuracy ${a} − ${b} (95 % CI) | Right only in ${a} | Right only in ${b} |`)
console.log('|---|---:|---:|---:|---:|')
const quality = (r: BenchReport) => r.summary.quality ?? 0
for (const ra of [...latest.values()].filter((r) => r.suiteId === a).sort((x, y) => quality(y) - quality(x))) {
  const rb = [...latest.values()].find((r) => r.suiteId === b && r.target.url === ra.target.url && r.target.model === ra.target.model)
  if (!rb) continue
  const qa = perQuestion(ra)
  const qb = perQuestion(rb)
  const dq: number[] = []
  const da: number[] = []
  let onlyA = 0
  let onlyB = 0
  for (const [k, x] of qa) {
    const y = qb.get(k)
    if (!y) continue
    dq.push(x.quality - y.quality)
    da.push(x.accuracy - y.accuracy)
    if (x.accuracy >= 0.5 && y.accuracy < 0.5) onlyA++
    if (y.accuracy >= 0.5 && x.accuracy < 0.5) onlyB++
  }
  const ci = (d: number[]) => {
    const n = d.length
    const mean = d.reduce((s, x) => s + x, 0) / n
    const sd = Math.sqrt(d.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1))
    const h = (1.96 * sd) / Math.sqrt(n)
    return `${pts(mean)} (${pts(mean - h)} to ${pts(mean + h)})`
  }
  console.log(`| ${model(ra)} | ${ci(dq)} | ${ci(da)} | ${onlyA} | ${onlyB} |`)
}

import { useMemo, useState } from 'react'
import { answerLabel, caseStats, decision, fmtMs, fmtNum, fmtPct, fmtUsd, formatExpected, grade, type CaseStats } from './stats'
import { LEGACY_SUITE_ID } from './suites'
import type { BenchReport, CaseResult, GroupStats } from './types'
import { Scatter } from './ui'
import { TYPE_LABEL } from '../draft'
import type { QType } from '../types'

const LETTERS = ['A', 'B', 'C', 'D']
const COLORS = ['var(--accent)', 'var(--score)', 'var(--noul)', 'var(--choice)']

interface Metric {
  label: string
  values: (number | null)[]
  fmt: (v: number | null) => string
  /** Sens favorable : 'low' = plus petit est meilleur. */
  better: 'low' | 'high'
  /** Écart exprimé en points (pourcentages) plutôt qu'en relatif. */
  points?: boolean
}

/** Indices des meilleurs rapports ; vide si tous sont à égalité (écart < 2 % relatif ou < 0,5 point). */
function winners(m: Metric): number[] {
  const vals = m.values.map((v, i) => ({ v, i })).filter((x): x is { v: number; i: number } => x.v != null)
  if (vals.length < 2) return []
  const best = m.better === 'low' ? Math.min(...vals.map((x) => x.v)) : Math.max(...vals.map((x) => x.v))
  const tol = (v: number) => (m.points ? 0.005 : Math.max(Math.abs(v), Math.abs(best)) * 0.02)
  const top = vals.filter((x) => Math.abs(x.v - best) <= tol(x.v)).map((x) => x.i)
  return top.length === vals.length ? [] : top
}

/** Écart d'une valeur par rapport à la référence A. */
function delta(m: Metric, i: number): string {
  const a = m.values[0]
  const b = m.values[i]
  if (i === 0 || a == null || b == null) return ''
  if (m.points) {
    const d = (b - a) * 100
    return `${d > 0 ? '+' : ''}${d.toFixed(1)} pt`
  }
  if (a === 0 || b === 0) return ''
  const r = b / a
  return r >= 1 ? `×${r.toFixed(2)}` : `÷${(1 / r).toFixed(2)}`
}

function metrics(reports: BenchReport[]): Metric[] {
  const S = reports.map((r) => r.summary)
  // Sans aucune requête réussie, les latences valent 0 : on les traite comme absentes.
  const lat = (f: (l: BenchReport['summary']['latency']) => number) => S.map((s) => (s.latency.n ? f(s.latency) : null))
  const ms = (v: number | null) => fmtMs(v)
  const pct = (v: number | null) => fmtPct(v)
  return [
    { label: 'Latence p50', values: lat((l) => l.p50), fmt: ms, better: 'low' },
    { label: 'Latence p95', values: lat((l) => l.p95), fmt: ms, better: 'low' },
    { label: 'Latence p99', values: lat((l) => l.p99), fmt: ms, better: 'low' },
    { label: 'Latence moyenne', values: lat((l) => l.mean), fmt: ms, better: 'low' },
    { label: 'Latence max', values: lat((l) => l.max), fmt: ms, better: 'low' },
    { label: 'Écart-type latence', values: lat((l) => l.stdev), fmt: ms, better: 'low' },
    { label: 'ms par token (médiane)', values: S.map((s) => s.msPerToken), fmt: (v) => fmtNum(v, 2), better: 'low' },
    { label: 'Débit d’entrée (tok/s)', values: S.map((s) => s.tokensPerSec), fmt: (v) => fmtNum(v), better: 'high' },
    { label: 'Requêtes / s', values: S.map((s) => s.requestsPerSec), fmt: (v) => fmtNum(v, 2), better: 'high' },
    { label: 'Coût pour 1 000 requêtes', values: S.map((s) => (s.cost != null && s.ok ? (s.cost / s.ok) * 1000 : null)), fmt: (v) => fmtUsd(v), better: 'low' },
    { label: 'Taux d’erreur', values: S.map((s) => s.errorRate), fmt: pct, better: 'low', points: true },
    { label: 'Exactitude', values: S.map((s) => s.accuracy), fmt: pct, better: 'high', points: true },
    { label: 'Qualité', values: S.map((s) => s.quality), fmt: pct, better: 'high', points: true },
    { label: 'Stabilité', values: S.map((s) => s.consistency), fmt: pct, better: 'high', points: true },
  ]
}

interface CaseRow {
  id: string
  meta: CaseResult['meta']
  stats: CaseStats[]
  /** Part des questions où tous les rapports prennent la même décision (1er essai). */
  agreement: number | null
}

interface Divergence {
  caseName: string
  qid: string
  type: string
  expected: string
  answers: { label: string; ok: boolean | null }[]
}

function compareCases(reports: BenchReport[]) {
  const maps = reports.map((r) => new Map(r.cases.map((c) => [c.meta.id, c])))
  const rows: CaseRow[] = []
  const divergences: Divergence[] = []
  for (const c0 of reports[0].cases) {
    const cs = maps.map((m) => m.get(c0.meta.id))
    if (cs.some((c) => !c)) continue
    const stats = cs.map((c) => caseStats(c!))
    let same = 0
    let n = 0
    for (const [qid, q] of Object.entries(c0.meta.questions)) {
      const firsts = stats.map((s) => s.questions[qid]?.first)
      if (firsts.some((f) => !f)) continue
      n++
      const ds = firsts.map((f) => decision(f!))
      if (ds.every((d) => d === ds[0])) same++
      else
        divergences.push({
          caseName: c0.meta.name,
          qid,
          type: q.type,
          expected: formatExpected(q.expected, q.type),
          answers: firsts.map((f, i) => ({ label: answerLabel(f), ok: grade(f!, cs[i]!.meta.questions[qid] ?? q)?.correct ?? null })),
        })
    }
    rows.push({ id: c0.meta.id, meta: c0.meta, stats, agreement: n ? same / n : null })
  }
  const allIds = new Set(reports.flatMap((r) => r.cases.map((c) => c.meta.id)))
  const missing = [...allIds].filter((id) => maps.some((m) => !m.has(id)))
  return { rows, divergences, missing }
}

function warningsFor(reports: BenchReport[], missing: string[]): string[] {
  const w: string[] = []
  const distinct = (f: (r: BenchReport) => unknown) => new Set(reports.map(f)).size > 1
  const suite = (r: BenchReport) => r.suiteId ?? LEGACY_SUITE_ID
  // Convention <nom>-<langue> : mêmes cas traduits (core-fr, core-en).
  const family = (r: BenchReport) => suite(r).replace(/-[a-z]{2}$/, '')
  if (distinct(suite) && !distinct(family) && !distinct((r) => r.suiteVersion))
    w.push(`Même benchmark en plusieurs langues (${reports.map((r, i) => `${LETTERS[i]} : ${suite(r)}`).join(', ')}) : chaque cas est comparé à sa traduction.`)
  else if (distinct(suite)) w.push(`Suites différentes (${reports.map((r, i) => `${LETTERS[i]} : ${r.suiteId ?? LEGACY_SUITE_ID}`).join(', ')}) : seuls les cas communs sont comparés.`)
  else if (distinct((r) => r.suiteVersion)) w.push(`Versions de suite différentes (${reports.map((r, i) => `${LETTERS[i]} : v${r.suiteVersion}`).join(', ')}).`)
  if (distinct((r) => r.settings.concurrency)) w.push('Concurrence différente : les débits et latences ne sont pas directement comparables.')
  if (distinct((r) => r.settings.repetitions)) w.push('Nombre d’essais différent.')
  if (distinct((r) => r.target.proxy)) w.push('Certains rapports passent par le proxy : leur latence est mesurée côté proxy, les autres incluent le saut navigateur (≈ quelques ms).')
  if (distinct((r) => r.target.kind ?? 'systemone'))
    w.push('Un rapport passe par l’adaptateur chat : un appel par question, state répété à chaque appel (tokens comptés en conséquence), probabilités issues des logprobs.')
  if (missing.length) w.push(`${missing.length} cas absent(s) d’au moins un rapport, ignoré(s) dans le détail : ${missing.join(', ')}.`)
  if (reports.some((r) => r.aborted)) w.push('Au moins un rapport a été interrompu.')
  return w
}

function toMarkdown(reports: BenchReport[], ms: Metric[], rows: CaseRow[]): string {
  const L = reports.map((_, i) => LETTERS[i])
  return [
    `# Comparaison : ${reports.map((r) => r.target.label).join(' vs ')}`,
    '',
    ...reports.map(
      (r, i) =>
        `- **${L[i]}** : ${r.name} — ${r.target.url} (${r.target.serverModel ?? r.target.model}), ${new Date(r.createdAt).toLocaleString('fr-FR')}, ${r.settings.repetitions} essais, concurrence ${r.settings.concurrency}`,
    ),
    '',
    `| Métrique | ${L.join(' | ')} | Meilleur |`,
    `|---|${L.map(() => '---').join('|')}|---|`,
    ...ms.map((m) => {
      const w = winners(m)
      return `| ${m.label} | ${m.values.map((v, i) => `${m.fmt(v)}${delta(m, i) ? ` (${delta(m, i)})` : ''}`).join(' | ')} | ${w.length ? w.map((i) => L[i]).join(', ') : '='} |`
    }),
    '',
    `| Cas | Profil | ${L.map((l) => `p50 ${l}`).join(' | ')} | ${L.map((l) => `Exact. ${l}`).join(' | ')} | Accord |`,
    `|---|---|${L.map(() => '---').join('|')}|${L.map(() => '---').join('|')}|---|`,
    ...rows.map(
      (r) =>
        `| ${r.meta.name} | ${r.meta.complexity}, ${r.meta.length} | ${r.stats.map((s) => fmtMs(s.latency.p50)).join(' | ')} | ${r.stats.map((s) => fmtPct(s.accuracy, 0)).join(' | ')} | ${fmtPct(r.agreement, 0)} |`,
    ),
  ].join('\n')
}

function Letter({ i }: { i: number }) {
  return <span className="letter" style={{ background: COLORS[i] }}>{LETTERS[i]}</span>
}

function GroupCompare({ title, groups }: { title: string; groups: GroupStats[][] }) {
  const keys = [...new Set(groups.flatMap((g) => g.map((x) => x.key)))]
  return (
    <div className="tablewrap">
      <table className="btable static">
        <thead>
          <tr>
            <th>{title}</th>
            {groups.map((_, i) => <th key={`l${i}`}>p50 <Letter i={i} /></th>)}
            {groups.map((_, i) => <th key={`a${i}`}>Exact. <Letter i={i} /></th>)}
          </tr>
        </thead>
        <tbody>
          {keys.map((k) => {
            const gs = groups.map((g) => g.find((x) => x.key === k))
            const p50 = gs.map((g) => g?.latency.p50 || null)
            const acc = gs.map((g) => g?.accuracy ?? null)
            const bestP = Math.min(...p50.filter((v): v is number => v != null))
            const bestA = Math.max(...acc.filter((v): v is number => v != null))
            return (
              <tr key={k}>
                <td>{k}</td>
                {p50.map((v, i) => <td key={`l${i}`} className={`num ${v != null && v === bestP ? 'good' : ''}`}>{fmtMs(v)}</td>)}
                {acc.map((v, i) => <td key={`a${i}`} className={`num ${v != null && v === bestA && acc.some((x) => x !== v) ? 'good' : ''}`}>{fmtPct(v)}</td>)}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

interface Props {
  reports: BenchReport[]
  /** Place le rapport i en référence (position A). */
  onReference: (i: number) => void
  onRemove: (i: number) => void
}

export function CompareView({ reports, onReference, onRemove }: Props) {
  const ms = useMemo(() => metrics(reports), [reports])
  const { rows, divergences, missing } = useMemo(() => compareCases(reports), [reports])
  const [copied, setCopied] = useState(false)
  const warnings = warningsFor(reports, missing)

  const maxP50 = Math.max(1, ...rows.flatMap((r) => r.stats.map((s) => s.latency.p50)))
  const agreements = rows.map((r) => r.agreement).filter((x): x is number => x != null)
  const agreementAll = agreements.length ? agreements.reduce((s, x) => s + x, 0) / agreements.length : null
  const wins = reports.map((_, i) => ms.filter((m) => winners(m).includes(i)).length)

  const copyMd = async () => {
    await navigator.clipboard.writeText(toMarkdown(reports, ms, rows))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="report">
      <div className="cmp-head">
        {reports.map((r, i) => (
          <div key={r.id} className="cmp-side" style={{ borderTop: `3px solid ${COLORS[i]}` }}>
            <div className="cmp-letter" style={{ background: COLORS[i] }}>{LETTERS[i]}</div>
            <div className="grow" style={{ minWidth: 0 }}>
              <div className="strong">{r.target.label}{i === 0 && <span className="muted small"> · référence</span>}</div>
              <div className="muted small ellipsis">{r.name}</div>
              <div className="muted small mono ellipsis">{r.target.serverModel ?? r.target.model} · {new Date(r.createdAt).toLocaleString('fr-FR')}</div>
              <div className="small">meilleur sur {wins[i]} métrique(s)</div>
            </div>
            <div className="cmp-actions">
              {i > 0 && <button className="link small" onClick={() => onReference(i)}>Référence</button>}
              {reports.length > 2 && <button className="icon danger" title="Retirer de la comparaison" onClick={() => onRemove(i)}>✕</button>}
            </div>
          </div>
        ))}
      </div>
      <div className="row" style={{ marginBottom: 10 }}>
        <span className="pill">accord des décisions {fmtPct(agreementAll)}</span>
        <span className="muted small">Écarts calculés par rapport à A.</span>
        <div className="spacer" />
        <button className="ghost" onClick={copyMd}>{copied ? 'Copié ✓' : 'Copier en Markdown'}</button>
      </div>
      {warnings.length > 0 && <ul className="warnings">{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>}

      <h3>Métriques globales</h3>
      <div className="tablewrap">
        <table className="btable static">
          <thead>
            <tr>
              <th>Métrique</th>
              {reports.map((_, i) => <th key={i}><Letter i={i} /></th>)}
            </tr>
          </thead>
          <tbody>
            {ms.map((m) => {
              const w = winners(m)
              return (
                <tr key={m.label}>
                  <td>{m.label}</td>
                  {m.values.map((v, i) => (
                    <td key={i} className={`num ${w.includes(i) ? 'good' : ''}`}>
                      {m.fmt(v)}
                      {delta(m, i) && <span className="delta">{delta(m, i)}</span>}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h3>Latence selon la taille de la requête</h3>
      <Scatter
        xLabel="tokens en entrée"
        yLabel="latence"
        series={reports.map((r, i) => ({
          name: `${LETTERS[i]} · ${r.target.label}`,
          color: COLORS[i],
          points: r.cases.flatMap((c) => c.runs.filter((x) => x.ok && x.inputTokens).map((x) => ({ x: x.inputTokens!, y: x.ms, label: c.meta.name }))),
        }))}
      />

      <h3>Par groupe</h3>
      <div className="groups">
        <GroupCompare title="Longueur" groups={reports.map((r) => r.summary.byLength)} />
        <GroupCompare title="Complexité" groups={reports.map((r) => r.summary.byComplexity)} />
      </div>
      <GroupCompare title="Catégorie" groups={reports.map((r) => r.summary.byCategory)} />
      {reports.some((r) => (r.summary.byLang?.length ?? 0) > 1) && <GroupCompare title="Langue" groups={reports.map((r) => r.summary.byLang ?? [])} />}

      <h3>Par cas</h3>
      <div className="tablewrap">
        <table className="btable static">
          <thead>
            <tr>
              <th>Cas</th>
              <th style={{ minWidth: 190 }}>Latence p50</th>
              {reports.map((_, i) => <th key={i}>Exact. <Letter i={i} /></th>)}
              <th>Accord</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const accs = r.stats.map((s) => s.accuracy)
              const bestA = Math.max(...accs.filter((v): v is number => v != null))
              return (
                <tr key={r.id}>
                  <td>
                    <span className="strong">{r.meta.name}</span>
                    <div className="muted small">{r.meta.complexity} · {r.meta.length} · {fmtNum(r.stats[0].inputTokens)} tok</div>
                  </td>
                  <td>
                    {r.stats.map((s, i) => (
                      <div key={i} className="duo">
                        <div className="duo-bar" style={{ width: `${(s.latency.p50 / maxP50) * 100}%`, background: COLORS[i] }} />
                        <span className="mono small">{fmtMs(s.latency.p50)}</span>
                      </div>
                    ))}
                  </td>
                  {accs.map((v, i) => (
                    <td key={i} className={`num ${v != null && v === bestA && accs.some((x) => x !== v) ? 'good' : ''}`}>{fmtPct(v, 0)}</td>
                  ))}
                  <td className={`num ${r.agreement == null ? '' : r.agreement === 1 ? 'good' : 'warn'}`}>{fmtPct(r.agreement, 0)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h3>Divergences de décision <span className="muted">({divergences.length})</span></h3>
      {divergences.length === 0 ? (
        <div className="muted small">Tous les rapports prennent les mêmes décisions sur les questions communes (1er essai).</div>
      ) : (
        <div className="tablewrap">
          <table className="btable static">
            <thead>
              <tr>
                <th>Cas</th>
                <th>Question</th>
                <th>Attendu</th>
                {reports.map((_, i) => <th key={i}><Letter i={i} /></th>)}
              </tr>
            </thead>
            <tbody>
              {divergences.map((d, k) => (
                <tr key={k}>
                  <td>{d.caseName}</td>
                  <td><span className={`badge badge-${d.type}`} title={d.type}>{TYPE_LABEL[d.type as QType] ?? d.type}</span> <span className="mono">{d.qid}</span></td>
                  <td className="mono">{d.expected}</td>
                  {d.answers.map((a, i) => (
                    <td key={i} className={`mono ${a.ok == null ? '' : a.ok ? 'good' : 'bad'}`}>{a.label}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

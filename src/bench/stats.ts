import type { Answer } from '../types'
import type { BenchReport, CaseQuestionMeta, CaseResult, Expectation, GroupStats, LatencyStats, Summary } from './types'

export function percentile(sorted: number[], p: number): number {
  if (!sorted.length) return 0
  const i = (sorted.length - 1) * p
  const lo = Math.floor(i)
  const hi = Math.ceil(i)
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo)
}

export function latencyStats(values: number[]): LatencyStats {
  const s = [...values].sort((a, b) => a - b)
  const n = s.length
  const mean = n ? s.reduce((a, b) => a + b, 0) / n : 0
  const stdev = n > 1 ? Math.sqrt(s.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)) : 0
  return {
    n,
    mean,
    min: s[0] ?? 0,
    p50: percentile(s, 0.5),
    p90: percentile(s, 0.9),
    p95: percentile(s, 0.95),
    p99: percentile(s, 0.99),
    max: s[n - 1] ?? 0,
    stdev,
  }
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null)
const defined = (xs: (number | null)[]) => xs.filter((x): x is number => x != null)

/** Décision discrète d'une réponse, pour comparer correction, stabilité et accord. */
export function decision(a: Answer): string {
  if (a.type === 'noul') return a.noul >= 0.5 ? 'oui' : 'non'
  if (a.type === 'choice') return a.choice
  return String(Math.round(a.score))
}

export function formatExpected(e: Expectation | undefined, type: string): string {
  if (e === undefined) return '—'
  if (typeof e === 'boolean') return e ? 'oui' : 'non'
  if (Array.isArray(e)) {
    if (type === 'noul' && typeof e[0] === 'number') return `${Math.round(Number(e[0]) * 100)}–${Math.round(Number(e[1]) * 100)} %`
    return type === 'score' ? `${e[0]}–${e[1]}` : e.join(' | ')
  }
  return String(e)
}

const dist = (v: number, lo: number, hi: number) => (v < lo ? lo - v : v > hi ? v - hi : 0)

export interface Grade {
  correct: boolean
  /** 0..1, continu : récompense une distribution qui penche vers la bonne réponse. */
  quality: number
}

export function grade(a: Answer, q: CaseQuestionMeta): Grade | null {
  const e = q.expected
  if (e === undefined || a.type !== q.type) return null
  if (a.type === 'noul') {
    if (typeof e === 'boolean') return { correct: a.noul >= 0.5 === e, quality: e ? a.noul : 1 - a.noul }
    if (Array.isArray(e) && typeof e[0] === 'number') {
      const [lo, hi] = e as [number, number]
      return { correct: a.noul >= lo && a.noul <= hi, quality: 1 - dist(a.noul, lo, hi) }
    }
    return null
  }
  if (a.type === 'choice') {
    const ok = new Set((Array.isArray(e) ? e : [e]).map(String))
    const p = Object.entries(a.probabilities).reduce((s, [k, v]) => s + (ok.has(k) ? v : 0), 0)
    return { correct: ok.has(a.choice), quality: Math.min(1, p) }
  }
  const [lo, hi] = Array.isArray(e) ? (e as [number, number]) : [Number(e), Number(e)]
  const span = Math.max(1, q.size - 1)
  return { correct: a.score >= lo - 0.5 && a.score <= hi + 0.5, quality: 1 - Math.min(1, dist(a.score, lo, hi) / span) }
}

export interface QuestionStats {
  answered: number
  accuracy: number | null
  quality: number | null
  /** 1 si toutes les répétitions donnent la même décision. */
  consistent: boolean | null
  decisions: string[]
  first?: Answer
}

export interface CaseStats {
  latency: LatencyStats
  inputTokens: number | null
  ok: number
  errors: string[]
  accuracy: number | null
  quality: number | null
  consistency: number | null
  questions: Record<string, QuestionStats>
}

export function caseStats(c: CaseResult): CaseStats {
  const okRuns = c.runs.filter((r) => r.ok && r.answers)
  const questions: Record<string, QuestionStats> = {}
  for (const [qid, q] of Object.entries(c.meta.questions)) {
    const answers = okRuns.map((r) => r.answers![qid]).filter(Boolean)
    const grades = answers.map((a) => grade(a, q)).filter((g): g is Grade => g != null)
    const decisions = answers.map(decision)
    questions[qid] = {
      answered: answers.length,
      accuracy: avg(grades.map((g) => (g.correct ? 1 : 0))),
      quality: avg(grades.map((g) => g.quality)),
      consistent: decisions.length > 1 ? decisions.every((d) => d === decisions[0]) : null,
      decisions,
      first: answers[0],
    }
  }
  const qs = Object.values(questions)
  const tokens = okRuns.map((r) => r.inputTokens).filter((t): t is number => t != null)
  return {
    latency: latencyStats(okRuns.map((r) => r.ms)),
    inputTokens: tokens.length ? Math.round(percentile([...tokens].sort((a, b) => a - b), 0.5)) : null,
    ok: okRuns.length,
    errors: [...new Set(c.runs.filter((r) => !r.ok).map((r) => r.error ?? `HTTP ${r.status}`))],
    accuracy: avg(defined(qs.map((q) => q.accuracy))),
    quality: avg(defined(qs.map((q) => q.quality))),
    consistency: avg(qs.filter((q) => q.consistent != null).map((q) => (q.consistent ? 1 : 0))),
    questions,
  }
}

function groupBy(cases: CaseResult[], stats: CaseStats[], key: (c: CaseResult) => string): GroupStats[] {
  const groups = new Map<string, number[]>()
  cases.forEach((c, i) => groups.set(key(c), [...(groups.get(key(c)) ?? []), i]))
  return [...groups.entries()].map(([k, idx]) => {
    const qs = idx.flatMap((i) => Object.values(stats[i].questions))
    return {
      key: k,
      cases: idx.length,
      latency: latencyStats(idx.flatMap((i) => cases[i].runs.filter((r) => r.ok).map((r) => r.ms))),
      accuracy: avg(defined(qs.map((q) => q.accuracy))),
      quality: avg(defined(qs.map((q) => q.quality))),
    }
  })
}

const LENGTH_ORDER = ['court', 'moyen', 'long', 'très long']

/** mainLang : langue de la suite, affichée en premier dans la répartition par langue. */
export function summarize(cases: CaseResult[], durationMs: number, mainLang?: string): Summary {
  const stats = cases.map(caseStats)
  const runs = cases.flatMap((c) => c.runs)
  const ok = runs.filter((r) => r.ok)
  const withTokens = ok.filter((r) => r.inputTokens)
  const qs = stats.flatMap((s) => Object.values(s.questions))

  const byType: Summary['byType'] = {}
  for (const type of new Set(cases.flatMap((c) => Object.values(c.meta.questions).map((q) => q.type)))) {
    const st = cases.flatMap((c, i) =>
      Object.entries(c.meta.questions)
        .filter(([, q]) => q.type === type)
        .map(([qid]) => stats[i].questions[qid]),
    )
    byType[type] = { questions: st.length, accuracy: avg(defined(st.map((q) => q.accuracy))), quality: avg(defined(st.map((q) => q.quality))) }
  }

  const tokSum = withTokens.reduce((s, r) => s + r.inputTokens!, 0)
  const msSum = withTokens.reduce((s, r) => s + r.ms, 0)
  const perTok = withTokens.map((r) => r.ms / r.inputTokens!).sort((a, b) => a - b)

  return {
    cases: cases.length,
    requests: runs.length,
    ok: ok.length,
    errorRate: runs.length ? (runs.length - ok.length) / runs.length : 0,
    latency: latencyStats(ok.map((r) => r.ms)),
    inputTokens: ok.reduce((s, r) => s + (r.inputTokens ?? 0), 0),
    cost: runs.some((r) => r.cost != null) ? runs.reduce((s, r) => s + (r.cost ?? 0), 0) : null,
    tokensPerSec: msSum ? tokSum / (msSum / 1000) : null,
    msPerToken: perTok.length ? percentile(perTok, 0.5) : null,
    requestsPerSec: durationMs ? ok.length / (durationMs / 1000) : 0,
    accuracy: avg(defined(qs.map((q) => q.accuracy))),
    quality: avg(defined(qs.map((q) => q.quality))),
    consistency: avg(qs.filter((q) => q.consistent != null).map((q) => (q.consistent ? 1 : 0))),
    byType,
    byLength: groupBy(cases, stats, (c) => c.meta.length).sort((a, b) => LENGTH_ORDER.indexOf(a.key) - LENGTH_ORDER.indexOf(b.key)),
    byComplexity: groupBy(cases, stats, (c) => c.meta.complexity).sort((a, b) => a.key.localeCompare(b.key)),
    byCategory: groupBy(cases, stats, (c) => c.meta.category).sort((a, b) => a.key.localeCompare(b.key)),
    byLang: groupBy(cases, stats, (c) => c.meta.lang).sort((a, b) => (a.key === mainLang ? -1 : b.key === mainLang ? 1 : a.key.localeCompare(b.key))),
  }
}

export const reportStats = (r: BenchReport) => r.cases.map(caseStats)

export interface Interval {
  lo: number
  hi: number
}

/** Intervalle de Wilson à 95 % pour une proportion k / n (k peut être fractionnaire : moyenne des essais). */
export function wilson(k: number, n: number, z = 1.96): Interval | null {
  if (!n) return null
  const p = k / n
  const d = 1 + (z * z) / n
  const c = (p + (z * z) / (2 * n)) / d
  const h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d
  return { lo: Math.max(0, c - h), hi: Math.min(1, c + h) }
}

/** Intervalle à 95 % d'une moyenne de valeurs entre 0 et 1 (approximation normale). */
export function meanInterval(xs: number[], z = 1.96): Interval | null {
  if (xs.length < 2) return null
  const m = xs.reduce((s, x) => s + x, 0) / xs.length
  const sd = Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1))
  const h = (z * sd) / Math.sqrt(xs.length)
  return { lo: Math.max(0, m - h), hi: Math.min(1, m + h) }
}

/**
 * Précision statistique d'un rapport. L'unité est la question (les essais d'une même question
 * ne sont pas indépendants : un modèle stable répond pareil à chaque essai).
 */
export function confidence(cases: CaseResult[]): { questions: number; accuracy: Interval | null; quality: Interval | null } {
  const qs = cases.flatMap((c) => Object.values(caseStats(c).questions))
  const acc = defined(qs.map((q) => q.accuracy))
  const qual = defined(qs.map((q) => q.quality))
  return { questions: acc.length, accuracy: wilson(acc.reduce((s, x) => s + x, 0), acc.length), quality: meanInterval(qual) }
}

/** Deux intervalles qui se chevauchent : l'écart n'est pas significatif à 95 %. */
export const overlaps = (a: Interval | null, b: Interval | null) => !a || !b || (a.lo <= b.hi && b.lo <= a.hi)

export const fmtInterval = (i: Interval | null) => (i ? `${(i.lo * 100).toFixed(1)} – ${(i.hi * 100).toFixed(1)} %` : '—')

export const fmtMs = (v: number | null | undefined) =>
  v == null || Number.isNaN(v) ? '—' : v >= 10000 ? `${(v / 1000).toFixed(1)} s` : `${Math.round(v).toLocaleString('fr-FR')} ms`
export const fmtUsd = (v: number | null | undefined) => (v == null ? '—' : `${v < 0.01 ? v.toFixed(5) : v.toFixed(3)} $`)
export const fmtPct = (v: number | null | undefined, digits = 1) => (v == null ? '—' : `${(v * 100).toFixed(digits)} %`)
export const fmtNum = (v: number | null | undefined, digits = 0) =>
  v == null ? '—' : v.toLocaleString('fr-FR', { maximumFractionDigits: digits, minimumFractionDigits: digits })

/** Résumé textuel d'une réponse : décision et probabilité associée. */
export function answerLabel(a?: Answer): string {
  if (!a) return '—'
  if (a.type === 'noul') return `${a.noul >= 0.5 ? 'oui' : 'non'} ${(a.noul * 100).toFixed(0)} %`
  if (a.type === 'choice') return `${a.choice} ${((a.probabilities[a.choice] ?? 0) * 100).toFixed(0)} %`
  return a.score.toFixed(2)
}

export const toneFor = (v: number | null | undefined, good: number, mid: number): 'ok' | 'mid' | 'ko' | undefined =>
  v == null ? undefined : v >= good ? 'ok' : v >= mid ? 'mid' : 'ko'

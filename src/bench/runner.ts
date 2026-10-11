import { serverInfo } from '../api'
import { callOptions, evaluateModel } from '../models'
import { summarize } from './stats'
import type { BenchCase, BenchReport, BenchSettings, BenchSuite, CaseMeta, CaseResult, RunRecord, Target } from './types'

export interface Progress {
  done: number
  total: number
  phase: 'info' | 'warmup' | 'run' | 'done'
  current?: string
}

export function caseMeta(c: BenchCase): CaseMeta {
  const questions: CaseMeta['questions'] = {}
  for (const [qid, q] of Object.entries(c.request.questions)) {
    const size = q.type === 'noul' ? 2 : Array.isArray(q.criteria) ? q.criteria.length : Object.keys((q.criteria as object) ?? {}).length
    questions[qid] = { type: q.type, expected: c.expected[qid], size }
  }
  return { id: c.id, name: c.name, category: c.category, complexity: c.complexity, length: c.length, lang: c.lang, questions }
}

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'cible'

export function reportId(label: string, date = new Date()) {
  const p = (n: number) => String(n).padStart(2, '0')
  const d = `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}-${p(date.getHours())}${p(date.getMinutes())}${p(date.getSeconds())}`
  return `${d}-${slug(label)}`
}

interface RunOptions {
  target: Target
  suite: BenchSuite
  cases: BenchCase[]
  settings: BenchSettings
  name: string
  notes?: string
  signal: AbortSignal
  onProgress: (p: Progress, partial: CaseResult[]) => void
}

export async function runBenchmark({ target, suite, cases, settings, name, notes, signal, onProgress }: RunOptions): Promise<BenchReport> {
  const opts = callOptions(target)
  const results: CaseResult[] = cases.map((c) => ({ meta: caseMeta(c), runs: [] }))
  const total = cases.length * settings.repetitions
  const snapshot = () => results.map((r) => ({ ...r, runs: [...r.runs] }))
  let done = 0

  onProgress({ done, total, phase: 'info' }, snapshot())
  const info =
    target.kind === 'openrouter' ? null : await serverInfo(target.url, AbortSignal.any([signal, AbortSignal.timeout(5000)]), opts).catch(() => null)

  const send = (c: BenchCase) =>
    evaluateModel(target, { ...c.request, model: target.model }, AbortSignal.any([signal, AbortSignal.timeout(settings.timeoutMs)]))

  // Préchauffage sur le cas le plus court, non comptabilisé.
  const warm = [...cases].sort((a, b) => JSON.stringify(a.request).length - JSON.stringify(b.request).length)[0]
  for (let i = 0; i < settings.warmup && warm && !signal.aborted; i++) {
    onProgress({ done, total, phase: 'warmup', current: `${warm.name} (${i + 1}/${settings.warmup})` }, snapshot())
    await send(warm)
  }

  // Répétitions entrelacées (tous les cas, puis à nouveau) pour lisser la dérive dans le temps.
  const jobs = Array.from({ length: settings.repetitions }, (_, rep) => cases.map((_, i) => ({ i, rep: rep + 1 }))).flat()
  const t0 = performance.now()
  let next = 0
  const worker = async () => {
    while (next < jobs.length && !signal.aborted) {
      const { i, rep } = jobs[next++]
      const c = cases[i]
      onProgress({ done, total, phase: 'run', current: `${c.name} · essai ${rep}` }, snapshot())
      const r = await send(c)
      if (signal.aborted) break
      const run: RunRecord = {
        rep,
        ok: r.ok,
        status: r.status,
        ms: r.upstreamMs ?? r.ms,
        clientMs: r.ms,
        inputTokens: r.response?.usage?.input_tokens,
        cost: r.response?.usage?.cost,
        error: r.error,
        answers: r.response?.answers,
        at: performance.now() - t0,
      }
      results[i].runs.push(run)
      done++
      onProgress({ done, total, phase: 'run', current: c.name }, snapshot())
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, settings.concurrency) }, worker))
  const durationMs = performance.now() - t0

  for (const r of results) r.runs.sort((a, b) => a.rep - b.rep)
  onProgress({ done, total, phase: 'done' }, snapshot())

  return {
    id: reportId(target.label),
    name: name.trim() || `${target.label} — ${new Date().toLocaleString('fr-FR')}`,
    notes: notes?.trim() || undefined,
    createdAt: new Date().toISOString(),
    suiteId: suite.id,
    suiteVersion: suite.version,
    target: {
      kind: target.kind ?? 'systemone',
      label: target.label,
      url: target.url,
      model: target.model,
      proxy: target.proxy,
      serverModel: info?.ok ? info.model : undefined,
      serverCtx: info?.ok ? info.ctx : undefined,
    },
    settings,
    durationMs,
    aborted: signal.aborted || undefined,
    cases: results,
    summary: summarize(results, durationMs, suite.lang),
  }
}

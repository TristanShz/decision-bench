import { useCallback, useEffect, useRef, useState } from 'react'
import type { RunResult } from '../types'
import { ModelPicker } from '../components/ModelPicker'
import { evaluateModel, type ModelConnection } from '../models'
import { load, save } from '../storage'
import { CaseDetails } from './CaseDetails'
import { CompareView } from './CompareView'
import { ReportView } from './ReportView'
import { runBenchmark, type Progress } from './runner'
import { fmtMs, fmtPct, summarize } from './stats'
import { deleteReport, downloadReport, listReports, loadReport, readReportFile, saveReport } from './store'
import { DEFAULT_SUITE_ID, LEGACY_SUITE_ID, SUITES } from './suites'
import type { BenchCase, BenchReport, BenchSettings, BenchSuite, ReportListItem, Target } from './types'
import { Tag } from './ui'

const DEFAULT_SETTINGS: BenchSettings = { repetitions: 3, warmup: 1, concurrency: 1, timeoutMs: 120_000 }

/** Estimation grossière (≈ 3,5 caractères par token) pour orienter la sélection. */
const approxTokens = (c: BenchCase) => Math.round(JSON.stringify(c.request).length / 3.5)

/** Cas cochés, mémorisés par suite ; tous par défaut. */
function loadSelection(suite: BenchSuite): Set<string> {
  const ids = new Set(suite.cases.map((c) => c.id))
  return new Set(load(`s1.bench.cases.${suite.id}`, [...ids]).filter((id) => ids.has(id)))
}

type Tab = 'report' | 'reports' | 'compare'

const MAX_COMPARE = 4
const PICK_COLORS = ['var(--accent)', 'var(--score)', 'var(--noul)', 'var(--choice)']

export function BenchView({ models, onManage }: { models: ModelConnection[]; onManage: (id?: string) => void }) {
  const [targetId, setTargetId] = useState<string>(() => load('s1.bench.model', ''))
  const [settings, setSettings] = useState<BenchSettings>(() => ({ ...DEFAULT_SETTINGS, ...load('s1.bench.settings', {}) }))
  const [suite, setSuite] = useState<BenchSuite>(() => SUITES.find((s) => s.id === load('s1.bench.suite', DEFAULT_SUITE_ID)) ?? SUITES[0])
  const [selected, setSelected] = useState<Set<string>>(() => loadSelection(suite))
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [tab, setTab] = useState<Tab>('report')
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [report, setReport] = useState<BenchReport | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [testOf, setTestOf] = useState<{ id: string; result: RunResult | 'running' } | null>(null)
  const [reports, setReports] = useState<ReportListItem[]>([])
  const [listError, setListError] = useState('')
  /** Rapports cochés pour la comparaison, dans l'ordre de sélection (A, B, C, D). */
  const [picks, setPicks] = useState<string[]>([])
  const [compared, setCompared] = useState<BenchReport[] | null>(null)
  const [openCase, setOpenCase] = useState<string | null>(null)
  const [confirmDel, setConfirmDel] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const target: Target | undefined = models.find((m) => m.id === targetId) ?? models[0]
  useEffect(() => save('s1.bench.model', targetId), [targetId])
  // Le résultat du test ne vaut que pour le modèle testé.
  const shownTest = testOf?.id === target?.id ? testOf?.result ?? null : null
  useEffect(() => save('s1.bench.settings', settings), [settings])
  useEffect(() => save('s1.bench.suite', suite.id), [suite])
  useEffect(() => save(`s1.bench.cases.${suite.id}`, [...selected]), [suite, selected])

  const refresh = useCallback(async () => {
    try {
      setReports(await listReports())
      setListError('')
    } catch (e) {
      setListError(`Impossible de lister les rapports : ${(e as Error).message}. L’app doit tourner via « yarn dev » ou « yarn preview ».`)
    }
  }, [])
  useEffect(() => void refresh(), [refresh])

  // Ré-affiche le dernier rapport consulté après un rechargement de la page.
  useEffect(() => {
    const id = load<string | null>('s1.bench.lastReport', null)
    if (id) loadReport(id).then((r) => { setReport((cur) => cur ?? r); setSaved((cur) => cur ?? id) }, () => save('s1.bench.lastReport', null))
  }, [])

  const cases = suite.cases.filter((c) => selected.has(c.id))
  const totalRequests = cases.length * settings.repetitions

  const run = async () => {
    if (!cases.length) return setError('Sélectionne au moins un cas.')
    if (!target) return setError('Connecte un modèle avec le bouton « Modèles ».')
    if (!/^https?:\/\/.+/.test(target.url)) return setError('URL du modèle invalide.')
    setError('')
    setRunning(true)
    setSaved(null)
    setTab('report')
    const ctrl = new AbortController()
    abortRef.current = ctrl
    const started = performance.now()
    try {
      const final = await runBenchmark({
        target,
        suite,
        cases,
        settings,
        name,
        notes,
        signal: ctrl.signal,
        onProgress: (p, partial) => {
          setProgress(p)
          const elapsed = performance.now() - started
          setReport({
            id: 'live',
            name: name.trim() || `${target.label} — en cours`,
            createdAt: new Date().toISOString(),
            suiteId: suite.id,
            suiteVersion: suite.version,
            target: { kind: target.kind ?? 'systemone', label: target.label, url: target.url, model: target.model, proxy: target.proxy },
            settings,
            durationMs: elapsed,
            cases: partial,
            summary: summarize(partial, elapsed, suite.lang),
          })
        },
      })
      setReport(final)
      if (!final.aborted) await persist(final)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setRunning(false)
    }
  }

  const persist = async (r: BenchReport) => {
    try {
      await saveReport(r)
      setSaved(r.id)
      save('s1.bench.lastReport', r.id)
      refresh()
    } catch (e) {
      setError(`Sauvegarde impossible : ${(e as Error).message}. Exporte le rapport en JSON pour ne pas le perdre.`)
    }
  }

  const testConnection = async () => {
    if (!target) return
    const id = target.id
    setTestOf({ id, result: 'running' })
    const c = suite.cases[0]
    setTestOf({ id, result: await evaluateModel(target, { ...c.request, model: target.model }, AbortSignal.timeout(30_000)) })
  }

  const openReport = async (id: string) => {
    try {
      setReport(await loadReport(id))
      setSaved(id)
      save('s1.bench.lastReport', id)
      setTab('report')
    } catch (e) {
      setListError((e as Error).message)
    }
  }

  const compare = async () => {
    if (picks.length < 2) return
    try {
      setCompared(await Promise.all(picks.map(loadReport)))
      setTab('compare')
    } catch (e) {
      setListError((e as Error).message)
    }
  }

  const importFile = async (file: File) => {
    try {
      const r = await readReportFile(file)
      await saveReport(r)
      await refresh()
    } catch (e) {
      setListError(`Import impossible : ${(e as Error).message}`)
    }
  }

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  const selectWhere = (f: (c: BenchCase) => boolean) => setSelected(new Set(suite.cases.filter(f).map((c) => c.id)))
  const changeSuite = (id: string) => {
    const next = SUITES.find((s) => s.id === id)
    if (!next) return
    setSuite(next)
    setSelected(loadSelection(next))
    setOpenCase(null)
  }

  const num = (v: string, min: number, max: number) => Math.min(max, Math.max(min, Math.round(Number(v) || min)))

  return (
    <main className="layout bench">
      <section className="pane left">
        <div className="section">
          <div className="block-title">Modèle</div>
          <ModelPicker models={models} value={target?.id ?? ''} onChange={setTargetId} onManage={onManage} />
          {target && (
            <div className="row" style={{ marginTop: 8 }}>
              <button className="ghost" disabled={shownTest === 'running'} onClick={testConnection}>{shownTest === 'running' ? 'Test…' : 'Tester sur le premier cas'}</button>
              {shownTest && shownTest !== 'running' && (
                shownTest.ok
                  ? <span className="small ok-text">OK · {fmtMs(shownTest.upstreamMs ?? shownTest.ms)} · {shownTest.response?.usage?.input_tokens ?? '?'} tokens · {shownTest.response?.model}</span>
                  : <span className="err-inline">{shownTest.error}</span>
              )}
            </div>
          )}
        </div>

        <div className="section">
          <h2>Paramètres</h2>
          <div className="grid4">
            <div className="field"><label>Essais par cas</label><input type="number" min={1} max={20} value={settings.repetitions} onChange={(e) => setSettings({ ...settings, repetitions: num(e.target.value, 1, 20) })} /></div>
            <div className="field"><label>Préchauffage</label><input type="number" min={0} max={10} value={settings.warmup} onChange={(e) => setSettings({ ...settings, warmup: num(e.target.value, 0, 10) })} /></div>
            <div className="field"><label>Concurrence</label><input type="number" min={1} max={32} value={settings.concurrency} onChange={(e) => setSettings({ ...settings, concurrency: num(e.target.value, 1, 32) })} /></div>
            <div className="field"><label>Timeout (s)</label><input type="number" min={5} max={600} value={settings.timeoutMs / 1000} onChange={(e) => setSettings({ ...settings, timeoutMs: num(e.target.value, 5, 600) * 1000 })} /></div>
          </div>
          <p className="muted small">Pour comparer deux modèles, garde les mêmes paramètres. La concurrence &gt; 1 mesure la tenue en charge : utile face à une API managée, sans gain attendu sur un iGPU déjà saturé.</p>
        </div>

        <div className="section">
          <div className="section-head">
            <h2>Suite</h2>
            <select value={suite.id} onChange={(e) => changeSuite(e.target.value)}>
              {SUITES.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.lang}) · v{s.version}</option>)}
            </select>
          </div>
          <p className="muted small">{suite.description}{suite.author ? ` · ${suite.author}` : ''}</p>
        </div>

        <div className="section">
          <div className="section-head">
            <h2>Cas <span className="muted">({cases.length}/{suite.cases.length})</span></h2>
            <div className="row small">
              <button className="link" onClick={() => selectWhere(() => true)}>Tous</button>
              <button className="link" onClick={() => selectWhere(() => false)}>Aucun</button>
              {suite.cases.some((c) => c.lang === suite.lang) && suite.cases.some((c) => c.lang !== suite.lang) && <button className="link" onClick={() => selectWhere((c) => c.lang === suite.lang)}>Langue {suite.lang} seule</button>}
              <button className="link" onClick={() => selectWhere((c) => c.length === 'court')}>Courts</button>
              <button className="link" onClick={() => selectWhere((c) => c.length === 'long' || c.length === 'très long')}>Longs</button>
              <button className="link" onClick={() => selectWhere((c) => c.complexity === 'simple')}>Simples</button>
              <button className="link" onClick={() => selectWhere((c) => c.complexity === 'complexe')}>Complexes</button>
            </div>
          </div>
          <div className="caselist">
            {suite.cases.map((c) => (
              <div key={c.id}>
              <label className={`caseitem ${selected.has(c.id) ? 'on' : ''}`}>
                <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} />
                <div className="grow">
                  <div className="row">
                    <span className="strong">{c.name}</span>
                    <span className="muted small">{c.category}{c.lang !== suite.lang ? ` · ${c.lang}` : ''}</span>
                  </div>
                  <div className="muted small">{c.description}</div>
                </div>
                <div className="caseitem-tags">
                  <Tag kind={c.complexity}>{c.complexity}</Tag>
                  <Tag>{c.length}</Tag>
                  <span className="muted small mono">{Object.keys(c.request.questions).length} q · ≈{approxTokens(c)} tok</span>
                  <button
                    className="link small"
                    onClick={(e) => {
                      e.preventDefault()
                      setOpenCase(openCase === c.id ? null : c.id)
                    }}
                  >
                    {openCase === c.id ? 'Masquer' : 'Voir'}
                  </button>
                </div>
              </label>
              {openCase === c.id && <CaseDetails c={c} />}
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="grid2">
            <div className="field"><label>Nom du rapport (optionnel)</label><input value={name} placeholder={`${target?.label ?? 'Modèle'} — ${new Date().toLocaleDateString('fr-FR')}`} onChange={(e) => setName(e.target.value)} /></div>
            <div className="field"><label>Notes (config serveur, quantification…)</label><input value={notes} placeholder="ROCm + FA, -ub 8192" onChange={(e) => setNotes(e.target.value)} /></div>
          </div>
        </div>

        <div className="runbar">
          <span className="muted small">{totalRequests} requêtes{settings.warmup ? ` + ${settings.warmup} de préchauffage` : ''}</span>
          <div className="spacer" />
          {running && <button className="ghost" onClick={() => abortRef.current?.abort()}>Interrompre</button>}
          <button className="primary" disabled={running || !cases.length || !target} onClick={run}>{running ? 'Benchmark en cours…' : 'Lancer le benchmark'}</button>
        </div>
        {running && progress && (
          <div className="progress">
            <div className="progress-track"><div className="progress-fill" style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }} /></div>
            <div className="muted small">
              {progress.phase === 'info' ? 'Interrogation du serveur…' : progress.phase === 'warmup' ? `Préchauffage : ${progress.current}` : `${progress.done}/${progress.total} · ${progress.current ?? ''}`}
            </div>
          </div>
        )}
        {error && <div className="errbox">{error}</div>}
      </section>

      <section className="pane right">
        <nav className="tabs">
          <button className={tab === 'report' ? 'on' : ''} onClick={() => setTab('report')}>Rapport</button>
          <button className={tab === 'reports' ? 'on' : ''} onClick={() => { setTab('reports'); refresh() }}>
            Rapports sauvegardés <span className="muted">({reports.length})</span>
          </button>
          <button className={tab === 'compare' ? 'on' : ''} onClick={() => setTab('compare')}>Comparaison</button>
        </nav>

        {tab === 'report' && (
          report ? (
            <>
              <div className="row" style={{ marginBottom: 10 }}>
                {saved ? <span className="pill ok">Sauvegardé · reports/{saved}.json</span> : !running && <span className="pill">Non sauvegardé</span>}
                <div className="spacer" />
                {!running && !saved && report.id !== 'live' && <button className="ghost" onClick={() => persist(report)}>Sauvegarder</button>}
                {!running && report.id !== 'live' && <button className="ghost" onClick={() => downloadReport(report)}>Exporter JSON</button>}
              </div>
              <ReportView report={report} running={running} />
            </>
          ) : (
            <div className="empty">Choisis un modèle et une suite à gauche, puis lance le benchmark. Le rapport s’affiche ici en direct et est sauvegardé à la fin.</div>
          )
        )}

        {tab === 'reports' && (
          <div>
            <div className="row" style={{ marginBottom: 10 }}>
              <span className="muted small">Coche 2 à {MAX_COMPARE} rapports (le premier coché sert de référence A). Fichiers dans <span className="mono">reports/</span>.</span>
              <div className="spacer" />
              <button className="ghost" onClick={() => fileRef.current?.click()}>Importer un JSON</button>
              <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) importFile(f); e.target.value = '' }} />
              <button className="primary" disabled={picks.length < 2} onClick={compare}>Comparer{picks.length >= 2 ? ` (${picks.length})` : ''}</button>
            </div>
            {listError && <div className="errbox">{listError}</div>}
            {reports.length === 0 && !listError && <div className="empty">Aucun rapport sauvegardé pour l’instant.</div>}
            {reports.length > 0 && (
              <div className="tablewrap">
                <table className="btable static">
                  <thead>
                    <tr><th>Comparer</th><th>Rapport</th><th>p50</th><th>p95</th><th>Exact.</th><th>Erreurs</th><th /></tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => {
                      const k = picks.indexOf(r.id)
                      return (
                      <tr key={r.id} className={k >= 0 ? 'sel' : ''}>
                        <td>
                          <label className="row">
                            <input
                              type="checkbox"
                              checked={k >= 0}
                              disabled={k < 0 && picks.length >= MAX_COMPARE}
                              onChange={() => setPicks((p) => (k >= 0 ? p.filter((x) => x !== r.id) : [...p, r.id]))}
                            />
                            {k >= 0 && <span className="letter" style={{ background: PICK_COLORS[k] }}>{'ABCD'[k]}</span>}
                          </label>
                        </td>
                        <td className="wrap">
                          <button className="link strong" onClick={() => openReport(r.id)} title="Afficher ce rapport">{r.name}</button>
                          <div className="muted small">{r.target.label} · {new Date(r.createdAt).toLocaleString('fr-FR')} · suite {r.suiteId ?? LEGACY_SUITE_ID} · {r.summary.cases} cas × {r.settings.repetitions}, conc. {r.settings.concurrency}</div>
                        </td>
                        <td className="num">{fmtMs(r.summary.latency.p50)}</td>
                        <td className="num">{fmtMs(r.summary.latency.p95)}</td>
                        <td className="num">{fmtPct(r.summary.accuracy)}</td>
                        <td className="num">{fmtPct(r.summary.errorRate)}</td>
                        <td>
                          <div className="row">
                            <button className="ghost" onClick={() => openReport(r.id)}>Ouvrir</button>
                            {confirmDel === r.id ? (
                              <button className="ghost danger-btn" onClick={async () => { await deleteReport(r.id).catch((e) => setListError(e.message)); setConfirmDel(null); refresh() }}>Confirmer</button>
                            ) : (
                              <button className="icon danger" title="Supprimer" onClick={() => setConfirmDel(r.id)}>✕</button>
                            )}
                          </div>
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'compare' && (
          compared ? (
            <CompareView
              reports={compared}
              onReference={(i) => setCompared((c) => c && [c[i], ...c.filter((_, j) => j !== i)])}
              onRemove={(i) => setCompared((c) => c && c.filter((_, j) => j !== i))}
            />
          ) : (
            <div className="empty">Dans « Rapports sauvegardés », coche 2 à {MAX_COMPARE} rapports (ex. Clef self-host, Jev managé…), puis clique sur <b>Comparer</b>.</div>
          )
        )}
      </section>
    </main>
  )
}

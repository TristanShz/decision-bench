import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { endpoint } from './api'
import { BenchView } from './bench/BenchView'
import { AnswerCard, AnswerCell } from './components/AnswerView'
import { ImagePicker } from './components/ImagePicker'
import { ModelManager } from './components/ModelManager'
import { ModelPicker } from './components/ModelPicker'
import { ModeToggle, QuestionEditor } from './components/QuestionEditor'
import {
  buildQuestions,
  buildRequest,
  emptyDraft,
  imageUrls,
  newQuestion,
  parseBatch,
  parseState,
  redactImages,
  requestToDraft,
  toCurl,
  uid,
} from './draft'
import { withDimensions } from './images'
import { PRESETS } from './presets'
import { evaluateModel, loadModels, type ModelConnection } from './models'
import { load, save } from './storage'
import type { BatchRow, Draft, HistoryEntry, QType, RunResult, SystemOneRequest } from './types'

const HISTORY_MAX = 40

/** Retire le base64 des images ; elles apparaîtront « non conservées » à la restauration. */
const stripDraft = (d: Draft): Draft => ({ ...d, images: (d.images ?? []).map((i) => ({ ...i, dataUrl: '' })) })
const stripEntry = (h: HistoryEntry): HistoryEntry => ({
  ...h,
  draft: stripDraft(h.draft),
  request: h.request.images ? { ...h.request, images: h.request.images.map(() => '') } : h.request,
})

const initialDraft = (): Draft => {
  const saved = load<Draft | null>('s1.draft', null)
  if (saved?.questions) return { ...saved, images: saved.images ?? [] }
  return requestToDraft(PRESETS[0].request)
}

type Tab = 'result' | 'json' | 'history'
type InputMode = 'single' | 'batch'

export default function App() {
  const [view, setView] = useState<'tester' | 'bench'>(() => load('s1.view', 'tester'))
  const [models, setModels] = useState<ModelConnection[]>(loadModels)
  const [modelId, setModelId] = useState<string>(() => load('s1.tester.model', ''))
  const [manager, setManager] = useState<{ id?: string } | null>(null)
  const [draft, setDraft] = useState<Draft>(initialDraft)
  const [inputMode, setInputMode] = useState<InputMode>('single')
  const [batchInput, setBatchInput] = useState(() => (PRESETS[0].batch ?? []).map((s) => (typeof s === 'string' ? s : JSON.stringify(s))).join('\n'))
  const [batchFormat, setBatchFormat] = useState<'lines' | 'json' | 'images'>('lines')
  const [maxSide, setMaxSide] = useState(() => load('s1.maxSide', 1024))
  const [tab, setTab] = useState<Tab>('result')
  const [running, setRunning] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [single, setSingle] = useState<{ request: SystemOneRequest; result: RunResult } | null>(null)
  const [batch, setBatch] = useState<{ request: Omit<SystemOneRequest, 'state'>; rows: BatchRow[] } | null>(null)
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>(() => load('s1.history', []))
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState('')
  const [copied, setCopied] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => save('s1.view', view), [view])
  useEffect(() => save('s1.models', models), [models])
  useEffect(() => save('s1.tester.model', modelId), [modelId])
  useEffect(() => save('s1.maxSide', maxSide), [maxSide])
  useEffect(() => save('s1.draft', draft, () => stripDraft(draft)), [draft])
  useEffect(() => save('s1.history', history, () => history.map(stripEntry)), [history])

  const built = useMemo(() => buildRequest(draft), [draft])
  const model = models.find((m) => m.id === modelId) ?? models[0]

  const patchQuestion = (i: number, q: Draft['questions'][number]) =>
    setDraft((d) => ({ ...d, questions: d.questions.map((x, j) => (j === i ? q : x)) }))

  const addQuestion = (type: QType) =>
    setDraft((d) => {
      let n = d.questions.length + 1
      while (d.questions.some((q) => q.id === `q${n}`)) n++
      return { ...d, questions: [...d.questions, newQuestion(type, `q${n}`)] }
    })

  const loadPreset = (name: string) => {
    const p = PRESETS.find((x) => x.name === name)
    if (!p) return
    setDraft(requestToDraft(p.request))
    if (p.batch) {
      const allText = p.batch.every((s) => typeof s === 'string')
      setBatchFormat(allText ? 'lines' : 'json')
      setBatchInput(allText ? p.batch.join('\n') : JSON.stringify(p.batch, null, 2))
    }
    setErrors([])
  }

  const runSingle = useCallback(async () => {
    if (!built.request || !model) {
      setErrors(model ? built.errors : ['Connecte un modèle avec le bouton « Modèles ».'])
      return
    }
    setErrors([])
    setRunning(true)
    setTab('result')
    const ctrl = new AbortController()
    abortRef.current = ctrl
    const request = { ...built.request, model: model.model }
    const result = await evaluateModel(model, request, ctrl.signal)
    setSingle({ request, result })
    setHistory((h) =>
      [{ id: uid(), at: Date.now(), url: model.url, modelLabel: model.label, draft, request, result }, ...h].slice(0, HISTORY_MAX),
    )
    setRunning(false)
  }, [built, model, draft])

  const runBatch = useCallback(async () => {
    const { questions, errors: qErr } = buildQuestions(draft)
    const byImage = batchFormat === 'images'
    const images = imageUrls(draft)
    // En lot d'images, le state commun est celui de l'éditeur unique.
    const common = parseState(draft)
    const { states, error } = byImage ? { states: [], error: common.error } : parseBatch(batchInput, batchFormat)
    const errs = [...(model ? [] : ['Connecte un modèle avec le bouton « Modèles ».']), ...(error ? [error] : []), ...qErr]
    if (!errs.length && byImage && images.length === 0) errs.push('Ajoute des images : chacune sera une ligne du lot.')
    if (!errs.length && !byImage && states.length === 0) errs.push('Le lot est vide.')
    if (errs.length) {
      setErrors(errs)
      return
    }
    setErrors([])
    setRunning(true)
    setTab('result')
    setSelectedRow(null)
    const ctrl = new AbortController()
    abortRef.current = ctrl
    const base: Omit<SystemOneRequest, 'state'> = { model: model!.model, questions }
    if (!byImage && images.length) base.images = images
    const named = (draft.images ?? []).filter((i) => i.dataUrl)
    const rows: BatchRow[] = byImage
      ? named.map((i) => ({ label: i.name, state: common.value ?? '', image: i.dataUrl }))
      : states.map((s) => ({ label: typeof s === 'string' ? s : JSON.stringify(s), state: s }))
    setBatch({ request: base, rows: [...rows] })
    for (let i = 0; i < rows.length; i++) {
      if (ctrl.signal.aborted) break
      rows[i] = { ...rows[i], running: true }
      setBatch({ request: base, rows: [...rows] })
      const req = { ...base, state: rows[i].state, ...(rows[i].image ? { images: [rows[i].image!] } : {}) }
      const result = await evaluateModel(model!, req, ctrl.signal)
      rows[i] = { ...rows[i], running: false, result }
      setBatch({ request: base, rows: [...rows] })
    }
    setRunning(false)
  }, [draft, batchInput, batchFormat, model])

  const picker = (
    <ImagePicker
      images={draft.images ?? []}
      onChange={(images) => setDraft((d) => ({ ...d, images }))}
      maxSide={maxSide}
      onMaxSide={setMaxSide}
      compact={!(inputMode === 'batch' && batchFormat === 'images')}
      hint={
        inputMode === 'batch' && batchFormat === 'images'
          ? 'Lot d’images : chaque image est évaluée séparément, avec le state commun ci-dessus.'
          : inputMode === 'batch'
            ? 'Ces images sont envoyées avec chaque state du lot.'
            : 'Envoyées dans le champ images de la requête (nécessite --mmproj côté serveur).'
      }
    />
  )

  const run = inputMode === 'single' ? runSingle : runBatch

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (view === 'tester' && (e.metaKey || e.ctrlKey) && e.key === 'Enter' && !running) {
        e.preventDefault()
        run()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [run, running, view])

  const copy = async (what: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(what)
      setTimeout(() => setCopied(''), 1500)
    } catch {
      setCopied('échec')
    }
  }

  const doImport = () => {
    try {
      const d = requestToDraft(JSON.parse(importText))
      setDraft(d)
      Promise.all((d.images ?? []).map(withDimensions)).then((images) => setDraft((cur) => (cur === d ? { ...d, images } : cur)))
      setImportError('')
      setImportText('')
    } catch (e) {
      setImportError((e as Error).message)
    }
  }

  const stateJsonError =
    draft.stateMode === 'json' && draft.state.trim()
      ? (() => {
          try {
            JSON.parse(draft.state)
            return ''
          } catch (e) {
            return (e as Error).message
          }
        })()
      : ''

  const tokens = built.request ? Math.round(JSON.stringify({ ...built.request, images: undefined }).length / 3.5) : null
  const imageCount = imageUrls(draft).length

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo">DB</span>
          <div className="title">DecisionBench</div>
        </div>
        <div className="seg">
          <button className={view === 'tester' ? 'on' : ''} onClick={() => setView('tester')}>Testeur</button>
          <button className={view === 'bench' ? 'on' : ''} onClick={() => setView('bench')}>Benchmark</button>
        </div>
        <div className="spacer" />
        <button className="ghost models-btn" onClick={() => setManager({})}>
          Modèles <span className="muted">({models.length})</span>
        </button>
      </header>

      {manager && <ModelManager models={models} onChange={setModels} initialId={manager.id} onClose={() => setManager(null)} />}

      {view === 'bench' ? <BenchView models={models} onManage={(id) => setManager({ id })} /> : (
      <main className="layout">
        <section className="pane left composer">
          <div className="block">
            <div className="block-title">Modèle</div>
            <ModelPicker models={models} value={model?.id ?? ''} onChange={setModelId} onManage={(id) => setManager({ id })} />
          </div>

          <div className="block">
            <div className="step-head">
              <span className="step-num">1</span>
              <h2>{inputMode === 'single' ? 'Texte à juger' : 'Textes à juger'}</h2>
              <div className="spacer" />
              <div className="seg small">
                <button className={inputMode === 'single' ? 'on' : ''} onClick={() => setInputMode('single')}>Unique</button>
                <button className={inputMode === 'batch' ? 'on' : ''} onClick={() => setInputMode('batch')}>Lot</button>
              </div>
              <select className="examples" value="" onChange={(e) => loadPreset(e.target.value)} title="Charger un exemple">
                <option value="" disabled>Exemples</option>
                {PRESETS.map((p) => (
                  <option key={p.name} value={p.name}>{p.name} — {p.description}</option>
                ))}
              </select>
              <button className="link" onClick={() => { setDraft({ ...emptyDraft(), stateMode: draft.stateMode }); setErrors([]) }}>Vider</button>
            </div>

            {inputMode === 'single' ? (
              <>
                <div className="textbox">
                  <textarea
                    className={`state ${draft.stateMode === 'json' ? 'mono' : ''}`}
                    rows={draft.stateMode === 'json' ? 10 : 6}
                    value={draft.state}
                    placeholder={draft.stateMode === 'json' ? '{ "ticket": { "text": "…" } }' : 'Le texte que le modèle doit juger…'}
                    onChange={(e) => setDraft({ ...draft, state: e.target.value })}
                    spellCheck={draft.stateMode === 'text'}
                  />
                  <div className="textbox-foot">
                    <ModeToggle value={draft.stateMode} onChange={(m) => setDraft({ ...draft, stateMode: m })} />
                    <div className="spacer" />
                    <span className="mono muted">{draft.state.length.toLocaleString('fr-FR')} car.</span>
                  </div>
                </div>
                {stateJsonError && <div className="err-inline">JSON invalide : {stateJsonError}</div>}
                {picker}
              </>
            ) : (
              <>
                <div className="label-row">
                  <span className="muted small">
                    {batchFormat === 'lines'
                      ? 'Un texte par ligne.'
                      : batchFormat === 'json'
                        ? 'Un tableau JSON de states (texte ou objets).'
                        : 'Une ligne par image, avec un state commun.'}{' '}
                    Mêmes questions pour chaque ligne.
                  </span>
                  <div className="seg small">
                    <button className={batchFormat === 'lines' ? 'on' : ''} onClick={() => setBatchFormat('lines')}>Lignes</button>
                    <button className={batchFormat === 'json' ? 'on' : ''} onClick={() => setBatchFormat('json')}>JSON</button>
                    <button className={batchFormat === 'images' ? 'on' : ''} onClick={() => setBatchFormat('images')}>Images</button>
                  </div>
                </div>
                {batchFormat === 'images' ? (
                  <textarea
                    className={`state ${draft.stateMode === 'json' ? 'mono' : ''}`}
                    rows={3}
                    value={draft.state}
                    placeholder="State commun (optionnel), ex. : Photo envoyée par un client avec son ticket."
                    onChange={(e) => setDraft({ ...draft, state: e.target.value })}
                  />
                ) : (
                  <textarea
                    className="state mono"
                    rows={10}
                    value={batchInput}
                    onChange={(e) => setBatchInput(e.target.value)}
                    placeholder={batchFormat === 'lines' ? 'premier texte\nsecond texte' : '[{ "text": "…" }, { "text": "…" }]'}
                  />
                )}
                {picker}
              </>
            )}
          </div>

          <div className="block">
            <div className="step-head">
              <span className="step-num">2</span>
              <h2>Questions</h2>
              <div className="spacer" />
              <span className="mono muted">{draft.questions.length}</span>
            </div>
            {draft.questions.map((q, i) => (
              <QuestionEditor
                key={q.uid}
                q={q}
                index={i}
                count={draft.questions.length}
                onChange={(nq) => patchQuestion(i, nq)}
                onRemove={() => setDraft((d) => ({ ...d, questions: d.questions.filter((_, j) => j !== i) }))}
                onDuplicate={() =>
                  setDraft((d) => {
                    const c = { ...structuredClone(q), uid: uid(), id: `${q.id}_copie` }
                    const qs = [...d.questions]
                    qs.splice(i + 1, 0, c)
                    return { ...d, questions: qs }
                  })
                }
                onMove={(dir) =>
                  setDraft((d) => {
                    const qs = [...d.questions]
                    ;[qs[i], qs[i + dir]] = [qs[i + dir], qs[i]]
                    return { ...d, questions: qs }
                  })
                }
              />
            ))}
            {draft.questions.length === 0 && <div className="empty small">Aucune question pour l’instant.</div>}
            <div className="add-row">
              <button className="add-pill add-noul" onClick={() => addQuestion('noul')}>+ Oui/Non</button>
              <button className="add-pill add-choice" onClick={() => addQuestion('choice')}>+ Choix</button>
              <button className="add-pill add-score" onClick={() => addQuestion('score')}>+ Score</button>
            </div>
          </div>

          <div className="runzone">
            <div className="run-row">
              {running ? (
                <button className="run-btn" onClick={() => abortRef.current?.abort()}>Annuler</button>
              ) : (
                <button className="run-btn" disabled={!model} onClick={run}>
                  {inputMode === 'single' ? `Lancer ${model?.label ?? ''}` : 'Lancer le lot'}
                </button>
              )}
              <button className="api-btn" disabled={!built.request || !model} onClick={() => built.request && model && copy('curl', toCurl(endpoint(model.url), { ...built.request, model: model.model }, model.authHeader))}>
                <span aria-hidden className="mono">&lt;/&gt;</span> {copied === 'curl' ? 'Copié ✓' : 'Copier l’exemple API'}
              </button>
            </div>
            <div className="run-info">
              <span className="muted small"><kbd>⌘↵</kbd> pour lancer</span>
              <div className="spacer" />
              <span className="mono muted small">
                {tokens != null ? `Cette requête ≈ ${tokens.toLocaleString('fr-FR')} tokens${imageCount ? ` + ${imageCount} image(s)` : ''}` : ''}
              </span>
            </div>
            {model?.kind === 'openrouter' && <p className="muted small">Modèle de chat : l’exemple API correspond au format System One, l’app le traduit en un appel chat par question.</p>}
            {errors.length > 0 && (
              <ul className="errors">
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
            <details className="preview">
              <summary>Aperçu de la requête</summary>
              {built.request ? (
                <>
                  <pre className="code">{JSON.stringify(redactImages({ ...built.request, model: model?.model ?? built.request.model }), null, 2)}</pre>
                  <button className="ghost" onClick={() => built.request && copy('json', JSON.stringify({ ...built.request, model: model?.model ?? built.request.model }, null, 2))}>
                    {copied === 'json' ? 'Copié ✓' : 'Copier le JSON'}
                  </button>
                </>
              ) : (
                <ul className="errors">{built.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
              )}
            </details>
            <p className="muted small footnote">Ton brouillon reste dans ce navigateur.</p>
          </div>
        </section>

        <section className="pane right">
          <nav className="tabs">
            <button className={tab === 'result' ? 'on' : ''} onClick={() => setTab('result')}>Résultats</button>
            <button className={tab === 'json' ? 'on' : ''} onClick={() => setTab('json')}>Importer</button>
            <button className={tab === 'history' ? 'on' : ''} onClick={() => setTab('history')}>
              Historique <span className="muted">({history.length})</span>
            </button>
          </nav>

          {tab === 'result' && (
            inputMode === 'single' ? (
              <SingleResult data={single} running={running} />
            ) : (
              <BatchResult
                batch={batch}
                selected={selectedRow}
                onSelect={setSelectedRow}
              />
            )
          )}

          {tab === 'json' && (
            <div className="jsonpane">
              <h3>Importer une requête</h3>
              <p className="muted small">Colle un corps de requête System One (state + questions) pour le charger dans l'éditeur. Pour exporter, ouvre « Aperçu de la requête » sous les questions.</p>
              <textarea className="mono" rows={10} value={importText} onChange={(e) => setImportText(e.target.value)} placeholder='{ "state": "…", "questions": { … } }' />
              {importError && <div className="err-inline">{importError}</div>}
              <button className="primary" disabled={!importText.trim()} onClick={doImport}>Charger dans l'éditeur</button>
            </div>
          )}

          {tab === 'history' && (
            <div className="history">
              {history.length === 0 && <div className="empty">Les évaluations uniques apparaîtront ici.</div>}
              {history.length > 0 && (
                <button className="link danger" onClick={() => setHistory([])}>Vider l'historique</button>
              )}
              {history.map((h) => (
                <div key={h.id} className="hitem">
                  <div className="hmain">
                    <div className="row">
                      <span className={`dot ${h.result.ok ? 'ok' : 'ko'}`} />
                      <span className="small muted">{new Date(h.at).toLocaleString('fr-FR')}</span>
                      <span className="small muted">· {Math.round(h.result.ms)} ms</span>
                      {h.modelLabel && <span className="small muted">· {h.modelLabel}</span>}
                    </div>
                    <div className="hstate">
                      {h.request.images?.length ? `🖼 ${h.request.images.length} image(s) · ` : ''}
                      {typeof h.request.state === 'string' ? h.request.state : JSON.stringify(h.request.state)}
                    </div>
                    <div className="hanswers small">
                      {h.result.response
                        ? Object.entries(h.result.response.answers).map(([k, a]) => (
                            <span key={k} className="chip">
                              <span className="mono">{k}</span>{' '}
                              <AnswerCell answer={a} question={h.request.questions[k]} />
                            </span>
                          ))
                        : <span className="err-inline">{h.result.error}</span>}
                    </div>
                  </div>
                  <div className="hactions">
                    <button
                      className="ghost"
                      onClick={() => {
                        setDraft(h.draft)
                        setInputMode('single')
                        setSingle({ request: h.request, result: h.result })
                        setTab('result')
                      }}
                    >
                      Restaurer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      )}
    </div>
  )
}

function SingleResult({ data, running }: { data: { request: SystemOneRequest; result: RunResult } | null; running: boolean }) {
  if (running && !data) return <div className="empty">Évaluation en cours…</div>
  if (!data) return <div className="empty">Écris un texte, ajoute des questions puis clique sur <b>Lancer</b> (⌘↵).</div>
  const { request, result } = data
  return (
    <div className={running ? 'stale' : ''}>
      <ResultMeta result={result} />
      <SentImages urls={request.images} />
      {result.ok && result.response ? (
        <div className="answers">
          {Object.keys(request.questions).map((id) =>
            result.response!.answers[id] ? (
              <AnswerCard key={id} id={id} answer={result.response!.answers[id]} question={request.questions[id]} />
            ) : (
              <div key={id} className="acard muted">Pas de réponse pour <span className="mono">{id}</span></div>
            ),
          )}
        </div>
      ) : (
        <div className="errbox">{result.error}</div>
      )}
      <details className="raw">
        <summary>Réponse brute</summary>
        <pre className="code">{typeof result.raw === 'string' ? result.raw : JSON.stringify(result.raw, null, 2)}</pre>
      </details>
    </div>
  )
}

function SentImages({ urls }: { urls?: string[] }) {
  const shown = (urls ?? []).filter(Boolean)
  if (!shown.length) return null
  return (
    <div className="sent-images">
      {shown.map((u, i) => <img key={i} src={u} alt={`image ${i + 1}`} />)}
    </div>
  )
}

function ResultMeta({ result }: { result: RunResult }) {
  return (
    <div className="meta">
      <span className={`pill ${result.ok ? 'ok' : 'ko'}`}>{result.status ? `HTTP ${result.status}` : 'Erreur'}</span>
      <span className="pill">{Math.round(result.ms)} ms</span>
      {result.response?.usage && <span className="pill">{result.response.usage.input_tokens} tokens en entrée</span>}
      {result.response?.model && <span className="pill mono" title={result.response.model}>{result.response.model.split('/').pop()}</span>}
    </div>
  )
}

function BatchResult({
  batch,
  selected,
  onSelect,
}: {
  batch: { request: Omit<SystemOneRequest, 'state'>; rows: BatchRow[] } | null
  selected: number | null
  onSelect: (i: number | null) => void
}) {
  if (!batch) return <div className="empty">Saisis plusieurs states à gauche puis clique sur <b>Lancer le lot</b>.</div>
  const qids = Object.keys(batch.request.questions)
  const done = batch.rows.filter((r) => r.result)
  const ok = done.filter((r) => r.result?.ok)
  const avg = done.length ? done.reduce((s, r) => s + (r.result?.ms ?? 0), 0) / done.length : 0
  const sel = selected != null ? batch.rows[selected] : null

  const exportCsv = () => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`
    const head = ['state', ...qids, 'ms', 'erreur']
    const lines = batch.rows.map((r) => {
      const a = r.result?.response?.answers ?? {}
      const cells = qids.map((id) => {
        const x = a[id]
        if (!x) return ''
        return x.type === 'noul' ? x.noul.toFixed(4) : x.type === 'choice' ? x.choice : x.score.toFixed(4)
      })
      return [esc(r.label), ...cells.map(esc), String(Math.round(r.result?.ms ?? 0)), esc(r.result?.error ?? '')].join(',')
    })
    const blob = new Blob([[head.join(','), ...lines].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'systemone-lot.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div>
      <div className="meta">
        <span className="pill">{done.length}/{batch.rows.length} évalués</span>
        <span className={`pill ${ok.length === done.length ? 'ok' : 'ko'}`}>{ok.length} OK</span>
        <span className="pill">moyenne {Math.round(avg)} ms</span>
        <div className="spacer" />
        <button className="ghost" disabled={!done.length} onClick={exportCsv}>Exporter CSV</button>
      </div>
      <div className="tablewrap">
        <table className="btable">
          <thead>
            <tr>
              <th>#</th>
              <th>State</th>
              {qids.map((id) => <th key={id} className="mono">{id}</th>)}
              <th>ms</th>
            </tr>
          </thead>
          <tbody>
            {batch.rows.map((r, i) => (
              <tr key={i} className={`${selected === i ? 'sel' : ''} ${r.running ? 'running' : ''}`} onClick={() => onSelect(selected === i ? null : i)}>
                <td className="muted">{i + 1}</td>
                <td className="statecell" title={r.label}>
                  {r.image && <img className="rowthumb" src={r.image} alt="" />}
                  {r.label}
                </td>
                {r.result && !r.result.ok ? (
                  <td colSpan={qids.length} className="err-inline">{r.result.error}</td>
                ) : (
                  qids.map((id) => (
                    <td key={id}>
                      {r.running ? <span className="muted">…</span> : <AnswerCell answer={r.result?.response?.answers[id]} question={batch.request.questions[id]} />}
                    </td>
                  ))
                )}
                <td className="muted mono">{r.result ? Math.round(r.result.ms) : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sel?.result?.response && (
        <div className="detail">
          <h3>Détail de la ligne {selected! + 1}</h3>
          <SentImages urls={sel.image ? [sel.image] : batch.request.images} />
          <div className="hstate">{sel.label}</div>
          <div className="answers">
            {qids.map((id) =>
              sel.result!.response!.answers[id] ? (
                <AnswerCard key={id} id={id} answer={sel.result!.response!.answers[id]} question={batch.request.questions[id]} />
              ) : null,
            )}
          </div>
        </div>
      )}
      {!sel && done.length > 0 && <p className="muted small">Clique sur une ligne pour voir le détail des distributions.</p>}
    </div>
  )
}


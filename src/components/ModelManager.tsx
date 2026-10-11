import { useEffect, useState } from 'react'
import { uid } from '../draft'
import { evaluateModel, hostOf, modelSubtitle, TEMPLATES, useModelStatus, type ModelConnection } from '../models'
import type { RunResult } from '../types'
import { Avatar, StatusBadge } from './ModelPicker'

/** Requête minimale pour vérifier qu'un modèle répond. */
const PING = {
  model: '',
  state: 'Le colis est arrivé avec trois jours de retard et la boîte était abîmée.',
  questions: { is_negative: { type: 'noul' as const, instructions: 'Is this message negative?' } },
}

interface Props {
  models: ModelConnection[]
  onChange: (models: ModelConnection[]) => void
  initialId?: string
  onClose: () => void
}

export function ModelManager({ models, onChange, initialId, onClose }: Props) {
  const [selected, setSelected] = useState(initialId ?? models[0]?.id ?? '')
  const [adding, setAdding] = useState(models.length === 0)
  const [confirmDel, setConfirmDel] = useState(false)
  const current = models.find((m) => m.id === selected)

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [onClose])

  const patch = (p: Partial<ModelConnection>) => onChange(models.map((m) => (m.id === selected ? { ...m, ...p } : m)))
  const add = (m: Omit<ModelConnection, 'id'>) => {
    const id = uid()
    onChange([...models, { ...m, id }])
    setSelected(id)
    setAdding(false)
  }
  const remove = () => {
    const rest = models.filter((m) => m.id !== selected)
    onChange(rest)
    setSelected(rest[0]?.id ?? '')
    setConfirmDel(false)
    if (!rest.length) setAdding(true)
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-label="Modèles connectés">
        <div className="modal-head">
          <h2>Modèles connectés</h2>
          <span className="muted small">Partagés entre le testeur et le benchmark. Les clés restent dans ce navigateur.</span>
          <div className="spacer" />
          <button className="icon" title="Fermer" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <aside className="mm-list">
            {models.map((m) => (
              <ListItem key={m.id} m={m} active={!adding && m.id === selected} onPick={() => { setSelected(m.id); setAdding(false); setConfirmDel(false) }} />
            ))}
            <button className={`mm-add ${adding ? 'on' : ''}`} onClick={() => setAdding(true)}>+ Connecter un modèle</button>
          </aside>

          <section className="mm-form">
            {adding || !current ? (
              <>
                <h3>Quel type de modèle ?</h3>
                <div className="templates">
                  {TEMPLATES.map((t) => (
                    <button key={t.name} className="template" onClick={() => add(t.model)}>
                      <span className="strong">{t.name}</span>
                      <span className="muted small">{t.hint}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <ModelForm key={current.id} m={current} onPatch={patch} onDuplicate={() => add({ ...current, label: `${current.label} (copie)` })} confirmDel={confirmDel} onAskDelete={() => setConfirmDel(true)} onDelete={remove} />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function ListItem({ m, active, onPick }: { m: ModelConnection; active: boolean; onPick: () => void }) {
  const status = useModelStatus(m)
  return (
    <button className={`mm-item ${active ? 'on' : ''}`} onClick={onPick}>
      <Avatar m={m} size={28} />
      <span className="mp-text">
        <span className="strong ellipsis">{m.label || 'Sans nom'}</span>
        <span className="muted small ellipsis">{hostOf(m.url)}</span>
      </span>
      <StatusBadge status={status} />
    </button>
  )
}

interface FormProps {
  m: ModelConnection
  onPatch: (p: Partial<ModelConnection>) => void
  onDuplicate: () => void
  confirmDel: boolean
  onAskDelete: () => void
  onDelete: () => void
}

function ModelForm({ m, onPatch, onDuplicate, confirmDel, onAskDelete, onDelete }: FormProps) {
  const [refresh, setRefresh] = useState(0)
  const status = useModelStatus(m, refresh)
  const [test, setTest] = useState<RunResult | 'running' | null>(null)
  const set = (p: Partial<ModelConnection>) => {
    onPatch(p)
    setTest(null)
  }
  const runTest = async () => {
    setTest('running')
    setRefresh((r) => r + 1)
    setTest(await evaluateModel(m, PING, AbortSignal.timeout(30_000)))
  }
  const kind = m.kind ?? 'systemone'

  return (
    <>
      <div className="mm-title">
        <Avatar m={m} size={44} />
        <div className="grow">
          <div className="mp-name">{m.label || 'Sans nom'}</div>
          <div className="muted small">{modelSubtitle(m, status)}</div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="field">
        <label>Type d’API</label>
        <div className="seg">
          <button className={kind === 'systemone' ? 'on' : ''} onClick={() => set({ kind: 'systemone' })}>API System One</button>
          <button className={kind === 'openrouter' ? 'on' : ''} onClick={() => set({ kind: 'openrouter' })}>Modèle de chat (adaptateur)</button>
        </div>
      </div>
      <div className="grid2">
        <div className="field"><label>Nom affiché (repris dans les rapports)</label><input value={m.label} onChange={(e) => set({ label: e.target.value })} /></div>
        <div className="field"><label>model</label><input className="mono" value={m.model} onChange={(e) => set({ model: e.target.value })} /></div>
      </div>
      <div className="field">
        <label>URL de base</label>
        <input className="mono" value={m.url} spellCheck={false} onChange={(e) => set({ url: e.target.value })} />
        <span className="muted small">
          {kind === 'openrouter'
            ? '/v1/chat/completions est ajouté. Un appel par question, réponse en 1 token, probabilités issues des logprobs.'
            : '/v1/systemone est ajouté ; une URL finissant par /systemone ou /decisions est gardée telle quelle.'}
        </span>
      </div>
      <div className="grid2">
        <div className="field"><label>En-tête d’authentification</label><input className="mono" value={m.authHeader} placeholder="aucun" onChange={(e) => set({ authHeader: e.target.value })} /></div>
        <div className="field"><label>Valeur (jamais écrite dans les rapports)</label><input className="mono" type="password" value={m.authValue} placeholder="Bearer sk-…" disabled={!m.authHeader.trim()} onChange={(e) => set({ authValue: e.target.value })} /></div>
      </div>
      {kind === 'openrouter' && (
        <div className="field">
          <label>Paramètres supplémentaires (JSON fusionné dans chaque appel, optionnel)</label>
          <textarea className="mono" rows={2} value={m.extraBody ?? ''} placeholder='{ "provider": { "order": ["…"] } }' onChange={(e) => set({ extraBody: e.target.value })} />
        </div>
      )}
      <label className="check small">
        <input type="checkbox" checked={m.proxy} onChange={(e) => set({ proxy: e.target.checked })} />
        Passer par le proxy local (API sans CORS) — la latence est alors mesurée côté proxy
      </label>

      <div className="mm-actions">
        <button className="primary" disabled={test === 'running'} onClick={runTest}>{test === 'running' ? 'Test…' : 'Tester la connexion'}</button>
        {test && test !== 'running' && (
          test.ok
            ? <span className="small ok-text">OK · {Math.round(test.upstreamMs ?? test.ms)} ms · {test.response?.usage?.input_tokens ?? '?'} tokens · {test.response?.model}</span>
            : <span className="err-inline">{test.error}</span>
        )}
        <div className="spacer" />
        <button className="ghost" onClick={onDuplicate}>Dupliquer</button>
        {confirmDel
          ? <button className="ghost danger-btn" onClick={onDelete}>Confirmer la suppression</button>
          : <button className="ghost" onClick={onAskDelete}>Supprimer</button>}
      </div>
    </>
  )
}

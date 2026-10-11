import { TYPE_LABEL, uid } from '../draft'
import type { QuestionDraft, QType } from '../types'

interface Props {
  q: QuestionDraft
  index: number
  count: number
  onChange: (q: QuestionDraft) => void
  onRemove: () => void
  onDuplicate: () => void
  onMove: (dir: -1 | 1) => void
}

const TYPE_HELP: Record<QType, string> = {
  noul: 'Oui ou non → probabilité du oui (0 à 1)',
  choice: 'Une option parmi plusieurs → distribution de probabilités',
  score: 'Position sur une échelle ordonnée → valeur pondérée',
}

const TYPES: QType[] = ['noul', 'choice', 'score']

/** Résumé des critères affiché sur la ligne repliée. */
function criteriaSummary(q: QuestionDraft): string {
  if (q.type === 'choice') {
    const n = q.choices.filter((c) => c.key.trim()).length
    return `${n} option${n > 1 ? 's' : ''}`
  }
  if (q.type === 'score') {
    const n = q.levels.filter((l) => l.text.trim()).length
    return `${n} niveau${n > 1 ? 'x' : ''}`
  }
  return ''
}

export function QuestionEditor({ q, index, count, onChange, onRemove, onDuplicate, onMove }: Props) {
  const set = (patch: Partial<QuestionDraft>) => onChange({ ...q, ...patch })

  let jsonError = ''
  if (q.instructionsMode === 'json' && q.instructions.trim()) {
    try {
      JSON.parse(q.instructions)
    } catch (e) {
      jsonError = (e as Error).message
    }
  }

  const summary = q.instructions.trim().split('\n')[0]
  const meta = [q.id, criteriaSummary(q)].filter(Boolean).join(' · ')

  if (q.collapsed)
    return (
      <button className={`qrow q-${q.type}`} onClick={() => set({ collapsed: false })} title="Cliquer pour modifier">
        <span className={`badge badge-${q.type}`}>{TYPE_LABEL[q.type]}</span>
        <span className={`qrow-text ${summary ? '' : 'muted'}`}>{summary || 'Question sans texte'}</span>
        {meta && <span className="qrow-meta mono">{meta}</span>}
        <span className="caret" aria-hidden />
      </button>
    )

  const setChoice = (i: number, patch: Partial<QuestionDraft['choices'][number]>) =>
    set({ choices: q.choices.map((x, j) => (j === i ? { ...x, ...patch } : x)) })
  const setLevel = (i: number, text: string) => set({ levels: q.levels.map((x, j) => (j === i ? { ...x, text } : x)) })

  return (
    <div className={`qedit q-${q.type}`}>
      <div className="qedit-head">
        <div className="qtypes" role="radiogroup" aria-label="Type de question">
          {TYPES.map((t) => (
            <button key={t} role="radio" aria-checked={q.type === t} className={`qtype qtype-${t} ${q.type === t ? 'on' : ''}`} title={TYPE_HELP[t]} onClick={() => set({ type: t })}>
              {TYPE_LABEL[t]}
            </button>
          ))}
        </div>
        <div className="spacer" />
        <div className="qactions">
          <button className="icon" title="Monter" disabled={index === 0} onClick={() => onMove(-1)}>↑</button>
          <button className="icon" title="Descendre" disabled={index === count - 1} onClick={() => onMove(1)}>↓</button>
          <button className="icon" title="Dupliquer" onClick={onDuplicate}>⧉</button>
          <button className="icon danger" title="Supprimer" onClick={onRemove}>✕</button>
        </div>
      </div>

      <div className="qedit-body">
        <textarea
          className={`qedit-question ${q.instructionsMode === 'json' ? 'mono' : ''}`}
          rows={q.instructionsMode === 'json' ? 5 : 1}
          value={q.instructions}
          title="Référence au state avec `chemin.vers.champ`"
          autoFocus={!q.instructions}
          placeholder={
            q.instructionsMode === 'json'
              ? '{\n  "reference": { ... },\n  "question": "Is `state` the same as `reference`?"\n}'
              : q.type === 'noul'
                ? 'Ex. : Le client est-il mécontent ?'
                : q.type === 'choice'
                  ? 'Ex. : Quelle équipe doit traiter ce ticket ?'
                  : 'Ex. : À quel point le client est-il frustré ?'
          }
          onChange={(e) => set({ instructions: e.target.value })}
        />
        <div className="qedit-sub">
          <span className="muted small ellipsis">{TYPE_HELP[q.type]}</span>
          <div className="spacer" />
          <ModeToggle value={q.instructionsMode} onChange={(m) => set({ instructionsMode: m })} />
        </div>
        {jsonError && <div className="err-inline">JSON invalide : {jsonError}</div>}

        {q.type === 'noul' && (
          <div className="qcrit">
            <div className="qcrit-title">Ce que signifie chaque réponse <span className="muted">· optionnel</span></div>
            <div className="qopt">
              <span className="qchip qchip-yes">OUI</span>
              <input value={q.noulTrue} placeholder="ex. Urgence explicite, délai mentionné" onChange={(e) => set({ noulTrue: e.target.value })} />
            </div>
            <div className="qopt">
              <span className="qchip qchip-no">NON</span>
              <input value={q.noulFalse} placeholder="ex. Aucune urgence exprimée" onChange={(e) => set({ noulFalse: e.target.value })} />
            </div>
          </div>
        )}

        {q.type === 'choice' && (
          <div className="qcrit">
            <div className="qcrit-title">Options <span className="muted">· clé renvoyée par l’API, description optionnelle</span></div>
            {q.choices.map((c, i) => (
              <div className="qopt" key={c.uid}>
                <input className="mono qkey" value={c.key} placeholder={`option_${i + 1}`} onChange={(e) => setChoice(i, { key: e.target.value })} />
                <input className="grow" value={c.desc} placeholder="Description" onChange={(e) => setChoice(i, { desc: e.target.value })} />
                <button className="icon qopt-x" title="Retirer" onClick={() => set({ choices: q.choices.filter((_, j) => j !== i) })}>✕</button>
              </div>
            ))}
            <button className="qadd" onClick={() => set({ choices: [...q.choices, { uid: uid(), key: '', desc: '' }] })}>+ Ajouter une option</button>
          </div>
        )}

        {q.type === 'score' && (
          <div className="qcrit">
            <div className="qcrit-title">Niveaux <span className="muted">· du plus bas au plus haut, 10 maximum</span></div>
            {q.levels.map((l, i) => (
              <div className="qopt" key={l.uid}>
                <span className="qlevel mono" style={{ '--lvl': q.levels.length > 1 ? i / (q.levels.length - 1) : 1 } as React.CSSProperties}>{i}</span>
                <input className="grow" value={l.text} placeholder={i === 0 ? 'Niveau le plus bas' : i === q.levels.length - 1 ? 'Niveau le plus haut' : `Niveau ${i}`} onChange={(e) => setLevel(i, e.target.value)} />
                <button className="icon qopt-x" title="Monter" disabled={i === 0} onClick={() => set({ levels: swap(q.levels, i, i - 1) })}>↑</button>
                <button className="icon qopt-x" title="Retirer" onClick={() => set({ levels: q.levels.filter((_, j) => j !== i) })}>✕</button>
              </div>
            ))}
            {q.levels.length < 10 && <button className="qadd" onClick={() => set({ levels: [...q.levels, { uid: uid(), text: '' }] })}>+ Ajouter un niveau</button>}
          </div>
        )}
      </div>

      <div className="qedit-foot">
        <label className="qid-field" title="Clé de cette question dans la requête et dans la réponse">
          <span className="muted small">Identifiant</span>
          <input className="mono" value={q.id} placeholder="identifiant" onChange={(e) => set({ id: e.target.value.replace(/\s/g, '_') })} />
        </label>
        <div className="spacer" />
        <button className="ghost" onClick={() => set({ collapsed: true })}>Terminé</button>
      </div>
    </div>
  )
}

function swap<T>(arr: T[], a: number, b: number): T[] {
  const c = [...arr]
  ;[c[a], c[b]] = [c[b], c[a]]
  return c
}

export function ModeToggle({ value, onChange }: { value: 'text' | 'json'; onChange: (v: 'text' | 'json') => void }) {
  return (
    <div className="seg small">
      <button className={value === 'text' ? 'on' : ''} onClick={() => onChange('text')}>Texte</button>
      <button className={value === 'json' ? 'on' : ''} onClick={() => onChange('json')}>JSON</button>
    </div>
  )
}

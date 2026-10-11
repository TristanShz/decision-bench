import type { Answer, ChoiceAnswer, NoulAnswer, Question, ScoreAnswer } from '../types'
import { TYPE_LABEL } from '../draft'

const pct = (v: number) => `${(v * 100).toFixed(1)} %`

export function AnswerCard({ id, answer, question }: { id: string; answer: Answer; question?: Question }) {
  const instr = question
    ? typeof question.instructions === 'string'
      ? question.instructions
      : JSON.stringify(question.instructions)
    : ''
  return (
    <div className="acard">
      <div className="ahead">
        <span className={`badge badge-${answer.type}`} title={answer.type}>{TYPE_LABEL[answer.type]}</span>
        <span className="mono strong">{id}</span>
        {'confidence' in answer && <Confidence value={answer.confidence} />}
      </div>
      {instr && <div className="muted ainstr" title={instr}>{instr}</div>}
      {answer.type === 'noul' && <NoulView a={answer} />}
      {answer.type === 'choice' && <ChoiceView a={answer} question={question} />}
      {answer.type === 'score' && <ScoreView a={answer} question={question} />}
    </div>
  )
}

function Confidence({ value }: { value: number }) {
  const cls = value >= 0.7 ? 'good' : value >= 0.4 ? 'mid' : 'low'
  return <span className={`conf conf-${cls}`} title="Concentration de la distribution">confiance {pct(value)}</span>
}

function NoulView({ a }: { a: NoulAnswer }) {
  const v = a.noul
  const verdict = v >= 0.8 ? 'Oui' : v >= 0.6 ? 'Plutôt oui' : v > 0.4 ? 'Incertain' : v > 0.2 ? 'Plutôt non' : 'Non'
  return (
    <div>
      <div className="noul-top">
        <span className="big">{pct(v)}</span>
        <span className={`verdict ${v >= 0.5 ? 'yes' : 'no'}`}>{verdict}</span>
      </div>
      <div className="noul-track">
        <div className="noul-fill" style={{ width: `${v * 100}%` }} />
        <div className="noul-mid" />
      </div>
      <div className="scale-labels muted"><span>non</span><span>oui</span></div>
    </div>
  )
}

function ChoiceView({ a, question }: { a: ChoiceAnswer; question?: Question }) {
  const crit = (question?.criteria ?? {}) as Record<string, unknown>
  const rows = Object.entries(a.probabilities).sort((x, y) => y[1] - x[1])
  return (
    <div className="bars">
      {rows.map(([k, p]) => (
        <Bar
          key={k}
          label={k}
          sub={typeof crit[k] === 'string' ? (crit[k] as string) : undefined}
          value={p}
          active={k === a.choice}
        />
      ))}
    </div>
  )
}

function ScoreView({ a, question }: { a: ScoreAnswer; question?: Question }) {
  const crit = Array.isArray(question?.criteria) ? (question.criteria as unknown[]) : []
  const n = Math.max(Object.keys(a.probabilities).length, crit.length, 2)
  const label = (i: number) => {
    const c = crit[i] ?? a.legend?.[String(i)]
    return typeof c === 'string' ? c : c != null ? JSON.stringify(c) : `Niveau ${i}`
  }
  const pos = (a.score / (n - 1)) * 100
  const nearest = Math.round(a.score)
  return (
    <div>
      <div className="noul-top">
        <span className="big">{a.score.toFixed(2)}</span>
        <span className="muted">/ {n - 1} · le plus proche : <b>{label(nearest)}</b></span>
      </div>
      <div className="score-track">
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className="tick" style={{ left: `${(i / (n - 1)) * 100}%` }} />
        ))}
        <div className="needle" style={{ left: `${pos}%` }} />
      </div>
      <div className="bars">
        {Array.from({ length: n }, (_, i) => (
          <Bar key={i} label={`${i} · ${label(i)}`} value={a.probabilities[String(i)] ?? 0} active={i === nearest} />
        ))}
      </div>
    </div>
  )
}

function Bar({ label, sub, value, active }: { label: string; sub?: string; value: number; active?: boolean }) {
  return (
    <div className={`bar ${active ? 'active' : ''}`} title={sub}>
      <div className="bar-label">
        <span className="mono">{label}</span>
        <span className="mono">{pct(value)}</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  )
}

/** Résumé compact d'une réponse pour le tableau du mode lot. */
export function AnswerCell({ answer, question }: { answer?: Answer; question?: Question }) {
  if (!answer) return <span className="muted">—</span>
  if (answer.type === 'noul') {
    const v = answer.noul
    return (
      <span className="cell" style={{ background: `color-mix(in srgb, var(--accent) ${Math.round(v * 45)}%, transparent)` }}>
        {pct(v)}
      </span>
    )
  }
  if (answer.type === 'choice') {
    return (
      <span className="cell">
        <b>{answer.choice}</b> <span className="muted">{pct(answer.probabilities[answer.choice] ?? 0)}</span>
      </span>
    )
  }
  const crit = Array.isArray(question?.criteria) ? (question.criteria as unknown[]) : []
  const near = crit[Math.round(answer.score)] ?? answer.legend?.[String(Math.round(answer.score))]
  return (
    <span className="cell" title={typeof near === 'string' ? near : undefined}>
      <b>{answer.score.toFixed(2)}</b> <span className="muted">{typeof near === 'string' ? near : ''}</span>
    </span>
  )
}

import type { Json } from '../types'
import { formatExpected } from './stats'
import type { BenchCase } from './types'
import { TYPE_LABEL } from '../draft'

const asText = (v: Json | undefined) => (v == null ? '' : typeof v === 'string' ? v : JSON.stringify(v, null, 2))
const PREVIEW = 1200

/** State et questions d'un cas de la suite, avec les réponses attendues. */
export function CaseDetails({ c }: { c: BenchCase }) {
  const state = asText(c.request.state)
  return (
    <div className="casedetails">
      <div className="small strong">State {state.length > PREVIEW && <span className="muted">({state.length.toLocaleString('fr-FR')} caractères, début affiché)</span>}</div>
      <pre className="code">{state.length > PREVIEW ? `${state.slice(0, PREVIEW)}\n…` : state}</pre>
      <div className="small strong">Questions ({Object.keys(c.request.questions).length})</div>
      <div className="caseqs">
        {Object.entries(c.request.questions).map(([qid, q]) => {
          const crit = q.criteria
          return (
            <div key={qid} className={`caseq qcard-${q.type}`}>
              <div className="row">
                <span className={`badge badge-${q.type}`} title={q.type}>{TYPE_LABEL[q.type]}</span>
                <span className="mono strong">{qid}</span>
                <div className="spacer" />
                <span className="small">attendu : <b className="mono">{formatExpected(c.expected[qid], q.type)}</b></span>
              </div>
              <div className="small caseq-instr">{asText(q.instructions)}</div>
              {q.type === 'choice' && crit && typeof crit === 'object' && !Array.isArray(crit) && (
                <ul className="small caseq-opts">
                  {Object.entries(crit).map(([k, d]) => (
                    <li key={k}><span className="mono">{k}</span>{d != null && <span className="muted"> — {asText(d)}</span>}</li>
                  ))}
                </ul>
              )}
              {q.type === 'score' && Array.isArray(crit) && (
                <ol start={0} className="small caseq-opts">
                  {crit.map((l, i) => <li key={i}>{asText(l)}</li>)}
                </ol>
              )}
              {q.type === 'noul' && crit && typeof crit === 'object' && !Array.isArray(crit) && (
                <div className="small muted">oui : {asText((crit as Record<string, Json>).true)} · non : {asText((crit as Record<string, Json>).false)}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

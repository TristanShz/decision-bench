import type { Json } from '../../types'
import type { BenchSuite, Expectation } from '../types'

// Sans dépendance à Vite : utilisé par le registre (navigateur) et par scripts/validate-suites.ts (Node).
// Messages en anglais : ils s'adressent aux contributeurs de nouvelles suites.

const COMPLEXITIES = ['simple', 'complexe']
const LENGTHS = ['court', 'moyen', 'long', 'très long']
const ID = /^[a-z0-9][a-z0-9-]*$/

const optionKeys = (criteria: Json | undefined): string[] | null =>
  Array.isArray(criteria) ? criteria.map(String) : criteria && typeof criteria === 'object' ? Object.keys(criteria) : null

const isRange = (e: Expectation): e is [number, number] => Array.isArray(e) && e.length === 2 && e.every((v) => typeof v === 'number') && e[0] <= e[1]

/** Liste les problèmes d'une suite ; tableau vide si elle est valide. */
export function validateSuite(suite: BenchSuite, folder?: string): string[] {
  const errors: string[] = []
  const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`)
  const at = `suite "${suite?.id ?? folder ?? '?'}"`

  if (!suite || typeof suite !== 'object') return [`${folder ?? '?'}: suite.ts must export \`suite\``]
  if (!ID.test(suite.id ?? '')) err(at, 'id must be lowercase letters, digits and dashes')
  if (folder && suite.id !== folder) err(at, `id must match its folder name ("${folder}")`)
  for (const k of ['name', 'description', 'lang', 'version'] as const) if (!suite[k]?.trim()) err(at, `missing "${k}"`)
  if (!Array.isArray(suite.cases) || !suite.cases.length) return [...errors, `${at}: no cases`]

  const seen = new Set<string>()
  for (const c of suite.cases) {
    const where = `${at} › case "${c.id}"`
    if (!ID.test(c.id ?? '')) err(where, 'id must be lowercase letters, digits and dashes')
    if (seen.has(c.id)) err(where, 'duplicate case id')
    seen.add(c.id)
    for (const k of ['name', 'description', 'category', 'lang'] as const) if (!c[k]?.trim()) err(where, `missing "${k}"`)
    if (!COMPLEXITIES.includes(c.complexity)) err(where, `complexity must be one of ${COMPLEXITIES.join(', ')}`)
    if (!LENGTHS.includes(c.length)) err(where, `length must be one of ${LENGTHS.join(', ')}`)
    if (c.request?.state === undefined) err(where, 'missing request.state')

    const questions = Object.entries(c.request?.questions ?? {})
    if (!questions.length) err(where, 'no questions')
    for (const qid of Object.keys(c.expected ?? {})) if (!c.request?.questions?.[qid]) err(where, `expected answer for unknown question "${qid}"`)

    for (const [qid, q] of questions) {
      const w = `${where} › ${qid}`
      const e = c.expected?.[qid]
      if (e === undefined) {
        err(w, 'missing expected answer')
        continue
      }
      if (q.type === 'noul') {
        if (typeof e !== 'boolean' && !(isRange(e) && e[0] >= 0 && e[1] <= 1)) err(w, 'noul expects a boolean or a [min, max] probability range within 0..1')
      } else if (q.type === 'choice') {
        const keys = optionKeys(q.criteria)
        if (!keys?.length) err(w, 'choice needs criteria (an object of options)')
        const picks = Array.isArray(e) ? e : [e]
        for (const p of picks) if (typeof p !== 'string' || (keys && !keys.includes(p))) err(w, `expected option "${String(p)}" is not in criteria`)
      } else if (q.type === 'score') {
        const n = Array.isArray(q.criteria) ? q.criteria.length : 0
        if (n < 2) err(w, 'score needs criteria as an array of at least 2 levels')
        const [lo, hi] = typeof e === 'number' ? [e, e] : isRange(e) ? e : [NaN, NaN]
        if (!Number.isInteger(lo) || !Number.isInteger(hi) || lo < 0 || hi > n - 1)
          err(w, `score expects a level index or [min, max] range within 0..${Math.max(0, n - 1)}`)
      } else {
        err(w, `unknown question type "${(q as { type: string }).type}"`)
      }
    }
  }
  return errors
}

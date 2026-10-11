import type { Json, Question } from '../../types'
import type { Complexity, Expectation, Length } from '../types'

// Benchmark « core » : les mêmes cas en français (core-fr) et en anglais (core-en), simplement traduits.
// Chaque cas est écrit une seule fois avec ses deux traductions côte à côte, pour que les deux suites
// restent identiques : mêmes identifiants, mêmes questions, mêmes options, mêmes réponses attendues.

export type CoreLang = 'fr' | 'en'

export interface Side {
  name: string
  description: string
  state: Json
  questions: Record<string, Question>
}

export interface Pair {
  id: string
  category: string
  complexity: Complexity
  length: Length
  expected: Record<string, Expectation>
  fr: Side
  en: Side
}

const optionKeys = (q: Question) => (Array.isArray(q.criteria) ? q.criteria.length : Object.keys((q.criteria as object) ?? {}).sort().join(','))

/** Refuse une paire dont les deux traductions n'ont pas la même structure. */
export function checkPair(p: Pair) {
  const fr = Object.keys(p.fr.questions)
  const en = Object.keys(p.en.questions)
  if (fr.join() !== en.join()) throw new Error(`core › ${p.id}: question ids differ between fr and en`)
  for (const qid of fr) {
    const a = p.fr.questions[qid]
    const b = p.en.questions[qid]
    if (a.type !== b.type) throw new Error(`core › ${p.id} › ${qid}: type differs between fr and en`)
    if (a.type !== 'noul' && optionKeys(a) !== optionKeys(b)) throw new Error(`core › ${p.id} › ${qid}: criteria differ between fr and en`)
  }
}

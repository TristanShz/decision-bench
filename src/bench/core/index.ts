import type { BenchCase } from '../types'
import { BASE } from './base.ts'
import { DOCUMENTS } from './documents.ts'
import { LANGUAGE } from './language.ts'
import { NUMBERS } from './numbers.ts'
import { OPERATIONS } from './operations.ts'
import { RULES } from './rules.ts'
import { checkPair, type CoreLang } from './pair.ts'

export type { CoreLang } from './pair.ts'

/** À incrémenter dès qu'un cas change, dans l'une ou l'autre langue. */
export const CORE_VERSION = '2'

// Un fichier par thème ; l'ordre des cas suit l'ordre de cette liste.
const PAIRS = [...BASE, ...LANGUAGE, ...OPERATIONS, ...RULES, ...NUMBERS, ...DOCUMENTS]

/** Les cas du benchmark core dans une langue ; identifiants identiques d'une langue à l'autre. */
export function coreCases(lang: CoreLang): BenchCase[] {
  const seen = new Set<string>()
  return PAIRS.map((p) => {
    checkPair(p)
    if (seen.has(p.id)) throw new Error(`core › ${p.id}: duplicate case id`)
    seen.add(p.id)
    const side = p[lang]
    return {
      id: p.id,
      name: side.name,
      description: side.description,
      category: p.category,
      complexity: p.complexity,
      length: p.length,
      lang,
      request: { state: side.state, questions: side.questions },
      expected: p.expected,
    }
  })
}

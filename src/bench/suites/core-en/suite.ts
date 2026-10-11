import type { BenchSuite } from '../../types'
import { CORE_VERSION, coreCases } from '../../core/index.ts'

// Les cas sont définis une seule fois, avec leur traduction française, dans src/bench/core/.
export const suite: BenchSuite = {
  id: 'core-en',
  name: 'Core (EN)',
  description: 'Core benchmark in English: exactly the same cases as core-fr, translated. Comparing both measures the effect of the language alone.',
  lang: 'en',
  version: CORE_VERSION,
  cases: coreCases('en'),
}

import type { BenchSuite } from '../../types'
import { CORE_VERSION, coreCases } from '../../core/index.ts'

// Les cas sont définis une seule fois, avec leur traduction anglaise, dans src/bench/core/.
export const suite: BenchSuite = {
  id: 'core-fr',
  name: 'Core (FR)',
  description: 'Benchmark core en français : exactement les mêmes cas que core-en, traduits. Comparer les deux mesure l’effet de la langue seule.',
  lang: 'fr',
  version: CORE_VERSION,
  cases: coreCases('fr'),
}

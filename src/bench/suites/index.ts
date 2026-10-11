import type { BenchSuite } from '../types'
import { validateSuite } from './validate.ts'

/** Suite des rapports enregistrés avant l'introduction des suites multiples. */
export const LEGACY_SUITE_ID = 'multilingual'
/** Suite proposée par défaut, et ordre d'affichage du sélecteur. */
export const DEFAULT_SUITE_ID = 'fr-native'
const ORDER = ['core-fr', 'core-en', 'fr-native', 'en-native', 'multilingual']

// Chaque dossier src/bench/suites/<id>/suite.ts est découvert automatiquement : rien à enregistrer ici.
const modules = import.meta.glob<{ suite: BenchSuite }>('./*/suite.ts', { eager: true })

export const SUITES: BenchSuite[] = Object.entries(modules)
  .map(([path, mod]) => {
    const folder = path.split('/')[1]
    const errors = validateSuite(mod.suite, folder)
    // Une suite invalide est écartée plutôt que de fausser les rapports.
    if (errors.length) {
      console.error(`Suite "${folder}" ignorée :\n${errors.join('\n')}`)
      return null
    }
    return mod.suite
  })
  .filter((s): s is BenchSuite => s != null)
  // Suites connues d'abord, puis les contributions par ordre alphabétique.
  .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name))

function rank(s: BenchSuite) {
  const i = ORDER.indexOf(s.id)
  return i < 0 ? ORDER.length : i
}

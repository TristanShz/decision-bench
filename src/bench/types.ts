import type { Answer, QType, SystemOneRequest } from '../types'

export type Complexity = 'simple' | 'complexe'
export type Length = 'court' | 'moyen' | 'long' | 'très long'

/**
 * Réponse attendue, interprétée selon le type de question :
 * - noul : booléen, ou intervalle [min, max] de probabilité (cas ambigus, calibration) ;
 * - choice : option attendue, ou liste d'options acceptables ;
 * - score : niveau attendu, ou intervalle [min, max] de niveaux acceptables.
 */
export type Expectation = boolean | string | string[] | number | [number, number]

export interface BenchCase {
  id: string
  name: string
  description: string
  category: string
  complexity: Complexity
  length: Length
  lang: string
  /** Le champ model est remplacé par celui de la cible au lancement. */
  request: Omit<SystemOneRequest, 'model'>
  expected: Record<string, Expectation>
}

/** Une suite = un dossier src/bench/suites/<id>/suite.ts qui exporte `suite`. */
export interface BenchSuite {
  /** Identique au nom du dossier ; enregistré dans les rapports. */
  id: string
  name: string
  description: string
  /** Langue principale (code ISO 639-1, ex. fr, en, de). Les cas peuvent en utiliser d'autres comme contrôle. */
  lang: string
  /** À incrémenter dès qu'un cas change : la comparaison signale les rapports de versions différentes. */
  version: string
  /** Auteur ou mainteneur, optionnel. */
  author?: string
  cases: BenchCase[]
}

/** Les cibles du benchmark sont les modèles connectés de l'app. */
export type { ModelConnection as Target, ModelKind as TargetKind } from '../models'
import type { ModelKind } from '../models'

export interface BenchSettings {
  repetitions: number
  warmup: number
  concurrency: number
  timeoutMs: number
}

export interface CaseQuestionMeta {
  type: QType
  expected?: Expectation
  /** Nombre de niveaux (score) ou d'options (choice). */
  size: number
}

/** Métadonnées recopiées dans le rapport, pour qu'il reste lisible si la suite évolue. */
export interface CaseMeta {
  id: string
  name: string
  category: string
  complexity: Complexity
  length: Length
  lang: string
  questions: Record<string, CaseQuestionMeta>
}

export interface RunRecord {
  rep: number
  ok: boolean
  status: number
  /** Latence retenue : mesurée par le proxy si utilisé, sinon par le navigateur. */
  ms: number
  clientMs: number
  inputTokens?: number
  /** Coût facturé en USD, si l'API le renvoie (OpenRouter). */
  cost?: number
  error?: string
  answers?: Record<string, Answer>
  /** Horodatage de fin, relatif au début du benchmark. */
  at: number
}

export interface CaseResult {
  meta: CaseMeta
  runs: RunRecord[]
}

export interface BenchReport {
  id: string
  name: string
  notes?: string
  createdAt: string
  /** Absent sur les rapports antérieurs aux suites multiples : fr. */
  suiteId?: string
  suiteVersion: string
  target: { kind?: ModelKind; label: string; url: string; model: string; proxy: boolean; serverModel?: string; serverCtx?: number }
  settings: BenchSettings
  durationMs: number
  aborted?: boolean
  cases: CaseResult[]
  summary: Summary
}

export interface ReportListItem {
  id: string
  name: string
  createdAt: string
  suiteId?: string
  suiteVersion?: string
  target: BenchReport['target']
  settings: BenchSettings
  summary: Summary
  durationMs: number
}

export interface LatencyStats {
  n: number
  mean: number
  min: number
  p50: number
  p90: number
  p95: number
  p99: number
  max: number
  stdev: number
}

export interface GroupStats {
  key: string
  cases: number
  latency: LatencyStats
  accuracy: number | null
  quality: number | null
}

export interface Summary {
  cases: number
  requests: number
  ok: number
  errorRate: number
  latency: LatencyStats
  inputTokens: number
  /** Coût total facturé en USD (null si l'API ne le renvoie pas). */
  cost: number | null
  /** Tokens d'entrée traités par seconde de latence cumulée. */
  tokensPerSec: number | null
  /** Médiane des ms par token d'entrée. */
  msPerToken: number | null
  /** Requêtes réussies par seconde de temps réel (dépend de la concurrence). */
  requestsPerSec: number
  /** Part des questions dont la décision est correcte (0..1). */
  accuracy: number | null
  /** Score continu 0..1 : proba de la bonne réponse, distance au niveau attendu. */
  quality: number | null
  /** Part des questions dont la décision est identique entre répétitions. */
  consistency: number | null
  byType: Record<string, { questions: number; accuracy: number | null; quality: number | null }>
  byLength: GroupStats[]
  byComplexity: GroupStats[]
  byCategory: GroupStats[]
  /** Absent sur les anciens rapports. */
  byLang?: GroupStats[]
}

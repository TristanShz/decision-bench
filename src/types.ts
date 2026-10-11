export type QType = 'noul' | 'choice' | 'score'
export type TextMode = 'text' | 'json'

export interface ChoiceOption {
  uid: string
  key: string
  desc: string
}

export interface ScoreLevel {
  uid: string
  text: string
}

export interface QuestionDraft {
  uid: string
  id: string
  type: QType
  instructions: string
  instructionsMode: TextMode
  noulTrue: string
  noulFalse: string
  choices: ChoiceOption[]
  levels: ScoreLevel[]
  collapsed?: boolean
}

export interface DraftImage {
  uid: string
  name: string
  /** data:image/...;base64,... — vide si l'image n'a pas pu être conservée (historique). */
  dataUrl: string
  width: number
  height: number
}

export interface Draft {
  model: string
  stateMode: TextMode
  state: string
  questions: QuestionDraft[]
  images?: DraftImage[]
}

export type Json = string | number | boolean | null | Json[] | { [k: string]: Json }

export interface Question {
  type: QType
  instructions: Json
  criteria?: Json
}

export interface SystemOneRequest {
  model: string
  state: Json
  questions: Record<string, Question>
  /** Images en data URLs, envoyées avec le state (nécessite le mmproj côté serveur). */
  images?: string[]
}

export interface NoulAnswer {
  type: 'noul'
  noul: number
}

export interface ChoiceAnswer {
  type: 'choice'
  choice: string
  probabilities: Record<string, number>
  confidence: number
}

export interface ScoreAnswer {
  type: 'score'
  score: number
  legend?: Record<string, string>
  probabilities: Record<string, number>
  confidence: number
}

export type Answer = NoulAnswer | ChoiceAnswer | ScoreAnswer

export interface SystemOneResponse {
  model: string
  answers: Record<string, Answer>
  usage?: { input_tokens: number; output_tokens: number; /** Coût en USD (OpenRouter). */ cost?: number }
}

export interface RunResult {
  ok: boolean
  status: number
  ms: number
  /** Latence mesurée par le proxy local, sans le saut navigateur → proxy. */
  upstreamMs?: number
  response?: SystemOneResponse
  error?: string
  raw?: unknown
}

export interface HistoryEntry {
  id: string
  at: number
  url: string
  /** Nom du modèle connecté utilisé. */
  modelLabel?: string
  draft: Draft
  request: SystemOneRequest
  result: RunResult
}

export interface BatchRow {
  label: string
  state: Json
  image?: string
  result?: RunResult
  running?: boolean
}

import type { Draft, DraftImage, Json, Question, QuestionDraft, QType, SystemOneRequest } from './types'

/** Libellés affichés des types de question (les noms de l'API restent noul / choice / score). */
export const TYPE_LABEL: Record<QType, string> = { noul: 'Oui/Non', choice: 'Choix', score: 'Score' }

export const uid = () => Math.random().toString(36).slice(2, 10)

export function newQuestion(type: QType = 'noul', id = ''): QuestionDraft {
  return {
    uid: uid(),
    id,
    type,
    instructions: '',
    instructionsMode: 'text',
    noulTrue: '',
    noulFalse: '',
    choices: [
      { uid: uid(), key: '', desc: '' },
      { uid: uid(), key: '', desc: '' },
    ],
    levels: [
      { uid: uid(), text: '' },
      { uid: uid(), text: '' },
      { uid: uid(), text: '' },
    ],
  }
}

export function emptyDraft(): Draft {
  return { model: 'clef', stateMode: 'text', state: '', questions: [newQuestion('noul', 'q1')], images: [] }
}

/** Une description qui ressemble à du JSON objet/tableau est envoyée structurée, sinon en texte. */
export function looseJson(s: string): Json {
  const t = s.trim()
  if (t.startsWith('{') || t.startsWith('[')) {
    try {
      return JSON.parse(t) as Json
    } catch {
      /* texte brut */
    }
  }
  return s
}

const asText = (v: unknown): string =>
  v == null ? '' : typeof v === 'string' ? v : JSON.stringify(v, null, 2)

export interface BuildResult {
  request?: SystemOneRequest
  errors: string[]
}

export function parseState(draft: Pick<Draft, 'state' | 'stateMode'>): { value?: Json; error?: string } {
  if (draft.stateMode === 'text') return { value: draft.state }
  try {
    return { value: JSON.parse(draft.state) as Json }
  } catch (e) {
    return { error: `State JSON invalide : ${(e as Error).message}` }
  }
}

export function buildQuestions(draft: Draft): { questions: Record<string, Question>; errors: string[] } {
  const errors: string[] = []
  const questions: Record<string, Question> = {}
  if (draft.questions.length === 0) errors.push('Ajoute au moins une question.')

  draft.questions.forEach((q, i) => {
    const label = q.id.trim() || `#${i + 1}`
    const id = q.id.trim()
    if (!id) errors.push(`Question ${label} : identifiant manquant.`)
    else if (questions[id]) errors.push(`Identifiant en double : ${id}.`)

    let instructions: Json = q.instructions
    if (q.instructionsMode === 'json') {
      try {
        instructions = JSON.parse(q.instructions) as Json
      } catch (e) {
        errors.push(`Question ${label} : instructions JSON invalides (${(e as Error).message}).`)
      }
    } else if (!q.instructions.trim()) {
      errors.push(`Question ${label} : instructions vides.`)
    }

    const question: Question = { type: q.type, instructions }

    if (q.type === 'noul') {
      const c: Record<string, Json> = {}
      if (q.noulTrue.trim()) c.true = looseJson(q.noulTrue)
      if (q.noulFalse.trim()) c.false = looseJson(q.noulFalse)
      if (Object.keys(c).length) question.criteria = c
    } else if (q.type === 'choice') {
      const c: Record<string, Json> = {}
      q.choices.forEach((o) => {
        const k = o.key.trim()
        if (!k) return
        if (k in c) errors.push(`Question ${label} : option en double « ${k} ».`)
        c[k] = o.desc.trim() ? looseJson(o.desc) : null
      })
      if (Object.keys(c).length < 2) errors.push(`Question ${label} : un choice demande au moins 2 options.`)
      question.criteria = c
    } else {
      const levels = q.levels.filter((l) => l.text.trim()).map((l) => looseJson(l.text))
      if (levels.length < 2) errors.push(`Question ${label} : un score demande au moins 2 niveaux.`)
      if (levels.length > 10) errors.push(`Question ${label} : 10 niveaux maximum.`)
      question.criteria = levels
    }

    if (id) questions[id] = question
  })

  return { questions, errors }
}

export function buildRequest(draft: Draft): BuildResult {
  const { questions, errors } = buildQuestions(draft)
  const st = parseState(draft)
  if (st.error) errors.unshift(st.error)
  const images = imageUrls(draft)
  if ((draft.images ?? []).some((i) => !i.dataUrl)) errors.push('Une image n’a pas été conservée dans l’historique : recharge-la ou retire-la.')
  if (errors.length) return { errors }
  const request: SystemOneRequest = { model: draft.model, state: st.value as Json, questions }
  if (images.length) request.images = images
  return { request, errors }
}

export const imageUrls = (draft: Draft): string[] => (draft.images ?? []).map((i) => i.dataUrl).filter(Boolean)

/** Convertit une requête API (collée, preset, historique) en brouillon éditable. */
export function requestToDraft(req: unknown): Draft {
  if (!req || typeof req !== 'object') throw new Error('La requête doit être un objet JSON.')
  const r = req as Record<string, unknown>
  if (!r.questions || typeof r.questions !== 'object' || Array.isArray(r.questions))
    throw new Error('Champ "questions" manquant ou invalide.')

  const questions = Object.entries(r.questions as Record<string, Record<string, unknown>>).map(([id, q]) => {
    const type = (q.type as QType) ?? 'noul'
    if (!['noul', 'choice', 'score'].includes(type)) throw new Error(`Question ${id} : type inconnu « ${String(type)} ».`)
    const d = newQuestion(type, id)
    // Les questions chargées sont repliées ; les nouvelles s'ouvrent pour être éditées.
    d.collapsed = true
    d.instructionsMode = typeof q.instructions === 'string' ? 'text' : 'json'
    d.instructions = asText(q.instructions)
    const crit = q.criteria
    if (type === 'noul' && crit && typeof crit === 'object') {
      const c = crit as Record<string, unknown>
      d.noulTrue = asText(c.true)
      d.noulFalse = asText(c.false)
    } else if (type === 'choice' && crit && typeof crit === 'object') {
      d.choices = Object.entries(crit as Record<string, unknown>).map(([key, desc]) => ({ uid: uid(), key, desc: asText(desc) }))
    } else if (type === 'score' && Array.isArray(crit)) {
      d.levels = crit.map((t) => ({ uid: uid(), text: asText(t) }))
    }
    return d
  })

  const images: DraftImage[] = Array.isArray(r.images)
    ? r.images
        .filter((u): u is string => typeof u === 'string' && u.startsWith('data:'))
        .map((dataUrl, i) => ({ uid: uid(), name: `image-${i + 1}`, dataUrl, width: 0, height: 0 }))
    : []

  const isText = typeof r.state === 'string'
  return {
    model: typeof r.model === 'string' ? r.model : 'clef',
    stateMode: isText ? 'text' : 'json',
    state: isText ? (r.state as string) : JSON.stringify(r.state ?? {}, null, 2),
    questions,
    images,
  }
}

/** Remplace le base64 des images par un résumé, pour l'affichage. */
export function redactImages<T extends { images?: string[] }>(req: T): T {
  if (!req.images?.length) return req
  return { ...req, images: req.images.map((u) => `${u.slice(0, u.indexOf(',') + 1)}…(${Math.round((u.length * 3) / 4 / 1024)} Ko)`) }
}

/** La clé n'est jamais copiée : l'en-tête d'authentification pointe vers une variable d'environnement. */
export function toCurl(url: string, req: SystemOneRequest, authHeader = ''): string {
  const body = JSON.stringify(req, null, 2).replace(/'/g, `'\\''`)
  const auth = authHeader.trim() ? `  -H "${authHeader.trim()}: Bearer $API_KEY" \\\n` : ''
  return `curl -s ${url} \\\n  -H 'Content-Type: application/json' \\\n${auth}  -d '${body}'`
}

/** Découpe l'entrée du mode lot : tableau JSON, ou un state texte par ligne. */
export function parseBatch(input: string, mode: 'lines' | 'json'): { states: Json[]; error?: string } {
  if (mode === 'lines') return { states: input.split('\n').map((l) => l.trim()).filter(Boolean) }
  try {
    const v = JSON.parse(input) as Json
    if (!Array.isArray(v)) return { states: [], error: 'Le lot JSON doit être un tableau de states.' }
    return { states: v }
  } catch (e) {
    return { states: [], error: `Lot JSON invalide : ${(e as Error).message}` }
  }
}

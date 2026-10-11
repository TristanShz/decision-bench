import { call, type CallOptions } from './api'
import type { Answer, Json, Question, RunResult, SystemOneRequest, SystemOneResponse } from './types'

/**
 * Adaptateur System One → OpenRouter (API compatible OpenAI, /v1/chat/completions).
 *
 * Chaque question devient un appel indépendant (lancés en parallèle) qui demande une réponse
 * en un seul token : yes/no pour un noul, une lettre pour un choice, un chiffre pour un score.
 * Les probabilités sont reconstruites à partir des top_logprobs du premier token, puis
 * renormalisées sur les options valides. Sans logprobs, la réponse texte donne une distribution
 * one-hot (signalée par une confiance de 1).
 */

export const chatEndpoint = (base: string) => base.replace(/\/+$/, '').replace(/\/v1$/, '') + '/v1/chat/completions'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const asText = (v: Json | undefined) => (v == null ? '' : typeof v === 'string' ? v : JSON.stringify(v, null, 2))

interface Prompt {
  /** Token attendu (en minuscules) → valeur de l'option : 'true'/'false', clé de choice, index de niveau. */
  tokens: Record<string, string>
  options: string[]
  messages: { role: 'system' | 'user'; content: string }[]
}

function buildPrompt(state: Json, q: Question): Prompt {
  const head = `STATE:\n${asText(state)}\n\nQUESTION:\n${asText(q.instructions)}`
  let body: string
  let format: string
  const tokens: Record<string, string> = {}
  let options: string[]

  if (q.type === 'noul') {
    const c = (q.criteria ?? {}) as Record<string, Json>
    const crit = [c.true != null && `"yes" means: ${asText(c.true)}`, c.false != null && `"no" means: ${asText(c.false)}`].filter(Boolean)
    body = crit.length ? `\n\nCRITERIA:\n${crit.join('\n')}` : ''
    format = 'yes or no'
    Object.assign(tokens, { yes: 'true', oui: 'true', no: 'false', non: 'false' })
    options = ['true', 'false']
  } else if (q.type === 'choice') {
    const keys = Object.keys((q.criteria ?? {}) as Record<string, Json>)
    if (keys.length > LETTERS.length) throw new Error(`Adaptateur OpenRouter : ${keys.length} options, ${LETTERS.length} maximum.`)
    const crit = q.criteria as Record<string, Json>
    body = '\n\nOPTIONS:\n' + keys.map((k, i) => `${LETTERS[i]}. ${k}${crit[k] != null ? ` — ${asText(crit[k])}` : ''}`).join('\n')
    format = `the letter of one option (${LETTERS[0]}–${LETTERS[keys.length - 1]})`
    keys.forEach((k, i) => (tokens[LETTERS[i].toLowerCase()] = k))
    options = keys
  } else {
    const levels = Array.isArray(q.criteria) ? q.criteria : []
    body = '\n\nLEVELS (lowest to highest):\n' + levels.map((l, i) => `${i}. ${asText(l)}`).join('\n')
    format = `the number of one level (0–${levels.length - 1})`
    levels.forEach((_, i) => (tokens[String(i)] = String(i)))
    options = levels.map((_, i) => String(i))
  }

  return {
    tokens,
    options,
    messages: [
      { role: 'system', content: `You are a precise decision model. Read the STATE, then answer the QUESTION with exactly one token: ${format}. Do not explain.` },
      { role: 'user', content: `${head}${body}\n\nAnswer with ${format} only.` },
    ],
  }
}

interface TopLogprob {
  token: string
  logprob: number
}

/** Distribution sur les options à partir des logprobs du premier token (ou du texte en repli). */
function distribution(p: Prompt, top: TopLogprob[] | undefined, content: string): Record<string, number> | null {
  const mass: Record<string, number> = Object.fromEntries(p.options.map((o) => [o, 0]))
  let total = 0
  for (const t of top ?? []) {
    const opt = p.tokens[t.token.trim().replace(/[.:)]$/, '').toLowerCase()]
    if (opt === undefined) continue
    const v = Math.exp(t.logprob)
    mass[opt] += v
    total += v
  }
  if (total === 0) {
    const first = content.trim().split(/[\s.:)]/)[0]?.toLowerCase() ?? ''
    const opt = p.tokens[first]
    if (opt === undefined) return null
    mass[opt] = total = 1
  }
  for (const k of Object.keys(mass)) mass[k] /= total
  return mass
}

/** Concentration de la distribution : 1 − entropie normalisée. */
function concentration(probs: number[]): number {
  if (probs.length < 2) return 1
  const h = -probs.reduce((s, p) => s + (p > 0 ? p * Math.log(p) : 0), 0)
  return 1 - h / Math.log(probs.length)
}

function toAnswer(q: Question, d: Record<string, number>): Answer {
  if (q.type === 'noul') return { type: 'noul', noul: d.true }
  const probs = Object.values(d)
  if (q.type === 'choice') {
    const choice = Object.entries(d).sort((a, b) => b[1] - a[1])[0][0]
    return { type: 'choice', choice, probabilities: d, confidence: concentration(probs) }
  }
  const score = Object.entries(d).reduce((s, [i, p]) => s + Number(i) * p, 0)
  return { type: 'score', score, probabilities: d, confidence: concentration(probs) }
}

/** Paramètres JSON ajoutés au corps de chaque appel (provider, reasoning…). */
export function parseExtraBody(s: string | undefined): Record<string, unknown> {
  if (!s?.trim()) return {}
  const v = JSON.parse(s)
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error('Les paramètres supplémentaires doivent être un objet JSON.')
  return v
}

interface ChatResponse {
  model?: string
  error?: { message?: string; metadata?: { raw?: string } }
  usage?: { prompt_tokens?: number; completion_tokens?: number }
  choices?: {
    finish_reason?: string
    message?: { content?: string | null; reasoning?: string | null }
    logprobs?: { content?: { token: string; top_logprobs?: TopLogprob[] }[] | null } | null
  }[]
}

/**
 * direct : 1 token, raisonnement désactivé (le plus rapide).
 * reasoning : pour les modèles qui raisonnent quand même ; budget large, effort minimal.
 */
type Mode = 'direct' | 'reasoning'
const MODES: Record<Mode, Record<string, unknown>> = {
  direct: { max_tokens: 1, reasoning: { enabled: false } },
  reasoning: { max_tokens: 2048, reasoning: { effort: 'low', exclude: false } },
}
const modeCache = new Map<string, Mode>()

const needsReasoning = (status: number, j: ChatResponse) => status === 400 && /reason/i.test(j?.error?.message ?? '')
const emptyAnswer = (j: ChatResponse) => !j?.error && !(j?.choices?.[0]?.message?.content ?? '').trim()

export async function evaluateOpenRouter(
  base: string,
  req: SystemOneRequest,
  signal?: AbortSignal,
  opts?: CallOptions & { extraBody?: string },
): Promise<RunResult> {
  const t0 = performance.now()
  let upstream = 0
  try {
    const extra = parseExtraBody(opts?.extraBody)
    const entries = Object.entries(req.questions)
    const results = await Promise.all(
      entries.map(async ([qid, q]) => {
        const p = buildPrompt(req.state, q)
        const content: unknown = req.images?.length
          ? [{ type: 'text', text: p.messages[1].content }, ...req.images.map((url) => ({ type: 'image_url', image_url: { url } }))]
          : p.messages[1].content
        const key = `${base}|${req.model}`
        const send = async (mode: Mode) => {
          const res = await call(
            chatEndpoint(base),
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'X-Title': 'DecisionBench' },
              body: JSON.stringify({
                model: req.model,
                messages: [p.messages[0], { role: 'user', content }],
                temperature: 0,
                logprobs: true,
                top_logprobs: 20,
                // Route uniquement vers un fournisseur qui gère logprobs.
                provider: { require_parameters: true },
                ...MODES[mode],
                ...extra,
              }),
              signal,
            },
            opts,
          )
          upstream = Math.max(upstream, Number(res.headers.get('x-upstream-ms')) || 0)
          const text = await res.text()
          let raw: unknown = text
          try {
            raw = JSON.parse(text)
          } catch {
            /* réponse non JSON */
          }
          return { res, text, raw, j: raw as ChatResponse }
        }

        let mode: Mode = modeCache.get(key) ?? 'direct'
        let r = await send(mode)
        // Modèle à raisonnement : soit il refuse reasoning désactivé, soit il épuise le budget
        // d'un token avant de répondre. On bascule alors sur un budget large, mémorisé par cible.
        if (mode === 'direct' && (needsReasoning(r.res.status, r.j) || emptyAnswer(r.j))) {
          mode = 'reasoning'
          r = await send(mode)
        }
        const { res, text, raw, j } = r
        if (!res.ok || j?.error) {
          const msg = j?.error?.message ?? text
          return { qid, status: res.status || 502, error: `${qid} : ${msg}${j?.error?.metadata?.raw ? ` (${j.error.metadata.raw})` : ''}`, raw }
        }
        const ch = j.choices?.[0]
        // Premier token non vide du contenu : c'est lui qui porte la réponse.
        const tok = ch?.logprobs?.content?.find((t) => t.token.trim())
        const d = distribution(p, tok?.top_logprobs, ch?.message?.content ?? '')
        if (!d) {
          const why = [
            `finish_reason=${ch?.finish_reason ?? '?'}`,
            ch?.message?.reasoning ? `raisonnement de ${ch.message.reasoning.length} caractères` : 'pas de raisonnement',
            ch?.logprobs?.content?.length ? `${ch.logprobs.content.length} logprobs` : 'pas de logprobs',
            `mode ${mode}`,
          ].join(', ')
          return { qid, status: 502, error: `${qid} : réponse inexploitable « ${ch?.message?.content ?? ''} » (${why}).\nRéponse brute : ${text.slice(0, 600)}`, raw }
        }
        modeCache.set(key, mode)
        return { qid, status: res.status, answer: toAnswer(q, d), usage: j.usage, model: j.model, raw }
      }),
    )
    const ms = performance.now() - t0
    const upstreamMs = opts?.proxy && upstream > 0 ? upstream : undefined
    const raw = Object.fromEntries(results.map((r) => [r.qid, r.raw]))
    const failed = results.find((r) => r.error)
    if (failed) return { ok: false, status: failed.status, ms, upstreamMs, error: results.filter((r) => r.error).map((r) => r.error).join('\n'), raw }
    const response: SystemOneResponse = {
      model: results[0]?.model ?? req.model,
      answers: Object.fromEntries(results.map((r) => [r.qid, r.answer!])),
      usage: {
        input_tokens: results.reduce((s, r) => s + (r.usage?.prompt_tokens ?? 0), 0),
        output_tokens: results.reduce((s, r) => s + (r.usage?.completion_tokens ?? 0), 0),
      },
    }
    return { ok: true, status: 200, ms, upstreamMs, response, raw }
  } catch (e) {
    const err = e as Error
    return {
      ok: false,
      status: 0,
      ms: performance.now() - t0,
      error: err.name === 'AbortError' ? 'Requête annulée.' : err.name === 'TimeoutError' ? 'Délai dépassé.' : `Erreur : ${err.message}`,
    }
  }
}

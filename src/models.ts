import { useEffect, useState } from 'react'
import { evaluate, serverInfo, type CallOptions, type ServerInfo } from './api'
import { uid } from './draft'
import { evaluateOpenRouter } from './openrouter'
import { DEFAULT_URL, load } from './storage'
import type { RunResult, SystemOneRequest } from './types'

/** systemone : API native POST /v1/systemone. openrouter : adaptateur chat/completions + logprobs. */
export type ModelKind = 'systemone' | 'openrouter'

/** Un modèle connecté, partagé entre le testeur et le benchmark. */
export interface ModelConnection {
  id: string
  /** Absent sur les cibles enregistrées avant l'adaptateur : systemone. */
  kind?: ModelKind
  label: string
  url: string
  model: string
  /** Nom de l'en-tête d'authentification (vide = aucun). */
  authHeader: string
  /** Valeur complète, ex. « Bearer sk-… ». Jamais écrite dans les rapports. */
  authValue: string
  proxy: boolean
  /** OpenRouter : objet JSON fusionné dans le corps de chaque appel. */
  extraBody?: string
}

/** Modèles proposés à la création d'une connexion. */
export const TEMPLATES: { name: string; hint: string; model: Omit<ModelConnection, 'id'> }[] = [
  {
    name: 'API System One',
    hint: 'Toute API compatible POST /v1/systemone : modèle auto-hébergé, Jev, OpenRouter… Clé optionnelle.',
    model: { kind: 'systemone', label: 'Nouveau modèle', url: 'https://', model: '', authHeader: 'Authorization', authValue: '', proxy: false },
  },
  {
    name: 'Modèle de chat (adaptateur)',
    hint: 'Pour comparer un modèle de chat classique : un appel chat/completions par question, probabilités issues des logprobs.',
    model: { kind: 'openrouter', label: 'Modèle de chat', url: 'https://openrouter.ai/api', model: 'openai/gpt-4o-mini', authHeader: 'Authorization', authValue: 'Bearer ', proxy: false },
  },
]

// Modèles proposés au premier lancement : un serveur local et Jev via OpenRouter.
const LOCAL: Omit<ModelConnection, 'id'> = { kind: 'systemone', label: 'Local', url: DEFAULT_URL, model: 'local', authHeader: '', authValue: '', proxy: false }
const JEV: Omit<ModelConnection, 'id'> = { kind: 'systemone', label: 'Jev', url: 'https://openrouter.ai/api', model: 'typesafe/jev-1.13', authHeader: 'Authorization', authValue: 'Bearer ', proxy: false }

const withId = (m: Omit<ModelConnection, 'id'> & { id?: string }): ModelConnection => ({ ...m, id: m.id ?? uid() })

/**
 * Modèles enregistrés. À la première ouverture, reprend les cibles du benchmark
 * et l'URL que l'ancien en-tête du testeur mémorisait.
 */
export function loadModels(): ModelConnection[] {
  const saved = load<ModelConnection[] | null>('s1.models', null)
  if (saved?.length) return saved.map(withId)
  const targets = load<Omit<ModelConnection, 'id'>[]>('s1.bench.targets', []).map(withId)
  const oldUrl = load<string | null>('s1.url', null)
  if (oldUrl && !targets.some((t) => t.url === oldUrl)) targets.unshift(withId({ ...LOCAL, url: oldUrl }))
  if (targets.length) return targets
  return [withId({ ...LOCAL, url: DEFAULT_URL }), withId(JEV)]
}

export const callOptions = (m: ModelConnection): CallOptions => ({
  proxy: m.proxy,
  headers: m.authHeader.trim() && m.authValue.trim() ? { [m.authHeader.trim()]: m.authValue.trim() } : undefined,
})

/** Envoie une requête System One au modèle, nativement ou via l'adaptateur OpenRouter. Le champ model est celui de la connexion. */
export function evaluateModel(m: ModelConnection, req: SystemOneRequest, signal?: AbortSignal): Promise<RunResult> {
  const r = { ...req, model: m.model }
  return m.kind === 'openrouter'
    ? evaluateOpenRouter(m.url, r, signal, { ...callOptions(m), extraBody: m.extraBody })
    : evaluate(m.url, r, signal, callOptions(m))
}

export const hasKey = (m: ModelConnection) => !!m.authValue.replace(/^Bearer\s*/i, '').trim()

export type ModelStatus =
  | { state: 'checking' }
  | { state: 'online'; info: ServerInfo }
  | { state: 'offline'; error: string }
  | { state: 'api' }

// Un seul appel /health par URL toutes les 15 s, même si plusieurs composants affichent le même modèle.
const probes = new Map<string, { at: number; promise: Promise<ServerInfo> }>()

function probe(url: string, proxy: boolean, force: boolean): Promise<ServerInfo> {
  const key = `${url}|${proxy}`
  const hit = probes.get(key)
  if (hit && !force && Date.now() - hit.at < 15_000) return hit.promise
  const promise = serverInfo(url, AbortSignal.timeout(4000), { proxy })
  probes.set(key, { at: Date.now(), promise })
  return promise
}

/** État d'un modèle : sondage de /health pour un serveur local, présence de la clé pour une API managée. */
export function useModelStatus(m: ModelConnection | undefined, refresh = 0): ModelStatus {
  const url = m?.url ?? ''
  const proxy = !!m?.proxy
  // Avec une clé, on ne sonde pas l'API : seule sa présence est vérifiée.
  const remote = m ? hasKey(m) : false
  const key = `${url}|${proxy}|${refresh}`
  const [probed, setProbed] = useState<{ key: string; status: ModelStatus } | null>(null)
  useEffect(() => {
    if (!url || remote) return
    let live = true
    const t = setTimeout(() => {
      probe(url, proxy, refresh > 0).then(
        // /health n'est pas dans le contrat System One : un serveur qui répond, même en 404, est joignable.
        (info) => live && setProbed({ key, status: info.ok || /^health HTTP/.test(info.error ?? '') ? { state: 'online', info } : { state: 'offline', error: info.error ?? 'injoignable' } }),
      )
    }, 300)
    return () => {
      live = false
      clearTimeout(t)
    }
  }, [key, url, proxy, remote, refresh])
  if (!m) return { state: 'offline', error: 'aucun modèle' }
  if (remote) return { state: 'api' }
  return probed?.key === key ? probed.status : { state: 'checking' }
}

export const STATUS_LABEL: Record<ModelStatus['state'], string> = {
  checking: 'Connexion…',
  online: 'En ligne',
  offline: 'Hors ligne',
  api: 'Clé ajoutée',
}

const AVATAR_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#ef4444', '#84cc16']

export function avatarColor(m: ModelConnection): string {
  let h = 0
  for (const c of m.label + m.model) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

export const hostOf = (url: string) => {
  try {
    return new URL(url).host
  } catch {
    return url
  }
}

/** Ligne descriptive : infos du serveur si elles sont connues, sinon model · hôte. */
export function modelSubtitle(m: ModelConnection, status: ModelStatus) {
  if (status.state === 'online' && status.info.model) {
    const i = status.info
    return [i.model, i.params ? `${(i.params / 1e9).toFixed(1)}B` : '', i.ctx ? `ctx ${i.ctx.toLocaleString('fr-FR')}` : ''].filter(Boolean).join(' · ')
  }
  return `${m.model} · ${hostOf(m.url)}${m.kind === 'openrouter' ? ' · adaptateur chat' : ''}`
}

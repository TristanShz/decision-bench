import type { RunResult, SystemOneRequest, SystemOneResponse } from './types'

/** URL de base → route System One. Une URL complète (…/systemone, …/decisions) est gardée telle quelle. */
export const endpoint = (base: string) => {
  const b = base.replace(/\/+$/, '')
  return /\/(systemone|decisions)$/.test(b) ? b : b + '/v1/systemone'
}

export interface CallOptions {
  /** En-têtes ajoutés à la requête (authentification d'une API managée). */
  headers?: Record<string, string>
  /** Passe par /api/proxy du serveur Vite, pour les API sans CORS. */
  proxy?: boolean
}

export function call(url: string, init: RequestInit, opts?: CallOptions): Promise<Response> {
  const headers = { ...(init.headers as Record<string, string>), ...opts?.headers }
  if (!opts?.proxy) return fetch(url, { ...init, headers })
  return fetch('/api/proxy', { ...init, headers: { ...headers, 'x-target-url': url } })
}

export async function evaluate(base: string, req: SystemOneRequest, signal?: AbortSignal, opts?: CallOptions): Promise<RunResult> {
  const t0 = performance.now()
  try {
    const res = await call(
      endpoint(base),
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req), signal },
      opts,
    )
    const text = await res.text()
    const ms = performance.now() - t0
    const up = Number(res.headers.get('x-upstream-ms'))
    const upstreamMs = up > 0 ? up : undefined
    let raw: unknown = text
    try {
      raw = JSON.parse(text)
    } catch {
      /* réponse non JSON */
    }
    if (!res.ok) {
      const msg = (raw as { error?: { message?: string } })?.error?.message ?? text
      const hint = /batch size/i.test(msg)
        ? '\n\n→ Limite du serveur llama.cpp : la requête dépasse la taille de batch. Relance-le avec un -b / -ub plus grand (ex. -b 4096 -ub 4096).'
        : ''
      return { ok: false, status: res.status, ms, upstreamMs, error: msg + hint, raw }
    }
    return { ok: true, status: res.status, ms, upstreamMs, response: raw as SystemOneResponse, raw }
  } catch (e) {
    const err = e as Error
    return {
      ok: false,
      status: 0,
      ms: performance.now() - t0,
      error: err.name === 'AbortError' ? 'Requête annulée.' : `Erreur réseau : ${err.message}`,
    }
  }
}

export interface ServerInfo {
  ok: boolean
  model?: string
  ctx?: number
  params?: number
  error?: string
}

export async function serverInfo(base: string, signal?: AbortSignal, opts?: CallOptions): Promise<ServerInfo> {
  const b = base.replace(/\/+$/, '')
  try {
    const h = await call(b + '/health', { signal }, opts)
    if (!h.ok) return { ok: false, error: `health HTTP ${h.status}` }
    const info: ServerInfo = { ok: true }
    try {
      const m = await call(b + '/v1/models', { signal }, opts)
      const j = await m.json()
      const d = j?.data?.[0]
      if (d) {
        info.model = String(d.id).split('/').pop()
        info.ctx = d.meta?.n_ctx
        info.params = d.meta?.n_params
      }
    } catch {
      /* /v1/models optionnel */
    }
    return info
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import type { Connect, Plugin } from 'vite'

/**
 * Middleware de l'app (dev et preview) :
 * - /api/reports : rapports de benchmark, un fichier JSON par rapport dans `dir`.
 * - /api/proxy   : relais vers une API externe sans CORS (en-tête x-target-url).
 */
export function benchServer(dir: string): Plugin {
  const middleware = createMiddleware(dir)
  return {
    name: 'systemone-bench-server',
    configureServer: (server) => void server.middlewares.use(middleware),
    configurePreviewServer: (server) => void server.middlewares.use(middleware),
  }
}

const ID = /^[\w-]{1,120}$/

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

/** En-têtes du navigateur qui ne doivent pas être relayés. */
const HOP = new Set(['host', 'connection', 'content-length', 'origin', 'referer', 'cookie', 'accept-encoding', 'x-target-url', 'user-agent'])

function createMiddleware(dir: string): Connect.NextHandleFunction {
  return async (req, res, next) => {
    const url = new URL(req.url ?? '/', 'http://local')
    try {
      if (url.pathname === '/api/proxy') return await proxy(req, res)
      if (!url.pathname.startsWith('/api/reports')) return next()

      await mkdir(dir, { recursive: true })
      const id = decodeURIComponent(url.pathname.slice('/api/reports'.length).replace(/^\//, ''))
      if (id && !ID.test(id)) return json(res, 400, { error: 'Identifiant de rapport invalide.' })
      const file = path.join(dir, `${id}.json`)

      if (!id && req.method === 'GET') {
        const names = (await readdir(dir)).filter((n) => n.endsWith('.json'))
        const items = await Promise.all(
          names.map(async (n) => {
            try {
              const r = JSON.parse(await readFile(path.join(dir, n), 'utf8'))
              // Liste légère : sans le détail des exécutions.
              return { id: r.id, name: r.name, createdAt: r.createdAt, suiteId: r.suiteId, suiteVersion: r.suiteVersion, target: r.target, settings: r.settings, summary: r.summary, durationMs: r.durationMs }
            } catch {
              return null
            }
          }),
        )
        return json(res, 200, items.filter(Boolean).sort((a, b) => (b!.createdAt > a!.createdAt ? 1 : -1)))
      }
      if (!id && req.method === 'POST') {
        const report = JSON.parse((await readBody(req)).toString('utf8'))
        if (!report?.id || !ID.test(report.id)) return json(res, 400, { error: 'Rapport sans identifiant valide.' })
        await writeFile(path.join(dir, `${report.id}.json`), JSON.stringify(report, null, 2))
        return json(res, 201, { id: report.id })
      }
      if (id && req.method === 'GET') return json(res, 200, JSON.parse(await readFile(file, 'utf8')))
      if (id && req.method === 'DELETE') {
        await unlink(file)
        return json(res, 200, { id })
      }
      return json(res, 405, { error: 'Méthode non prise en charge.' })
    } catch (e) {
      const err = e as NodeJS.ErrnoException
      json(res, err.code === 'ENOENT' ? 404 : 500, { error: err.message })
    }
  }
}

async function proxy(req: IncomingMessage, res: ServerResponse) {
  const target = req.headers['x-target-url']
  if (typeof target !== 'string' || !/^https?:\/\//.test(target)) return json(res, 400, { error: 'En-tête x-target-url manquant ou invalide.' })
  const headers: Record<string, string> = {}
  for (const [k, v] of Object.entries(req.headers)) {
    if (typeof v === 'string' && !HOP.has(k) && !k.startsWith('sec-')) headers[k] = v
  }
  const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await readBody(req)
  const t0 = performance.now()
  try {
    const up = await fetch(target, { method: req.method, headers, body })
    const buf = Buffer.from(await up.arrayBuffer())
    // Temps mesuré au plus près du serveur distant, sans le saut navigateur → proxy.
    res.setHeader('x-upstream-ms', (performance.now() - t0).toFixed(1))
    res.setHeader('Access-Control-Expose-Headers', 'x-upstream-ms')
    res.statusCode = up.status
    res.setHeader('Content-Type', up.headers.get('content-type') ?? 'application/octet-stream')
    res.end(buf)
  } catch (e) {
    json(res, 502, { error: { message: `Proxy : ${(e as Error).message}` } })
  }
}

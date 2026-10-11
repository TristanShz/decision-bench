import { summarize } from './stats'
import type { BenchReport, ReportListItem } from './types'

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(body?.error ?? `HTTP ${res.status}`)
  return body as T
}

export const listReports = () => req<ReportListItem[]>('/api/reports')
export const loadReport = (id: string) => req<BenchReport>(`/api/reports/${encodeURIComponent(id)}`)
export const deleteReport = (id: string) => req<{ id: string }>(`/api/reports/${encodeURIComponent(id)}`, { method: 'DELETE' })
export const saveReport = (r: BenchReport) =>
  req<{ id: string }>('/api/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(r) })

export function downloadReport(r: BenchReport) {
  const blob = new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${r.id}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}

/** Lit un rapport exporté ; le résumé est recalculé pour rester cohérent avec la version de l'app. */
export async function readReportFile(file: File): Promise<BenchReport> {
  const r = JSON.parse(await file.text()) as BenchReport
  if (!r?.id || !Array.isArray(r.cases) || !r.target) throw new Error('Ce fichier ne ressemble pas à un rapport de benchmark.')
  return { ...r, summary: summarize(r.cases, r.durationMs) }
}

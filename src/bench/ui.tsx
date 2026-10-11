import type { ReactNode } from 'react'
import { fmtMs } from './stats'

export function Kpi({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: 'ok' | 'ko' | 'mid' }) {
  return (
    <div className={`kpi ${tone ? `kpi-${tone}` : ''}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {sub != null && <div className="kpi-sub muted">{sub}</div>}
    </div>
  )
}

export function Tag({ children, kind }: { children: ReactNode; kind?: string }) {
  return <span className={`tag ${kind ? `tag-${kind}` : ''}`}>{children}</span>
}

export interface Series {
  name: string
  color: string
  points: { x: number; y: number; label?: string }[]
}

function niceMax(v: number) {
  if (v <= 0) return 1
  const p = 10 ** Math.floor(Math.log10(v))
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((m) => m >= v) ?? v
}

/** Nuage de points latence / tokens d'entrée : montre le coût marginal du token. */
export function Scatter({ series, xLabel, yLabel }: { series: Series[]; xLabel: string; yLabel: string }) {
  const all = series.flatMap((s) => s.points)
  if (!all.length) return <div className="empty small">Pas encore de données.</div>
  const W = 640
  const H = 260
  const m = { l: 56, r: 12, t: 10, b: 34 }
  const xMax = niceMax(Math.max(...all.map((p) => p.x)))
  const yMax = niceMax(Math.max(...all.map((p) => p.y)))
  const X = (v: number) => m.l + (v / xMax) * (W - m.l - m.r)
  const Y = (v: number) => H - m.b - (v / yMax) * (H - m.t - m.b)
  const ticks = [0, 0.25, 0.5, 0.75, 1]
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${yLabel} en fonction de ${xLabel}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={W - m.r} y1={Y(t * yMax)} y2={Y(t * yMax)} className="grid" />
            <text x={m.l - 6} y={Y(t * yMax) + 4} textAnchor="end" className="axis">{fmtMs(t * yMax)}</text>
            <text x={X(t * xMax)} y={H - m.b + 16} textAnchor="middle" className="axis">{Math.round(t * xMax).toLocaleString('fr-FR')}</text>
          </g>
        ))}
        <text x={(W + m.l) / 2} y={H - 4} textAnchor="middle" className="axis">{xLabel}</text>
        {series.map((s) =>
          s.points.map((p, i) => (
            <circle key={`${s.name}-${i}`} cx={X(p.x)} cy={Y(p.y)} r={3.5} fill={s.color} fillOpacity={0.7}>
              <title>{`${s.name} · ${p.label ?? ''}\n${p.x} tokens · ${fmtMs(p.y)}`}</title>
            </circle>
          )),
        )}
      </svg>
      {series.length > 1 && (
        <div className="legend small">
          {series.map((s) => (
            <span key={s.name}><i style={{ background: s.color }} /> {s.name}</span>
          ))}
        </div>
      )}
    </div>
  )
}

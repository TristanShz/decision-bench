import { Fragment, useMemo, useState } from 'react'
import { answerLabel, caseStats, confidence, fmtInterval, fmtMs, fmtNum, fmtPct, fmtUsd, formatExpected, toneFor } from './stats'
import { LEGACY_SUITE_ID } from './suites'
import type { BenchReport, GroupStats } from './types'
import { Kpi, Scatter, Tag } from './ui'
import { TYPE_LABEL } from '../draft'
import type { QType } from '../types'

export function ReportHeader({ report }: { report: BenchReport }) {
  const t = report.target
  const s = report.settings
  return (
    <div className="rhead">
      <div className="row">
        <h2>{report.name}</h2>
        {report.aborted && <Tag kind="ko">interrompu</Tag>}
      </div>
      <div className="muted small">
        <b>{t.label}</b> · <span className="mono">{t.url}</span> · modèle <span className="mono">{t.serverModel ?? t.model}</span>
        {t.serverCtx ? ` · ctx ${t.serverCtx.toLocaleString('fr-FR')}` : ''}
        {t.proxy ? ' · via proxy' : ''}
        {t.kind === 'openrouter' ? ' · adaptateur OpenRouter' : ''}
      </div>
      <div className="muted small">
        {new Date(report.createdAt).toLocaleString('fr-FR')} · {report.summary.cases} cas × {s.repetitions} essai(s), concurrence {s.concurrency}, préchauffage {s.warmup} · durée {fmtMs(report.durationMs)} · suite {report.suiteId ?? LEGACY_SUITE_ID} v{report.suiteVersion}
      </div>
      {report.notes && <div className="small rnotes">{report.notes}</div>}
    </div>
  )
}

export function SummaryKpis({ report }: { report: BenchReport }) {
  const s = report.summary
  const ci = useMemo(() => confidence(report.cases), [report.cases])
  return (
    <div className="kpis">
      <Kpi label="Qualité" value={fmtPct(s.quality)} tone={toneFor(s.quality, 0.8, 0.6)} sub={<span title="Probabilité donnée à la bonne réponse, intervalle de confiance à 95 %">IC 95 % {fmtInterval(ci.quality)}</span>} />
      <Kpi label="Exactitude" value={fmtPct(s.accuracy)} tone={toneFor(s.accuracy, 0.85, 0.7)} sub={<span title={`Décisions correctes sur ${ci.questions} questions, intervalle de confiance à 95 %`}>IC 95 % {fmtInterval(ci.accuracy)}</span>} />
      <Kpi label="Stabilité" value={fmtPct(s.consistency)} tone={toneFor(s.consistency, 0.95, 0.85)} sub="mêmes décisions entre essais" />
      <Kpi label="Questions" value={ci.questions} sub="unité de mesure de la précision" />
      <Kpi label="Latence p50" value={fmtMs(s.latency.p50)} sub={`p95 ${fmtMs(s.latency.p95)}`} />
      <Kpi label="Latence moyenne" value={fmtMs(s.latency.mean)} sub={`σ ${fmtMs(s.latency.stdev)}`} />
      <Kpi label="Débit d'entrée" value={s.tokensPerSec ? `${fmtNum(s.tokensPerSec)} tok/s` : '—'} sub={s.msPerToken ? `${fmtNum(s.msPerToken, 2)} ms / token` : undefined} />
      <Kpi label="Requêtes / s" value={fmtNum(s.requestsPerSec, 2)} sub={`${s.ok}/${s.requests} réussies${s.cost != null ? ` · coût ${fmtUsd(s.cost)}` : ''}`} />
      <Kpi label="Erreurs" value={fmtPct(s.errorRate)} tone={s.errorRate === 0 ? 'ok' : s.errorRate < 0.05 ? 'mid' : 'ko'} />
    </div>
  )
}

function GroupTable({ title, groups }: { title: string; groups: GroupStats[] }) {
  return (
    <div className="tablewrap">
      <table className="btable static">
        <thead>
          <tr>
            <th>{title}</th>
            <th>Cas</th>
            <th>p50</th>
            <th>p95</th>
            <th>Exactitude</th>
            <th>Qualité</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g.key}>
              <td>{g.key}</td>
              <td className="num">{g.cases}</td>
              <td className="num">{fmtMs(g.latency.p50)}</td>
              <td className="num">{fmtMs(g.latency.p95)}</td>
              <td className="num">{fmtPct(g.accuracy)}</td>
              <td className="num">{fmtPct(g.quality)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ReportView({ report, running }: { report: BenchReport; running?: boolean }) {
  const [open, setOpen] = useState<string | null>(null)
  const stats = useMemo(() => report.cases.map(caseStats), [report])
  const s = report.summary
  const l = s.latency

  return (
    <div className="report">
      <ReportHeader report={report} />
      <SummaryKpis report={report} />

      <h3>Distribution de la latence</h3>
      <div className="tablewrap">
        <table className="btable static">
          <thead>
            <tr>{['n', 'min', 'p50', 'p90', 'p95', 'p99', 'max', 'moyenne', 'écart-type'].map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            <tr>
              <td className="num">{l.n}</td>
              {[l.min, l.p50, l.p90, l.p95, l.p99, l.max, l.mean, l.stdev].map((v, i) => <td key={i} className="num">{fmtMs(v)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Latence selon la taille de la requête</h3>
      <Scatter
        xLabel="tokens en entrée"
        yLabel="latence"
        series={[
          {
            name: report.target.label,
            color: 'var(--accent)',
            points: report.cases.flatMap((c) => c.runs.filter((r) => r.ok && r.inputTokens).map((r) => ({ x: r.inputTokens!, y: r.ms, label: c.meta.name }))),
          },
        ]}
      />

      <h3>Par groupe</h3>
      <div className="groups">
        <GroupTable title="Longueur" groups={s.byLength} />
        <GroupTable title="Complexité" groups={s.byComplexity} />
      </div>
      <GroupTable title="Catégorie" groups={s.byCategory} />
      {s.byLang && s.byLang.length > 1 && <GroupTable title="Langue" groups={s.byLang} />}
      <div className="tablewrap" style={{ marginTop: 10 }}>
        <table className="btable static">
          <thead>
            <tr><th>Type de question</th><th>Questions</th><th>Exactitude</th><th>Qualité</th></tr>
          </thead>
          <tbody>
            {Object.entries(s.byType).map(([k, t]) => (
              <tr key={k}>
                <td><span className={`badge badge-${k}`} title={k}>{TYPE_LABEL[k as QType] ?? k}</span></td>
                <td className="num">{t.questions}</td>
                <td className="num">{fmtPct(t.accuracy)}</td>
                <td className="num">{fmtPct(t.quality)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Détail par cas</h3>
      <div className="tablewrap">
        <table className="btable">
          <thead>
            <tr>
              <th>Cas</th>
              <th>Profil</th>
              <th>Tokens</th>
              <th>p50</th>
              <th>min – max</th>
              <th>Exactitude</th>
              <th>Stabilité</th>
              <th>Essais</th>
            </tr>
          </thead>
          <tbody>
            {report.cases.map((c, i) => {
              const st = stats[i]
              const pending = running && c.runs.length < report.settings.repetitions
              return (
                <Fragment key={c.meta.id}>
                  <tr className={`${open === c.meta.id ? 'sel' : ''} ${pending && c.runs.length === 0 ? 'muted' : ''}`} onClick={() => setOpen(open === c.meta.id ? null : c.meta.id)}>
                    <td>
                      <span className="strong">{c.meta.name}</span>
                      <div className="muted small">{c.meta.category} · {c.meta.lang}</div>
                    </td>
                    <td><Tag kind={c.meta.complexity}>{c.meta.complexity}</Tag> <Tag>{c.meta.length}</Tag></td>
                    <td className="num">{fmtNum(st.inputTokens)}</td>
                    <td className="num">{st.ok ? fmtMs(st.latency.p50) : '—'}</td>
                    <td className="num muted">{st.ok ? `${fmtMs(st.latency.min)} – ${fmtMs(st.latency.max)}` : ''}</td>
                    <td className={`num ${st.accuracy == null ? '' : st.accuracy === 1 ? 'good' : st.accuracy >= 0.5 ? 'warn' : 'bad'}`}>{fmtPct(st.accuracy, 0)}</td>
                    <td className="num">{fmtPct(st.consistency, 0)}</td>
                    <td className="num">
                      {st.ok}/{c.runs.length}
                      {st.errors.length > 0 && <span className="err-inline"> ⚠</span>}
                    </td>
                  </tr>
                  {open === c.meta.id && (
                    <tr className="expand">
                      <td colSpan={8}>
                        {st.errors.map((e, j) => <div key={j} className="errbox small">{e}</div>)}
                        <table className="qtable">
                          <thead>
                            <tr><th>Question</th><th>Attendu</th><th>Réponse (1er essai)</th><th>Décisions par essai</th><th>Exactitude</th><th>Qualité</th></tr>
                          </thead>
                          <tbody>
                            {Object.entries(c.meta.questions).map(([qid, q]) => {
                              const qs = st.questions[qid]
                              return (
                                <tr key={qid}>
                                  <td><span className={`badge badge-${q.type}`} title={q.type}>{TYPE_LABEL[q.type]}</span> <span className="mono">{qid}</span></td>
                                  <td className="mono">{formatExpected(q.expected, q.type)}</td>
                                  <td className="mono">{answerLabel(qs.first)}</td>
                                  <td className="mono small">{qs.decisions.join(' · ') || '—'}</td>
                                  <td className={`num ${qs.accuracy == null ? '' : qs.accuracy === 1 ? 'good' : qs.accuracy > 0 ? 'warn' : 'bad'}`}>{fmtPct(qs.accuracy, 0)}</td>
                                  <td className="num">{fmtPct(qs.quality, 0)}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                        <div className="muted small">Latences : {c.runs.map((r) => (r.ok ? fmtMs(r.ms) : `✕ ${r.status || 'réseau'}`)).join(' · ')}</div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

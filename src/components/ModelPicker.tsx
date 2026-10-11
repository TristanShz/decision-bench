import { useEffect, useRef, useState } from 'react'
import { avatarColor, modelSubtitle, STATUS_LABEL, useModelStatus, type ModelConnection, type ModelStatus } from '../models'

export function Avatar({ m, size = 40 }: { m: ModelConnection; size?: number }) {
  return (
    <span className="avatar" style={{ background: avatarColor(m), width: size, height: size, fontSize: size * 0.45 }}>
      {(m.label.trim()[0] ?? '?').toUpperCase()}
    </span>
  )
}

export function StatusBadge({ status }: { status: ModelStatus }) {
  const title = status.state === 'offline' ? status.error : status.state === 'api' ? 'Joignabilité non vérifiée : utilise « Tester la connexion »' : undefined
  return <span className={`status status-${status.state}`} title={title}>{STATUS_LABEL[status.state]}</span>
}

function Option({ m, active, onPick }: { m: ModelConnection; active: boolean; onPick: () => void }) {
  const status = useModelStatus(m)
  return (
    <button className={`mp-option ${active ? 'on' : ''}`} onClick={onPick}>
      <Avatar m={m} size={30} />
      <span className="mp-text">
        <span className="strong">{m.label || 'Sans nom'}</span>
        <span className="muted small ellipsis">{modelSubtitle(m, status)}</span>
      </span>
      <StatusBadge status={status} />
    </button>
  )
}

interface Props {
  models: ModelConnection[]
  value: string
  onChange: (id: string) => void
  onManage: (id?: string) => void
}

/** Carte de sélection du modèle, avec la liste des modèles connectés. */
export function ModelPicker({ models, value, onChange, onManage }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = models.find((m) => m.id === value) ?? models[0]
  const status = useModelStatus(current)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  if (!current)
    return (
      <button className="mp-card mp-empty" onClick={() => onManage()}>
        + Connecter un modèle
      </button>
    )

  return (
    <div className="mp" ref={ref}>
      <button className="mp-card" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Avatar m={current} />
        <span className="mp-text">
          <span className="mp-name">{current.label || 'Sans nom'}</span>
          <span className="muted small ellipsis">{modelSubtitle(current, status)}</span>
        </span>
        <StatusBadge status={status} />
        <span className="caret" aria-hidden />
      </button>
      {open && (
        <div className="mp-menu">
          {models.map((m) => (
            <Option key={m.id} m={m} active={m.id === current.id} onPick={() => { onChange(m.id); setOpen(false) }} />
          ))}
          <div className="mp-foot">
            <button className="link" onClick={() => { setOpen(false); onManage(current.id) }}>Modifier « {current.label} »</button>
            <button className="link" onClick={() => { setOpen(false); onManage() }}>Gérer les modèles…</button>
          </div>
        </div>
      )}
    </div>
  )
}

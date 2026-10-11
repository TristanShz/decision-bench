import { useEffect, useRef, useState } from 'react'
import { dataUrlKb, estimateTokens, fileToImage } from '../images'
import type { DraftImage } from '../types'

interface Props {
  images: DraftImage[]
  onChange: (images: DraftImage[]) => void
  maxSide: number
  onMaxSide: (v: number) => void
  hint: string
  /** Sans image, une simple ligne au lieu de la zone de dépôt complète. */
  compact?: boolean
}

const SIZES = [
  { v: 512, label: '512 px' },
  { v: 768, label: '768 px' },
  { v: 1024, label: '1024 px' },
  { v: 1536, label: '1536 px' },
  { v: 0, label: 'Originale' },
]

export function ImagePicker({ images, onChange, maxSide, onMaxSide, hint, compact }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const [error, setError] = useState('')
  // Garde une référence à jour pour le collage, qui est écouté globalement.
  const latest = useRef({ images, maxSide, onChange })
  latest.current = { images, maxSide, onChange }

  const add = async (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith('image/'))
    if (!imgs.length) return
    setError('')
    try {
      const loaded = await Promise.all(imgs.map((f) => fileToImage(f, latest.current.maxSide)))
      latest.current.onChange([...latest.current.images, ...loaded])
    } catch (e) {
      setError((e as Error).message)
    }
  }

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? []).filter((f) => f.type.startsWith('image/'))
      if (!files.length) return
      e.preventDefault()
      add(files)
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalTokens = images.reduce((s, i) => s + estimateTokens(i.width, i.height), 0)
  const small = compact && images.length === 0

  return (
    <div className="images">
      {!small && <div className="label-row">
        <span className="small strong">
          Images {images.length > 0 && <span className="muted">({images.length} · ≈ {totalTokens.toLocaleString('fr-FR')} tokens)</span>}
        </span>
        <label className="small muted row">
          Réduire à
          <select value={maxSide} onChange={(e) => onMaxSide(Number(e.target.value))}>
            {SIZES.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
          </select>
        </label>
      </div>}

      <div
        className={`dropzone ${small ? 'compact' : ''} ${over ? 'over' : ''}`}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          add(Array.from(e.dataTransfer.files))
        }}
      >
        {small ? (
          <span title={hint}>+ Image <span className="muted">— glisser, cliquer ou coller (⌘V)</span></span>
        ) : (
          <>
            Glisse des images ici, clique pour choisir, ou colle (⌘V)
            <div className="muted small">{hint}</div>
          </>
        )}
        <input
          ref={input}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            add(Array.from(e.target.files ?? []))
            e.target.value = ''
          }}
        />
      </div>
      {error && <div className="err-inline">{error}</div>}

      {images.length > 0 && (
        <div className="thumbs">
          {images.map((img, i) => (
            <div key={img.uid} className={`thumb ${img.dataUrl ? '' : 'missing'}`} title={img.name}>
              {img.dataUrl ? <img src={img.dataUrl} alt={img.name} /> : <div className="nodata">non conservée</div>}
              <div className="thumb-meta small">
                <span className="ellipsis">{img.name}</span>
                {img.dataUrl && (
                  <span className="muted">
                    {img.width ? `${img.width}×${img.height} · ` : ''}{dataUrlKb(img.dataUrl)} Ko
                    {img.width ? ` · ≈${estimateTokens(img.width, img.height)} tok` : ''}
                  </span>
                )}
              </div>
              <button className="icon danger thumb-x" title="Retirer" onClick={() => onChange(images.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
          <button className="link danger" onClick={() => onChange([])}>Tout retirer</button>
        </div>
      )}
    </div>
  )
}

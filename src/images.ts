import { uid } from './draft'
import type { DraftImage } from './types'

/** Formats décodés par llama.cpp (stb_image) ; les autres sont convertis en JPEG. */
const NATIVE = ['image/png', 'image/jpeg']

/** Mesuré sur Clef : environ 1 token par 1 000 pixels. */
export const estimateTokens = (w: number, h: number) => Math.round((w * h) / 1000)

export const dataUrlKb = (u: string) => Math.round(((u.length - u.indexOf(',') - 1) * 3) / 4 / 1024)

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = () => reject(r.error)
    r.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Image illisible'))
    img.src = src
  })
}

/** Charge un fichier image, le réduit à maxSide (0 = taille d'origine) et le convertit si besoin. */
export async function fileToImage(file: File, maxSide: number): Promise<DraftImage> {
  const original = await readAsDataUrl(file)
  const img = await loadImage(original)
  const w0 = img.naturalWidth
  const h0 = img.naturalHeight
  const scale = maxSide > 0 ? Math.min(1, maxSide / Math.max(w0, h0)) : 1
  const name = file.name || 'image-collée'

  if (scale === 1 && NATIVE.includes(file.type)) {
    return { uid: uid(), name, dataUrl: original, width: w0, height: h0 }
  }

  const w = Math.round(w0 * scale)
  const h = Math.round(h0 * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#fff' // la transparence deviendrait noire en JPEG
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, w, h)
  const keepPng = file.type === 'image/png'
  const dataUrl = canvas.toDataURL(keepPng ? 'image/png' : 'image/jpeg', 0.9)
  return { uid: uid(), name, dataUrl, width: w, height: h }
}

/** Retrouve les dimensions d'une image importée depuis un JSON. */
export async function withDimensions(i: DraftImage): Promise<DraftImage> {
  if (i.width || !i.dataUrl) return i
  try {
    const img = await loadImage(i.dataUrl)
    return { ...i, width: img.naturalWidth, height: img.naturalHeight }
  } catch {
    return i
  }
}

'use client'

import { useRef, useState } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface CropModalProps {
  src: string
  sizeLabel: string
  widthMm: number
  heightMm: number
  onSave: (result: { croppedSrc: string; cropWidth: number; cropHeight: number }) => void
  onCancel: () => void
}

function initialCrop(imgW: number, imgH: number, aspect: number): Crop {
  return centerCrop(makeAspectCrop({ unit: '%', width: 90 }, aspect, imgW, imgH), imgW, imgH)
}

export default function CropModal({ src, sizeLabel, widthMm, heightMm, onSave, onCancel }: CropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [landscape, setLandscape] = useState(false)
  const [crop, setCrop] = useState<Crop>()
  const [completed, setCompleted] = useState<PixelCrop>()

  const longMm = Math.max(widthMm, heightMm)
  const shortMm = Math.min(widthMm, heightMm)
  const aspect = landscape ? longMm / shortMm : shortMm / longMm

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget
    const isLandscape = naturalWidth > naturalHeight
    setLandscape(isLandscape)
    const a = isLandscape ? longMm / shortMm : shortMm / longMm
    setCrop(initialCrop(width, height, a))
  }

  function toggleOrientation() {
    const next = !landscape
    setLandscape(next)
    const img = imgRef.current
    if (img) {
      const a = next ? longMm / shortMm : shortMm / longMm
      setCrop(initialCrop(img.width, img.height, a))
      setCompleted(undefined)
    }
  }

  function handleSave() {
    const img = imgRef.current
    if (!img || !completed || !completed.width || !completed.height) return
    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height
    const w = Math.round(completed.width * scaleX)
    const h = Math.round(completed.height * scaleY)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(img, completed.x * scaleX, completed.y * scaleY, w, h, 0, 0, w, h)
    onSave({ croppedSrc: canvas.toDataURL('image/jpeg', 0.92), cropWidth: w, cropHeight: h })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-lg bg-white">
        <div className="flex justify-between items-center p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            ✂️ Decupare — {sizeLabel} ({landscape ? 'peisaj' : 'portret'})
          </p>
          <button onClick={toggleOrientation}
            className="px-3 py-1 text-xs rounded"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            ⟲ Rotește cadrul
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 flex justify-center" style={{ background: 'var(--surface)' }}>
          <ReactCrop crop={crop} onChange={(_, pc) => setCrop(pc)} onComplete={c => setCompleted(c)}
            aspect={aspect} keepSelection>
            <img ref={imgRef} src={src} alt="Decupare" onLoad={handleImageLoad}
              style={{ maxHeight: '60vh', maxWidth: '100%' }} />
          </ReactCrop>
        </div>
        <div className="flex justify-end gap-3 p-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={onCancel} className="px-5 py-2 text-sm"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            Anulează
          </button>
          <button onClick={handleSave} disabled={!completed}
            className="px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ background: 'var(--text-primary)', color: 'var(--background)' }}>
            Salvează
          </button>
        </div>
      </div>
    </div>
  )
}

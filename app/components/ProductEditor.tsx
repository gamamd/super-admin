'use client'

import { useRef, useState } from 'react'

interface Size {
  id: string
  label: string
  width_mm: number
  height_mm: number
  price_modifier: number
}

interface Material {
  id: string
  label: string
  description: string
  price_modifier: number
}

interface PhotoItem {
  id: string
  file: File
  src: string
  naturalWidth: number
  naturalHeight: number
  size: Size
  material: Material
  quantity: number
  status: 'pending' | 'ready'
}

interface ProductEditorProps {
  productId: string
  productName: string
  basePrice: number
  availableSizes: Size[]
  availableMaterials: Material[]
  onAddToCart: (data: {
    photos: PhotoItem[]
    totalPrice: number
  }) => void
}

function getQualityWarning(photo: PhotoItem): string | null {
  const minPx = (photo.size.width_mm / 25.4) * 150
  if (photo.naturalWidth < minPx || photo.naturalHeight < minPx) {
    return 'Rezoluție mică — calitatea la print poate fi redusă'
  }
  return null
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ProductEditor({
  productId,
  productName,
  basePrice,
  availableSizes,
  availableMaterials,
  onAddToCart,
}: ProductEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [globalSize, setGlobalSize] = useState<Size>(availableSizes[0])
  const [globalMaterial, setGlobalMaterial] = useState<Material>(availableMaterials[0])
  const [applyToAll, setApplyToAll] = useState(true)

  const totalPhotos = photos.reduce((sum, p) => sum + p.quantity, 0)
  const totalPrice = photos.reduce((sum, p) => {
    return sum + (basePrice + p.size.price_modifier + p.material.price_modifier) * p.quantity
  }, 0)

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const src = ev.target?.result as string
        const img = new Image()
        img.onload = () => {
          const newPhoto: PhotoItem = {
            id: `${Date.now()}-${Math.random()}`,
            file,
            src,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            size: globalSize,
            material: globalMaterial,
            quantity: 1,
            status: 'pending',
          }
          setPhotos(prev => [...prev, newPhoto])
        }
        img.src = src
      }
      reader.readAsDataURL(file)
    })

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function updatePhoto(id: string, updates: Partial<PhotoItem>) {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  function removePhoto(id: string) {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  function applyGlobalSettings() {
    setPhotos(prev => prev.map(p => ({ ...p, size: globalSize, material: globalMaterial })))
  }

  function handleAddToCart() {
    if (!photos.length) return
    onAddToCart({ photos, totalPrice })
  }

  return (
    <div className="max-w-5xl mx-auto">

      {/* Upload zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all hover:opacity-80 mb-8"
        style={{ borderColor: 'var(--accent)', background: 'var(--surface)' }}
      >
        <div className="text-5xl mb-3">📷</div>
        <p className="text-lg font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          {photos.length === 0 ? 'Încarcă fotografiile tale' : 'Adaugă mai multe fotografii'}
        </p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          JPG, PNG — poți selecta mai multe odată
        </p>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFilesChange} />
      </div>

      {photos.length > 0 && (
        <>
          {/* Global settings */}
          <div className="p-4 rounded-lg mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>Mărime globală</p>
                <select
                  value={globalSize.id}
                  onChange={e => setGlobalSize(availableSizes.find(s => s.id === e.target.value) || availableSizes[0])}
                  className="px-3 py-2 text-sm rounded"
                  style={{ border: '1px solid var(--border)', background: 'white', color: 'var(--text-primary)' }}
                >
                  {availableSizes.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>Hârtie globală</p>
                <select
                  value={globalMaterial.id}
                  onChange={e => setGlobalMaterial(availableMaterials.find(m => m.id === e.target.value) || availableMaterials[0])}
                  className="px-3 py-2 text-sm rounded"
                  style={{ border: '1px solid var(--border)', background: 'white', color: 'var(--text-primary)' }}
                >
                  {availableMaterials.map(m => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={applyGlobalSettings}
                className="px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ background: 'var(--accent)', color: '#1A1A1A' }}
              >
                Aplică la toate
              </button>
            </div>
          </div>

          {/* Photo list */}
          <div className="flex flex-col gap-3 mb-8">
            {photos.map((photo, index) => {
              const warning = getQualityWarning(photo)
              return (
                <div key={photo.id} className="p-4 rounded-lg bg-white"
                  style={{ border: `1px solid ${warning ? '#f59e0b' : 'var(--border)'}` }}>
                  <div className="flex gap-4 items-start">

                    {/* Preview */}
                    <div className="flex-shrink-0">
                      <img src={photo.src} alt={`Foto ${index + 1}`}
                        className="rounded object-cover"
                        style={{ width: '80px', height: '80px', border: '1px solid var(--border)' }} />
                    </div>

                    {/* Info + controls */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                            Foto {index + 1}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {photo.naturalWidth}×{photo.naturalHeight}px · {formatFileSize(photo.file.size)}
                          </p>
                        </div>
                        <button onClick={() => removePhoto(photo.id)}
                          className="text-xs px-2 py-1 rounded transition-opacity hover:opacity-70"
                          style={{ color: '#ef4444', border: '1px solid #fca5a5' }}>
                          Șterge
                        </button>
                      </div>

                      {warning && (
                        <div className="text-xs px-3 py-1 rounded mb-2"
                          style={{ background: '#fef3c7', color: '#92400e' }}>
                          ⚠️ {warning}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 items-center">
                        {/* Size per photo */}
                        <select
                          value={photo.size.id}
                          onChange={e => updatePhoto(photo.id, { size: availableSizes.find(s => s.id === e.target.value) || availableSizes[0] })}
                          className="px-2 py-1 text-xs rounded"
                          style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                        >
                          {availableSizes.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>

                        {/* Material per photo */}
                        <select
                          value={photo.material.id}
                          onChange={e => updatePhoto(photo.id, { material: availableMaterials.find(m => m.id === e.target.value) || availableMaterials[0] })}
                          className="px-2 py-1 text-xs rounded"
                          style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                        >
                          {availableMaterials.map(m => (
                            <option key={m.id} value={m.id}>{m.label}</option>
                          ))}
                        </select>

                        {/* Quantity */}
                        <div className="flex items-center gap-1">
                          <button onClick={() => updatePhoto(photo.id, { quantity: Math.max(1, photo.quantity - 1) })}
                            className="w-6 h-6 rounded flex items-center justify-center text-sm font-medium"
                            style={{ border: '1px solid var(--border)' }}>−</button>
                          <span className="text-sm font-medium w-6 text-center" style={{ color: 'var(--text-primary)' }}>{photo.quantity}</span>
                          <button onClick={() => updatePhoto(photo.id, { quantity: photo.quantity + 1 })}
                            className="w-6 h-6 rounded flex items-center justify-center text-sm font-medium"
                            style={{ border: '1px solid var(--border)' }}>+</button>
                        </div>

                        {/* Quick quantity buttons */}
                        {[2, 5, 10].map(q => (
                          <button key={q} onClick={() => updatePhoto(photo.id, { quantity: q })}
                            className="px-2 py-1 text-xs rounded transition-all"
                            style={{
                              border: '1px solid var(--border)',
                              background: photo.quantity === q ? 'var(--accent)' : 'var(--surface)',
                              color: photo.quantity === q ? '#1A1A1A' : 'var(--text-secondary)'
                            }}>
                            ×{q}
                          </button>
                        ))}

                        {/* Price per photo */}
                        <span className="ml-auto text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                          {(basePrice + photo.size.price_modifier + photo.material.price_modifier) * photo.quantity} MDL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary + order */}
          <div className="p-6 rounded-lg sticky bottom-4"
            style={{ background: 'white', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {photos.length} {photos.length === 1 ? 'fotografie' : 'fotografii'} · {totalPhotos} {totalPhotos === 1 ? 'bucată' : 'bucăți'}
                </p>
                <p className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {totalPrice} MDL
                </p>
              </div>
              <button onClick={handleAddToCart}
                className="px-8 py-3 font-medium transition-opacity hover:opacity-80"
                style={{ background: 'var(--text-primary)', color: 'var(--background)' }}>
                Adaugă în coș →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
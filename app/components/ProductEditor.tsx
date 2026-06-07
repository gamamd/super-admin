'use client'

import { useRef, useState, useEffect } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

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

interface ProductEditorProps {
  productId: string
  productName: string
  basePrice: number
  availableSizes: Size[]
  availableMaterials: Material[]
  onAddToCart: (data: {
    imageFile: File
    imageDataUrl: string
    size: Size
    material: Material
    quantity: number
    totalPrice: number
  }) => void
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
  const imgRef = useRef<HTMLImageElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [croppedDataUrl, setCroppedDataUrl] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [selectedSize, setSelectedSize] = useState<Size>(availableSizes[0])
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(availableMaterials[0])
  const [quantity, setQuantity] = useState(1)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [step, setStep] = useState<'upload' | 'edit' | 'options'>('upload')

  const totalPrice = (basePrice + selectedSize.price_modifier + selectedMaterial.price_modifier) * quantity

  useEffect(() => {
    const ratio = selectedSize.width_mm / selectedSize.height_mm
    setCrop({ unit: '%', x: 5, y: 5, width: 90, height: 90 / ratio })
  }, [selectedSize])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImageSrc(ev.target?.result as string)
      setCroppedDataUrl(null)
      setStep('edit')
    }
    reader.readAsDataURL(file)
  }

  function getCroppedImage(): Promise<string> {
    return new Promise((resolve) => {
      if (!imgRef.current || !completedCrop) { resolve(imageSrc || ''); return }
      const canvas = document.createElement('canvas')
      const img = imgRef.current
      const scaleX = img.naturalWidth / img.width
      const scaleY = img.naturalHeight / img.height
      canvas.width = completedCrop.width * scaleX
      canvas.height = completedCrop.height * scaleY
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(imageSrc || ''); return }
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.drawImage(img, completedCrop.x * scaleX, completedCrop.y * scaleY, completedCrop.width * scaleX, completedCrop.height * scaleY, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
      ctx.restore()
      resolve(canvas.toDataURL('image/jpeg', 0.95))
    })
  }

  async function handleContinue() {
    const cropped = await getCroppedImage()
    setCroppedDataUrl(cropped)
    setStep('options')
  }

  async function handleAddToCart() {
    const cropped = croppedDataUrl || await getCroppedImage()
    if (!selectedFile || !imageSrc) return
    onAddToCart({ imageFile: selectedFile, imageDataUrl: cropped, size: selectedSize, material: selectedMaterial, quantity, totalPrice })
  }

  const steps = ['upload', 'edit', 'options']
  const stepLabels = ['Încarcă', 'Editează', 'Opțiuni']

  return (
    <div className="max-w-5xl mx-auto">

      <div className="flex items-center gap-2 mb-10">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ background: i <= steps.indexOf(step) ? 'var(--accent)' : 'var(--surface)', color: i <= steps.indexOf(step) ? '#1A1A1A' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                {i + 1}
              </div>
              <span className="text-sm font-medium" style={{ color: i <= steps.indexOf(step) ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {label}
              </span>
            </div>
            {i < 2 && <div className="w-8 h-px" style={{ background: 'var(--border)' }} />}
          </div>
        ))}
      </div>

      {step === 'upload' && (
        <div onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-20 text-center cursor-pointer transition-all hover:opacity-80"
          style={{ borderColor: 'var(--accent)', background: 'var(--surface)' }}>
          <div className="text-6xl mb-4">📷</div>
          <p className="text-xl font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Încarcă fotografia ta</p>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>JPG, PNG — maxim 20MB</p>
          <div className="inline-block px-6 py-3 font-medium" style={{ background: 'var(--text-primary)', color: 'var(--background)' }}>Alege fotografia</div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      )}

      {step === 'edit' && imageSrc && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>
              Decupează — trage colțurile pentru a selecta zona
            </p>
            <div style={{ background: 'var(--surface)', padding: '16px', border: '1px solid var(--border)', maxHeight: '500px', overflow: 'hidden' }}>
              <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)} aspect={selectedSize.width_mm / selectedSize.height_mm}>
                <img ref={imgRef} src={imageSrc} alt="De editat"
                  style={{ maxWidth: '100%', maxHeight: '460px', objectFit: 'contain', filter: `brightness(${brightness}%) contrast(${contrast}%)`, transform: `rotate(${rotation}deg)`, transition: 'transform 0.2s' }} />
              </ReactCrop>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Ajustări</p>
            <div>
              <label className="text-sm mb-2 block" style={{ color: 'var(--text-primary)' }}>Luminozitate: {brightness}%</label>
              <input type="range" min={50} max={150} value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full" style={{ accentColor: 'var(--accent)' }} />
            </div>
            <div>
              <label className="text-sm mb-2 block" style={{ color: 'var(--text-primary)' }}>Contrast: {contrast}%</label>
              <input type="range" min={50} max={150} value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full" style={{ accentColor: 'var(--accent)' }} />
            </div>
            <div>
              <label className="text-sm mb-3 block" style={{ color: 'var(--text-primary)' }}>Rotire</label>
              <div className="flex gap-2">
                {[0, 90, 180, 270].map(r => (
                  <button key={r} onClick={() => setRotation(r)} className="px-3 py-2 text-sm rounded transition-all"
                    style={{ background: rotation === r ? 'var(--accent)' : 'var(--surface)', color: rotation === r ? '#1A1A1A' : 'var(--text-primary)', border: '1px solid var(--border)' }}>
                    {r}°
                  </button>
                ))}
              </div>
            </div>
            <div className="h-px" style={{ background: 'var(--border)' }} />
            <button onClick={() => { setStep('upload'); setImageSrc(null) }} className="text-sm text-left underline" style={{ color: 'var(--text-secondary)' }}>
              ← Schimbă fotografia
            </button>
            <button onClick={handleContinue} className="px-6 py-3 font-medium transition-opacity hover:opacity-80" style={{ background: 'var(--text-primary)', color: 'var(--background)' }}>
              Continuă →
            </button>
          </div>
        </div>
      )}

      {step === 'options' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Mărime</p>
              <div className="grid grid-cols-2 gap-2">
                {availableSizes.map(size => (
                  <button key={size.id} onClick={() => setSelectedSize(size)} className="p-3 text-left rounded transition-all"
                    style={{ border: `1px solid ${selectedSize.id === size.id ? 'var(--accent)' : 'var(--border)'}`, background: selectedSize.id === size.id ? '#fdf8f0' : 'white' }}>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{size.label}</p>
                    {size.price_modifier > 0 && <p className="text-xs" style={{ color: 'var(--accent)' }}>+{size.price_modifier} MDL</p>}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Tip hârtie</p>
              <div className="flex flex-col gap-2">
                {availableMaterials.map(mat => (
                  <button key={mat.id} onClick={() => setSelectedMaterial(mat)} className="p-3 text-left rounded transition-all"
                    style={{ border: `1px solid ${selectedMaterial.id === mat.id ? 'var(--accent)' : 'var(--border)'}`, background: selectedMaterial.id === mat.id ? '#fdf8f0' : 'white' }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{mat.label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{mat.description}</p>
                      </div>
                      {mat.price_modifier > 0 && <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>+{mat.price_modifier} MDL</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Cantitate</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded flex items-center justify-center text-lg font-medium" style={{ border: '1px solid var(--border)' }}>−</button>
                <span className="text-lg font-medium w-8 text-center" style={{ color: 'var(--text-primary)' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 rounded flex items-center justify-center text-lg font-medium" style={{ border: '1px solid var(--border)' }}>+</button>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Sumar comandă</p>
            <div className="p-6 rounded" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              {croppedDataUrl && (
                <img src={croppedDataUrl} alt="preview" className="w-full h-44 object-cover mb-4 rounded" style={{ border: '1px solid var(--border)' }} />
              )}
              <div className="flex flex-col gap-2 text-sm mb-4">
                <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Produs</span><span style={{ color: 'var(--text-primary)' }}>{productName}</span></div>
                <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Mărime</span><span style={{ color: 'var(--text-primary)' }}>{selectedSize.label}</span></div>
                <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Hârtie</span><span style={{ color: 'var(--text-primary)' }}>{selectedMaterial.label}</span></div>
                <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Cantitate</span><span style={{ color: 'var(--text-primary)' }}>{quantity} buc</span></div>
              </div>
              <div className="h-px mb-4" style={{ background: 'var(--border)' }} />
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Total</span>
                <span className="text-xl font-semibold" style={{ color: 'var(--accent)' }}>{totalPrice} MDL</span>
              </div>
              <button onClick={() => setStep('edit')} className="w-full py-2 text-sm mb-3 transition-opacity hover:opacity-70 rounded" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                ← Înapoi la editare
              </button>
              <button onClick={handleAddToCart} className="w-full py-3 font-medium transition-opacity hover:opacity-80" style={{ background: 'var(--text-primary)', color: 'var(--background)' }}>
                Adaugă în coș
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import ProductEditor, { type PhotoItem } from './ProductEditor'
import { useCartStore } from '@/lib/store/cart'
import { useRouter, useParams } from 'next/navigation'

interface Props {
  productId: string
  productName: string
  basePrice: number
  availableSizes: any[]
  availableMaterials: any[]
}

// Miniatură mică pentru coș — localStorage nu poate ține pozele originale
function makeThumbnail(src: string, maxSide = 200): Promise<string> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.naturalWidth * scale)
      canvas.height = Math.round(img.naturalHeight * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) return resolve('')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.onerror = () => resolve('')
    img.src = src
  })
}

export default function ProductEditorWrapper({
  productId,
  productName,
  basePrice,
  availableSizes,
  availableMaterials,
}: Props) {
  const addItem = useCartStore(s => s.addItem)
  const router = useRouter()
  const params = useParams<{ locale: string }>()
  const locale = params?.locale || 'ro'

  async function handleAddToCart(data: { photos: PhotoItem[]; totalPrice: number }) {
    for (const photo of data.photos) {
      const thumb = await makeThumbnail(photo.croppedSrc || photo.src)
      const unitPrice = basePrice + photo.size.price_modifier + photo.material.price_modifier
      addItem({
        id: `${productId}-${photo.id}`,
        name: `${productName} — ${photo.size.label} — ${photo.material.label}`,
        price: unitPrice,
        quantity: photo.quantity,
        image_url: thumb || null,
        slug: productId,
      })
    }
    router.push(`/${locale}/cos`)
  }

  return (
    <ProductEditor
      productId={productId}
      productName={productName}
      basePrice={basePrice}
      availableSizes={availableSizes}
      availableMaterials={availableMaterials}
      onAddToCart={handleAddToCart}
    />
  )
}

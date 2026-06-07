'use client'

import ProductEditor from './ProductEditor'
import { useCartStore } from '@/lib/store/cart'
import { useRouter } from 'next/navigation'

interface Props {
  productId: string
  productName: string
  basePrice: number
  availableSizes: any[]
  availableMaterials: any[]
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

  function handleAddToCart(data: {
    imageFile: File
    imageDataUrl: string
    size: any
    material: any
    quantity: number
    totalPrice: number
  }) {
    addItem({
      id: `${productId}-${data.size.id}-${data.material.id}-${Date.now()}`,
      name: `${productName} — ${data.size.label} — ${data.material.label}`,
      price: data.totalPrice / data.quantity,
      quantity: data.quantity,
      image_url: data.imageDataUrl,
      slug: productId,
    })
    router.push('/ro/cos')
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
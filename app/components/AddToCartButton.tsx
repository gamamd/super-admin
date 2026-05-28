'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'

interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
  slug: string
  is_customizable: boolean
}

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url,
      slug: product.slug,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Cantitate:</span>
        <div className="flex items-center" style={{ border: "1px solid var(--border)" }}>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-primary)" }}>−</button>
          <span className="px-4 py-2 text-center w-12"
            style={{ color: "var(--text-primary)", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-primary)" }}>+</button>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={handleAdd}
          className="px-8 py-4 text-base font-medium transition-all hover:opacity-80"
          style={{
            background: added ? "var(--accent)" : "var(--text-primary)",
            color: "var(--background)"
          }}>
          {added ? '✓ Adăugat în coș' : 'Adaugă în coș'}
        </button>
        {product.is_customizable && (
          <button className="px-8 py-4 text-base font-medium transition-opacity hover:opacity-80"
            style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}>
            Personalizează
          </button>
        )}
      </div>
    </div>
  )
}
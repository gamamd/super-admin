'use client'

import { useCartStore } from '@/lib/store/cart'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: "var(--background)" }}>
        <p className="text-xl mb-8" style={{ color: "var(--text-secondary)" }}>
          Coșul tău este gol.
        </p>
        <Link href="/catalog"
          className="px-8 py-4 text-base font-medium hover:opacity-80 transition-opacity"
          style={{ background: "var(--text-primary)", color: "var(--background)" }}>
          Vezi produsele
        </Link>
      </main>
    )
  }

  return (
    <main className="px-6 md:px-16 lg:px-24 py-16" style={{ background: "var(--background)" }}>

      <div className="mb-12">
        <p className="text-sm font-medium tracking-widest uppercase mb-4"
          style={{ color: "var(--text-secondary)" }}>Coș</p>
        <h1 className="text-4xl font-medium" style={{ color: "var(--text-primary)" }}>
          Produsele tale
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* Lista produse */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 py-6"
              style={{ borderBottom: "1px solid var(--border)" }}>

              {/* Imagine */}
              <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>foto</span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                  {item.name}
                </h3>
                <p className="mb-4" style={{ color: "var(--accent)" }}>
                  {item.price} MDL
                </p>

                {/* Cantitate */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center" style={{ border: "1px solid var(--border)" }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:opacity-70"
                      style={{ color: "var(--text-primary)" }}>−</button>
                    <span className="px-3 py-1 text-center w-10"
                      style={{ color: "var(--text-primary)", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:opacity-70"
                      style={{ color: "var(--text-primary)" }}>+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)}
                    className="text-sm hover:opacity-70"
                    style={{ color: "var(--text-secondary)" }}>
                    Elimină
                  </button>
                </div>
              </div>

              {/* Total linie */}
              <div className="text-right">
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                  {item.price * item.quantity} MDL
                </p>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="text-sm self-start hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}>
            Golește coșul
          </button>
        </div>

        {/* Sumar */}
        <div className="lg:col-span-1">
          <div className="p-8 sticky top-8"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h2 className="text-xl font-medium mb-8" style={{ color: "var(--text-primary)" }}>
              Sumar comandă
            </h2>

            <div className="flex justify-between mb-4">
              <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
              <span style={{ color: "var(--text-primary)" }}>{total()} MDL</span>
            </div>
            <div className="flex justify-between mb-8 pb-8"
              style={{ borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-secondary)" }}>Livrare</span>
              <span style={{ color: "var(--text-secondary)" }}>Se calculează</span>
            </div>
            <div className="flex justify-between mb-8">
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>Total</span>
              <span className="font-medium text-xl" style={{ color: "var(--accent)" }}>
                {total()} MDL
              </span>
            </div>

            <Link href="/checkout"
              className="block w-full text-center py-4 text-base font-medium hover:opacity-80 transition-opacity"
              style={{ background: "var(--text-primary)", color: "var(--background)" }}>
              Continuă la plată
            </Link>

            <Link href="/catalog"
              className="block w-full text-center py-3 text-sm mt-3 hover:opacity-70"
              style={{ color: "var(--text-secondary)" }}>
              Continuă cumpărăturile
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
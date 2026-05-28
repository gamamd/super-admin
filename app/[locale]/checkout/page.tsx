'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    delivery: 'nova_poshta',
    payment: 'cash'
  })
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleOrder() {
    if (!form.name || !form.email || !form.phone || !form.address) {
      alert('Completează toate câmpurile obligatorii.')
      return
    }
    setLoading(true)

    const { error } = await supabase
      .from('orders')
      .insert({
        workspace_id: '94722422-b939-44d0-a580-7420eebbb554',
        order_number: 'ORD-' + Date.now(),
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        shipping_address: { city: form.city, address: form.address },
        delivery_method: form.delivery,
        payment_method: form.payment,
        payment_status: 'pending',
        status: 'new',
        total_amount: total(),
        notes: JSON.stringify(items.map(i => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price })))
      })

    if (error) {
      alert('Eroare la plasarea comenzii. Încearcă din nou.')
      setLoading(false)
      return
    }

    clearCart()
    router.push('/multumim')
    setLoading(false)
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: "var(--background)" }}>
        <p className="text-xl mb-8" style={{ color: "var(--text-secondary)" }}>
          Coșul tău este gol.
        </p>
        <Link href="/catalog"
          className="px-8 py-4 text-base font-medium hover:opacity-80"
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
          style={{ color: "var(--text-secondary)" }}>Checkout</p>
        <h1 className="text-4xl font-medium" style={{ color: "var(--text-primary)" }}>
          Finalizează comanda
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div>
            <h2 className="text-lg font-medium mb-6" style={{ color: "var(--text-primary)" }}>
              Date personale
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Nume complet *', name: 'name', placeholder: 'Ion Popescu' },
                { label: 'Email *', name: 'email', placeholder: 'email@exemplu.com' },
                { label: 'Telefon *', name: 'phone', placeholder: '+373 69 000 000' },
                { label: 'Oraș *', name: 'city', placeholder: 'Chișinău' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 text-base outline-none"
                    style={{ border: "1px solid var(--border)", background: "var(--background)", color: "var(--text-primary)" }}
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                  Adresă livrare *
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Str. Ștefan cel Mare 1, ap. 5"
                  className="w-full px-4 py-3 text-base outline-none"
                  style={{ border: "1px solid var(--border)", background: "var(--background)", color: "var(--text-primary)" }}
                />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-medium mb-6" style={{ color: "var(--text-primary)" }}>
              Metoda de livrare
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { value: 'nova_poshta', label: 'Nova Poshta MD', desc: '1-2 zile lucrătoare' },
                { value: 'posta_md', label: 'Poșta Moldovei', desc: '3-5 zile lucrătoare' },
                { value: 'curier', label: 'Curier Chișinău', desc: 'În aceeași zi' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-4 p-4 cursor-pointer"
                  style={{
                    border: `1px solid ${form.delivery === opt.value ? "var(--text-primary)" : "var(--border)"}`,
                    background: form.delivery === opt.value ? "var(--surface)" : "var(--background)"
                  }}>
                  <input type="radio" name="delivery" value={opt.value}
                    checked={form.delivery === opt.value}
                    onChange={handleChange} />
                  <div>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>{opt.label}</p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-medium mb-6" style={{ color: "var(--text-primary)" }}>
              Metoda de plată
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { value: 'cash', label: 'Ramburs (Cash)', desc: 'Plătești la primirea coletului' },
                { value: 'card', label: 'Card bancar', desc: 'MAIB ePay — Visa / Mastercard' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-4 p-4 cursor-pointer"
                  style={{
                    border: `1px solid ${form.payment === opt.value ? "var(--text-primary)" : "var(--border)"}`,
                    background: form.payment === opt.value ? "var(--surface)" : "var(--background)"
                  }}>
                  <input type="radio" name="payment" value={opt.value}
                    checked={form.payment === opt.value}
                    onChange={handleChange} />
                  <div>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>{opt.label}</p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="p-8 sticky top-8"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h2 className="text-xl font-medium mb-6" style={{ color: "var(--text-primary)" }}>
              Sumar
            </h2>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between mb-3">
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {item.name} × {item.quantity}
                </span>
                <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {item.price * item.quantity} MDL
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-4 mt-4 mb-8"
              style={{ borderTop: "1px solid var(--border)" }}>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>Total</span>
              <span className="font-medium text-xl" style={{ color: "var(--accent)" }}>
                {total()} MDL
              </span>
            </div>
            <button
              onClick={handleOrder}
              disabled={loading}
              className="w-full py-4 text-base font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ background: "var(--text-primary)", color: "var(--background)" }}>
              {loading ? 'Se procesează...' : 'Plasează comanda'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

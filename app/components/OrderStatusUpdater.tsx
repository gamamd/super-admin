'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const STATUSES = [
  { value: 'new', label: 'Nouă', color: '#fef3c7', text: '#92400e' },
  { value: 'confirmed', label: 'Confirmată', color: '#dbeafe', text: '#1e40af' },
  { value: 'in_productie', label: 'În producție', color: '#ede9fe', text: '#5b21b6' },
  { value: 'expediat', label: 'Expediată', color: '#d1fae5', text: '#065f46' },
  { value: 'livrat', label: 'Livrată', color: '#f0fdf4', text: '#14532d' },
  { value: 'anulat', label: 'Anulată', color: '#fee2e2', text: '#991b1b' },
]

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function updateStatus(newStatus: string) {
    setLoading(true)
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (!error) {
      setStatus(newStatus)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setLoading(false)
  }

  const current = STATUSES.find(s => s.value === status)

  return (
    <div className="p-8 sticky top-8"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <h2 className="text-lg font-medium mb-6" style={{ color: "var(--text-primary)" }}>
        Status comandă
      </h2>
      <div className="inline-block px-3 py-1 text-sm mb-8"
        style={{ background: current?.color, color: current?.text }}>
        {current?.label}
      </div>
      <div className="flex flex-col gap-3">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => updateStatus(s.value)}
            disabled={loading || s.value === status}
            className="w-full py-3 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{
              background: s.value === status ? s.color : "var(--background)",
              color: s.value === status ? s.text : "var(--text-secondary)",
              border: `1px solid ${s.value === status ? s.color : "var(--border)"}`
            }}>
            {s.label}
          </button>
        ))}
      </div>
      {saved && (
        <p className="text-sm mt-4 text-center" style={{ color: '#065f46' }}>
          ✓ Status actualizat
        </p>
      )}
    </div>
  )
}

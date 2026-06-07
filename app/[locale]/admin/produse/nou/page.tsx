'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProdusNouPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', price: '', description: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'name') {
      setForm(prev => ({ ...prev, name: value, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price), workspace_id: '94722422-b939-44d0-a580-7420eebbb554' })
    })
    if (res.ok) {
      router.push('/ro/admin/produse')
    } else {
      alert('Eroare la salvare')
    }
    setLoading(false)
  }

  const inputStyle = { border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-primary)', borderRadius: '6px', padding: '10px 14px', width: '100%', fontSize: '14px', outline: 'none' }
  const labelStyle = { fontSize: '12px', fontWeight: '500' as const, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-2xl font-semibold' style={{ color: 'var(--text-primary)' }}>Produs nou</h1>
        <p className='text-sm mt-1' style={{ color: 'var(--text-secondary)' }}>Adauga un produs nou in catalog</p>
      </div>
      <div className='bg-white rounded-lg p-8 max-w-2xl' style={{ border: '1px solid var(--border)' }}>
        <div className='flex flex-col gap-6'>
          <div>
            <label style={labelStyle}>Nume produs</label>
            <input name='name' value={form.name} onChange={handleChange} placeholder='ex: Cana personalizata 330ml' style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Slug (URL)</label>
            <input name='slug' value={form.slug} onChange={handleChange} placeholder='ex: cana-personalizata-330ml' style={inputStyle} />
            <p className='text-xs mt-1' style={{ color: 'var(--text-secondary)' }}>Generat automat din nume.</p>
          </div>
          <div>
            <label style={labelStyle}>Pret (MDL)</label>
            <input name='price' type='number' value={form.price} onChange={handleChange} placeholder='ex: 250' style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Descriere</label>
            <textarea name='description' value={form.description} onChange={handleChange} placeholder='Descriere produs...' rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div className='flex gap-3 pt-2'>
            <button onClick={handleSubmit} disabled={loading}
              className='px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-80'
              style={{ background: 'var(--text-primary)', color: 'var(--background)', opacity: loading ? 0.5 : 1 }}>
              {loading ? 'Se salveaza...' : 'Salveaza produsul'}
            </button>
            <button onClick={() => router.push('/ro/admin/produse')}
              className='px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-80'
              style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              Anuleaza
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
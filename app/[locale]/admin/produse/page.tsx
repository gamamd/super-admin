import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'

const WORKSPACE_ID = '94722422-b939-44d0-a580-7420eebbb554'

async function getProducts() {
  const { data } = await supabaseAdmin
    .from('products')
    .select('id, name, slug, price, description, created_at')
    .eq('workspace_id', WORKSPACE_ID)
    .order('created_at', { ascending: false })
  return data || []
}

export default async function ProduseAdminPage() {
  const products = await getProducts()

  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-semibold' style={{ color: 'var(--text-primary)' }}>Produse</h1>
          <p className='text-sm mt-1' style={{ color: 'var(--text-secondary)' }}>{products.length} produse în catalog</p>
        </div>
        <Link href='/ro/admin/produse/nou'
          className='px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-80'
          style={{ background: 'var(--text-primary)', color: 'var(--background)' }}>
          + Produs nou
        </Link>
      </div>

      <div className='bg-white rounded-lg' style={{ border: '1px solid var(--border)' }}>
        {products.length === 0 ? (
          <div className='p-12 text-center'>
            <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>Nu există produse încă.</p>
            <Link href='/ro/admin/produse/nou' className='text-sm mt-2 inline-block' style={{ color: 'var(--accent)' }}>
              Adaugă primul produs →
            </Link>
          </div>
        ) : (
          <table className='w-full text-sm'>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Nume', 'Slug', 'Pret', 'Descriere', 'Actiuni'].map((h) => (
                  <th key={h} className='text-left px-6 py-3 font-medium' style={{ color: 'var(--text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className='px-6 py-4 font-medium' style={{ color: 'var(--text-primary)' }}>{p.name}</td>
                  <td className='px-6 py-4' style={{ color: 'var(--text-secondary)' }}>{p.slug}</td>
                  <td className='px-6 py-4 font-medium' style={{ color: 'var(--accent)' }}>{p.price ? p.price + ' MDL' : '—'}</td>
                  <td className='px-6 py-4 max-w-xs truncate' style={{ color: 'var(--text-secondary)' }}>{p.description || '—'}</td>
                  <td className='px-6 py-4'>
                    <Link href={'/ro/admin/produse/' + p.id}
                      className='text-sm hover:opacity-70 transition-opacity'
                      style={{ color: 'var(--accent)' }}>
                      Editează
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
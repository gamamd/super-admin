import Link from 'next/link'
import WorkspaceSelector from '@/app/components/WorkspaceSelector'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen' style={{ background: 'var(--surface)' }}>
      <div className='flex'>
        <aside className='w-64 min-h-screen bg-white p-6' style={{ borderRight: '1px solid var(--border)' }}>
          <p className='text-xs font-semibold tracking-widest uppercase mb-4' style={{ color: 'var(--accent)' }}>Admin Panel</p>
          <WorkspaceSelector />
          <nav className='flex flex-col gap-1'>
            {[
              { href: '/ro/admin', label: 'Dashboard' },
              { href: '/ro/admin/comenzi', label: 'Comenzi' },
              { href: '/ro/admin/produse', label: 'Produse' },
              { href: '/ro/admin/categorii', label: 'Categorii' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className='px-3 py-2 rounded text-sm transition-all hover:opacity-80' style={{ color: 'var(--text-primary)' }}>
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className='flex-1 p-8'>{children}</main>
      </div>
    </div>
  )
}
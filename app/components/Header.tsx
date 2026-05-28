'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'

export default function Header() {
  const count = useCartStore((state) => state.count)

  return (
    <header className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 h-16">
        <Link href="/" className="text-sm font-medium tracking-widest uppercase"
          style={{ color: "var(--text-primary)" }}>
          i-printsmart
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/catalog" className="text-sm transition-opacity hover:opacity-60"
            style={{ color: "var(--text-secondary)" }}>Produse</Link>
          <Link href="#" className="text-sm transition-opacity hover:opacity-60"
            style={{ color: "var(--text-secondary)" }}>Corporate B2B</Link>
          <Link href="#" className="text-sm transition-opacity hover:opacity-60"
            style={{ color: "var(--text-secondary)" }}>Despre</Link>
          <Link href="#" className="text-sm transition-opacity hover:opacity-60"
            style={{ color: "var(--text-secondary)" }}>Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/cos" className="relative p-2 transition-opacity hover:opacity-70">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5"
              style={{ color: "var(--text-primary)" }}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium"
                style={{ background: "var(--accent)", color: "var(--background)" }}>
                {count()}
              </span>
            )}
          </Link>
          <Link href="/auth" className="px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--text-primary)", color: "var(--background)" }}>
            Cont
          </Link>
        </div>
      </div>
    </header>
  )
}
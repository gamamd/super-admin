import { getCategories, getProducts } from '@/lib/queries'
import Link from 'next/link'

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts()
  ])

  return (
    <main className="px-6 md:px-16 lg:px-24 py-16" style={{ background: "var(--background)" }}>
      
      {/* Titlu */}
      <div className="mb-12">
        <p className="text-sm font-medium tracking-widest uppercase mb-4"
          style={{ color: "var(--text-secondary)" }}>
          Catalog
        </p>
        <h1 className="text-4xl md:text-5xl font-medium"
          style={{ color: "var(--text-primary)" }}>
          Toate produsele
        </h1>
      </div>

      {/* Categorii filtre */}
      <div className="flex gap-3 flex-wrap mb-12">
        <button className="px-5 py-2 text-sm font-medium"
          style={{ background: "var(--text-primary)", color: "var(--background)" }}>
          Toate
        </button>
        {categories && categories.map((cat) => (
          <button key={cat.id} className="px-5 py-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }}>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid produse */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link href={`/catalog/${product.slug}`} key={product.id}>
              <div className="group cursor-pointer"
                style={{ border: "1px solid var(--border)" }}>
                {/* Imagine placeholder */}
                <div className="aspect-square flex items-center justify-center"
                  style={{ background: "var(--surface)" }}>
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Foto produs
                  </span>
                </div>
                {/* Info produs */}
                <div className="p-4">
                  <h3 className="font-medium mb-2 group-hover:opacity-70 transition-opacity"
                    style={{ color: "var(--text-primary)" }}>
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="font-medium"
                      style={{ color: "var(--accent)" }}>
                      {product.price} MDL
                    </span>
                    {product.is_customizable && (
                      <span className="text-xs px-2 py-1"
                        style={{ background: "var(--surface)", color: "var(--text-secondary)" }}>
                        Personalizabil
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p style={{ color: "var(--text-secondary)" }}>
            Produsele se adaugă în curând.
          </p>
        </div>
      )}

    </main>
  )
}
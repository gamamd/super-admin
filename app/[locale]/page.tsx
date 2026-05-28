import { getCategories } from '@/lib/queries'

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <main>
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24"
        style={{ background: "var(--background)" }}>
        <div className="max-w-4xl">
          <p className="text-sm font-medium tracking-widest uppercase mb-6"
            style={{ color: "var(--accent)" }}>
            i-printsmart
          </p>
          <h1 className="text-5xl md:text-7xl font-medium leading-tight mb-8"
            style={{ color: "var(--text-primary)" }}>
            Imprimare personalizata profesionala
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-xl"
            style={{ color: "var(--text-secondary)" }}>
            Cadouri unice, textile branduite si produse personalizate.
            Livrare in Moldova si Romania.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button className="px-8 py-4 text-base font-medium transition-opacity hover:opacity-80"
              style={{ background: "var(--text-primary)", color: "var(--background)" }}>
              Vezi produsele
            </button>
            <button className="px-8 py-4 text-base font-medium transition-opacity hover:opacity-80"
              style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }}>
              Oferta B2B
            </button>
          </div>
        </div>
      </section>

      <div className="h-px mx-6 md:mx-16 lg:px-24"
        style={{ background: "var(--border)" }} />

      <section className="px-6 md:px-16 lg:px-24 py-24"
        style={{ background: "var(--surface)" }}>
        <p className="text-sm font-medium tracking-widest uppercase mb-12"
          style={{ color: "var(--text-secondary)" }}>
          Categorii principale
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories && categories.map((cat) => (
            <div key={cat.id} className="p-8 cursor-pointer"
              style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
              <h3 className="text-lg font-medium mb-3"
                style={{ color: "var(--text-primary)" }}>
                {cat.name}
              </h3>
              <p style={{ color: "var(--text-secondary)" }}>
                {cat.description || ''}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
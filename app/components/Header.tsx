export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 h-16">
        <a href="/" className="text-sm font-medium tracking-widest uppercase"
          style={{ color: "var(--text-primary)" }}>
          i-printsmart
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {["Produse", "Corporate B2B", "Despre", "Contact"].map((item) => (
            <a key={item} href="#"
              className="text-sm transition-opacity hover:opacity-60"
              style={{ color: "var(--text-secondary)" }}>
              {item}
            </a>
          ))}
        </nav>
        <button className="px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: "var(--text-primary)", color: "var(--background)" }}>
          Comanda acum
        </button>
      </div>
    </header>
  )
}
import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--background)" }}>
      <p className="text-sm font-medium tracking-widest uppercase mb-6"
        style={{ color: "var(--accent)" }}>
        Comandă plasată
      </p>
      <h1 className="text-4xl md:text-5xl font-medium mb-6"
        style={{ color: "var(--text-primary)" }}>
        Mulțumim!
      </h1>
      <p className="text-xl mb-12 max-w-md"
        style={{ color: "var(--text-secondary)" }}>
        Comanda ta a fost înregistrată. Vei primi un email de confirmare în curând.
      </p>
      <Link href="/catalog"
        className="px-8 py-4 text-base font-medium hover:opacity-80 transition-opacity"
        style={{ background: "var(--text-primary)", color: "var(--background)" }}>
        Continuă cumpărăturile
      </Link>
    </main>
  )
}
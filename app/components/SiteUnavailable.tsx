// Afișat când domeniul cererii nu e legat de niciun workspace (lib/tenant.ts).
// Nu arată date, nu dezvăluie ce workspace-uri există. Răspuns 404 (notFound) — nu se indexează.
import { notFound } from 'next/navigation'

export default function SiteUnavailable(): never {
  notFound()
}

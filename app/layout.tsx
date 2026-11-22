import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { getSiteWorkspace, brandName } from "@/lib/tenant";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Titlul și descrierea vin din workspace-ul domeniului (theme.title / theme.description), cu nume ca rezervă.
export async function generateMetadata(): Promise<Metadata> {
  const ws = await getSiteWorkspace();
  const t = (ws?.theme ?? {}) as Record<string, unknown>;
  return {
    title: typeof t.title === "string" ? t.title : brandName(ws) || undefined,
    description: typeof t.description === "string" ? t.description : undefined,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
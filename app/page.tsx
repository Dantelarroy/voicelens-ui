import type { Metadata } from "next"
import VoicelensApp from "@/components/voicelens-app"

export const metadata: Metadata = {
  title: "Voicelens | Análisis de Audio con IA",
  description: "Dejá de rebobinar audios. Subí, leé y preguntale a tu grabación.",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <VoicelensApp />
    </main>
  )
}

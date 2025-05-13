"use client"

import { Upload, FileAudio } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-500/10">
          <FileAudio className="h-12 w-12 text-purple-400" />
        </div>

        <h2 className="mb-2 text-2xl font-semibold tracking-tight">Bienvenido a Voicelens</h2>

        <p className="mb-8 text-gray-400">
          Dejá de rebobinar audios. Subí, leé y preguntale a tu grabación. Nuestra IA analizará tu audio y generará un
          informe detallado.
        </p>

        <Button
          size="lg"
          onClick={() => document.getElementById("audio-upload")?.click()}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Upload className="mr-2 h-5 w-5" />
          Subir archivo de audio
        </Button>

        <p className="mt-4 text-xs text-gray-500">Formatos soportados: MP3, WAV, M4A</p>
      </div>
    </div>
  )
}

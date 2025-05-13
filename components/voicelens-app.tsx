"use client"

import { useState, ChangeEvent } from "react"
import { AudioWaveform, Upload, Bot, FileAudio, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AudioUploader from "@/components/audio-uploader"
import ChatPanel from "@/components/chat-panel"

// URL base del backend
const API_URL = 'http://localhost:8000'

export default function VoicelensApp() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [report, setReport] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setReport(null)
    setError(null)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Error al procesar el archivo')
      }

      const data = await response.json()
      setReport(data.informe)
      
      // Mostrar mensaje de éxito
      console.log('Procesamiento completado:', {
        transcripcion: data.transcripcion,
        tematica: data.tematica,
        revision: data.revision
      })
    } catch (err) {
      console.error('Error al subir el archivo:', err)
      setError(err instanceof Error ? err.message : 'Hubo un error al procesar el archivo. Por favor, intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full flex-col bg-[#121212] text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <AudioWaveform className="h-6 w-6 text-purple-400" />
            <h1 className="text-xl font-semibold tracking-tight text-white">Voicelens</h1>
          </div>

          {!selectedFile && (
            <Button
              onClick={() => document.getElementById("audio-upload")?.click()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              Subir audio
            </Button>
          )}

          {selectedFile && !isLoading && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full bg-gray-800 px-3 py-1 text-sm">
                <FileAudio className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">{selectedFile.name}</span>
              </div>
              <Button
                onClick={handleUpload}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Bot className="mr-2 h-4 w-4" />
                Analizar audio
              </Button>
            </div>
          )}

          {isLoading && (
            <Button disabled className="bg-purple-600">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </Button>
          )}
        </div>
      </header>

      {/* Subtitle */}
      {!selectedFile && (
        <div className="border-b border-gray-800 bg-gray-900/50 px-6 py-3 text-center">
          <p className="text-sm text-gray-400">Dejá de rebobinar audios. Subí, leé y preguntale a tu grabación.</p>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          {/* File input (hidden) */}
          <input
            id="audio-upload"
            type="file"
            accept=".mp3,.wav,.m4a"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0])
              }
            }}
            className="hidden"
          />

          {/* Report section */}
          {report && (
            <Card className="mb-6 bg-gray-900 shadow-md">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-400" />
                  Informe generado
                </h2>
                <p className="whitespace-pre-line text-gray-300">{report}</p>
              </CardContent>
            </Card>
          )}

          {/* Error display */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-900/20 p-4 text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Right panel - Chat */}
        <div className="w-96 flex-shrink-0 border-l border-gray-800 bg-gray-900">
          <ChatPanel isActive={report !== null} audioFile={selectedFile} />
        </div>
      </div>

      {/* Hidden file input */}
      <AudioUploader id="audio-upload" onFileUpload={setSelectedFile} />
    </div>
  )
}

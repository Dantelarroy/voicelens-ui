'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [report, setReport] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setReport(null)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch(' https://a678-2a0c-5a85-9104-2d00-fc82-c7ba-5a01-a5f1.ngrok-free.app/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setReport(data.report)
      setSessionId(data.session_id)
    } catch (err) {
      console.error('Error al subir el archivo:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Voicelens</h1>
      <p className="mb-6 text-muted-foreground">
        Dejá de rebobinar audios. Subí, leé y preguntale a tu grabación.
      </p>

      {/* Input de archivo */}
      <input
        type="file"
        accept=".mp3,.wav,.m4a"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
          }
        }}
        className="mb-4"
      />

      {/* Botón para enviar */}
      <Button onClick={handleUpload} disabled={!selectedFile || isLoading}>
        {isLoading ? 'Analizando...' : 'Generar informe'}
      </Button>

      {/* Mostrar informe */}
      {report && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">🧠 Informe generado</h2>
          <p className="whitespace-pre-line text-muted-foreground">{report}</p>
        </div>
      )}
    </div>
  )
}

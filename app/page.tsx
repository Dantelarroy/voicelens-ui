'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// URL base del backend
const API_URL = 'http://localhost:8000'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [report, setReport] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [chatResponse, setChatResponse] = useState<string | null>(null)
  const [isChatLoading, setIsChatLoading] = useState(false)
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
        throw new Error('Error al procesar el archivo')
      }

      const data = await response.json()
      setReport(data.informe)
    } catch (err) {
      console.error('Error al subir el archivo:', err)
      setError('Hubo un error al procesar el archivo. Por favor, intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChat = async () => {
    if (!question.trim()) return

    setIsChatLoading(true)
    setChatResponse(null)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: question.trim() })
      })

      if (!response.ok) {
        throw new Error('Error al procesar la pregunta')
      }

      const data = await response.json()
      setChatResponse(data.respuesta)
    } catch (err) {
      console.error('Error al enviar la pregunta:', err)
      setError('Hubo un error al procesar tu pregunta. Por favor, intenta nuevamente.')
    } finally {
      setIsChatLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Voicelens</h1>
      <p className="mb-6 text-muted-foreground">
        Dejá de rebobinar audios. Subí, leé y preguntale a tu grabación.
      </p>

      <input
        type="file"
        accept=".mp3,.wav,.m4a"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
          }
        }}
        className="mb-4"
      />

      <Button onClick={handleUpload} disabled={!selectedFile || isLoading}>
        {isLoading ? 'Analizando...' : 'Generar informe'}
      </Button>

      {report && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">🧠 Informe generado</h2>
          <p className="whitespace-pre-line text-muted-foreground">{report}</p>
        </div>
      )}

      {report && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">💬 Preguntale al audio</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
              placeholder="Escribí tu pregunta aquí..."
              className="flex-1 p-2 border rounded"
              disabled={isChatLoading}
            />
            <Button onClick={handleChat} disabled={!question.trim() || isChatLoading}>
              {isChatLoading ? 'Pensando...' : 'Enviar'}
            </Button>
          </div>

          {chatResponse && (
            <div className="mt-4 bg-gray-100 p-4 rounded shadow">
              <p className="whitespace-pre-line text-muted-foreground">{chatResponse}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

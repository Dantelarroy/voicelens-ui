'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [report, setReport] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [question, setQuestion] = useState('')
  const [chatResponse, setChatResponse] = useState<string | null>(null)
  const [isChatLoading, setIsChatLoading] = useState(false)

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setReport(null)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch('https://a678-2a0c-5a85-9104-2d00-fc82-c7ba-5a01-a5f1.ngrok-free.app/upload', {
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

  const handleChat = async () => {
    if (!sessionId || !question.trim()) return

    setIsChatLoading(true)
    setChatResponse(null)

    try {
      const response = await fetch('https://a678-2a0c-5a85-9104-2d00-fc82-c7ba-5a01-a5f1.ngrok-free.app/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          question: question.trim()
        })
      })

      const data = await response.json()
      setChatResponse(data.response)
    } catch (err) {
      console.error('Error al enviar la pregunta:', err)
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

      {sessionId && (
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

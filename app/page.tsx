'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [report, setReport] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
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
      const response = await fetch('https://a678-2a0c-5a85-9104-2d00-fc82-c7ba-5a01-a5f1.ngrok-free.app/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Error al procesar el archivo')
      }

      const data = await response.json()
      setReport(data.report)
      setSessionId(data.session_id)
    } catch (err) {
      console.error('Error al subir el archivo:', err)
      setError('Hubo un error al procesar el archivo. Por favor, intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Trigger upload automatically when file is selected
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      handleUpload() // Auto-upload when file is selected
    }
  }

  const handleChat = async () => {
    if (!sessionId || !question.trim()) return

    setIsChatLoading(true)
    setChatResponse(null)
    setError(null)

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

      if (!response.ok) {
        throw new Error('Error al procesar la pregunta')
      }

      const data = await response.json()
      setChatResponse(data.response)
    } catch (err) {
      console.error('Error al enviar la pregunta:', err)
      setError('Hubo un error al procesar tu pregunta. Por favor, intenta nuevamente.')
    } finally {
      setIsChatLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Upload and Report */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Voicelens</CardTitle>
              <CardDescription>
                Dejá de rebobinar audios. Subí, leé y preguntale a tu grabación.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  type="file"
                  accept=".mp3,.wav,.m4a"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Archivo seleccionado: {selectedFile.name}
                  </p>
                )}
                {isLoading && (
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Procesando archivo...
                  </p>
                )}
                {error && (
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {report && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <span className="flex items-center gap-2">
                    🧠 Informe generado
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-muted-foreground">{report}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Chat */}
        {sessionId && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <span className="flex items-center gap-2">
                    💬 Preguntale al audio
                  </span>
                </CardTitle>
                <CardDescription>
                  Hacé preguntas sobre el contenido del audio y obtené respuestas instantáneas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={question}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
                      placeholder="Escribí tu pregunta aquí..."
                      disabled={isChatLoading}
                    />
                    <Button onClick={handleChat} disabled={!question.trim() || isChatLoading}>
                      {isChatLoading ? 'Pensando...' : 'Enviar'}
                    </Button>
                  </div>

                  {chatResponse && (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="whitespace-pre-line text-muted-foreground">{chatResponse}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

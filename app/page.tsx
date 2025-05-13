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
    <div>
      <input
        type="file"
        accept=".mp3,.wav,.m4a"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
          }
        }}
      />

      <Button onClick={handleUpload} disabled={!selectedFile || isLoading}>
        {isLoading ? 'Analizando...' : 'Generar informe'}
      </Button>

      {report && <p>{report}</p>}

      {sessionId && (
        <>
          <input
            type="text"
            value={question}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
            placeholder="Escribí tu pregunta aquí..."
            disabled={isChatLoading}
          />
          <Button onClick={handleChat} disabled={!question.trim() || isChatLoading}>
            {isChatLoading ? 'Pensando...' : 'Enviar'}
          </Button>

          {chatResponse && <p>{chatResponse}</p>}
        </>
      )}
    </div>
  )
}

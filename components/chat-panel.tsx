"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// URL base del backend
const API_URL = 'http://localhost:8000'

interface ChatPanelProps {
  isActive: boolean
  audioFile: File | null
}

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatPanel({ isActive, audioFile }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debug log para props
  useEffect(() => {
    console.log('ChatPanel props:', { isActive, audioFile: audioFile?.name })
  }, [isActive, audioFile])

  // Añadir mensaje de bienvenida cuando se carga el componente o cambia el estado
  useEffect(() => {
    console.log('Evaluando condiciones para mensaje de bienvenida:', {
      messagesLength: messages.length,
      isActive,
      hasAudioFile: !!audioFile
    })

    if (isActive && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        content: audioFile
          ? `He analizado tu archivo "${audioFile.name}". ¿En qué puedo ayudarte?`
          : "¡Hola! Soy tu asistente de Voicelens. Sube un archivo de audio para comenzar el análisis.",
        sender: "bot" as const,
        timestamp: new Date(),
      }
      console.log('Añadiendo mensaje de bienvenida:', welcomeMessage)
      setMessages([welcomeMessage])
    }
  }, [isActive, audioFile, messages.length])

  // Añadir mensaje cuando se activa el análisis
  useEffect(() => {
    if (isActive && audioFile && !messages.some((m) => m.content.includes(audioFile.name))) {
      const analysisMessage: Message = {
        id: `analysis-${Date.now()}`,
        content: `He analizado tu archivo "${audioFile.name}". ¿En qué puedo ayudarte?`,
        sender: "bot" as const,
        timestamp: new Date(),
      }
      console.log('Añadiendo mensaje de análisis:', analysisMessage)
      setMessages((prev) => [...prev, analysisMessage])
    }
  }, [isActive, audioFile])

  // Scroll al último mensaje
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isActive || !audioFile) return

    // Añadir mensaje del usuario
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      console.log('Enviando pregunta al backend:', {
        filename: audioFile.name,
        query: userMessage.content
      })

      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: audioFile.name,
          query: userMessage.content
        })
      })

      const data = await response.json()
      console.log('Respuesta del backend:', data)

      if (!response.ok) {
        throw new Error(data.detail || 'Error al procesar la pregunta')
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: data.respuesta || "Lo siento, no pude procesar tu pregunta. ¿Podrías reformularla?",
        sender: "bot" as const,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error('Error al enviar la pregunta:', err)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta nuevamente.",
        sender: "bot" as const,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Debug render
  console.log('Renderizando ChatPanel:', {
    isActive,
    hasAudioFile: !!audioFile,
    messagesCount: messages.length,
    isTyping
  })

  return (
    <div className="flex h-full flex-col bg-gray-900">
      <div className="border-b border-gray-800 px-4 py-3">
        <h2 className="flex items-center gap-2 font-medium">
          <Bot className="h-5 w-5 text-purple-400" />
          Chat Contextual {isActive ? '(Activo)' : '(Inactivo)'}
        </h2>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4">
          {!isActive && (
            <div className="rounded-lg bg-gray-800/50 p-4 text-center text-sm text-gray-400">
              El chat se activará cuando el análisis esté completo
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "bot" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-purple-900 text-purple-200">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === "user" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-200"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>

              {message.sender === "user" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-gray-700">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-purple-900 text-purple-200">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg bg-gray-800 px-4 py-2">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-gray-800 p-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isActive ? "Pregunta sobre tu audio..." : "Espera a que se complete el análisis..."}
            disabled={!isActive}
            className="border-gray-700 bg-gray-800 focus-visible:ring-purple-500"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !isActive}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

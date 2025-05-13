"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

  // Añadir mensaje de bienvenida cuando se carga el componente
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: audioFile
            ? `He analizado tu archivo "${audioFile.name}". ¿En qué puedo ayudarte?`
            : "¡Hola! Soy tu asistente de Voicelens. Sube un archivo de audio para comenzar el análisis, o pregúntame sobre cómo puedo ayudarte.",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    } else if (isActive && audioFile && !messages.some((m) => m.content.includes(audioFile.name))) {
      // Añadir mensaje cuando se completa el análisis de un nuevo archivo
      setMessages((prev) => [
        ...prev,
        {
          id: `analysis-${Date.now()}`,
          content: `He analizado tu archivo "${audioFile.name}". ¿En qué puedo ayudarte?`,
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    }
  }, [isActive, audioFile, messages.length])

  // Scroll al último mensaje
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Añadir mensaje del usuario
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simular respuesta del bot
    setIsTyping(true)

    setTimeout(() => {
      const botResponses = [
        "Según el análisis de la reunión, el Proyecto Alpha necesita recursos adicionales para cumplir con la fecha límite.",
        "La Iniciativa Beta está experimentando retrasos debido a problemas con el proveedor actual. El equipo está considerando alternativas.",
        "El equipo de marketing debe entregar la estrategia para el Lanzamiento Gamma antes del 15 de junio.",
        "Carlos mencionó que hablará con Recursos Humanos para reasignar temporalmente a un desarrollador con experiencia en optimización de APIs.",
        "La próxima reunión de seguimiento está programada para el 5 de junio, donde se revisarán los avances de los tres proyectos principales.",
      ]

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-800 px-4 py-3">
        <h2 className="flex items-center gap-2 font-medium">
          <Bot className="h-5 w-5 text-purple-400" />
          Chat Contextual
        </h2>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4">
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
            placeholder={audioFile ? "Pregunta sobre tu audio..." : "Escribe un mensaje..."}
            className="border-gray-700 bg-gray-800 focus-visible:ring-purple-500"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

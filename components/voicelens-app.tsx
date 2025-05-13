"use client"

import { useState } from "react"
import { AudioWaveform, Upload, Bot, FileAudio, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AudioUploader from "@/components/audio-uploader"
import TranscriptView from "@/components/transcript-view"
import ChatPanel from "@/components/chat-panel"
import EmptyState from "@/components/empty-state"

export default function VoicelensApp() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [activeTab, setActiveTab] = useState("transcript")
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (file: File) => {
    setAudioFile(file)
    setError(null)
    processAudio(file)
  }

  const processAudio = (file: File) => {
    setIsProcessing(true)
    setIsComplete(false)

    // Simulación de procesamiento de audio
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
      // En un caso real, aquí se llamaría a la API externa
    }, 3000)
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

          {!audioFile && (
            <Button
              onClick={() => document.getElementById("audio-upload")?.click()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              Subir audio
            </Button>
          )}

          {audioFile && !isComplete && !isProcessing && (
            <Button onClick={() => processAudio(audioFile)} className="bg-purple-600 hover:bg-purple-700">
              <Bot className="mr-2 h-4 w-4" />
              Analizar audio
            </Button>
          )}

          {isProcessing && (
            <Button disabled className="bg-purple-600">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </Button>
          )}

          {isComplete && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full bg-gray-800 px-3 py-1 text-sm">
                <FileAudio className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">{audioFile?.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAudioFile(null)
                  setIsComplete(false)
                }}
                className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                Cambiar
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Subtitle */}
      {!audioFile && (
        <div className="border-b border-gray-800 bg-gray-900/50 px-6 py-3 text-center">
          <p className="text-sm text-gray-400">Dejá de rebobinar audios. Subí, leé y preguntale a tu grabación.</p>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {!audioFile && <EmptyState />}

          {audioFile && isProcessing && (
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 animate-ping rounded-full bg-purple-400 opacity-20"></div>
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-purple-600">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-xl font-medium">Procesando tu audio</h3>
                  <p className="text-sm text-gray-400">
                    Estamos analizando tu archivo con IA para generar un informe detallado. Esto puede tomar unos
                    momentos...
                  </p>
                </div>
              </div>
            </div>
          )}

          {audioFile && isComplete && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                <div className="border-b border-gray-800 px-6">
                  <TabsList className="h-12 bg-gray-900">
                    <TabsTrigger value="transcript" className="data-[state=active]:bg-gray-800">
                      Transcripción
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="data-[state=active]:bg-gray-800">
                      Insights
                    </TabsTrigger>
                    <TabsTrigger value="summary" className="data-[state=active]:bg-gray-800">
                      Resumen
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-auto p-6">
                  <TabsContent value="transcript" className="mt-0 h-full">
                    <TranscriptView />
                  </TabsContent>

                  <TabsContent value="insights" className="mt-0 h-full">
                    <div className="rounded-lg bg-gray-900 p-6 shadow-md">
                      <h3 className="mb-4 text-lg font-medium">Insights clave</h3>
                      <ul className="space-y-3">
                        <li className="flex gap-2">
                          <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400"></div>
                          <p className="text-gray-300">
                            La reunión se centró principalmente en la planificación del próximo trimestre.
                          </p>
                        </li>
                        <li className="flex gap-2">
                          <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400"></div>
                          <p className="text-gray-300">
                            Se mencionaron 3 proyectos clave: Proyecto Alpha, Iniciativa Beta y Lanzamiento Gamma.
                          </p>
                        </li>
                        <li className="flex gap-2">
                          <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400"></div>
                          <p className="text-gray-300">
                            El equipo de marketing necesita entregar la estrategia antes del 15 de junio.
                          </p>
                        </li>
                        <li className="flex gap-2">
                          <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400"></div>
                          <p className="text-gray-300">
                            Se identificaron problemas con el proveedor actual y se discutieron alternativas.
                          </p>
                        </li>
                        <li className="flex gap-2">
                          <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400"></div>
                          <p className="text-gray-300">
                            La próxima reunión de seguimiento está programada para el 5 de junio.
                          </p>
                        </li>
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="summary" className="mt-0 h-full">
                    <div className="rounded-lg bg-gray-900 p-6 shadow-md">
                      <h3 className="mb-4 text-lg font-medium">Resumen ejecutivo</h3>
                      <div className="space-y-4 text-gray-300">
                        <p>
                          En esta reunión de planificación trimestral, el equipo discutió los objetivos estratégicos
                          para el Q3 2023. La conversación se centró en tres proyectos principales que requieren
                          atención inmediata.
                        </p>
                        <p>
                          El director de producto, Carlos, presentó el estado actual del Proyecto Alpha, destacando los
                          logros recientes y los desafíos pendientes. Se acordó que el equipo de desarrollo necesita
                          recursos adicionales para cumplir con la fecha límite de agosto.
                        </p>
                        <p>
                          María del departamento de marketing expresó preocupaciones sobre los retrasos en la Iniciativa
                          Beta, principalmente debido a problemas con el proveedor externo. El equipo decidió explorar
                          alternativas y programar una reunión con nuevos proveedores potenciales la próxima semana.
                        </p>
                        <p>
                          Finalmente, se discutió el Lanzamiento Gamma, programado para septiembre. Todos los
                          departamentos deben entregar sus planes de acción antes del 15 de junio para su revisión.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}

          {error && (
            <div className="flex flex-1 items-center justify-center p-6">
              <div className="rounded-lg bg-red-500/10 p-6 text-center">
                <p className="text-red-400">{error}</p>
                <Button variant="outline" onClick={() => setError(null)} className="mt-4 border-gray-700">
                  Intentar nuevamente
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right panel - Chat */}
        <div className="w-96 flex-shrink-0 border-l border-gray-800 bg-gray-900">
          <ChatPanel isActive={true} audioFile={audioFile} />
        </div>
      </div>

      {/* Hidden file input */}
      <AudioUploader id="audio-upload" onFileUpload={handleFileUpload} />
    </div>
  )
}

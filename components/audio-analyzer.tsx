"use client"

import { useState } from "react"
import { AudioWaveformIcon as Waveform, FileAudio, Bot, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ChatInterface from "@/components/chat-interface"
import AudioUploader from "@/components/audio-uploader"
import AudioReport from "@/components/audio-report"

export default function AudioAnalyzer() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")

  const handleFileUpload = (file: File) => {
    setAudioFile(file)
    setActiveTab("analyze")
  }

  const handleAnalyze = () => {
    if (!audioFile) return

    setIsAnalyzing(true)

    // Simulación de análisis
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
      setActiveTab("report")
    }, 3000)
  }

  return (
    <div className="flex h-screen w-full bg-black text-white">
      {/* Panel principal (izquierda) */}
      <div className="flex flex-1 flex-col overflow-hidden border-r border-zinc-800">
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-6">
          <div className="flex items-center gap-2">
            <Waveform className="h-6 w-6 text-purple-400" />
            <h1 className="text-xl font-semibold">AudioLM</h1>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="border-b border-zinc-800 px-6 py-2">
            <TabsList className="grid w-full grid-cols-3 bg-zinc-900">
              <TabsTrigger value="upload">Subir</TabsTrigger>
              <TabsTrigger value="analyze" disabled={!audioFile}>
                Analizar
              </TabsTrigger>
              <TabsTrigger value="report" disabled={!analysisComplete}>
                Informe
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 p-6">
            <TabsContent value="upload" className="h-full">
              <AudioUploader onFileUpload={handleFileUpload} />
            </TabsContent>

            <TabsContent value="analyze" className="h-full">
              {audioFile && (
                <div className="flex h-full flex-col items-center justify-center gap-6">
                  <Card className="w-full max-w-md overflow-hidden bg-zinc-900 shadow-md">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <FileAudio className="h-8 w-8 text-purple-400" />
                        <div>
                          <p className="font-medium">{audioFile.name}</p>
                          <p className="text-sm text-zinc-400">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>

                      <div className="h-24 rounded-md bg-zinc-800 p-2">
                        <div className="flex h-full items-center justify-center">
                          <div className="space-y-1">
                            <div className="flex gap-1">
                              {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="h-8 w-1 animate-pulse rounded-full bg-purple-500"
                                  style={{
                                    animationDelay: `${i * 0.05}s`,
                                    height: `${Math.random() * 100}%`,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analizando...
                      </>
                    ) : (
                      <>
                        <Bot className="mr-2 h-4 w-4" />
                        Analizar con IA
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="report" className="h-full">
              {analysisComplete && <AudioReport />}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Panel de chat (derecha) */}
      <div className="w-96 flex-shrink-0 overflow-hidden bg-zinc-950">
        <ChatInterface audioFile={audioFile} analysisComplete={analysisComplete} />
      </div>
    </div>
  )
}

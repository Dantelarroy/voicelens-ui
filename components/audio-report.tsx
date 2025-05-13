"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, AudioWaveformIcon as Waveform, Music, FileText, Mic, Volume2, Clock } from "lucide-react"

export default function AudioReport() {
  const [activeTab, setActiveTab] = useState("summary")

  // Datos simulados para el informe
  const reportData = {
    summary: {
      duration: "3:42",
      format: "MP3 (320kbps)",
      channels: "Estéreo",
      sampleRate: "44.1 kHz",
      quality: "Alta",
    },
    spectrum: [
      { frequency: "20-60 Hz", level: 75 },
      { frequency: "60-250 Hz", level: 85 },
      { frequency: "250-500 Hz", level: 65 },
      { frequency: "500-2k Hz", level: 55 },
      { frequency: "2k-8k Hz", level: 45 },
      { frequency: "8k-20k Hz", level: 30 },
    ],
    insights: [
      "El audio presenta una buena calidad de grabación con mínimo ruido de fondo.",
      "Se detecta una ecualización con énfasis en frecuencias bajas y medias.",
      "La dinámica del audio es moderada, con un rango dinámico de aproximadamente 14dB.",
      "No se detectan problemas de clipping o distorsión significativa.",
      "La voz principal está bien centrada en el campo estéreo.",
      "Se recomienda una leve reducción en las frecuencias entre 200-300Hz para mejorar la claridad.",
    ],
  }

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6">
        <div>
          <h2 className="mb-2 text-2xl font-semibold">Informe de Análisis</h2>
          <p className="text-zinc-400">Análisis técnico completo generado por IA</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 bg-zinc-900">
            <TabsTrigger value="summary" className="gap-2">
              <FileText className="h-4 w-4" />
              <span>Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="spectrum" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Espectro</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <Waveform className="h-4 w-4" />
              <span>Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card className="bg-zinc-900 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  Información Técnica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 rounded-lg bg-zinc-800/50 p-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Clock className="h-4 w-4" />
                      Duración
                    </div>
                    <div className="text-lg font-medium">{reportData.summary.duration}</div>
                  </div>

                  <div className="space-y-2 rounded-lg bg-zinc-800/50 p-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Music className="h-4 w-4" />
                      Formato
                    </div>
                    <div className="text-lg font-medium">{reportData.summary.format}</div>
                  </div>

                  <div className="space-y-2 rounded-lg bg-zinc-800/50 p-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Volume2 className="h-4 w-4" />
                      Canales
                    </div>
                    <div className="text-lg font-medium">{reportData.summary.channels}</div>
                  </div>

                  <div className="space-y-2 rounded-lg bg-zinc-800/50 p-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Mic className="h-4 w-4" />
                      Frecuencia de muestreo
                    </div>
                    <div className="text-lg font-medium">{reportData.summary.sampleRate}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spectrum">
            <Card className="bg-zinc-900 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Análisis Espectral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="h-64 rounded-lg bg-zinc-800/50 p-4">
                    <div className="flex h-full flex-col justify-end gap-1">
                      <div className="flex h-full items-end justify-between">
                        {reportData.spectrum.map((band, index) => (
                          <div key={index} className="flex w-full flex-col items-center">
                            <div
                              className="w-full max-w-[30px] rounded-t-sm bg-gradient-to-t from-purple-600 to-purple-400"
                              style={{ height: `${band.level}%` }}
                            />
                            <div className="mt-2 text-center text-xs text-zinc-500">{band.frequency}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-zinc-800/50 p-4">
                    <h4 className="mb-2 font-medium">Interpretación</h4>
                    <p className="text-sm text-zinc-400">
                      El espectro muestra una concentración de energía en las frecuencias bajas y medias-bajas, típico
                      de grabaciones con voces y/o instrumentos con presencia de graves. La caída gradual hacia las
                      altas frecuencias sugiere un audio bien balanceado sin exceso de sibilancia o ruido de alta
                      frecuencia.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card className="bg-zinc-900 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waveform className="h-5 w-5 text-purple-400" />
                  Insights y Recomendaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {reportData.insights.map((insight, index) => (
                    <li key={index} className="rounded-lg bg-zinc-800/50 p-4">
                      <p className="text-sm text-zinc-300">{insight}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}

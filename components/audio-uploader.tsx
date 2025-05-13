"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileAudio, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface AudioUploaderProps {
  id?: string
  onFileUpload: (file: File) => void
}

export default function AudioUploader({ id = "file-upload", onFileUpload }: AudioUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.includes("audio")) {
        handleFile(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (
        file.type === "audio/mp3" ||
        file.type === "audio/wav" ||
        file.type === "audio/mpeg" ||
        file.type === "audio/x-m4a" ||
        file.type === "audio/m4a"
      ) {
        handleFile(file)
      } else {
        alert("Por favor, sube un archivo de audio válido (.mp3, .wav o .m4a)")
      }
    }
  }

  const handleFile = (file: File) => {
    setSelectedFile(file)
    onFileUpload(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const openFileSelector = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Card
        className={`relative w-full max-w-xl overflow-hidden bg-gray-900 shadow-md transition-all ${
          dragActive ? "border-2 border-purple-500" : "border border-gray-800"
        }`}
      >
        <CardContent className="p-0">
          <div
            className="flex min-h-80 flex-col items-center justify-center p-8"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="flex w-full flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20">
                  <FileAudio className="h-8 w-8 text-purple-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                  className="mt-2 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <X className="mr-2 h-4 w-4" />
                  Eliminar archivo
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-500/20">
                  <Upload className="h-10 w-10 text-purple-400" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Sube tu archivo de audio</h3>
                <p className="mb-6 text-center text-gray-400">
                  Arrastra y suelta tu archivo aquí o haz clic para seleccionarlo
                </p>
                <p className="mb-4 text-sm text-gray-500">Formatos soportados: MP3, WAV, M4A</p>
                <Button onClick={openFileSelector} className="bg-purple-600 hover:bg-purple-700">
                  Seleccionar archivo
                </Button>
                <input
                  id={id}
                  ref={inputRef}
                  type="file"
                  accept="audio/mp3,audio/wav,audio/mpeg,audio/x-m4a,audio/m4a"
                  onChange={handleChange}
                  className="hidden"
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

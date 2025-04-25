"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

interface FileViewerProps {
  file: File
}

export function FileViewer({ file }: FileViewerProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) return

    const loadPreview = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Para imágenes
        if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file)
          setPreview(url)
          return
        }

        // Para PDFs
        if (file.type === "application/pdf") {
          const url = URL.createObjectURL(file)
          setPreview(url)
          return
        }

        // Para archivos de texto
        if (
          file.type === "text/plain" ||
          file.type === "text/html" ||
          file.type === "text/css" ||
          file.type === "application/javascript"
        ) {
          const text = await file.text()
          setPreview(text)
          return
        }

        // Para otros tipos de archivos
        setError("Vista previa no disponible para este tipo de archivo")
      } catch (err) {
        setError("Error al cargar la vista previa")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadPreview()

    return () => {
      // Limpiar URLs de objetos al desmontar
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [file, preview])

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <FileText size={64} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">{error}</h3>
          <p className="text-gray-500 mb-4">Este tipo de archivo no puede ser visualizado directamente.</p>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => {
              // En una aplicación real, aquí se implementaría la descarga
              console.log(`Descargando ${file.name}`)
            }}
          >
            <Download size={16} className="mr-2" />
            Descargar archivo
          </Button>
        </div>
      )
    }

    if (!preview) return null

    // Renderizar según el tipo de archivo
    if (file.type.startsWith("image/")) {
      return (
        <div className="flex items-center justify-center h-full">
          <img src={preview || "/placeholder.svg"} alt={file.name} className="max-w-full max-h-full object-contain" />
        </div>
      )
    }

    if (file.type === "application/pdf") {
      return <iframe src={preview} className="w-full h-full" title={file.name} />
    }

    // Para archivos de texto
    if (typeof preview === "string" && !preview.startsWith("blob:")) {
      return (
        <pre className="whitespace-pre-wrap p-4 overflow-auto h-full bg-gray-50 dark:bg-gray-900 rounded text-sm">
          {preview}
        </pre>
      )
    }

    return (
      <div className="flex items-center justify-center h-full">
        <p>No se puede mostrar una vista previa para este tipo de archivo.</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">{renderPreview()}</div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => {
            // En una aplicación real, aquí se implementaría la descarga
            console.log(`Descargando ${file.name}`)
          }}
        >
          <Download size={16} className="mr-2" />
          Descargar
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

import { Upload, X, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadItem {
  id: string
  file: File
  progress: number
  status: "uploading" | "success" | "error"
  error?: string
}

export function FileUpload() {
  const [files, setFiles] = useState<FileUploadItem[]>([])


  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      progress: 0,
      status: "uploading" as const,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simular carga para cada archivo
    newFiles.forEach((fileItem) => {
      simulateUpload(fileItem.id)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
      "application/vnd.ms-excel": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "application/zip": [],
      "application/x-zip-compressed": [],
      "text/plain": [],
    },
  })

  const simulateUpload = (id: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5

      if (progress >= 100) {
        progress = 100
        clearInterval(interval)

        // Simular éxito o error aleatorio (90% éxito, 10% error)
        const isSuccess = Math.random() > 0.1

        setFiles((prev) =>
          prev.map((file) =>
            file.id === id
              ? {
                  ...file,
                  progress,
                  status: isSuccess ? "success" : "error",
                  error: isSuccess ? undefined : "Error al subir el archivo",
                }
              : file,
          ),
        )

      } else {
        setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, progress } : file)))
      }
    }, 200)
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
        return <Upload size={16} className="animate-pulse" />
      case "success":
        return <Check size={16} className="text-green-500" />
      case "error":
        return <AlertCircle size={16} className="text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors",
          isDragActive
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
            : "border-gray-300 dark:border-gray-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20",
        )}
      >
        <input {...getInputProps()} />
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mb-4">
          <Upload size={24} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <p className="text-lg font-medium mb-1">Arrastra y suelta archivos aquí</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">O haz clic para seleccionar archivos</p>
        <Button className="bg-emerald-600 hover:bg-emerald-700">Seleccionar archivos</Button>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Formatos soportados: PDF, DOCX, XLSX, ZIP, PNG, JPG y más
        </p>
      </div>

      {files.length > 0 && (
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
          <div className="p-3 border-b bg-gray-50 dark:bg-gray-900">
            <h3 className="font-medium">Archivos ({files.length})</h3>
          </div>
          <div className="divide-y max-h-80 overflow-auto">
            {files.map((fileItem) => (
              <div key={fileItem.id} className="p-3 flex items-center">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <span className="font-medium truncate mr-2">{fileItem.file.name}</span>
                    {getStatusIcon(fileItem.status)}
                  </div>
                  <div className="flex items-center">
                    <Progress value={fileItem.progress} className="h-2 flex-1 mr-2" />
                    <span className="text-xs text-gray-500 w-10">{fileItem.progress}%</span>
                  </div>
                  {fileItem.error && <p className="text-xs text-red-500 mt-1">{fileItem.error}</p>}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 text-gray-500 hover:text-red-500"
                  onClick={() => removeFile(fileItem.id)}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

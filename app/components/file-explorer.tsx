"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  FileText,
  FileImage,
  FileArchive,
  FileIcon as FilePdf,
  FileCode,
  FileIcon,
  MoreVertical,
  Download,
  Trash,
  Eye,
} from "lucide-react"

interface FileItem {
  id: string
  name: string
  type: string
  size: string
  lastModified: string
  file: File
}

interface FileExplorerProps {
  onFileSelect: (file: File) => void
}

export function FileExplorer({ onFileSelect }: FileExplorerProps) {
  // Datos de ejemplo
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "Informe_Anual_2023.pdf",
      type: "pdf",
      size: "2.4 MB",
      lastModified: "10/04/2023",
      file: new File([""], "Informe_Anual_2023.pdf", { type: "application/pdf" }),
    },
    {
      id: "2",
      name: "Presupuesto_Q2.xlsx",
      type: "xlsx",
      size: "1.8 MB",
      lastModified: "15/03/2023",
      file: new File([""], "Presupuesto_Q2.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
    },
    {
      id: "3",
      name: "Organigrama.png",
      type: "png",
      size: "0.5 MB",
      lastModified: "22/02/2023",
      file: new File([""], "Organigrama.png", { type: "image/png" }),
    },
    {
      id: "4",
      name: "Documentos_Legales.zip",
      type: "zip",
      size: "5.2 MB",
      lastModified: "05/01/2023",
      file: new File([""], "Documentos_Legales.zip", { type: "application/zip" }),
    },
    {
      id: "5",
      name: "Manual_Procedimientos.docx",
      type: "docx",
      size: "3.1 MB",
      lastModified: "18/12/2022",
      file: new File([""], "Manual_Procedimientos.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FilePdf className="text-red-500" />
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return <FileImage className="text-blue-500" />
      case "zip":
      case "rar":
        return <FileArchive className="text-yellow-500" />
      case "docx":
      case "doc":
      case "txt":
        return <FileText className="text-emerald-500" />
      case "js":
      case "html":
      case "css":
      case "jsx":
      case "tsx":
        return <FileCode className="text-purple-500" />
      default:
        return <FileIcon className="text-gray-500" />
    }
  }

  const handleDownload = (file: FileItem) => {
    // En una aplicación real, aquí se implementaría la descarga del archivo
    console.log(`Descargando ${file.name}`)
  }

  const handleDelete = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
  }

  const handleView = (file: FileItem) => {
    onFileSelect(file.file)
  }

  return (
    <div className="h-full flex flex-col border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
      <div className="p-4 border-b flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar archivos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Tamaño</TableHead>
              <TableHead>Última modificación</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {getFileIcon(file.type)}
                      <span className="ml-2">{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{file.type.toUpperCase()}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>{file.lastModified}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(file)}>
                          <Eye size={16} className="mr-2" />
                          Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(file)}>
                          <Download size={16} className="mr-2" />
                          Descargar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(file.id)} className="text-red-500">
                          <Trash size={16} className="mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No se encontraron archivos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

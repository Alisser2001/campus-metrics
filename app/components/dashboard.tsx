"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileExplorer } from "./file-explorer"
import { FileUpload } from "./file-upload"
import { FileViewer } from "./file-viewer"
import { Chatbot } from "./Chatbot"
import { Button } from "@/components/ui/button"
import { MessageSquare, X } from "lucide-react"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("explorer")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showChatbot, setShowChatbot] = useState(false)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleCloseViewer = () => {
    setSelectedFile(null)
  }

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot)
  }

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Sistema de Gestión de Archivos</h1>
      </header>

      <div className="flex-1 p-4 relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="explorer" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Explorador
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Subir Archivos
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4">
            <TabsContent value="explorer" className="h-full">
              <FileExplorer onFileSelect={handleFileSelect} />
            </TabsContent>

            <TabsContent value="upload" className="h-full">
              <FileUpload />
            </TabsContent>
          </div>
        </Tabs>

        {selectedFile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-950 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold">{selectedFile.name}</h2>
                <Button variant="ghost" size="icon" onClick={handleCloseViewer}>
                  <X size={24} />
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <FileViewer file={selectedFile} />
              </div>
            </div>
          </div>
        )}

        <Button
          className="fixed bottom-4 right-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
          size="icon"
          onClick={toggleChatbot}
        >
          <MessageSquare size={24} />
        </Button>

        {showChatbot && (
          <div className="fixed bottom-20 right-4 w-80 h-96 bg-white dark:bg-gray-950 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 z-40 flex flex-col">
            <Chatbot />
          </div>
        )}
      </div>
    </div>
  )
}

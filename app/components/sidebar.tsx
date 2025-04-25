"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Upload, Download, FolderOpen, MessageSquare, Settings, LogOut } from "lucide-react"


export function Sidebar() {

  const [isOpen] = useState(false)


  return (
    <>
      <div
        className={cn(
          "bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-screen transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-16",
         
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <div className={cn("flex items-center", !isOpen &&  "justify-center")}>
              <div className="bg-emerald-600 text-white p-2 rounded-md">
                <FileText size={24} />
              </div>
              {(isOpen) && (
                <h1 className={cn("ml-2 font-bold text-xl", !isOpen &&  "hidden")}>ArchiGest</h1>
              )}
            </div>
          </div>
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-2 py-2">
              <NavItem icon={<FolderOpen size={20} />} label="Archivos" isOpen={isOpen}  active />
              <NavItem icon={<Upload size={20} />} label="Subir" isOpen={isOpen}  />
              <NavItem icon={<Download size={20} />} label="Descargas" isOpen={isOpen}  />
              <NavItem icon={<MessageSquare size={20} />} label="Chatbot" isOpen={isOpen}  />
              <NavItem icon={<Settings size={20} />} label="Configuración" isOpen={isOpen}  />
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="ghost" className={cn("w-full justify-start", !isOpen &&  "justify-center")}>
              <LogOut size={20} className="mr-2" />
              <span className={cn(!isOpen &&  "hidden")}>Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isOpen: boolean
  active?: boolean
}

function NavItem({ icon, label, isOpen,  active }: NavItemProps) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      className={cn(
        "w-full justify-start",
        !isOpen && "justify-center",
        active && "bg-emerald-600 hover:bg-emerald-700 text-white",
      )}
    >
      {icon}
      <span className={cn("ml-2", !isOpen  && "hidden")}>{label}</span>
    </Button>
  )
}

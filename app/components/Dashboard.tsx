"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentList } from "./DocumentExplorer";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function Dashboard() {
    return (
        <div className="flex flex-col justify-start items-start w-full min-h-full p-8 overflow-y-auto">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="gap-y-4">
                    <h2 className="text-3xl font-bold text-black">Panel de Control</h2>
                    <p className="text-lg text-muted-foreground text-gray-600">Gestión de documentos presupuestales de la Universidad de Antioquia</p>
                </div>
            </div>

            <Tabs defaultValue="documents" className="w-full h-auto flex flex-col mt-8">
                <div className="flex flex-row justify-between items-center w-full h-auto">
                    <TabsList className="bg-gray-200 rounded-lg flex space-x-2 p-0">
                        <TabsTrigger
                            value="documents"
                            className="
                                    data-[state=active]:bg-[#107C4C]
                                    data-[state=active]:text-white
                                    transition-colors
                                    h-8
                                    cursor-pointer
                                    p-4
                                    "
                        >
                            Documentos
                        </TabsTrigger>
                        <TabsTrigger
                            value="recents"
                            className="
                                    data-[state=active]:bg-[#107C4C]
                                    data-[state=active]:text-white
                                    transition-colors
                                    h-8
                                    cursor-pointer
                                    p-4
                                    "
                        >
                            Actividad Reciente
                        </TabsTrigger>
                        <TabsTrigger
                            value="stadistics"
                            className="
                                    data-[state=active]:bg-[#107C4C]
                                    data-[state=active]:text-white
                                    transition-colors
                                    h-8
                                    cursor-pointer
                                    p-4
                                    "
                        >
                            Estadísticas
                        </TabsTrigger>
                    </TabsList>
                    <Button className="bg-[#0A5C36] hover:bg-[#107C4C] text-white h-10 cursor-pointer">
                        <FileText className="h-4 w-4" /> Nuevo documento
                    </Button>
                </div>

                <TabsContent value="documents" className="space-y-4">
                    <DocumentList />
                </TabsContent>

                <TabsContent value="recents" className="space-y-4">
                    <DocumentList />
                </TabsContent>

                <TabsContent value="stadistics" className="space-y-4">
                    <DocumentList />
                </TabsContent>
            </Tabs>
        </div>
    )
}

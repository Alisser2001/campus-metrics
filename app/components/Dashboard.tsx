"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentList } from "./DocumentExplorer";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { NewDocumentModal } from "./NewDocumentModal";
import { useState } from "react";

export function Dashboard({
    searchTerm,
    setSearchTerm,
    sidebarVisible,
    setSidebaVisible,
    toggleSort,
    sortDirection,
    sortedDocuments,
    loadData,
    selectedType,
    setSelectedType,
    selectedYear,
    setSelectedYear
}: any) {
    const [newDocModalVisible, setNewDocModalVisible] = useState(false);

    return (
        <div className="flex flex-col justify-start items-start w-full min-h-screen p-8 overflow-y-auto">
            {sidebarVisible ?
                <svg onClick={() => setSidebaVisible(false)} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-layout-sidebar-left-collapse"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M9 4v16" /><path d="M15 10l-2 2l2 2" /></svg> :
                <svg onClick={() => setSidebaVisible(true)} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-layout-sidebar-right-collapse"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M15 4v16" /><path d="M9 10l2 2l-2 2" /></svg>
            }
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-4">
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
                    <Button className="bg-[#0A5C36] hover:bg-[#107C4C] text-white h-10 cursor-pointer" onClick={() => setNewDocModalVisible(true)}>
                        <FileText className="h-4 w-4" /> Nuevo documento
                    </Button>
                </div>
                <NewDocumentModal open={newDocModalVisible} onOpenChange={setNewDocModalVisible} loadData={loadData} />
                <TabsContent value="documents" className="space-y-4">
                    <DocumentList
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        toggleSort={toggleSort}
                        sortDirection={sortDirection}
                        sortedDocuments={sortedDocuments}
                        selectedType={selectedType}
                        setSelectedType={setSelectedType}
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                    />
                </TabsContent>

                <TabsContent value="recents" className="space-y-4">

                </TabsContent>

                <TabsContent value="stadistics" className="space-y-4">

                </TabsContent>
            </Tabs>
        </div>
    )
}

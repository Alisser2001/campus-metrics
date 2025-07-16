"use client"

import { Download, MoreHorizontal, Trash2, Filter, Search, Calendar, ArrowUp, ArrowDown, Edit, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate } from "@/utils/date-utils"
import { documentService } from "@/utils/services/documents"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

export const downloadHelper = {
    async downloadFile(filePath: string, fileName: string) {
        const supabase = createClient();
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                throw new Error('Usuario no autenticado');
            }
            const { data, error } = await supabase.storage
                .from('campus-metrics')
                .createSignedUrl(filePath, 3600);

            if (error) throw error;

            const link = document.createElement("a");
            link.href = data.signedUrl;
            link.download = fileName;
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return true;
        } catch (error) {
            console.error('Error en la descarga:', error);
            return false;
        }
    }
};

export function DocumentList({
    searchTerm,
    setSearchTerm,
    toggleSort,
    sortDirection,
    sortedDocuments,
    selectedType,
    setSelectedType,
    selectedYear,
    setSelectedYear,
    loadData,
    setEditDocModalVisible,
    setSelectedEditDoc
}: any) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const totalItems = sortedDocuments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDocuments = sortedDocuments.slice(startIndex, endIndex);

    const handleDownload = async (filePath: string, fileName: string) => {
        const success = await downloadHelper.downloadFile(filePath, fileName);
        if (!success) {
            toast.error('Error al descargar el archivo');
        }
    };

    const handleDeleteDoc = async () => {
        if (!selectedDoc) return;
        try {
            await documentService.deleteDocument(selectedDoc.id);
            onClose();
            loadData();
        } catch (error) {
            console.error("Error al eliminar el documento:", error);
        }
    };
    const onClose = () => {
        setOpenModal(false);
        setSelectedDoc(null);
    };
    const onOpen = (doc: any) => {
        setOpenModal(true);
        setSelectedDoc(doc);
    }

    return (
        <>
            <Card className="flex flex-col w-full h-auto overflow-x-hidden overflow-y-auto border-1 border-gray-200 mt-4 bg-white">
                <CardHeader className="flex flex-col lg:flex-row items-center justify-between w-full">
                    <div className="relative flex-1 w-full lg:w-auto">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            type="search"
                            placeholder="Buscar en documentos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm((e.target.value))}
                            className="pl-9 bg-gray-50 border-1 border-gray-200 focus:border-gray-300"
                        />
                    </div>
                    <Select
                        value={selectedType}
                        onValueChange={(value) =>
                            setSelectedType(value)
                        }
                    >
                        <SelectTrigger className="w-full lg:w-48 border-1 border-gray-200 focus:border-gray-300 cursor-pointer">
                            <div className="flex items-center">
                                <Filter className="h-4 w-4 mr-2 " />
                                <SelectValue placeholder="Filtrar por" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="border-1 border-gray-200 focus:border-gray-300 bg-white">
                            <SelectItem value="all" className="cursor-pointer focus:bg-gray-200">Todos los tipos</SelectItem>
                            <SelectItem value="pdf" className="cursor-pointer focus:bg-gray-200">Documentos PDF</SelectItem>
                            <SelectItem value="excel" className="cursor-pointer focus:bg-gray-200">Hojas de cálculo</SelectItem>
                            <SelectItem value="word" className="cursor-pointer focus:bg-gray-200">Documentos Word</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={selectedYear}
                        onValueChange={(value) =>
                            setSelectedYear(value)
                        }
                    >
                        <SelectTrigger className="w-full lg:w-48 border-1 border-gray-200 focus:border-gray-300 cursor-pointer">
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Periodo" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="border-1 border-gray-200 focus:border-gray-300 bg-white">
                            <SelectItem className="cursor-pointer focus:bg-gray-200" value="all">Todos los periodos</SelectItem>
                            <SelectItem className="cursor-pointer focus:bg-gray-200" value="2025">2025</SelectItem>
                            <SelectItem className="cursor-pointer focus:bg-gray-200" value="2024">2024</SelectItem>
                            <SelectItem className="cursor-pointer focus:bg-gray-200" value="2023">2023</SelectItem>
                            <SelectItem className="cursor-pointer focus:bg-gray-200" value="2022">2022</SelectItem>
                            <SelectItem className="cursor-pointer focus:bg-gray-200" value="2021">2021</SelectItem>
                            <SelectItem className="cursor-pointer focus:bg-gray-200" value="2020">2020</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={toggleSort} className="border-1 border-gray-200 focus:border-gray-300 cursor-pointer w-full lg:w-auto">
                        {sortDirection === 'asc' ? (
                            <ArrowUp className="h-4 w-4" />
                        ) : (
                            <ArrowDown className="h-4 w-4" />
                        )}
                        Ordenar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border-1 border-gray-200 overflow-hidden">
                        {!currentDocuments || currentDocuments.length === 0 ?
                            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                    <FileText className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No hay documentos disponibles
                                </h3>
                                <p className="text-gray-500 max-w-md">
                                    Aún no has agregado ningún documento. Comienza subiendo tu primer archivo para organizar tu información.
                                </p>
                            </div>
                            :
                            <Table className="overflow-x-auto">
                                <TableHeader className="h-12 bg-[#33691e] text-white font-bold">
                                    <TableRow className="w-full h-full border-gray-200">
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Tamaño</TableHead>
                                        <TableHead>Actualizado por</TableHead>
                                        <TableHead>Ultima Actualizacion</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentDocuments.map((doc: any) => (
                                        <TableRow key={doc.id} className="border-gray-200">
                                            <TableCell className="font-medium">{doc.name}</TableCell>
                                            <TableCell>{doc.doc_categorie.categorie}</TableCell>
                                            <TableCell>{doc.doc_type.type}</TableCell>
                                            <TableCell>{doc.size_mb} MB</TableCell>
                                            <TableCell>{doc.updated_by_user.name ?? 'Sin Nombre'}</TableCell>
                                            <TableCell>{formatDate(doc.updated_at)}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        doc.doc_state.state === "approved"
                                                            ? "default"
                                                            : doc.doc_state.state === "review"
                                                                ? "default"
                                                                : doc.doc_state.state === "draft"
                                                                    ? "outline"
                                                                    : "secondary"
                                                    }
                                                    className={
                                                        doc.doc_state.state === "approved"
                                                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                            : doc.doc_state.state === "review"
                                                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                                                : doc.doc_state.state === "draft"
                                                                    ? "bg-gray-100 text-gray-800 hover:bg-gray-100 border-none"
                                                                    : "border-gray-300"
                                                    }
                                                >
                                                    {doc.doc_state.state === 'approved' ? 'Aprobado' :
                                                        doc.doc_state.state === 'review' ? 'Revisión' :
                                                            doc.doc_state.state === 'archived' ? 'Archivado' :
                                                                'Borrador'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                                                            <span className="sr-only">Acciones</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="border-1 border-gray-200 focus:border-gray-300 bg-white">
                                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            className="focus:bg-gray-200 cursor-pointer"
                                                            onClick={() => handleDownload(doc.doc_path, doc.name)}
                                                        >
                                                            <Download className="h-4 w-4" />
                                                            <span>Descargar</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="focus:bg-gray-200 cursor-pointer"
                                                            onClick={() => {
                                                                setSelectedEditDoc(doc);
                                                                setEditDocModalVisible(true);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            <span>Actualizar</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="focus:bg-gray-200 cursor-pointer text-red-600"
                                                            onClick={() => onOpen(doc)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span>Eliminar</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>}
                    </div>
                </CardContent>
                <div className="flex items-center justify-center lg:justify-between px-6 pt-4 border-t border-gray-200">
                    <div className="items-center text-sm text-gray-700 hidden lg:flex">
                        <span>
                            Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} documentos
                        </span>
                    </div>

                    <div className="flex items-center space-x-2 w-full lg:w-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="border-gray-200 cursor-pointer"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="border-gray-200 cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <Button
                                        key={pageNum}
                                        variant={currentPage === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={currentPage === pageNum ? "bg-[#33691e] text-white cursor-pointer" : "border-gray-200 cursor-pointer"}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="border-gray-200 cursor-pointer"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="border-gray-200 cursor-pointer"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-auto p-6 animate-fade-in">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Confirmar eliminación
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                            ¿Estás seguro de que deseas eliminar el documento
                            <span className="font-semibold">{selectedDoc?.name}</span>?
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm border rounded-md border-gray-300 hover:bg-gray-100 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteDoc}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

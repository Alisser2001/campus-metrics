"use client"

import { useState } from "react"
import { Download, MoreHorizontal, Eye, Edit, Trash2, Filter, Search, Calendar, ArrowUp, ArrowDown } from "lucide-react"
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

const documents = [
    {
        id: 1,
        name: "Presupuesto Anual 2023",
        category: "Presupuesto Anual",
        type: "PDF",
        size: "2.4 MB",
        uploadedBy: "Juan Pérez",
        uploadedAt: "15/03/2023",
        status: "Aprobado",
    },
    {
        id: 2,
        name: "Informe Financiero Q1",
        category: "Ejecución Presupuestal",
        type: "XLSX",
        size: "1.8 MB",
        uploadedBy: "María López",
        uploadedAt: "05/04/2023",
        status: "Revisión",
    },
    {
        id: 3,
        name: "Plan de Inversiones 2023-2024",
        category: "Auditoría y Control",
        type: "DOCX",
        size: "3.2 MB",
        uploadedBy: "Carlos Rodríguez",
        uploadedAt: "22/02/2023",
        status: "Aprobado",
    },
    {
        id: 4,
        name: "Ejecución Presupuestal Enero",
        category: "Informes Financieros",
        type: "PDF",
        size: "4.1 MB",
        uploadedBy: "Ana Martínez",
        uploadedAt: "10/02/2023",
        status: "Archivado",
    },
    {
        id: 5,
        name: "Proyección Gastos Facultades",
        category: "Informes Financieros",
        type: "XLSX",
        size: "2.7 MB",
        uploadedBy: "Pedro Gómez",
        uploadedAt: "18/03/2023",
        status: "Borrador",
    },
]

export function DocumentList() {
    const [searchTerm] = useState("");
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const filteredDocuments = documents.filter(
        (doc) =>
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const toggleSort = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    return (
        <Card className="flex flex-col w-full h-auto overflow-x-hidden overflow-y-auto border-1 border-gray-200 mt-4 bg-white">
            <CardHeader className="flex flex-row items-center justify-between w-full">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder="Buscar en documentos..."
                        className="pl-9 bg-gray-50 border-1 border-gray-200 focus:border-gray-300"
                    />
                </div>
                <Select>
                    <SelectTrigger className="w-48 border-1 border-gray-200 focus:border-gray-300 cursor-pointer">
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
                <Select>
                    <SelectTrigger className="w-48 border-1 border-gray-200 focus:border-gray-300 cursor-pointer">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Periodo" />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="border-1 border-gray-200 focus:border-gray-300 bg-white">
                        <SelectItem className="cursor-pointer focus:bg-gray-200" value="all">Todos los periodos</SelectItem>
                        <SelectItem className="cursor-pointer focus:bg-gray-200" value="2024">2024</SelectItem>
                        <SelectItem className="cursor-pointer focus:bg-gray-200" value="2023">2023</SelectItem>
                        <SelectItem className="cursor-pointer focus:bg-gray-200" value="2022">2022</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={toggleSort} className="border-1 border-gray-200 focus:border-gray-300 cursor-pointer">
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
                    <Table className="overflow-x-auto">
                        <TableHeader className="h-12 bg-[#107C4C] text-white font-bold">
                            <TableRow className="w-full h-full border-gray-200">
                                <TableHead>Nombre</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Tamaño</TableHead>
                                <TableHead>Subido por</TableHead>
                                <TableHead>Ultima Actualizacion</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocuments.map((doc) => (
                                <TableRow key={doc.id} className="border-gray-200">
                                    <TableCell className="font-medium">{doc.name}</TableCell>
                                    <TableCell>{doc.category}</TableCell>
                                    <TableCell>{doc.type}</TableCell>
                                    <TableCell>{doc.size}</TableCell>
                                    <TableCell>{doc.uploadedBy}</TableCell>
                                    <TableCell>{doc.uploadedAt}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                doc.status === "Aprobado"
                                                    ? "default"
                                                    : doc.status === "Revisión"
                                                        ? "default"
                                                        : doc.status === "Borrador"
                                                            ? "outline"
                                                            : "secondary"
                                            }
                                            className={
                                                doc.status === "Aprobado"
                                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                    : doc.status === "Revisión"
                                                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                                        : doc.status === "Borrador"
                                                            ? "bg-gray-100 text-gray-800 hover:bg-gray-100 border-none"
                                                            : "border-gray-300"
                                            }
                                        >
                                            {doc.status}
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
                                                <DropdownMenuItem className="focus:bg-gray-200 cursor-pointer">
                                                    <Eye className="h-4 w-4" />
                                                    <span>Ver</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="focus:bg-gray-200 cursor-pointer">
                                                    <Download className="h-4 w-4" />
                                                    <span>Descargar</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="focus:bg-gray-200 cursor-pointer">
                                                    <Edit className="h-4 w-4" />
                                                    <span>Editar</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="focus:bg-gray-200 cursor-pointer text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                    <span>Eliminar</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

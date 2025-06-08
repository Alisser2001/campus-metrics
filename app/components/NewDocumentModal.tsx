"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { categoryService } from "@/utils/services/categories"
import { typeService } from "@/utils/services/types"
import { stateService } from "@/utils/services/states"
import { toast } from "sonner"
import { documentService } from "@/utils/services/documents"

interface NewDocumentModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    loadData: () => void
}

export function NewDocumentModal({ open, onOpenChange, loadData }: NewDocumentModalProps) {
    const [docName, setDocName] = useState<any>(null);
    const [description, setDescription] = useState<any>(null);
    const [docCategory, setDocCategory] = useState<any>(null);
    const [docType, setDocType] = useState<any>(null);
    const [docState, setDocState] = useState<any>(null);
    const [docFile, setDocFile] = useState<any>(null);

    const [dragActive, setDragActive] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [documentCategories, setDocumentCategories] = useState<any[]>([]);
    const [documentTypes, setDocumentTypes] = useState<any[]>([]);
    const [documentStates, setDocumentStates] = useState<any[]>([]);

    async function loadLocalData() {
        try {
            const [categoriesData, typesData, statesData] = await Promise.all([
                categoryService.getCategories(),
                typeService.getTypes(),
                stateService.getStates()
            ])
            setDocumentCategories(categoriesData);
            setDocumentTypes(typesData);
            setDocumentStates(statesData);
        } catch (error) {
            console.error("Error al cargar datos:", error)
            toast("No se pudieron cargar los datos iniciales.");
        }
    };

    useEffect(() => {
        loadLocalData();
    }, []);

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
            handleFileSelect(file)
        }
    }

    const handleFileSelect = (file: File) => {
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        if (!allowedTypes.includes(file.type)) {
            setErrors({ ...errors, file: "Tipo de archivo no permitido" })
            return
        }
        if (file.size > 50 * 1024 * 1024) {
            setErrors({ ...errors, file: "El archivo no puede ser mayor a 50MB" })
            return
        }
        setDocFile(file);
        setErrors({ ...errors, file: "" });
        if (file.type === "application/pdf") {
            const typeSelected = documentTypes.find(e => e.type === 'PDF');
            setDocType(typeSelected);
        } else if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            const typeSelected = documentTypes.find(e => e.type === 'XLSX');
            setDocType(typeSelected);
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const typeSelected = documentTypes.find(e => e.type === 'DOCX');
            setDocType(typeSelected);
        }
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0])
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!docName) {
            newErrors.name = "El nombre del documento es requerido"
        }

        if (!docCategory) {
            newErrors.categoryId = "Debe seleccionar una categoría"
        }

        if (!docType) {
            newErrors.typeId = "Debe seleccionar un tipo de documento"
        }

        if (!docState) {
            newErrors.stateId = "Debe seleccionar un estado"
        }

        if (!docFile) {
            newErrors.file = "Debe seleccionar un archivo"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            await documentService.addDocument({
                name: docName || '',
                description,
                docCategorieId: docCategory.id,
                docCategoriePath: docCategory.folder_path,
                docTypeId: docType.id,
                docStateId: docState.id,
                file: docFile,
                updatedBy: 'f8945315-25c6-47ef-aadb-67df06d91d19'
            });
            setDocName(null);
            setDescription(null);
            setDocCategory(null);
            setDocType(null);
            setDocState(null);
            setDocFile(null);
            setErrors({});
            onOpenChange(false);

            toast("Documento creado exitosamente");
        } catch (error) {
            console.error("Error al crear documento:", error)
            toast("Error al crear el documento")
        } finally {
            setIsSubmitting(false);
            loadData();
        }
    }

    const removeFile = () => {
        setDocType(null);
        setDocFile(null);
        setErrors({ ...errors, file: "" })
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="h-auto max-w-2xl mx-auto bg-white border-1 border-gray-300 rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-green-800">Nuevo Documento</DialogTitle>
                    <DialogDescription>
                        Complete la información del documento que desea subir al repositorio central.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre del Documento *</Label>
                            <Input
                                id="name"
                                placeholder="Ej: Presupuesto General 2024"
                                value={docName ? docName : ''}
                                onChange={(e) => setDocName(e.target.value)}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción (Opcional)</Label>
                            <Textarea
                                id="description"
                                placeholder="Descripción detallada del documento..."
                                value={description ? description : ''}
                                onChange={(e: any) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full resize-none max-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Categoría *</Label>
                            <Select
                                value={docCategory?.id}
                                onValueChange={(value) =>
                                    setDocCategory(documentCategories.find((cat) => cat.id === value))
                                }
                            >
                                <SelectTrigger className={`w-full ${errors.categoryId ? "border-red-500" : ""}`}>
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-200">
                                    {documentCategories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.categorie}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Estado Inicial *</Label>
                            <Select
                                value={docState?.id}
                                onValueChange={(value) =>
                                    setDocState(documentStates.find((ste) => ste.id === value))
                                }
                            >
                                <SelectTrigger className={`w-full ${errors.stateId ? "border-red-500" : ""}`}>
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-200">
                                    {documentStates.map((state) => (
                                        <SelectItem key={state.id} value={state.id}>
                                            {state.state === 'approved' ? 'Aprobado' :
                                                state.state === 'review' ? 'Revisión' :
                                                    state.state === 'archived' ? 'Archivado' :
                                                        'Borrador'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.stateId && <p className="text-sm text-red-500">{errors.stateId}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Archivo del Documento *</Label>
                            {!docFile ? (
                                <Card
                                    className={`border-2 border-dashed transition-colors ${dragActive
                                        ? "border-green-500 bg-green-50"
                                        : errors.file
                                            ? "border-red-500"
                                            : "border-gray-300 hover:border-green-400"
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <CardContent className="relative flex flex-col items-center justify-center py-4">
                                        <Upload className="h-8 w-8 text-gray-400 mb-4" />
                                        <div className="text-center">
                                            <p className="text-lg font-medium text-gray-700 mb-2">
                                                Arrastra tu archivo aquí o haz clic para seleccionar
                                            </p>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Formatos soportados: PDF, Excel, Word.
                                            </p>
                                            <p className="text-xs text-gray-400">Tamaño máximo: 50MB</p>
                                        </div>
                                        <input
                                            type="file"
                                            onChange={handleFileInputChange}
                                            accept=".pdf,.xlsx,.docx,.xls,.doc"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-green-200 bg-green-50">
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="h-8 w-8 text-green-600" />
                                            <div>
                                                <p className="font-medium text-green-800">{'.' + docType.type}</p>
                                                <p className="text-sm text-green-600">{formatFileSize(docFile?.size)}</p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={removeFile}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                            {errors.file && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{errors.file}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button className="bg-red-700 hover:bg-red-800 cursor-pointer border-none text-white" type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-green-700 hover:bg-green-800 cursor-pointer text-white" disabled={isSubmitting}>
                            {isSubmitting ? "Creando..." : "Crear Documento"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent >
        </Dialog >
    )
}

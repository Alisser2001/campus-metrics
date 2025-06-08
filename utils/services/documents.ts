import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

function normalizeName(name: string) {
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9-_]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '')
        .toLowerCase();
}

export const documentService = {
    async getDocuments() {
        const { data, error } = await supabase
            .from('doc_info')
            .select(`
                *,
                doc_categorie (
                    id,
                    categorie,
                    folder_path,
                    quantity,
                    created_at
                ),
                doc_type (
                    id,
                    type,
                    created_at
                ),
                doc_state (
                    id,
                    state,
                    created_at
                ),
                updated_by_user:udea_user (
                    id,
                    name,
                    email,
                    phone,
                    created_at
                )
            `)
            .order('updated_at', { ascending: false })

        if (error) {
            console.error("Error al obtener documentos:", error)
            throw error
        }

        return data || []
    },

    async addDocument({
        name,
        description,
        docCategorieId,
        docCategoriePath,
        docTypeId,
        docStateId,
        file,
        updatedBy,
    }: {
        name: string;
        description?: string | null;
        docCategorieId: string;
        docCategoriePath: string;
        docTypeId: string;
        docStateId: string;
        file: File;
        updatedBy: string;
    }) {
        try {
            const normName = normalizeName(file.name);
            const filePath = `${docCategoriePath}/${normName}`;
            const { error: uploadError } = await supabase.storage
                .from('campus-metrics')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Error al subir archivo:', uploadError);
                throw uploadError;
            }

            const { error: insertError, data: inserted } = await supabase
                .from('doc_info')
                .insert([
                    {
                        name,
                        description: description || null,
                        doc_categorie_id: docCategorieId,
                        doc_type_id: docTypeId,
                        doc_state_id: docStateId,
                        size_mb: +(file.size / (1024 * 1024)).toFixed(2),
                        updated_by: updatedBy,
                        doc_path: filePath
                    },
                ])
                .select()
                .single();

            if (insertError) {
                console.error('Error al insertar documento:', insertError);
                await supabase.storage.from('documents').remove([filePath]);
                throw insertError;
            }
            return inserted;
        } catch (err) {
            console.error('Error general en addDocument:', err);
            throw err;
        }
    },
}

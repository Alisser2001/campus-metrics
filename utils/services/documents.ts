import { createClient } from '@/utils/supabase/client';
import { createClient as serverClient } from '../supabase/server';

const supabase = createClient();

/*function normalizeName(name: string) {
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9-_]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '')
        .toLowerCase();
}*/

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
                        doc_path: null
                    },
                ])
                .select()
                .single();

            if (insertError) {
                console.error('Error al insertar documento:', insertError);
                throw insertError;
            }

            const filePath = `${docCategoriePath}/${inserted.id}`;

            const { error: uploadError } = await supabase.storage
                .from('campus-metrics')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Error al subir archivo:', uploadError);
                await supabase.from('doc_info').delete().eq('id', inserted.id);
                throw uploadError;
            }

            const { error: updateError, data: updated } = await supabase
                .from('doc_info')
                .update({ doc_path: filePath })
                .eq('id', inserted.id)
                .select()
                .single();

            if (updateError) {
                console.error('Error al actualizar path del documento:', updateError);
                await supabase.storage.from('campus-metrics').remove([filePath]);
                await supabase.from('doc_info').delete().eq('id', inserted.id);
                throw updateError;
            }

            return updated;
        } catch (err) {
            console.error('Error general en addDocument:', err);
            throw err;
        }
    },

    async editDocument({
        documentId,
        name,
        description,
        docCategorieId,
        docCategoriePath,
        docTypeId,
        docStateId,
        file,
        updatedBy,
    }: {
        documentId: string;
        name?: string;
        description?: string | null;
        docCategorieId?: string;
        docCategoriePath?: string;
        docTypeId?: string;
        docStateId?: string;
        file?: File;
        updatedBy: string;
    }) {
        try {
            const { data: currentDoc, error: fetchError } = await supabase
                .from('doc_info')
                .select('*')
                .eq('id', documentId)
                .single();

            if (fetchError) {
                console.error('Error al obtener documento actual:', fetchError);
                throw fetchError;
            }

            if (!currentDoc) {
                throw new Error('Documento no encontrado');
            }

            let newFilePath = currentDoc.doc_path;
            let newSizeMb = currentDoc.size_mb;

            if (file) {
                const categoryPath = docCategoriePath || currentDoc.doc_categorie_path;
                newFilePath = `${categoryPath}/${documentId}`;
                newSizeMb = +(file.size / (1024 * 1024)).toFixed(2);

                const { error: uploadError } = await supabase.storage
                    .from('campus-metrics')
                    .upload(newFilePath, file, { upsert: true });

                if (uploadError) {
                    console.error('Error al subir nuevo archivo:', uploadError);
                    throw uploadError;
                }

                if (newFilePath !== currentDoc.doc_path) {
                    await supabase.storage
                        .from('campus-metrics')
                        .remove([currentDoc.doc_path]);
                }
            }
            else if (docCategoriePath && docCategoriePath !== currentDoc.doc_categorie_path) {
                const oldFilePath = currentDoc.doc_path;
                newFilePath = `${docCategoriePath}/${documentId}`;

                const { error: moveError } = await supabase.storage
                    .from('campus-metrics')
                    .move(oldFilePath, newFilePath);

                if (moveError) {
                    console.error('Error al mover archivo:', moveError);
                    throw moveError;
                }
            }

            const updateData: any = {
                updated_by: updatedBy,
                updated_at: new Date().toISOString(),
            };

            if (name !== undefined) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (docCategorieId !== undefined) updateData.doc_categorie_id = docCategorieId;
            if (docTypeId !== undefined) updateData.doc_type_id = docTypeId;
            if (docStateId !== undefined) updateData.doc_state_id = docStateId;

            if (file || (docCategoriePath && docCategoriePath !== currentDoc.doc_categorie_path)) {
                updateData.doc_path = newFilePath;
            }
            if (file) {
                updateData.size_mb = newSizeMb;
            }

            const { error: updateError, data: updated } = await supabase
                .from('doc_info')
                .update(updateData)
                .eq('id', documentId)
                .select()
                .single();

            if (updateError) {
                console.error('Error al actualizar documento:', updateError);
                throw updateError;
            }

            return updated;
        } catch (err) {
            console.error('Error general en editDocument:', err);
            throw err;
        }
    },

    async deleteDocument(id: string) {
        try {
            const { data: doc, error: fetchError } = await supabase
                .from('doc_info')
                .select('doc_path')
                .eq('id', id)
                .single();

            if (fetchError) {
                console.error('Error al obtener path del documento:', fetchError);
                throw fetchError;
            }

            const { error: removeError } = await supabase
                .storage
                .from('campus-metrics')
                .remove([doc.doc_path]);

            if (removeError) {
                console.error('Error al eliminar archivo:', removeError);
                throw removeError;
            }

            const { error: deleteError } = await supabase
                .from('doc_info')
                .delete()
                .eq('id', id);

            if (deleteError) {
                console.error('Error al eliminar registro:', deleteError);
                throw deleteError;
            }

            return true;
        } catch (err) {
            console.error('Error general en deleteDocument:', err);
            throw err;
        }
    }
}

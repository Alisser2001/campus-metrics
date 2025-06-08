import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const typeService = {
    async getTypes() {
        const { data, error } = await supabase.from("doc_type").select("*").order("type")

        if (error) {
            console.error("Error al obtener tipos:", error)
            throw error
        }

        return data || []
    }
}

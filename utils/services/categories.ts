import { createClient } from '@/utils/supabase/client';
import { checkAuthentication } from '../auth/helper';

const supabase = createClient();

export const categoryService = {
    async getCategories() {
        await checkAuthentication();

        const { data, error } = await supabase.from("doc_categorie").select("*").order("categorie")

        if (error) {
            console.error("Error al obtener categorías:", error)
            throw error
        }

        return data || []
    }
}

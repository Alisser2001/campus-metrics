import { createClient } from '@/utils/supabase/client';
import { checkAuthentication } from '../auth/helper';

const supabase = createClient();

export const stateService = {
    async getStates() {
        await checkAuthentication();

        const { data, error } = await supabase.from("doc_state").select("*").order("state")

        if (error) {
            console.error("Error al obtener estados:", error)
            throw error
        }

        return data || []
    }
}

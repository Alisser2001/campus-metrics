'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient();
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    const { error: authError } = await supabase.auth.signUp(data);
    if (authError) {
        return { error: authError.message }
    }

    const { error: insertError } = await supabase
        .from('udea_user')
        .insert({
            name: formData.get('username') as string,
            email: formData.get('email') as string,
            user_role_id: 'c6ef3a6e-5798-473f-85b6-e40ba58d4dba'
        });
    if (insertError) {
        await supabase.auth.signOut();
        return { error: insertError.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function logout() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/login')
}

export const checkAuthentication = async () => {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        throw new Error('Usuario no autenticado');
    }
    return user;
};
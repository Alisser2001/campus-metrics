import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export const useUserData = () => {
    const [session, setSession] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        const getSessionAndUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);

            if (session?.user?.email) {
                const { data: userData, error: userError } = await supabase
                    .from('udea_user')
                    .select('*')
                    .eq('email', session.user.email)
                    .single();

                if (userError) {
                    console.error('Error al obtener datos del usuario:', userError);
                }

                setUser(userData);
            }
            setLoading(false);
        };

        getSessionAndUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            if (session?.user?.email) {
                const { data: userData, error: userError } = await supabase
                    .from('udea_user')
                    .select('*')
                    .eq('email', session.user.email)
                    .single();

                if (userError) {
                    console.error('Error al obtener datos del usuario:', userError);
                }

                setUser(userData);
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return { session, user, loading };
};

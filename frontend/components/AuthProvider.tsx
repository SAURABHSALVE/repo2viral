"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        // 1. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth Event:', event);

            if (event === 'SIGNED_OUT') {
                router.push('/');
            }
        });

        // 2. Proactive check for broken sessions on mount
        const validateSession = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.warn("Session validation error:", error.message);
                    if (error.message.includes("Refresh Token") || error.message.includes("Not Found")) {
                        console.log("Invalid token detected. Forcing logout related cleanup.");
                        await supabase.auth.signOut();
                        router.push('/'); // Force user to login again
                    }
                }
            } catch (e) {
                console.error("Auth check failed completely:", e);
            }
        };

        validateSession();

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    return <>{children}</>;
}

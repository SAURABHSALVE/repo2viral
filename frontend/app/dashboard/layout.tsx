"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check auth
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push("/");
            } else {
                setLoading(false);
            }
        });
    }, [router]);

    if (loading) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 font-sans">
            {/* Background Grid Effect - persistent across dashboard */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none fixed z-0"></div>

            <Sidebar />
            <main className="pl-64 min-h-screen relative z-10">
                <div className="max-w-5xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

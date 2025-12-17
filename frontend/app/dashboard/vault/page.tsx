"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Lock, Calendar, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

interface HistoryItem {
    id: string;
    repo_url: string;
    created_at: string;
    tone_used: string;
    platform: string;
    generated_content: any;
}

export default function VaultPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPro, setIsPro] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Check Pro Status
            const { data: userData } = await supabase.from("user_usage").select("is_pro").eq("user_id", user.id).maybeSingle();
            if (userData) setIsPro(userData.is_pro);

            // Fetch History
            const { data: historyData, error: fetchError } = await supabase
                .from("content_history")
                .select("*")
                .order("created_at", { ascending: false });

            if (fetchError) {
                console.error("Error fetching history:", fetchError);
                setError(fetchError.message);
            }

            if (historyData) {
                setHistory(historyData);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const isOlderThan3Days = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 3;
    };

    if (loading) {
        return <div className="text-slate-400">Loading your vault...</div>;
    }

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Vault</h1>
                    <p className="text-slate-400">History of your viral generations.</p>
                </div>
                {!isPro && (
                    <a href="https://saurabhsalve.gumroad.com/l/rczekx" target="_blank" className="text-sm bg-indigo-600/20 text-indigo-400 px-4 py-2 rounded-lg border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors">
                        Upgrade for Full Access
                    </a>
                )}
            </header>

            <div className="grid gap-4">
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
                        <p>Failed to load history: {error}</p>
                    </div>
                )}

                {!error && history.length === 0 ? (
                    <div className="text-center p-12 bg-slate-900/30 rounded-2xl border border-slate-800">
                        <p className="text-slate-400">No history found. Generate some content!</p>
                        <Link href="/dashboard/generator" className="inline-block mt-4 text-indigo-400 hover:text-indigo-300">
                            Go to Generator &rarr;
                        </Link>
                    </div>
                ) : (
                    history.map((item) => {
                        const blurred = !isPro && isOlderThan3Days(item.created_at);

                        return (
                            <div
                                key={item.id}
                                className={`relative p-6 rounded-xl border transition-all ${blurred
                                    ? "bg-slate-900/20 border-slate-800 opacity-70 overflow-hidden"
                                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                                    }`}
                            >
                                <div className={blurred ? "blur-sm select-none" : ""}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-mono text-lg text-white truncate max-w-md">{item.repo_url}</h3>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs">
                                                    {item.tone_used || "Educator"}
                                                </span>
                                            </div>
                                        </div>
                                        <a href={item.repo_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>

                                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/50">
                                        <p className="text-slate-400 text-sm line-clamp-2">
                                            {item.generated_content.twitter_thread?.substring(0, 150)}...
                                        </p>
                                    </div>
                                </div>

                                {blurred && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm z-10">
                                        <div className="text-center bg-slate-900 p-6 rounded-xl border border-indigo-500/30 shadow-2xl">
                                            <Lock className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                                            <h3 className="text-white font-bold mb-1">History Locked</h3>
                                            <p className="text-slate-400 text-sm mb-4">Upgrade to access history older than 3 days.</p>
                                            <a
                                                href="https://saurabhsalve.gumroad.com/l/rczekx"
                                                target="_blank"
                                                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Upgrade Now <ArrowRight className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

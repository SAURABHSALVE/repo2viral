"use client";

import { useState, useEffect } from "react";
import RepoInput from "@/components/RepoInput";
import ResultDisplay from "@/components/ResultDisplay";
import TerminalLoader from "@/components/TerminalLoader";
import { useRepoGenerator } from "@/hooks/useRepoGenerator";
import { Lock, Sparkles, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function GeneratorPage() {
    const { generateContent, data, loading, logs, error, showPaywall, setShowPaywall } = useRepoGenerator();
    const [tone, setTone] = useState("Educator");
    const [isPro, setIsPro] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    useEffect(() => {
        const checkUserStatus = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                console.error("Auth session error:", error.message);
                // If the refresh token is invalid, we should probably force a logout
                if (error.message.includes("Refresh Token")) {
                    await supabase.auth.signOut();
                    window.location.href = "/";
                }
                return;
            }

            if (user) {
                const { data } = await supabase.from("user_usage").select("is_pro").eq("user_id", user.id).maybeSingle();
                if (data) {
                    setIsPro(data.is_pro);
                }
            }
        }
        checkUserStatus();
    }, []);

    const tones = [
        { id: "Educator", name: "The Educator", icon: "👨‍🏫", locked: false, description: "Step-by-step tutorials" },
        { id: "Hype Man", name: "The Hype Man", icon: "🚀", locked: true, description: "High energy launch posts" },
        { id: "Senior Dev", name: "The Senior Dev", icon: "👓", locked: true, description: "Architectural insights" },
    ];

    const handleToneSelect = (selectedId: string) => {
        const selected = tones.find(t => t.id === selectedId);
        if (selected?.locked && !isPro) {
            setShowUpgradeModal(true);
            return;
        }
        setTone(selectedId);
    };

    const [currentUrl, setCurrentUrl] = useState("");

    const handleAnalyze = (url: string) => {
        setCurrentUrl(url);
        generateContent(url, tone);
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Content Generator</h1>
                <p className="text-slate-400">Turn any GitHub repository into viral social media content.</p>
            </header>

            {/* Tone Selector */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300">Select Persona</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tones.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => handleToneSelect(t.id)}
                            className={`relative flex flex-col items-start p-4 rounded-xl border transition-all ${tone === t.id
                                ? "bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500"
                                : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                                }`}
                        >
                            <div className="flex items-center justify-between w-full mb-2">
                                <span className="text-2xl">{t.icon}</span>
                                {t.locked && !isPro && <Lock className="w-4 h-4 text-amber-500" />}
                            </div>
                            <span className={`font-semibold ${tone === t.id ? "text-white" : "text-slate-300"}`}>
                                {t.name}
                            </span>
                            <span className="text-xs text-slate-500 mt-1">{t.description}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Input */}
            <div className="bg-slate-900/30 p-8 rounded-2xl border border-slate-800/50">
                <RepoInput onAnalyze={handleAnalyze} isLoading={loading} />
            </div>

            {/* Loading & Results */}
            {loading && <TerminalLoader logs={logs} />}

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
                    {error}
                </div>
            )}

            {data && <ResultDisplay data={data} repoUrl={currentUrl} />}

            {/* Upgrade Modal (Reused Logic) */}
            {(showPaywall || showUpgradeModal) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl p-8 max-w-md w-full relative shadow-2xl shadow-indigo-500/20">
                        <button
                            onClick={() => { setShowPaywall(false); setShowUpgradeModal(false); }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-white">Unlock Premium Personas</h2>
                                <p className="text-slate-400">
                                    Upgrade to Pro to access "Hype Man" and "Senior Dev" personas alongside unlimited generations.
                                </p>
                            </div>

                            <a
                                href="https://saurabhsalve.gumroad.com/l/rczekx"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all transform hover:scale-105 text-center"
                            >
                                Upgrade for $15/mo
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

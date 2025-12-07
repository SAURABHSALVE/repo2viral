"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

interface RepoInputProps {
    onAnalyze: (url: str) => void;
    isLoading: boolean;
}

export default function RepoInput({ onAnalyze, isLoading }: RepoInputProps) {
    const [url, setUrl] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            onAnalyze(url);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            <form onSubmit={handleSubmit} className="relative flex items-center">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <span className="text-slate-500 font-mono text-sm">git clone</span>
                    </div>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://github.com/username/repo"
                        className="w-full bg-slate-900 border-2 border-slate-800 text-slate-200 pl-24 pr-32 py-4 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono shadow-xl placeholder:text-slate-600"
                        disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        <button
                            type="submit"
                            disabled={isLoading || !url}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing
                                </>
                            ) : (
                                <>
                                    Generate
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Twitter, Copy, Check, RefreshCw, ChevronDown, AlertCircle } from "lucide-react";

interface HistoryItem {
    id: string;
    repo_url: string;
    generated_content: any;
    tone_used: string;
    created_at: string;
}

function parseTweets(threadText: string): string[] {
    return threadText
        .split(/\n\n+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0 && t.length <= 500);
}

function TweetCard({ tweet, index, total }: { tweet: string; index: number; total: number }) {
    const [copied, setCopied] = useState(false);
    const charCount = tweet.length;
    const isOver = charCount > 280;

    const copy = async () => {
        await navigator.clipboard.writeText(tweet);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    return (
        <div className={`bg-slate-900 border rounded-xl p-5 group relative ${isOver ? "border-red-500/30" : "border-slate-800 hover:border-slate-700"}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-xs font-mono text-indigo-400 mt-1 shrink-0">{index + 1}/{total}</span>
                    <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap break-words">{tweet}</p>
                </div>
                <button
                    onClick={copy}
                    className="shrink-0 p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 transition-colors text-slate-400 hover:text-white"
                    title="Copy tweet"
                >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-2">
                    {isOver && (
                        <span className="text-xs text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Too long — split before posting
                        </span>
                    )}
                </div>
                <span className={`text-xs font-mono ${isOver ? "text-red-400" : charCount > 240 ? "text-yellow-400" : "text-slate-500"}`}>
                    {charCount}/280
                </span>
            </div>
        </div>
    );
}

export default function TwitterThreadPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [selected, setSelected] = useState<HistoryItem | null>(null);
    const [tweets, setTweets] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedAll, setCopiedAll] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/user/history");
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setHistory(data);
                    pickItem(data[0]);
                }
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };
        load();
    }, []);

    const pickItem = (item: HistoryItem) => {
        setSelected(item);
        try {
            const content = typeof item.generated_content === "string"
                ? JSON.parse(item.generated_content)
                : item.generated_content;
            const thread: string = content?.twitter_thread || "";
            setTweets(thread ? parseTweets(thread) : []);
        } catch {
            setTweets([]);
        }
    };

    const copyAll = async () => {
        const allText = tweets.map((t, i) => `${i + 1}/${tweets.length} ${t}`).join("\n\n---\n\n");
        await navigator.clipboard.writeText(allText);
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    const repoLabel = (url: string) => {
        try { return new URL(url).pathname.replace(/^\//, ""); } catch { return url; }
    };

    return (
        <div className="space-y-8 animate-fade-in-up max-w-3xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Twitter className="w-7 h-7 text-sky-400" />
                        Twitter Thread
                    </h1>
                    <p className="text-slate-400">Copy your AI-generated thread and paste directly into Twitter/X.</p>
                </div>
                {tweets.length > 0 && (
                    <button
                        onClick={copyAll}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-colors shrink-0"
                    >
                        {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedAll ? "Copied!" : "Copy All Tweets"}
                    </button>
                )}
            </div>

            {/* Repo selector */}
            {history.length > 1 && (
                <div className="relative w-full max-w-md">
                    <select
                        onChange={(e) => {
                            const item = history.find((h) => h.id === e.target.value);
                            if (item) pickItem(item);
                        }}
                        value={selected?.id}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-10"
                    >
                        {history.map((item) => (
                            <option key={item.id} value={item.id}>
                                {repoLabel(item.repo_url)} — {new Date(item.created_at).toLocaleDateString()}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="flex items-center gap-3 text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Loading your threads...
                </div>
            ) : tweets.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                    <Twitter className="w-10 h-10 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg font-medium mb-2">No thread yet</p>
                    <p className="text-slate-500 text-sm">
                        Go to <span className="text-indigo-400">Generator</span> and analyze a repository to create your first thread.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tweets.map((tweet, i) => (
                        <TweetCard key={i} tweet={tweet} index={i} total={tweets.length} />
                    ))}

                    <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-4 flex items-start gap-3 mt-6">
                        <Twitter className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-400">
                            <span className="text-sky-400 font-medium">Tip:</span> Post tweet 1, then reply to it with the rest to keep the thread connected. Pin tweet 1 for maximum reach.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

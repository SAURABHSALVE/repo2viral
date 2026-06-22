"use client";

import { useState, useEffect } from "react";
import { Image, Copy, Check, RefreshCw, ExternalLink } from "lucide-react";

interface CardConfig {
    repo: string;
    hook: string;
    stars: string;
    forks: string;
    lang: string;
}

function CopyField({ label, value }: { label: string; value: string }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>
            <div className="flex items-center gap-2">
                <code className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-indigo-300 font-mono break-all">
                    {value}
                </code>
                <button
                    onClick={copy}
                    className="shrink-0 p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 transition-colors text-slate-400 hover:text-white"
                >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}

export default function ReadmeCardPage() {
    const [config, setConfig] = useState<CardConfig>({
        repo: "my-org/my-repo",
        hook: "Open source project that does something amazing",
        stars: "0",
        forks: "0",
        lang: "",
    });
    const [loading, setLoading] = useState(true);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/user/history");
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    const item = data[0];
                    const content = typeof item.generated_content === "string"
                        ? JSON.parse(item.generated_content)
                        : item.generated_content;

                    const stats = content?.repo_stats || {};
                    const repoName = stats.name || item.repo_url?.split("github.com/")[1] || "my-org/my-repo";
                    const hook = content?.video_metadata?.hook_text || "Open source project";

                    setConfig({
                        repo: repoName,
                        hook: hook.slice(0, 60),
                        stars: String(stats.stars || 0),
                        forks: String(stats.forks || 0),
                        lang: stats.language || "",
                    });
                }
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };
        load();
    }, []);

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://repo2viral.com";

    const cardUrl = `${baseUrl}/api/card?${new URLSearchParams({
        repo: config.repo,
        hook: config.hook,
        stars: config.stars,
        forks: config.forks,
        ...(config.lang ? { lang: config.lang } : {}),
    }).toString()}`;

    const markdownEmbed = `[![${config.repo} - Repo2Viral Card](${cardUrl})](https://github.com/${config.repo})`;
    const htmlEmbed = `<a href="https://github.com/${config.repo}"><img src="${cardUrl}" alt="${config.repo}" /></a>`;

    return (
        <div className="space-y-8 animate-fade-in-up max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Image className="w-7 h-7 text-purple-400" />
                    README Card
                </h1>
                <p className="text-slate-400">
                    A dynamic card that shows your repo stats. Paste it into your README — every viewer becomes a potential user.
                </p>
            </div>

            {loading ? (
                <div className="flex items-center gap-3 text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Loading your repo data...
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Preview */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Preview</h3>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden">
                            {imgError ? (
                                <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
                                    Preview unavailable in dev — card works when deployed
                                </div>
                            ) : (
                                <img
                                    src={cardUrl}
                                    alt="Repo card preview"
                                    className="w-full rounded-xl"
                                    onError={() => setImgError(true)}
                                />
                            )}
                        </div>
                        <a
                            href={cardUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Open card URL directly
                        </a>
                    </div>

                    {/* Config + Embed codes */}
                    <div className="space-y-5">
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Customize</h3>

                        <div className="space-y-3">
                            {(["repo", "hook", "stars", "forks", "lang"] as (keyof CardConfig)[]).map((key) => (
                                <div key={key}>
                                    <label className="block text-xs font-medium text-slate-400 mb-1 capitalize">{key}</label>
                                    <input
                                        type="text"
                                        value={config[key]}
                                        onChange={(e) => {
                                            setImgError(false);
                                            setConfig((c) => ({ ...c, [key]: e.target.value }));
                                        }}
                                        placeholder={key === "lang" ? "TypeScript (optional)" : undefined}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-slate-800 space-y-4">
                            <CopyField label="Markdown (paste into README.md)" value={markdownEmbed} />
                            <CopyField label="HTML embed" value={htmlEmbed} />
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 flex items-start gap-3">
                <Image className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-400">
                    <span className="text-purple-400 font-medium">How it works:</span> The card is a live SVG served from your Repo2Viral deployment.
                    Anyone who views your README makes a request to <code className="text-xs text-purple-300 bg-purple-950/50 px-1 py-0.5 rounded">/api/card</code>, which renders the latest stats. Deploy to Vercel or Netlify to make it public.
                </p>
            </div>
        </div>
    );
}


"use client";

import { Player } from "@remotion/player";
import { RepoTrailer } from "@/remotion/RepoTrailer";
import { useState } from "react";
import { Download, Play, Volume2, VolumeX, Music, Lock } from "lucide-react";
import { z } from "zod";
import { repoTrailerSchema } from "@/remotion/RepoTrailer";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const musicTracks = [
    { name: "Energetic Upbeat", path: "/music/energetic-upbeat-background-music-377668 (1).mp3" },
    { name: "Upbeat Energetic", path: "/music/upbeat-energetic-background-music-337963.mp3" },
    { name: "Upbeat Classic", path: "/music/upbeat-music-398339.mp3" },
    { name: "Upbeat Modern", path: "/music/upbeat-music-433257.mp3" },
];

export default function VideoPreviewPage() {
    const router = useRouter();
    const [isPro, setIsPro] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // 1. Check Pro Status
                const { data: usage } = await supabase
                    .from('user_usage')
                    .select('is_pro')
                    .eq('user_id', session.user.id)
                    .single();

                setIsPro(usage?.is_pro || false);

                // 2. Fetch Latest Analysis Data
                try {
                    const { data: history, error } = await supabase
                        .from('content_history')
                        .select('generated_content')
                        .eq('user_id', session.user.id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .single();

                    if (history && history.generated_content) {
                        const content = history.generated_content;
                        // Handle both JSON object and stringified JSON
                        const parsed = typeof content === 'string' ? JSON.parse(content) : content;

                        const videoMeta = parsed.video_metadata || {};
                        const repoStats = parsed.repo_stats || {};

                        setInputProps(prev => ({
                            ...prev,
                            repoName: repoStats.name || "My Awesome Repo",
                            ownerAvatar: repoStats.avatar || prev.ownerAvatar,
                            hookText: videoMeta.hook_text || prev.hookText,
                            codeSnippet: videoMeta.code_snippet?.substring(0, 400) || prev.codeSnippet,
                            stats: {
                                stars: repoStats.stars || 0,
                                forks: repoStats.forks || 0
                            }
                        }));
                    }
                } catch (err) {
                    console.error("Error fetching history:", err);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    // Initial State (Will be overwritten by effect)
    const [inputProps, setInputProps] = useState<z.infer<typeof repoTrailerSchema>>({
        repoName: "Repo2Viral",
        ownerAvatar: "https://avatars.githubusercontent.com/u/1234567?v=4",
        hookText: "Turn your Code into Content Instantly.",
        codeSnippet: `
export function generateViralVideo() {
  const repo = analyze(codebase);
  return remotion.render(repo);
}
// 🚀 Viral ready in 30s!
        `.trim(),
        stats: { stars: 1250, forks: 42 },
        isMuted: false,
        musicTrack: musicTracks[0].path,
    });

    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!isPro) {
            alert("🔒 Premium Feature: Upgrade to Pro ($15/mo) to download watermark-free HD videos and unlock 30 AI posts!");
            router.push('/pricing');
            return;
        }

        try {
            setDownloading(true);
            const response = await fetch('/api/render-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inputProps,
                    compositionId: "RepoTrailer"
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Download failed");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `repo-trailer-${inputProps.repoName || 'video'}.mp4`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            alert("Download started!");
        } catch (e: any) {
            console.error(e);
            alert("Render failed: " + e.message);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Video Generator</h1>
                    <p className="text-slate-400">Preview your viral repository trailer.</p>
                </div>
                <button
                    onClick={handleDownload}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-lg transition-all w-full md:w-auto justify-center ${isPro
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 cursor-not-allowed"
                        }`}
                >
                    {downloading ? "Rendering..." : (
                        isPro ? <><Download className="w-5 h-5" /> Download MP4</> : <><Lock className="w-4 h-4" /> Unlock Download</>
                    )}
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Player Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-4">
                    <div className="aspect-video relative rounded-xl overflow-hidden bg-black">
                        <Player
                            component={RepoTrailer}
                            inputProps={inputProps}
                            durationInFrames={450}
                            fps={30}
                            compositionWidth={1920} // Landscape preview
                            compositionHeight={1080}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                            controls
                            autoPlay
                            loop
                        />
                    </div>
                    <div className="mt-4 text-center text-sm text-slate-500">
                        HD 1080p • 30 FPS • 15 Seconds
                    </div>
                </div>

                {/* Controls / Inputs Section (MVP) */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4">Customize Trailer</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Hook Text</label>
                            <input
                                type="text"
                                value={inputProps.hookText}
                                onChange={(e) => setInputProps({ ...inputProps, hookText: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Star Count</label>
                            <input
                                type="number"
                                value={inputProps.stats.stars}
                                onChange={(e) => setInputProps({ ...inputProps, stats: { ...inputProps.stats, stars: parseInt(e.target.value) || 0 } })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Audio Control</label>
                            <button
                                onClick={() => setInputProps(prev => ({ ...prev, isMuted: !prev.isMuted }))}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${inputProps.isMuted
                                    ? 'bg-red-500/10 border-red-500/30 text-red-500'
                                    : 'bg-green-500/10 border-green-500/30 text-green-500'}`}
                            >
                                {inputProps.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                <span className="text-sm font-medium">{inputProps.isMuted ? 'Muted' : 'Sound On'}</span>
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Background Music</label>
                            <div className="relative">
                                <Music className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                                <select
                                    value={inputProps.musicTrack}
                                    onChange={(e) => setInputProps(prev => ({ ...prev, musicTrack: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                                >
                                    {musicTracks.map(track => (
                                        <option key={track.path} value={track.path}>{track.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Code Snippet</label>
                            <textarea
                                value={inputProps.codeSnippet}
                                onChange={(e) => setInputProps({ ...inputProps, codeSnippet: e.target.value })}
                                rows={6}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <div className="flex items-center gap-2 text-yellow-500 text-sm bg-yellow-500/10 p-3 rounded-lg">
                            <Play className="w-4 h-4" />
                            <span>Changes update in real-time in the player!</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

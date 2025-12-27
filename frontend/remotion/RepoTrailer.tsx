
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate, random, Audio } from 'remotion';
import { z } from 'zod';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import "../app/globals.css";

export const repoTrailerSchema = z.object({
    repoName: z.string(),
    ownerAvatar: z.string(),
    hookText: z.string(),
    codeSnippet: z.string(),
    stats: z.object({
        stars: z.number(),
        forks: z.number(),
    }),
    isMuted: z.boolean().optional(),
    musicTrack: z.string().optional(),
});

const MovingGrid = () => {
    const frame = useCurrentFrame();
    const offset = (frame * 2) % 50;
    return (
        <AbsoluteFill style={{ transform: `translateY(${offset}px)` }}>
            <div className="w-full h-[120%] -mt-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:50px_50px]" />
        </AbsoluteFill>
    )
}

const FloatingParticle = ({ index }: { index: number }) => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    // Simple deterministic random for visual variety
    const x = ((index * 321) % 100) / 100 * width;
    const y = ((index * 123) % 100) / 100 * height;
    const size = ((index * 50) % 30) + 10;

    const translateY = Math.sin((frame + index * 10) / 30) * 20;

    return (
        <div
            className="absolute rounded-full bg-indigo-500/20 blur-xl"
            style={{
                left: x,
                top: y,
                width: size,
                height: size,
                transform: `translateY(${translateY}px)`
            }}
        />
    )
}

export const RepoTrailer: React.FC<z.infer<typeof repoTrailerSchema>> = ({
    repoName,
    ownerAvatar,
    hookText,
    codeSnippet,
    stats,
    isMuted = false,
    musicTrack = "/music/energetic-upbeat-background-music-377668 (1).mp3",
}) => {
    const frame = useCurrentFrame();
    const { fps, width, durationInFrames } = useVideoConfig();

    // Audio Logic
    const fadeOutStart = durationInFrames - 30;
    const baseVolume = interpolate(frame, [fadeOutStart, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const finalVolume = isMuted ? 0 : baseVolume;

    // Scene 1: The Hook (0-4s / 0-120 frames)
    const activeFrame1 = frame;
    const hookScale = spring({ frame: activeFrame1, fps, config: { damping: 12 } });
    const logoRotate = interpolate(activeFrame1, [0, 120], [0, 10]);

    // Typing effect logic
    const words = hookText.split(" ");

    // Scene 2: Code (4s-11s / 120-330 frames)
    const activeFrame2 = frame - 120;
    const windowScale = spring({ frame: activeFrame2, fps, config: { mass: 0.5, damping: 12 } });
    const windowTilt = interpolate(activeFrame2, [0, 210], [5, -5]); // Subtle 3D tilt
    const scrollY = interpolate(activeFrame2, [30, 180], [0, -600], { extrapolateRight: 'clamp' });

    // Scene 3: Stats (11s-15s / 330-450 frames)
    const activeFrame3 = frame - 330;
    const statsPop = spring({ frame: activeFrame3, fps, config: { stiffness: 200 } });
    const starCount = Math.floor(interpolate(activeFrame3, [0, 50], [0, stats.stars], { extrapolateRight: 'clamp' }));
    const glowOpacity = interpolate(activeFrame3, [0, 30, 60], [0, 0.5, 0]);

    return (
        <AbsoluteFill className="bg-[#020617] text-white font-sans overflow-hidden">
            {/* Dynamic Background */}
            <MovingGrid />
            <AbsoluteFill>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                {new Array(10).fill(0).map((_, i) => <FloatingParticle key={i} index={i} />)}
            </AbsoluteFill>

            {/* SCENE 1: THE HOOK */}
            <Sequence from={0} durationInFrames={120}>
                <AbsoluteFill className="flex flex-col items-center justify-center p-12 text-center z-10">
                    <div style={{ transform: `scale(${hookScale})` }} className="flex flex-col items-center gap-8">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
                            <img
                                src={ownerAvatar}
                                alt="Avatar"
                                className="relative w-40 h-40 rounded-full border-4 border-slate-900 shadow-2xl z-10"
                                style={{ transform: `rotate(${logoRotate}deg)` }}
                            />
                        </div>

                        <h1 className="text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-500 drop-shadow-2xl">
                            {repoName}
                        </h1>

                        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 max-w-4xl mt-4">
                            {words.map((word, i) => {
                                const wordFrame = activeFrame1 - 15 - (i * 5);
                                const opacity = interpolate(wordFrame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
                                const y = interpolate(wordFrame, [0, 10], [20, 0], { extrapolateRight: 'clamp' });
                                return (
                                    <span
                                        key={i}
                                        style={{ opacity, transform: `translateY(${y}px)` }}
                                        className="text-5xl font-bold text-indigo-400"
                                    >
                                        {word}
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* SCENE 2: THE CODE - 3D Perspective */}
            <Sequence from={120} durationInFrames={210}>
                <AbsoluteFill className="flex items-center justify-center z-20 perspective-[1000px]">
                    <div
                        style={{
                            transform: `scale(${windowScale}) rotateY(${windowTilt}deg)`,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                        className="w-[85%] h-[70%] bg-[#0f172a] rounded-xl border border-slate-700/50 overflow-hidden relative"
                    >
                        {/* Glass Header */}
                        <div className="h-12 bg-slate-900/80 backdrop-blur border-b border-slate-700/50 flex items-center px-6 gap-3">
                            <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
                            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
                            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
                            <div className="ml-auto flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                viral_generator.ts
                            </div>
                        </div>

                        {/* Code Content */}
                        <div className="p-8 overflow-hidden h-full relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f172a]/90 z-10 pointer-events-none" />
                            <div style={{ transform: `translateY(${scrollY}px)` }}>
                                <SyntaxHighlighter
                                    language="typescript"
                                    style={vscDarkPlus}
                                    customStyle={{ background: 'transparent', fontSize: '1.4rem', lineHeight: '1.6', fontFamily: 'JetBrains Mono, monospace' }}
                                    wrapLines={true}
                                    showLineNumbers={true}
                                >
                                    {codeSnippet}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* SCENE 3: STATS - Impact */}
            <Sequence from={330} durationInFrames={120}>
                <AbsoluteFill className="flex flex-col items-center justify-center z-30">
                    {/* Burst Background */}
                    <div
                        className="absolute inset-0 bg-indigo-500 mix-blend-screen"
                        style={{ opacity: glowOpacity }}
                    />

                    <div style={{ transform: `scale(${statsPop})` }} className="text-center relative">
                        <div className="absolute -inset-10 bg-indigo-600/30 blur-3xl rounded-full" />

                        <h2 className="relative text-slate-300 text-4xl font-bold uppercase tracking-[0.2em] mb-8 font-mono">
                            Open Source Impact
                        </h2>

                        <div className="relative flex items-center gap-8 justify-center">
                            <div className="flex flex-col items-center bg-slate-900/80 backdrop-blur-xl p-12 rounded-3xl border border-indigo-400/30 shadow-[0_0_50px_-12px_rgba(99,102,241,0.5)]">
                                <span className="text-9xl font-black text-white tabular-nums tracking-tighter">
                                    {starCount.toLocaleString()}
                                </span>
                                <div className="flex items-center gap-3 mt-4 px-6 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                                    <span className="text-3xl">⭐</span>
                                    <span className="text-2xl text-yellow-400 font-bold tracking-widest">STARS</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 opacity-80 animate-bounce">
                            <span className="text-slate-400 text-lg">🚀 Star this repository on GitHub</span>
                        </div>
                    </div>
                </AbsoluteFill>
            </Sequence>

            <Audio
                src={musicTrack}
                volume={finalVolume}
            />

        </AbsoluteFill>
    );
};

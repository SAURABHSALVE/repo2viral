"use client";

import { useState, useRef } from "react";
import { Download, Lock, CheckCircle, Code as CodeIcon, Share2, ArrowRight, AlertTriangle, XCircle, Star, Terminal, Zap } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// Shared Type Definition
export interface Slide {
    slide_number: number;
    type: "hook" | "problem" | "solution" | "code" | "cta" | "technical" | "feature";
    headline: string;
    body: string;
    visual_cue?: string;
    code_snippet?: string;
}

interface CarouselGeneratorProps {
    slides?: Slide[];
    repoUrl: string;
    isPro: boolean;
}

export default function CarouselGenerator({ slides, repoUrl, isPro }: CarouselGeneratorProps) {
    const [generating, setGenerating] = useState(false);
    const slidesRef = useRef<HTMLDivElement>(null);

    // Fallback if slides are undefined/empty
    const effectiveSlides = slides && slides.length > 0 ? slides : [
        { slide_number: 1, type: "hook", headline: "No Content Generated", body: "Regenerate to see the new carousel format." },
        { slide_number: 2, type: "problem", headline: "Old Way is Broken", body: "Manual creation takes too long." },
        { slide_number: 3, type: "solution", headline: "Automated Magic", body: "Use our tool to generate slides instantly." },
        { slide_number: 4, type: "cta", headline: "Try it Now", body: "Star on GitHub." }
    ] as Slide[];

    const generatePDF = async () => {
        if (!isPro) {
            alert("Upgrade to Pro to download high-quality LinkedIn Carousels!");
            window.open("https://saurabhsalve.gumroad.com/l/rczekx", "_blank");
            return;
        }

        if (!slidesRef.current) return;
        setGenerating(true);

        // Standard LinkedIn Aspect Ratio: 1080 x 1350 (4:5)
        const pdf = new jsPDF("p", "px", [1080, 1350]);
        const slideElements = slidesRef.current.querySelectorAll(".carousel-slide");

        try {
            for (let i = 0; i < slideElements.length; i++) {
                const element = slideElements[i] as HTMLElement;

                // Higher pixel ratio for better text clarity
                const dataUrl = await toPng(element, {
                    pixelRatio: 2,
                    backgroundColor: '#020617',
                    cacheBust: true,
                    style: {
                        transform: 'scale(1)',
                    }
                });

                if (i > 0) pdf.addPage();
                pdf.addImage(dataUrl, "PNG", 0, 0, 1080, 1350);
            }

            pdf.save("repo2viral-carousel.pdf");
        } catch (error) {
            console.error("PDF Gen Error:", error);
            alert("Failed to generate PDF. Check console.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Share2 className="w-5 h-5 text-indigo-400" />
                    LinkedIn Carousel Preview
                </h3>
                <button
                    onClick={generatePDF}
                    disabled={generating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all shadow-lg ${isPro
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
                        }`}
                >
                    {generating ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating...
                        </div>
                    ) : !isPro ? (
                        <>
                            <Lock className="w-4 h-4" /> Unlock PDF
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" /> Download PDF
                        </>
                    )}
                </button>
            </div>

            {/* Scrollable Preview - Visible on screen */}
            <div className="overflow-x-auto pb-8 custom-scrollbar">
                <div ref={slidesRef} className="flex gap-8 w-max min-w-full px-2">
                    {effectiveSlides.map((slide, i) => (
                        <SlideRenderer
                            key={i}
                            slide={slide}
                            repoUrl={repoUrl}
                            isLast={i === effectiveSlides.length - 1}
                        />
                    ))}
                </div>
            </div>

            <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Optimized for LinkedIn (1080 x 1350px)
            </p>
        </div>
    );
}

function SlideRenderer({ slide, repoUrl, isLast }: { slide: Slide, repoUrl: string, isLast: boolean }) {
    // Determine Icon
    let Icon = Terminal;
    if (slide.type === "hook") Icon = AlertTriangle;
    if (slide.type === "problem") Icon = XCircle;
    if (slide.type === "solution") Icon = CheckCircle;
    if (slide.type === "code") Icon = CodeIcon;
    if (slide.type === "cta") Icon = Star;
    if (slide.type === "technical") Icon = Terminal;
    if (slide.type === "feature") Icon = Zap;
    if (slide.visual_cue === "warning_icon") Icon = AlertTriangle;
    if (slide.visual_cue === "red_cross") Icon = XCircle;
    if (slide.visual_cue === "green_check") Icon = CheckCircle;
    if (slide.visual_cue === "star_badge") Icon = Star;
    if (slide.visual_cue === "code") Icon = CodeIcon;
    if (slide.visual_cue === "server") Icon = Terminal;

    // Theme Colors based on Type
    const getTheme = () => {
        switch (slide.type) {
            case 'problem': return 'text-red-400 bg-red-500/20';
            case 'solution': return 'text-green-400 bg-green-500/20';
            case 'cta': return 'text-yellow-400 bg-yellow-500/20';
            case 'technical': return 'text-pink-400 bg-pink-500/20';
            case 'feature': return 'text-cyan-400 bg-cyan-500/20';
            default: return 'text-indigo-400 bg-indigo-500/20';
        }
    };

    return (
        <SlideWrapper isLast={isLast}>
            {/* Background Effects */}
            {slide.type === 'hook' && <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />}
            {slide.type === 'problem' && <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />}
            {slide.type === 'solution' && <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-green-900/10 rounded-full blur-3xl pointer-events-none" />}
            {slide.type === 'technical' && <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />}
            {slide.type === 'feature' && <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-cyan-500/5 to-transparent pointer-events-none" />}

            <div className="relative z-10 h-full flex flex-col">
                {/* Top Icon Badge */}
                <div className="mb-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getTheme()} backdrop-blur-md ring-1 ring-white/10`}>
                        <Icon className="w-7 h-7" />
                    </div>
                </div>

                {/* Headline: Huge & Bold (text-4xl ~ 36px/40px, but scaled up visually) */}
                <h2 className="text-[42px] leading-[1.1] font-black text-white mb-6 tracking-tight drop-shadow-lg">
                    {slide.headline}
                </h2>

                {/* Body: Readable Gray (text-lg) */}
                <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-sm">
                    {slide.body}
                </p>

                {/* Code Window Logic (Only if code snippet is substantial) */}
                {(slide.type === 'code' || slide.type === 'technical') && slide.code_snippet && slide.code_snippet.length > 20 && (
                    <div className="mt-8 flex-1 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl ring-1 ring-white/5 relative">
                        {/* Fake Browser Header */}
                        <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono ml-auto">source.ts</span>
                        </div>
                        <div className="text-xs">
                            <SyntaxHighlighter
                                language="typescript"
                                style={vscDarkPlus}
                                customStyle={{ background: 'transparent', margin: 0, padding: '1rem' }}
                                wrapLines={true}
                                showLineNumbers={false}
                            >
                                {slide.code_snippet}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                )}

                {/* CTA Visual */}
                {slide.type === 'cta' && (
                    <div className="mt-auto">
                        <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4 shadow-xl">
                            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                                <Star className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white mb-1">Star on GitHub</div>
                                <div className="text-xs text-slate-400 font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                    {repoUrl.replace("https://github.com/", "")}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </SlideWrapper>
    )
}

function SlideWrapper({ children, isLast }: { children: React.ReactNode, isLast?: boolean }) {
    return (
        <div
            className="carousel-slide flex-shrink-0 bg-slate-950 p-10 flex flex-col relative overflow-hidden ring-1 ring-slate-800 shadow-2xl"
            style={{
                width: "432px",  // Preview scale (1080 * 0.4)
                height: "540px", // Preview scale (1350 * 0.4)
            }}
        >
            {/* Subtle Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light" />

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col">
                {children}
            </div>

            {/* Sticky Footer */}
            {!isLast && (
                <div className="absolute bottom-6 left-10 right-10 flex justify-between items-center opacity-30 mix-blend-screen pointer-events-none">
                    <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Repo2Viral</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">Swipe <ArrowRight className="w-3 h-3" /></span>
                </div>
            )}
        </div>
    );
}

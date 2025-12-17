"use client";

import { useState, useEffect } from "react";
import { Twitter, Linkedin, FileText, LayoutTemplate } from "lucide-react";
import PreviewCard from "./PreviewCard";
import CarouselGenerator, { Slide } from "./CarouselGenerator";
import { supabase } from "@/lib/supabase";

interface ContentData {
    twitter_thread: string;
    linkedin_post: string;
    blog_intro: string;
    slides?: Slide[]; // Validated JSON slides
}

interface ResultDisplayProps {
    data: ContentData;
    repoUrl?: string;
}

export default function ResultDisplay({ data, repoUrl = "https://github.com/example/repo" }: ResultDisplayProps) {
    const [activeTab, setActiveTab] = useState<"twitter" | "linkedin" | "blog" | "carousel">("twitter");
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        const checkPro = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Auth check failed:", error.message);
                return;
            }
            if (user) {
                const { data } = await supabase.from("user_usage").select("is_pro").eq("user_id", user.id).maybeSingle();
                if (data) setIsPro(data.is_pro);
            }
        };
        checkPro();
    }, []);

    const getContent = () => {
        switch (activeTab) {
            case "twitter":
                return data.twitter_thread;
            case "linkedin":
                return data.linkedin_post;
            case "blog":
                return data.blog_intro;
            default:
                return "";
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-12 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/50 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("twitter")}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === "twitter"
                        ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        }`}
                >
                    <Twitter className="w-4 h-4" />
                    Twitter Thread
                </button>
                <button
                    onClick={() => setActiveTab("linkedin")}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === "linkedin"
                        ? "border-blue-500 text-blue-400 bg-blue-500/10"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        }`}
                >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn Post
                </button>
                <button
                    onClick={() => setActiveTab("blog")}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === "blog"
                        ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        }`}
                >
                    <FileText className="w-4 h-4" />
                    Blog Intro
                </button>
                <button
                    onClick={() => setActiveTab("carousel")}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === "carousel"
                        ? "border-purple-500 text-purple-400 bg-purple-500/10"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        }`}
                >
                    <LayoutTemplate className="w-4 h-4" />
                    Carousel PDF (HQ)
                    {!isPro && <span className="text-[10px] bg-indigo-600 text-white px-1.5 rounded ml-1">PRO</span>}
                </button>
            </div>

            {/* Content Area */}
            <div className="p-8 min-h-[400px] bg-slate-900/30">
                {activeTab === "carousel" ? (
                    <CarouselGenerator
                        slides={data.slides}
                        repoUrl={repoUrl}
                        isPro={isPro}
                    />
                ) : (
                    <PreviewCard
                        platform={activeTab}
                        content={getContent() || "No content generated yet."}
                    />
                )}
            </div>
        </div>
    );
}

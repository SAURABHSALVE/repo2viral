"use client";

import { useState } from "react";
import { Copy, Check, Twitter, Linkedin, FileText } from "lucide-react";

interface ContentData {
    twitter_thread: string;
    linkedin_post: string;
    blog_intro: string;
}

interface ResultDisplayProps {
    data: ContentData;
}

export default function ResultDisplay({ data }: ResultDisplayProps) {
    const [activeTab, setActiveTab] = useState<"twitter" | "linkedin" | "blog">("twitter");
    const [copied, setCopied] = useState(false);

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

    const handleCopy = async () => {
        await navigator.clipboard.writeText(getContent());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-12 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/50">
                <button
                    onClick={() => setActiveTab("twitter")}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${activeTab === "twitter"
                            ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                            : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        }`}
                >
                    <Twitter className="w-4 h-4" />
                    Twitter Thread
                </button>
                <button
                    onClick={() => setActiveTab("linkedin")}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${activeTab === "linkedin"
                            ? "border-blue-500 text-blue-400 bg-blue-500/10"
                            : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        }`}
                >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn Post
                </button>
                <button
                    onClick={() => setActiveTab("blog")}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${activeTab === "blog"
                            ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                            : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        }`}
                >
                    <FileText className="w-4 h-4" />
                    Blog Intro
                </button>
            </div>

            {/* Content Area */}
            <div className="relative p-6 min-h-[400px]">
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border border-slate-700 hover:border-slate-600"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-emerald-400" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Copy
                            </>
                        )}
                    </button>
                </div>

                <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed">
                        {getContent() || "No content generated yet."}
                    </pre>
                </div>
            </div>
        </div>
    );
}

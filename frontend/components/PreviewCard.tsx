"use client";

import { Twitter, Linkedin, Heart, MessageCircle, Repeat, Share, MoreHorizontal, Copy, Check } from "lucide-react";
import { useState } from "react";

interface PreviewCardProps {
    platform: "twitter" | "linkedin" | "blog";
    content: string;
}

export default function PreviewCard({ platform, content }: PreviewCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (platform === "twitter") {
        return (
            <div className="bg-black border border-slate-800 rounded-xl overflow-hidden max-w-lg mx-auto shadow-2xl">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-slate-700"></div>
                        <div className="leading-tight">
                            <p className="font-bold text-white">You <span className="text-slate-500 font-normal">@developer</span></p>
                        </div>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
                <div className="p-4 text-white whitespace-pre-wrap text-lg">
                    {content}
                </div>
                <div className="p-3 border-t border-slate-800 flex items-center justify-between text-slate-500 px-8">
                    <MessageCircle className="w-5 h-5" />
                    <Repeat className="w-5 h-5" />
                    <Heart className="w-5 h-5" />
                    <Share className="w-5 h-5" />
                </div>
            </div>
        );
    }

    if (platform === "linkedin") {
        return (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden max-w-lg mx-auto shadow-xl text-slate-900">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-slate-300"></div>
                        <div className="leading-tight">
                            <p className="font-bold text-sm">You</p>
                            <p className="text-xs text-slate-500">Software Engineer</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            title="Copy to clipboard"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <MoreHorizontal className="w-5 h-5 text-slate-500" />
                    </div>
                </div>
                <div className="p-4 text-sm whitespace-pre-wrap">
                    {content}
                </div>
                <div className="p-2 border-t border-slate-100 flex items-center justify-around text-slate-500">
                    <div className="flex items-center gap-1 cursor-pointer hover:bg-slate-50 p-2 rounded"><Heart className="w-4 h-4" /> Like</div>
                    <div className="flex items-center gap-1 cursor-pointer hover:bg-slate-50 p-2 rounded"><MessageCircle className="w-4 h-4" /> Comment</div>
                    <div className="flex items-center gap-1 cursor-pointer hover:bg-slate-50 p-2 rounded"><Repeat className="w-4 h-4" /> Repost</div>
                    <div className="flex items-center gap-1 cursor-pointer hover:bg-slate-50 p-2 rounded"><Share className="w-4 h-4" /> Send</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative">
            <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                title="Copy to clipboard"
            >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <div className="prose prose-invert max-w-none">
                {content}
            </div>
        </div>
    )
}

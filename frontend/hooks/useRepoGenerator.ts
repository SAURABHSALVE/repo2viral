"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface ContentData {
    twitter_thread: string;
    linkedin_post: string;
    blog_intro: string;
}

export function useRepoGenerator() {
    const [data, setData] = useState<ContentData | null>(null);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showPaywall, setShowPaywall] = useState(false);

    const logMessages = [
        "> Initializing connection...",
        "> Fetching repository data...",
        "> Analyzing codebase structure...",
        "> Drafting viral content...",
        "> Finalizing output..."
    ];

    const generateContent = async (url: string) => {
        setLoading(true);
        setError(null);
        setData(null);
        setLogs([]);
        setShowPaywall(false);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
            setError("Please login to generate content.");
            setLoading(false);
            return;
        }

        // Timer for simulating logs
        let step = 0;
        const intervalId = setInterval(() => {
            if (step < logMessages.length) {
                setLogs(prev => [...prev, logMessages[step]]);
                step++;
            }
        }, 800);

        try {
            const response = await fetch("http://127.0.0.1:8000/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url,
                    user_id: user.id,
                    email: user.email
                }),
            });

            if (response.status === 403) {
                setShowPaywall(true);
                throw new Error("Free limit reached");
            }

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Failed to analyze repository");
            }

            const result = await response.json();
            setData(result);
        } catch (err: any) {
            if (err.message !== "Free limit reached") {
                setError(err.message);
            }
        } finally {
            clearInterval(intervalId);
            setLoading(false);
        }
    };

    return { generateContent, data, loading, logs, error, showPaywall, setShowPaywall };
}

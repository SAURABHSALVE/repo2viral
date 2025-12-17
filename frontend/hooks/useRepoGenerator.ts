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

    const generateContent = async (url: string, tone: string) => {
        setLoading(true);
        setError(null);
        setData(null);
        setLogs([]);
        setShowPaywall(false);

        // Get current session for token
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error("Session error:", sessionError.message);
            if (sessionError.message.includes("Refresh Token")) {
                setError("Session expired. Please Log Out and Log In again.");
                // Optionally force logout here, but maybe better to let user do it so they see the message
            } else {
                setError(`Auth Error: ${sessionError.message}`);
            }
            setLoading(false);
            return;
        }

        if (!session || !session.user) {
            setError("Please login to generate content.");
            setLoading(false);
            return;
        }

        const token = session.provider_token;
        if (!token) {
            setError("GitHub access expired. Please Sign Out and Log In again to refresh permissions.");
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
            // Use environment variable or default to localhost
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

            // Remove trailing slash if present to avoid //analyze
            const baseUrl = backendUrl.replace(/\/$/, "");

            const response = await fetch(`${baseUrl}/api/analyze-repo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    repo_url: url,
                    github_token: token,
                    user_id: session.user.id,
                    email: session.user.email,
                    tone
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

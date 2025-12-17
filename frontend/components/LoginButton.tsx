"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { LogIn, LogOut, Github, X, Loader2, AlertCircle } from "lucide-react";

export default function LoginButton() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                setShowModal(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    if (loading) return null;

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400 font-mono hidden sm:inline-block">
                    {user.user_metadata?.full_name || user.email}
                </span>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/20"
            >
                <LogIn className="w-4 h-4" />
                Login / Signup
            </button>

            {showModal && mounted && createPortal(
                <AuthModal onClose={() => setShowModal(false)} />,
                document.body
            )}
        </>
    );
}

function AuthModal({ onClose }: { onClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (provider: 'github' | 'google') => {
        setIsLoading(true);
        setError("");
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}`,
                    scopes: 'repo'
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
                    <h2 className="text-lg font-bold text-white">
                        Welcome to Repo2Viral
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    <p className="text-slate-400 text-sm mb-6 text-center">
                        Sign in to start generating viral content.
                    </p>

                    {/* Messages */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex gap-3 text-red-400 text-sm mb-6 animate-in fade-in">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Github Button */}
                        <button
                            onClick={() => handleLogin('github')}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 bg-[#24292F] hover:bg-[#24292F]/90 text-white font-bold py-3 rounded-xl transition-all group disabled:opacity-70 border border-slate-700"
                        >
                            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>Continue with GitHub</span>
                        </button>

                        {/* Google Button */}
                        <button
                            onClick={() => handleLogin('google')}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 rounded-xl transition-all group disabled:opacity-70"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span>Continue with Google</span>
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center gap-2 mt-6 text-slate-500 text-sm animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Redirecting...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

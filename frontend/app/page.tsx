"use client";

import { useEffect, useState } from "react";
import RepoInput from "@/components/RepoInput";
import ResultDisplay from "@/components/ResultDisplay";
import TerminalLoader from "@/components/TerminalLoader";
import LoginButton from "@/components/LoginButton";
import { useRepoGenerator } from "@/hooks/useRepoGenerator";
import { Sparkles, Terminal, X, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const { generateContent, data, loading, logs, error, showPaywall, setShowPaywall } = useRepoGenerator();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">

      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,#3730a3,transparent)] opacity-20 pointer-events-none"></div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Repo2Viral</span>
        </div>
        <LoginButton />
      </nav>

      <div className="relative max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* Hero Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-slate-900/80 rounded-full border border-slate-800 mb-4 backdrop-blur-sm">
            <span className="flex items-center gap-2 px-3 py-1 text-xs font-mono text-indigo-400">
              <Terminal className="w-3 h-3" />
              <span>v1.0.0-beta</span>
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-4">
            Repo<span className="text-indigo-500">2</span>Viral
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Turn your GitHub repositories into viral social media content using AI.
          </p>
        </div>

        {/* Input Section */}
        {!loading && !data && (
          <div className="flex flex-col items-center space-y-4">
            {user ? (
              <RepoInput onAnalyze={generateContent} isLoading={loading} />
            ) : (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center max-w-md">
                <Lock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Login Required</h3>
                <p className="text-slate-400 mb-6">Please login with GitHub to start generating content.</p>
                {/* The login button in navbar covers this, but visual cue is good */}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <TerminalLoader logs={logs} />
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-top-2">
            <p className="font-mono">Error: {error}</p>
          </div>
        )}

        {/* Results Section */}
        {data && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
            <ResultDisplay data={data} />

            <div className="text-center">
              <button
                onClick={() => window.location.reload()}
                className="text-slate-500 hover:text-indigo-400 transition-colors text-sm"
              >
                Generate Another
              </button>
            </div>
          </div>
        )}

        {/* Paywall Modal */}
        {showPaywall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl p-8 max-w-md w-full relative shadow-2xl shadow-indigo-500/20">
              <button
                onClick={() => setShowPaywall(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">Upgrade to Pro</h2>
                  <p className="text-slate-400">
                    You've used your free credit. Upgrade now to generate unlimited viral content.
                  </p>
                </div>

                <ul className="text-left space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckIcon /> Unlimited generations
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckIcon /> Advanced AI models (GPT-4)
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckIcon /> Priority support
                  </li>
                </ul>

                <button className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all transform hover:scale-105">
                  Upgrade for $9/mo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-24 text-center text-slate-600 text-sm font-mono pb-8">
          <p className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Powered by OpenAI GPT-4o & Next.js
          </p>
        </div>

      </div>
    </main>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

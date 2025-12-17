"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginButton from "@/components/LoginButton";
import Footer from "@/components/Footer";
import { Sparkles, Terminal, ArrowRight, Zap, Share2, FileText, Code2, Cpu } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        router.push("/dashboard/generator");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        router.push("/dashboard/generator");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">

      {/* Hero Section Background */}
      <div className="absolute inset-0 h-[100vh] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute inset-0 h-[100vh] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Repo2Viral</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="hidden md:block text-slate-400 hover:text-white transition-colors text-sm font-medium">Features</a>
            <a href="#how-it-works" className="hidden md:block text-slate-400 hover:text-white transition-colors text-sm font-medium">How it Works</a>
            <div className="h-4 w-px bg-slate-800 hidden md:block" />
            <LoginButton />
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-slate-900/80 rounded-full border border-slate-800 mb-8 backdrop-blur-sm ring-1 ring-white/10 animate-fade-in-up">
            <span className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-indigo-400">
              <Sparkles className="w-3 h-3" />
              <span>v1.0 is Live</span>
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-8 leading-tight">
            Code to Content, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              In Seconds.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Stop wasting hours writing threads. Our AI analyzes your GitHub repo and generates viral Twitter threads, LinkedIn posts, and Blogs instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!user ? (
              <button className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40">
                <span className="flex items-center gap-2">
                  Get Started for Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 blur-lg group-hover:opacity-50 transition opacity" />
              </button>
            ) : (
              <button
                onClick={() => router.push("/dashboard/generator")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-indigo-500/25"
              >
                Go to Dashboard &rarr;
              </button>
            )}
            <a href="#demo" className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full font-medium text-lg transition-all border border-slate-800">
              View Demo
            </a>
          </div>
        </div>
      </div>

      {/* Stats / Social Proof */}
      <div className="border-y border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Repos Analyzed", value: "10,000+" },
            { label: "Tweets Generated", value: "50k+" },
            { label: "LinkedIn Posts", value: "25k+" },
            { label: "Developer Users", value: "2,500+" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything you need to go viral</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">We handle the boring stuff—reading code and writing copy—so you can focus on building.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Share2 className="w-6 h-6 text-indigo-400" />,
                title: "Multi-Platform Ready",
                desc: "Generate tailored content for Twitter, LinkedIn, and Technical Blogs simultaneously from a single analysis."
              },
              {
                icon: <Code2 className="w-6 h-6 text-purple-400" />,
                title: "Deep Code Understanding",
                desc: "Our AI doesn't just read the README. It scans your file structure, dependencies, and code comments for accuracy."
              },
              {
                icon: <Zap className="w-6 h-6 text-yellow-400" />,
                title: "Instant Carousels",
                desc: "Turn your repository into a beautiful, exportable PDF carousel for LinkedIn with zero design skills needed."
              },
              {
                icon: <Cpu className="w-6 h-6 text-cyan-400" />,
                title: "Technical Accuracy",
                desc: "No more hallucinations. We cite specific files and lines of code to back up every claim in your content."
              },
              {
                icon: <FileText className="w-6 h-6 text-emerald-400" />,
                title: "SEO Optimized Blogs",
                desc: "Get 1,000+ word technical tutorials with code snippets, headers, and meta tags ready for your engineering blog."
              },
              {
                icon: <Sparkles className="w-6 h-6 text-pink-400" />,
                title: "Tone Customization",
                desc: "Choose your persona: The 'Senior Architect', The 'Hype Man', or The 'Helpful Educator'."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Step */}
      <section id="how-it-works" className="py-24 bg-slate-900/20 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">From Repo to Revenue in 3 Steps</h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Paste URL", desc: "Simply paste your GitHub repository URL. We support public and private repos." },
                  { step: "02", title: "AI Analysis", desc: "Our engine scans your codebase to understand the 'What', 'Why', and 'How'." },
                  { step: "03", title: "Publish", desc: "Review the generated threads, modify the tone, and hit publish." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-4xl font-black text-slate-800">{item.step}</span>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-3xl rounded-full" />
              <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500">
                {/* Mock UI Code Window */}
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-3 font-mono text-sm">
                  <div className="text-slate-500"># Analysis Complete</div>
                  <div className="flex gap-2">
                    <span className="text-purple-400">const</span>
                    <span className="text-blue-400">viralPost</span>
                    <span className="text-slate-400">=</span>
                    <span className="text-green-400">await</span>
                    <span className="text-yellow-400">generate</span>
                    <span className="text-slate-400">('your-repo');</span>
                  </div>
                  <div className="pl-4 border-l-2 border-indigo-500/30 text-slate-400 text-xs">
                    "🚀 Just built a new SaaS using Next.js 14 and Supabase..."
                  </div>
                  <div className="bg-indigo-500/10 text-indigo-300 p-3 rounded border border-indigo-500/20 mt-4">
                    ✨ Twitter Thread Ready (8 tweets)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/20 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to showcase your work?</h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">Join thousands of developers who are building in public without the burnout.</p>
          <button
            onClick={() => user ? router.push("/dashboard/generator") : document.querySelector('button')?.click()}
            className="bg-white text-slate-950 hover:bg-slate-200 px-10 py-4 rounded-full font-bold text-xl transition-all shadow-xl shadow-white/10"
          >
            Start Generating Now
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}



import React, { useState } from 'react';
import Footer from '@/components/Footer';
import { Terminal, Check, Star, Zap, Video, TrendingUp, Users, Menu, X } from 'lucide-react';

export default function PricingPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Simple Navbar */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <Terminal className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">Repo2Viral</span>
                    </div>

                    {/* Desktop Link */}
                    <a href="/" className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        &larr; Back to Home
                    </a>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-slate-400 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Nav Overlay */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-slate-950 border-b border-slate-800 p-6 shadow-2xl animate-fade-in-up">
                        <a href="/" className="block text-lg font-medium text-slate-400 hover:text-white">
                            &larr; Back to Home
                        </a>
                    </div>
                )}
            </nav>

            <div className="relative pt-32 pb-20 px-6">
                {/* Background Effects */}
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
                </div>

                <div className="max-w-7xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
                        <Star className="w-4 h-4 fill-current" />
                        <span>Launch Offer: 50% OFF for Early Birds</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
                        Stop Coding in Silence. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                            Start Going Viral.
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Developers who market their work earn <strong className="text-white">2.5x more</strong> than those who don't.
                        Don't let your hard work rot in a private repo. Turn it into a content machine.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                    {/* Free Plan */}
                    <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 transition-all animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h3 className="text-xl font-bold text-white mb-2">Hobbyist</h3>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-4xl font-black text-white">$0</span>
                            <span className="text-slate-500">/ forever</span>
                        </div>
                        <p className="text-slate-400 mb-8 h-12">
                            Perfect for trying out the power of AI content generation.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-slate-300">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>2 Free Repo Analyses</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>Basic Twitter Threads</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>Preview Video Trailer</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-500">
                                <Lock className="w-5 h-5 flex-shrink-0" />
                                <span>No HD Video Download</span>
                            </li>
                        </ul>
                        <a href="/dashboard/generator" className="block w-full py-4 text-center rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all">
                            Start for Free
                        </a>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative p-8 rounded-3xl border border-indigo-500/50 bg-slate-900/80 shadow-2xl shadow-indigo-500/20 scale-105 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                            Most Popular
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Pro Creator</h3>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-5xl font-black text-white">$15</span>
                            <span className="text-slate-500">/ month</span>
                        </div>
                        <p className="text-indigo-200 mb-8 h-12">
                            For developers serious about building a personal brand and shipping products.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-white font-medium">
                                <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                                <span>30 AI Posts / Month (Twitter, LinkedIn, Blog)</span>
                            </li>
                            <li className="flex items-center gap-3 text-white font-medium">
                                <Video className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                <span>Unlimited HD Video Downloads (MP4)</span>
                            </li>
                            <li className="flex items-center gap-3 text-white font-medium">
                                <Check className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                                <span>Remove Watermarks</span>
                            </li>
                            <li className="flex items-center gap-3 text-white font-medium">
                                <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span>Viral Stats Dashboard</span>
                            </li>
                        </ul>
                        <a
                            href="https://saurabhsalve.gumroad.com/l/repo2viral"
                            target="_blank"
                            className="block w-full py-4 text-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-[1.02]"
                        >
                            Become a Creator ($15)
                        </a>
                        <p className="text-xs text-center text-slate-500 mt-4">
                            30-day money-back guarantee. No questions asked.
                        </p>
                    </div>
                </div>

                {/* Urgency Section */}
                <div className="max-w-4xl mx-auto mt-24 text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">Why You Need This Now</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 bg-slate-900/50 rounded-xl">
                            <Users className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Visibility is Currency</h3>
                            <p className="text-slate-400 text-sm">Recruiters and VCs don't read code. They watch videos and read threads.</p>
                        </div>
                        <div className="p-6 bg-slate-900/50 rounded-xl">
                            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Compound Growth</h3>
                            <p className="text-slate-400 text-sm">Every post you make adds up. Start building your audience today, not next year.</p>
                        </div>
                        <div className="p-6 bg-slate-900/50 rounded-xl">
                            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Speed Wins</h3>
                            <p className="text-slate-400 text-sm">Don't spend 4 hours writing a blog. Spend 4 minutes generating it.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}

function Lock({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    )
}

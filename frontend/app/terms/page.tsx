
import React from 'react';
import Footer from '@/components/Footer';
import { Terminal, Scale, FileText } from 'lucide-react';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
            <nav className="fixed top-0 w-full z-50 px-6 py-4 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <Terminal className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">Repo2Viral</span>
                    </div>
                    <a href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        &larr; Back to Home
                    </a>
                </div>
            </nav>

            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-full mb-6">
                        <Scale className="w-8 h-8 text-purple-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
                    <p className="text-slate-400">Effective Date: December 17, 2025</p>
                </div>

                <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-400 prose-li:text-slate-400">
                    <p>
                        By accessing or using Repo2Viral, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
                    </p>

                    <h3>1. Use License</h3>
                    <p>
                        Repo2Viral grants you a revocable, non-exclusive, non-transferable, limited license to use the application strictly in accordance with the terms of this agreement.
                    </p>
                    <ul>
                        <li>You must not use the service for any illegal or unauthorized purpose.</li>
                        <li>You must not attempt to reverse engineer the code analysis engine.</li>
                    </ul>

                    <h3>2. Subscription & Payments</h3>
                    <p>
                        Services are billed on a subscription basis via Gumroad. You agree to provide accurate and complete billing information.
                    </p>
                    <p>
                        <strong>Refund Policy:</strong> Startups are hard. If you are not satisfied with Repo2Viral within the first 7 days, we offer a full refund. No questions asked.
                    </p>

                    <h3>3. Intellectual Property</h3>
                    <p>
                        The generated content (Tweets, LinkedIn posts, etc.) belongs to <strong>YOU</strong>. We claim no ownership over the output produced by our AI for your repositories.
                    </p>

                    <h3>4. Disclaimer</h3>
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 not-prose mb-8">
                        <p className="text-sm text-slate-400 italic">
                            "The software is provided 'as is', without warranty of any kind, express or implied..."
                        </p>
                    </div>
                    <p>
                        We do not guarantee that the generated content will go viral. Virality depends on many factors outside our control (algorithm changes, timing, audience).
                    </p>

                    <h3>5. Governing Law</h3>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    )
}

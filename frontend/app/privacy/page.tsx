
import React from 'react';
import Footer from '@/components/Footer';
import { Terminal, Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
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
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-full mb-6">
                        <Shield className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
                    <p className="text-slate-400">Last updated: December 17, 2025</p>
                </div>

                <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-400 prose-li:text-slate-400">
                    <p>
                        At Repo2Viral, ensuring the privacy of your data and your code is our top priority. We understand that your intellectual property is your most valuable asset.
                    </p>

                    <h3>1. Data Collection</h3>
                    <p>
                        We collect minimal data necessary to function:
                    </p>
                    <ul>
                        <li><strong>Account Info:</strong> Email address for authentication via Supabase.</li>
                        <li><strong>Repository Data:</strong> We temporarily access your public/private repositories solely for the purpose of generating content. <strong>We do not store your code.</strong></li>
                        <li><strong>Generated Content:</strong> We store the tweets, posts, and blogs you generate to provide you with a history dashboard.</li>
                    </ul>

                    <h3>2. How We Use Your Data</h3>
                    <p>
                        Your data is used strictly to:
                    </p>
                    <ul>
                        <li>Authenticate you and manage your subscription.</li>
                        <li>Analyze your code using OpenAI's API to generate marketing content.</li>
                        <li>Improve our AI models (only if you explicitly opt-in).</li>
                    </ul>

                    <h3>3. Data Security</h3>
                    <div className="flex items-start gap-4 bg-slate-900/50 p-6 rounded-xl border border-slate-800 not-prose mb-8">
                        <Lock className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="text-white font-bold mb-1">Enterprise-Grade Encryption</h4>
                            <p className="text-sm text-slate-400">All data in transit is encrypted via TLS 1.3. At rest, your data is secured within Supabase's enterprise infrastructure.</p>
                        </div>
                    </div>

                    <h3>4. Third-Party Services</h3>
                    <p>
                        We utilize trusted third-party vendors:
                    </p>
                    <ul>
                        <li><strong>Supabase:</strong> For authentication and database hosting.</li>
                        <li><strong>OpenAI:</strong> As the LLM engine for code analysis.</li>
                        <li><strong>Gumroad:</strong> For payment processing. We do not store credit card details.</li>
                    </ul>

                    <h3>5. Your Rights</h3>
                    <p>
                        You have the right to request deletion of all your data at any time. Simply contact us at <a href="mailto:support@repo2viral.com">support@repo2viral.com</a>.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    )
}

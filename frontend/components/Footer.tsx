
import Link from 'next/link';
import { Github, Twitter, Linkedin, Terminal, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-600 p-1.5 rounded-lg">
                                <Terminal className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">Repo2Viral</span>
                        </div>
                        <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                            Turn your code into content. Repurpose your GitHub repositories into viral tweets, LinkedIn posts, and blogs in seconds using AI.
                        </p>
                        <div className="flex space-x-5">
                            <a href="https://github.com/saurabhsalve" className="text-slate-500 hover:text-white transition-colors">
                                <span className="sr-only">GitHub</span>
                                <Github className="h-5 w-5" />
                            </a>

                            <a href="https://www.linkedin.com/in/saurabhsalve99/" className="text-slate-500 hover:text-blue-500 transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Product</h3>
                                <ul role="list" className="mt-4 space-y-3">
                                    <li>
                                        <Link href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Features</Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Pricing</Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Showcase</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Support</h3>
                                <ul role="list" className="mt-4 space-y-3">
                                    <li>
                                        <Link href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Documentation</Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">API Status</Link>
                                    </li>
                                    <li>
                                        <a href="mailto:support@repo2viral.com" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Contact Support</a>
                                    </li>
                                    <li>
                                        <span className="text-sm text-slate-500">Call: +91 9766789387</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
                                <ul role="list" className="mt-4 space-y-3">
                                    <li>
                                        <Link href="/about" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">About</Link>
                                    </li>
                                    <li>
                                        <Link href="/blog" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Blog</Link>
                                    </li>
                                    <li>
                                        <Link href="/careers" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Careers</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Legal</h3>
                                <ul role="list" className="mt-4 space-y-3">
                                    <li>
                                        <Link href="/privacy" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Privacy Policy</Link>
                                    </li>
                                    <li>
                                        <Link href="/terms" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Terms of Service</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-slate-800 pt-8 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        &copy; 2024 Repo2Viral. All rights reserved.
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> by Developers
                    </p>
                </div>
            </div>
        </footer>
    );
}

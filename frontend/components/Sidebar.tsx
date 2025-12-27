"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, History, User, Terminal, Video } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const navItems = [
        { name: "Generator", href: "/dashboard/generator", icon: LayoutDashboard },
        { name: "Video Studio", href: "/dashboard/video-preview", icon: Video },
        { name: "My Vault", href: "/dashboard/vault", icon: History },
        { name: "Profile", href: "/dashboard/profile", icon: User },
    ];

    const handleSignOut = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await supabase.auth.signOut();
            router.refresh();
            router.replace("/");
        } catch (error) {
            console.error("Error signing out:", error);
            setIsLoggingOut(false);
        }
    };

    return (
        <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <Terminal className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white tracking-tight">Repo2Viral</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent hover:border-slate-700"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 relative z-10 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-white transition-colors"}`} />
                            <span className="font-medium relative z-10">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                    <p className="text-xs text-slate-400 mb-2">Logged in as User</p>
                    <button
                        onClick={handleSignOut}
                        disabled={isLoggingOut}
                        className="w-full text-left text-xs font-medium text-indigo-400 hover:text-indigo-300 py-2 px-1 hover:bg-slate-800/50 rounded transition-colors disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isLoggingOut ? "Signing out..." : "Sign Out"}
                    </button>
                </div>
            </div>
        </aside>
    );
}

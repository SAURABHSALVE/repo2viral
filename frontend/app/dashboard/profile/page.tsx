"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { User as UserIcon, CreditCard, Sparkles, LogOut, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
    const { data: session } = useSession();
    const [usage, setUsage] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/user/usage");
                const data = await res.json();
                setUsage(data || { is_pro: false, usage_count: 0 });
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setUsage({ is_pro: false, usage_count: 0 });
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
    };

    if (loading) return <div className="text-slate-400">Loading profile...</div>;

    const isPro = usage?.is_pro;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-slate-400">Manage your account and subscription.</p>
            </header>

            {/* Profile Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-8 flex items-center gap-6 border-b border-slate-800">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className="w-8 h-8 text-slate-400" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white max-w-xs truncate" title={session?.user?.email || ""}>
                            {session?.user?.name || session?.user?.email}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                            <Mail className="w-3 h-3" /> {session?.user?.email}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-slate-950/30 space-y-4">
                    {/* Plan Status */}
                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isPro ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-700/20 text-slate-400"}`}>
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 font-medium">Current Plan</p>
                                <p className={`text-lg font-bold ${isPro ? "text-white" : "text-slate-200"}`}>
                                    {isPro ? "Pro Plan" : "Free Plan"}
                                </p>
                            </div>
                        </div>
                        {isPro ? (
                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-bold uppercase tracking-wide">Active</span>
                        ) : (
                            <a href="https://saurabhsalve.gumroad.com/l/rczekx" target="_blank" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">Upgrade</a>
                        )}
                    </div>

                    {/* Usage Stats */}
                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 font-medium">Generations Used</p>
                                <p className="text-lg font-bold text-slate-200">{usage?.usage_count || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                <a
                    href={isPro ? "https://app.gumroad.com/library" : "https://saurabhsalve.gumroad.com/l/rczekx"}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                >
                    <CreditCard className="w-4 h-4" />
                    {isPro ? "Manage Subscription" : "Upgrade to Pro"}
                </a>
                <button
                    onClick={handleSignOut}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white py-3 px-4 rounded-xl font-medium transition-all border border-slate-700 hover:border-slate-600"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

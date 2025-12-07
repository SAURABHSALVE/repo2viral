"use client";

import { useEffect, useState } from "react";

interface TerminalLoaderProps {
    logs: string[];
}

export default function TerminalLoader({ logs }: TerminalLoaderProps) {
    const [cursorVisible, setCursorVisible] = useState(true);

    // Blink effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCursorVisible((v) => !v);
        }, 500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 bg-black border-2 border-slate-800 rounded-xl p-6 shadow-2xl font-mono text-sm min-h-[200px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-[8px]">●</div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-[8px]">●</div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-[8px]">●</div>
                <span className="text-slate-600 ml-2">sys_monitor.exe</span>
            </div>

            <div className="space-y-2 text-green-500">
                {logs.map((log, index) => (
                    <div key={index} className="animate-in fade-in slide-in-from-left-2 duration-300">
                        {log}
                    </div>
                ))}
                <div className="text-green-500">
                    <span className="opacity-50">{">"}</span>
                    <span className={`ml-2 bg-green-500 w-2.5 h-4 inline-block align-middle ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
                </div>
            </div>
        </div>
    );
}

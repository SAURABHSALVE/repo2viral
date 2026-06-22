import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const repoName = searchParams.get("repo") || "my-repo";
    const hook = searchParams.get("hook") || "Open source project";
    const stars = searchParams.get("stars") || "0";
    const forks = searchParams.get("forks") || "0";
    const lang = searchParams.get("lang") || "";

    // Truncate long strings so they fit the card
    const truncate = (s: string, max: number) => s.length > max ? s.slice(0, max - 1) + "…" : s;
    const safeRepo = truncate(repoName, 30);
    const safeHook = truncate(hook, 60);

    const svg = `<svg width="600" height="280" viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${safeRepo} - GitHub Repository Card">
  <title>${safeRepo}</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="600" y2="280" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
    <clipPath id="round">
      <rect width="600" height="280" rx="16"/>
    </clipPath>
  </defs>

  <g clip-path="url(#round)">
    <!-- Background -->
    <rect width="600" height="280" fill="url(#bg)"/>

    <!-- Grid lines (subtle) -->
    <line x1="0" y1="50" x2="600" y2="50" stroke="#1e293b" stroke-width="1"/>
    <line x1="0" y1="100" x2="600" y2="100" stroke="#1e293b" stroke-width="1"/>
    <line x1="0" y1="150" x2="600" y2="150" stroke="#1e293b" stroke-width="1"/>
    <line x1="0" y1="200" x2="600" y2="200" stroke="#1e293b" stroke-width="1"/>
    <line x1="0" y1="250" x2="600" y2="250" stroke="#1e293b" stroke-width="1"/>
    <line x1="100" y1="0" x2="100" y2="280" stroke="#1e293b" stroke-width="1"/>
    <line x1="200" y1="0" x2="200" y2="280" stroke="#1e293b" stroke-width="1"/>
    <line x1="300" y1="0" x2="300" y2="280" stroke="#1e293b" stroke-width="1"/>
    <line x1="400" y1="0" x2="400" y2="280" stroke="#1e293b" stroke-width="1"/>
    <line x1="500" y1="0" x2="500" y2="280" stroke="#1e293b" stroke-width="1"/>

    <!-- Border -->
    <rect width="600" height="280" rx="16" fill="none" stroke="#1e293b" stroke-width="1.5"/>

    <!-- Top accent bar -->
    <rect x="32" y="28" width="80" height="3" rx="1.5" fill="url(#accent)"/>

    <!-- Repo name -->
    <text x="32" y="74" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="26" font-weight="700" fill="#ffffff" letter-spacing="-0.5">${safeRepo}</text>

    <!-- Hook text -->
    <text x="32" y="108" font-family="ui-sans-serif,system-ui,sans-serif" font-size="15" fill="#94a3b8">${safeHook}</text>

    <!-- Divider -->
    <line x1="32" y1="130" x2="568" y2="130" stroke="#1e293b" stroke-width="1"/>

    <!-- Stars icon + count -->
    <text x="32" y="162" font-size="15" fill="#fbbf24">★</text>
    <text x="52" y="162" font-family="ui-sans-serif,system-ui,sans-serif" font-size="15" fill="#e2e8f0" font-weight="600">${stars}</text>
    <text x="92" y="162" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13" fill="#64748b">stars</text>

    <!-- Forks icon + count -->
    <text x="160" y="162" font-size="14" fill="#64748b">⑂</text>
    <text x="178" y="162" font-family="ui-sans-serif,system-ui,sans-serif" font-size="15" fill="#e2e8f0" font-weight="600">${forks}</text>
    <text x="218" y="162" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13" fill="#64748b">forks</text>

    ${lang ? `<!-- Language badge -->
    <rect x="32" y="182" width="${lang.length * 8 + 24}" height="24" rx="12" fill="#1e293b"/>
    <text x="${32 + 12}" y="198" font-family="ui-monospace,monospace" font-size="12" fill="#a78bfa" dominant-baseline="middle" text-anchor="middle">${lang}</text>` : ""}

    <!-- Repo2Viral badge -->
    <rect x="32" y="238" width="148" height="22" rx="11" fill="#1e1b4b"/>
    <text x="106" y="249" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11" fill="#6366f1" dominant-baseline="middle" text-anchor="middle">⚡ Powered by Repo2Viral</text>
  </g>
</svg>`;

    return new NextResponse(svg, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=3600",
        },
    });
}

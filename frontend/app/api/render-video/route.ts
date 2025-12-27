
import { NextRequest, NextResponse } from "next/server";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import os from "os";

// Allow longer timeout for this route (if platform supports it)
export const maxDuration = 300;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { inputProps, compositionId } = body;

        console.log("Received render request for:", compositionId);

        if (!inputProps) {
            return NextResponse.json({ error: "Missing inputProps" }, { status: 400 });
        }

        // 1. Bundle
        // Locate the entry file. 
        // We assume 'remotion/index.ts' exists in the project root (or frontend root)
        const entry = path.join(process.cwd(), "remotion/index.ts");

        console.log("Bundling entry:", entry);
        if (!fs.existsSync(entry)) {
            throw new Error(`Entry file not found at ${entry}`);
        }

        // Create a webpack bundle key to cache the bundle if possible, 
        // but for now strictly bundle fresh to ensure it works.
        const bundleLocation = await bundle({
            entryPoint: entry,
            // If you use Tailwind, you might need to ensure postcss config is picked up
            // Remotion usually respects the project's config.
            webpackOverride: (config) => config,
        });

        // 2. Select Composition
        const composition = await selectComposition({
            serveUrl: bundleLocation,
            id: compositionId || "RepoTrailer",
            inputProps,
        });

        // 3. Render
        const tmpDir = os.tmpdir();
        const outputLocation = path.join(tmpDir, `out-${Date.now()}.mp4`);

        console.log("Rendering to:", outputLocation);
        await renderMedia({
            composition,
            serveUrl: bundleLocation,
            codec: "h264",
            outputLocation,
            inputProps,
            // concurrency: 1, // Reduce load if needed
        });

        // 4. Read and return
        const fileBuffer = fs.readFileSync(outputLocation);

        // Clean up stored file
        fs.unlinkSync(outputLocation);

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "video/mp4",
                "Content-Disposition": `attachment; filename="repo-trailer.mp4"`,
            },
        });

    } catch (err: any) {
        console.error("Render Error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to render video", details: err.stack },
            { status: 500 }
        );
    }
}

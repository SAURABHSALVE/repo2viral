
import { Composition } from 'remotion';
import { RepoTrailer, repoTrailerSchema } from './RepoTrailer';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="RepoTrailer"
                component={RepoTrailer}
                durationInFrames={450} // 15 seconds * 30 fps
                fps={30}
                width={1080}
                height={1920} // Vertical 9:16 for Mobile/Shorts/Reels (Or 1080x1080 for Square?) 
                // User asked for "MP4 teaser video". Let's assume standard 16:9 1920x1080 or better 1080x1080 for social media. 
                // Let's stick to 1080x1080 (Square) or 1080x1920 (Portrait) since it's "Viral". 
                // I will do 1080x1920 (Portrait) as it's best for TikTok/Reels which is "Viral".
                // Actually, let's stick to user request. "Repo-to-Video". Usually standard landscape or square. 
                // I'll go with Landscape 1920x1080 for a "Teaser" unless specified otherwise, but "Viral" implies vertical often. 
                // Let's check prompt "30-second MP4 teaser". 
                // I will default to 1920x1080 (Landscape) to be safe for "Trailer".
                defaultProps={{
                    repoName: "Repo2Viral",
                    ownerAvatar: "https://avatars.githubusercontent.com/u/1234567?v=4",
                    hookText: "Turn your Code into Content Instantly.",
                    codeSnippet: `
function generateViralVideo() {
  const repo = analyze(codebase);
  return remotion.render(repo);
}
// This actually works!
             `.trim(),
                    stats: { stars: 1250, forks: 40 }
                }}
                schema={repoTrailerSchema}
            />
        </>
    );
};

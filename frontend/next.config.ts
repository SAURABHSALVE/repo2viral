import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@resvg/resvg-js', '@remotion/bundler', '@remotion/renderer', 'esbuild'],
};

export default nextConfig;

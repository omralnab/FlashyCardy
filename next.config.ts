import type { NextConfig } from "next";

/** GitHub Pages project sites use `/RepoName`; Vercel serves at domain root — use empty base path there. */
function resolveBasePath(): string {
  if (process.env.NEXT_PUBLIC_BASE_PATH !== undefined) {
    return process.env.NEXT_PUBLIC_BASE_PATH.trim();
  }
  return process.env.VERCEL ? "" : "/FlashyCardy";
}

const basePath = resolveBasePath();

const nextConfig: NextConfig = {
  output: "export",
  ...(basePath
    ? { basePath, assetPrefix: `${basePath}/` }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

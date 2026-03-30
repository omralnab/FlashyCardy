import type { NextConfig } from "next";

console.log(
  "NEXT CONFIG LOADED",
  process.env.NEXT_STATIC_EXPORT,
  process.env.VERCEL,
);

/** Fails the build if static export is forced via env (e.g. mis-set Vercel env var). */
if (
  process.env.NEXT_STATIC_EXPORT === "1" ||
  process.env.NEXT_STATIC_EXPORT === "true"
) {
  throw new Error(
    "[flashycardy] Build aborted: NEXT_STATIC_EXPORT is set. Remove it to use SSR, server actions, and Firebase Admin.",
  );
}

const nextConfig: NextConfig = {};

if ((nextConfig as { output?: string }).output === "export") {
  throw new Error(
    '[flashycardy] next.config sets output: "export", which disables SSR.',
  );
}

export default nextConfig;

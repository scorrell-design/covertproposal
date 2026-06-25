import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this repo — a stray lockfile in the parent
  // directory was making Next infer the wrong root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;

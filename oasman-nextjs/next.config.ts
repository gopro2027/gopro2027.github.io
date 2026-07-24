import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  transpilePackages: ["three"],
  // Note: rewrites don't work with static export on GitHub Pages
  // Files are copied to the correct location via post-build script
  // images: {
  //   unoptimized: true,
  // },
};

export default nextConfig;


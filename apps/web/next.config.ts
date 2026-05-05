import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@jurisflow/shared"],
  output: "standalone"
};

export default nextConfig;

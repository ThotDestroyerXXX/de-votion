import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL(`${process.env.UPLOADTHING_URL_ENDPOINT}/**`)],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // next/image only optimizes remote hosts we explicitly allow. DummyJSON
    // serves all product images from its CDN, so we whitelist it here. Without
    // this, <Image> would throw for any remote src.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.dummyjson.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Album artwork shown next to each artist's Apple Music preview.
    remotePatterns: [new URL("https://is1-ssl.mzstatic.com/image/thumb/**")],
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: { formats: ["image/avif", "image/webp"] },
  poweredByHeader: false,
  trailingSlash: false,
  productionBrowserSourceMaps: false,
  experimental: {
    // optimizeCss: true
  }
};

export default withNextIntl(nextConfig);

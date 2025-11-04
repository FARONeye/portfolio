import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Active le nouveau compilateur React (déjà présent)
  reactCompiler: true,

  // ✅ Active les formats d’image modernes
  images: {
    formats: ["image/avif", "image/webp"],
    // Si tu veux héberger des images ailleurs plus tard, tu pourras ajouter :
    // domains: ["cdn.example.com"],
  },

  // ✅ Optimisations SEO / perf
  poweredByHeader: false, // cache le header "X-Powered-By: Next.js"
  trailingSlash: false, // URLs sans slash final
  productionBrowserSourceMaps: false, // évite d'exposer ton code source

  // ✅ Future proof options (tu peux les garder actives)
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;

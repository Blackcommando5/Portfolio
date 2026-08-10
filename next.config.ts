import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Firebase Hosting serves static files only, so the app is exported rather
     than run. Safe here because there are no API routes, no middleware, and no
     server actions, and the case-study routes are pinned to
     generateStaticParams via `dynamicParams = false`. */
  output: "export",

  /* The image optimizer needs a server it will not have. Every thumbnail and
     render is already pre-compressed WebP at its display size, so the cost is
     losing per-device resizing rather than shipping unoptimised originals. */
  images: { unoptimized: true },
};

export default nextConfig;

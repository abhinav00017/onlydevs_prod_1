import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // lib/load-client.ts reads clients/<CLIENT>/ with fs. Its paths carry turbopackIgnore so the
  // tracer does not pull in the whole repo; /api/book runs at request time, so include clients/ here.
  outputFileTracingIncludes: {
    "/api/book": ["./clients/**/*"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
    resolveAlias: {
      buffer: "buffer",
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve("buffer/"),
        crypto: false,
        stream: false,
        path: false,
        fs: false,
      };
      config.plugins.push(
        new (require("webpack").ProvidePlugin)({
          Buffer: ["buffer", "Buffer"],
        })
      );
    }
    return config;
  },
};

export default nextConfig;

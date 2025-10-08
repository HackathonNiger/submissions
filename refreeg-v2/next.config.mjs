import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

let userConfig = undefined;
try {
  userConfig = await import("./v0-user-next.config");
} catch (e) {
  // ignore error
}


/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          process.env.NODE_ENV === "development"
            ? "eivlgwyipqojpeaxoajm.supabase.co"
            : "gfrksuuzzaczlxcswgkw.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  webpack(config, { dev, isServer }) {
    // Aceternity UI may import CSS that requires MiniCssExtractPlugin in prod
    if (!dev && !isServer) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: "static/css/[name].[contenthash].css",
          chunkFilename: "static/css/[id].[contenthash].css",
        })
      );

      // Make sure CSS loader uses the plugin
      const cssRule = config.module.rules.find(
        (r) => r.test && r.test.toString().includes(".css")
      );
      if (cssRule) {
        cssRule.use = [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ];
      }
    }

    return config;
  },
};

mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) return;
  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === "object" &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = { ...nextConfig[key], ...userConfig[key] };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

export default nextConfig;

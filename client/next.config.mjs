import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
    serverActions: true,
  },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };

    config.module.rules.push({
      test: /\.(mp4|webm|ogg|swf|avi)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            outputPath: "static/videos",
            publicPath: "/_next/static/videos",
            name: "[name].[hash].[ext]",
          },
        },
      ],
    });

    return config;
  },
};

export default withNextVideo(nextConfig);
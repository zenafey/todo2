import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', '26.64.197.106'],
  devIndicators: false,
};

export default nextConfig;
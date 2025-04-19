/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Enable App Router features
    appDir: true,
  },
  // Redirect any legacy pages to the app directory
  async redirects() {
    return [
      {
        source: '/pages/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

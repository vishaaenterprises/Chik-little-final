/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/products/:slug',
        destination: '/product/:slug',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
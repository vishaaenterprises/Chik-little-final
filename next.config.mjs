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
      {
        source: '/product/kids-dinosaur-print-backpack',
        destination: '/product/kids-owl-bird-print-backpack',
        permanent: true,
      },
      {
        source: '/product/kids-dinosaur-print-backpack-2',
        destination: '/product/kids-owl-bird-print-backpack-gift',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // The product-feed endpoints are fetched by Google Merchant Center /
      // Meta Catalog, so they are allowed explicitly. For Google the longest
      // matching rule wins, so these beat the broader `/api/` disallow.
      allow: [
        '/',
        '/api/google-feed',
        '/api/meta-feed',
        '/api/facebook-feed',
      ],
      // Keep crawlers out of the remaining API routes and per-user /
      // transactional pages.
      disallow: ['/api/', '/cart', '/wishlist', '/payment/'],
    },

    sitemap: 'https://littlechiku.com/sitemap.xml',
  }
}

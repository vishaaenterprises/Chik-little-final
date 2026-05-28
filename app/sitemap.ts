import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const baseUrl = 'https://littlechiku.com'

  // Example products
  const products = [
    {
      slug: 'baby-bath-towel',
      updatedAt: new Date(),
    },

    {
      slug: 'kids-apron',
      updatedAt: new Date(),
    },

    {
      slug: 'baby-blanket',
      updatedAt: new Date(),
    },
  ]

  // Product URLs
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [

    // Homepage
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },

    // Static pages
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // Categories
    {
      url: `${baseUrl}/bath-linen`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    {
      url: `${baseUrl}/kids-accessories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Products
    ...productUrls,
  ]
}
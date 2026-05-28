import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const baseUrl = 'https://littlechiku.com'

  // Fetch products from Sanity
  const products = await client.fetch(`
    *[_type == "product"]{
      "slug": slug.current,
      _updatedAt
    }
  `)

  // Product URLs
  const productUrls = products.map((product: any) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(product._updatedAt),
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

    // Static Pages
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

    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },

    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },

    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },

    {
      url: `${baseUrl}/term-condition`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },

    // Categories
    {
      url: `${baseUrl}/category/bath-linen`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    {
      url: `${baseUrl}/category/bags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    {
      url: `${baseUrl}/category/bedding`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    {
      url: `${baseUrl}/category/clothing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    {
      url: `${baseUrl}/category/kids-accessories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Dynamic Product URLs
    ...productUrls,
  ]
}
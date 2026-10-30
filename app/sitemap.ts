import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const baseUrl = 'https://littlechiku.com'

  // Fetch products from Sanity
  // A Sanity outage must not turn /sitemap.xml into a 500 (Search Console
  // would flag it) — fall back to the static URLs instead.
  const products = await client
    .fetch(`
    *[_type == "product" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }
  `)
    .catch(() => [])

  // Fetch categories from Sanity — dynamic, so a new/renamed category
  // is picked up automatically instead of needing a hardcoded edit here
  const categories = await client
    .fetch(`
    *[_type == "category" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }
  `)
    .catch(() => [])

  // Product URLs
  const productUrls = products.map((product: any) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Category URLs
  const categoryUrls = categories.map((category: any) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(category._updatedAt),
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

    // /cart and /wishlist are intentionally NOT listed: they are per-user,
    // noindex pages and don't belong in a sitemap.
    {
      url: `${baseUrl}/reviews`,
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

    // All Products listing
    {
      url: `${baseUrl}/category/all`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },

    // Categories — fetched dynamically from Sanity above
    ...categoryUrls,

    // Dynamic Product URLs
    ...productUrls,
  ]
}
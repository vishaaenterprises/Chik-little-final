import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const FEED_QUERY = `*[_type == "product"]{
  _id,
  productName,
  slug,
  shortDescription,
  price,
  outOfStock,
  sku,
  "categoryTitle": category->title,
  "mainImageUrl": mainImage.asset->url,
  variants[]{
    colorName,
    sku,
    price,
    stock,
    "imageUrl": images[0].asset->url
  }
}`

export async function GET() {
  try {
    const products = await client.fetch(FEED_QUERY)

    const baseUrl = 'https://www.littlechiku.com'

    const rows: string[] = []

    for (const p of products) {
      const hasVariants = Array.isArray(p.variants) && p.variants.length > 0

      if (hasVariants) {
        // Each variant = separate row in feed
        for (const v of p.variants) {
          const id        = v.sku || `${p._id}-${v.colorName?.replace(/\s+/g, '-').toLowerCase()}`
          const title     = `${p.productName} - ${v.colorName}`
          const desc      = (p.shortDescription || p.productName).slice(0, 150)
          const link      = `${baseUrl}/product/${p.slug?.current}`
          const image     = v.imageUrl || ''
          const price     = `${v.price?.toFixed(2) || '0.00'} INR`
          const avail     = (v.stock > 0) ? 'in stock' : 'out of stock'
          const condition = 'new'
          const brand     = 'Little Chiku'
          const category  = p.categoryTitle || 'Baby & Toddler'

          rows.push([id, title, desc, link, image, price, avail, condition, brand, category].join('\t'))
        }
      } else {
        // No variants — use product-level fields
        const id        = p.sku || p._id
        const title     = p.productName
        const desc      = (p.shortDescription || p.productName).slice(0, 150)
        const link      = `${baseUrl}/product/${p.slug?.current}`
        const image     = p.mainImageUrl || ''
        const price     = `${p.price?.toFixed(2) || '0.00'} INR`
        const avail     = p.outOfStock ? 'out of stock' : 'in stock'
        const condition = 'new'
        const brand     = 'Little Chiku'
        const category  = p.categoryTitle || 'Baby & Toddler'

        rows.push([id, title, desc, link, image, price, avail, condition, brand, category].join('\t'))
      }
    }

    const header = [
      'id', 'title', 'description', 'link',
      'image_link', 'price', 'availability',
      'condition', 'brand', 'product_type'
    ].join('\t')

    const tsv = [header, ...rows].join('\n')

    return new NextResponse(tsv, {
      status: 200,
      headers: {
        'Content-Type': 'text/tab-separated-values; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    console.error('Google Feed Error:', err)
    return new NextResponse('Feed generation failed', { status: 500 })
  }
}
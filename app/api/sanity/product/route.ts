import { NextRequest, NextResponse } from 'next/server'
import { sanityFetch, productBySlugQuery, relatedProductsQuery, type SanityProduct } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  try {
    // Fetch the product
    const product = await sanityFetch<SanityProduct | null>({
      query: productBySlugQuery,
      params: { slug },
      revalidate: 60,
    })

    if (!product) {
      return NextResponse.json({ product: null, relatedProducts: [] })
    }

    // Fetch related products
    const relatedProducts = await sanityFetch<SanityProduct[]>({
      query: relatedProductsQuery,
      params: {
        categorySlug: product.category?.slug || '',
        currentSlug: slug,
      },
      revalidate: 60,
    })

    return NextResponse.json({
      product,
      relatedProducts: relatedProducts || [],
    })
  } catch (error) {
    console.error('Error fetching product from Sanity:', error)
    return NextResponse.json({ product: null, relatedProducts: [] })
  }
}

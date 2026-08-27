import { NextRequest, NextResponse } from 'next/server'
import {
  sanityFetch,
  productBySlugQuery,
  relatedProductsQuery,
  reviewsListQuery,
  type SanityProduct,
  type SanityTestimonial,
} from '@/lib/sanity'

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
      return NextResponse.json({ product: null, relatedProducts: [], reviews: [] })
    }

    // Fetch related products + a general set of active reviews in parallel.
    // Reviews are shown on EVERY product page regardless of which product
    // (if any) they were originally written for.
    const [relatedProducts, reviews] = await Promise.all([
      sanityFetch<SanityProduct[]>({
        query: relatedProductsQuery,
        params: {
          categorySlug: product.category?.slug || '',
          currentSlug: slug,
        },
        revalidate: 60,
      }),
      sanityFetch<SanityTestimonial[]>({
        query: reviewsListQuery,
        params: { productSlug: '', start: 0, end: 8 },
        revalidate: 60,
      }),
    ])

    return NextResponse.json({
      product,
      relatedProducts: relatedProducts || [],
      reviews: reviews || [],
    })
  } catch (error) {
    console.error('Error fetching product from Sanity:', error)
    return NextResponse.json({ product: null, relatedProducts: [], reviews: [] })
  }
}
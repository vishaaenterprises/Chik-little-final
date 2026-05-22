import { NextRequest, NextResponse } from 'next/server'
import { sanityFetch, productsByCategoryQuery, productsQuery, categoriesQuery, type SanityProduct, type SanityCategory } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categorySlug = searchParams.get('slug')

  try {
    // Fetch categories
    const categories = await sanityFetch<SanityCategory[]>({
      query: categoriesQuery,
      revalidate: 60,
    })

    // Fetch products
    let products: SanityProduct[]
    
    if (!categorySlug || categorySlug === 'all') {
      products = await sanityFetch<SanityProduct[]>({
        query: productsQuery,
        revalidate: 60,
      })
    } else {
      products = await sanityFetch<SanityProduct[]>({
        query: productsByCategoryQuery,
        params: { categorySlug },
        revalidate: 60,
      })
    }

    return NextResponse.json({
      products: products || [],
      categories: categories || [],
    })
  } catch (error) {
    console.error('Error fetching category data from Sanity:', error)
    return NextResponse.json({ products: [], categories: [] })
  }
}

// app/api/sanity/category/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity/client'
import {
  categoriesQuery,
  categoryBySlugQuery,
  productsByCategoryQuery,
  productsQuery,
} from '@/lib/sanity/queries'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') ?? 'all'

  try {
    // Always fetch ALL categories (for the filter sidebar)
    const categories = await client.fetch(categoriesQuery)

    // Fetch the current category document (for the banner)
    const currentCategory =
      slug !== 'all'
        ? await client.fetch(categoryBySlugQuery, { slug })
        : null

    // Fetch products — all if slug === 'all', else only this category
    const products =
      slug === 'all'
        ? await client.fetch(productsQuery)
        : await client.fetch(productsByCategoryQuery, {
            categorySlug: slug,
          })

    return NextResponse.json({
      products: products ?? [],
      categories: categories ?? [],
      currentCategory: currentCategory ?? null,
    })
  } catch (err) {
    console.error('[/api/sanity/category] error:', err)
    return NextResponse.json(
      { products: [], categories: [], currentCategory: null },
      { status: 500 }
    )
  }
}
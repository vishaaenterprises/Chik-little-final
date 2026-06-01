// import { NextRequest, NextResponse } from 'next/server'
// import { sanityFetch, productsByCategoryQuery, productsQuery, categoriesQuery, type SanityProduct, type SanityCategory } from '@/lib/sanity'

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url)
//   const categorySlug = searchParams.get('slug')

//   try {
//     // Fetch categories
//     const categories = await sanityFetch<SanityCategory[]>({
//       query: categoriesQuery,
//       revalidate: 60,
//     })

//     // Fetch products
//     let products: SanityProduct[]
    
//     if (!categorySlug || categorySlug === 'all') {
//       products = await sanityFetch<SanityProduct[]>({
//         query: productsQuery,
//         revalidate: 60,
//       })
//     } else {
//       products = await sanityFetch<SanityProduct[]>({
//         query: productsByCategoryQuery,
//         params: { categorySlug },
//         revalidate: 60,
//       })
//     }

//     return NextResponse.json({
//       products: products || [],
//       categories: categories || [],
//     })
//   } catch (error) {
//     console.error('Error fetching category data from Sanity:', error)
//     return NextResponse.json({ products: [], categories: [] })
//   }
// }


// app/api/sanity/category/route.ts
// 
// NOTE: Ye route ab primary data source nahi hai.
// Server Component directly Sanity fetch karta hai.
// Ye route optional hai — kisi aur client-side use ke liye rakho,
// ya delete kar sakte ho agar koi aur page use nahi karta.

import { NextRequest, NextResponse } from 'next/server'
import { sanityFetch } from '@/lib/sanity/client'
import {
  productsByCategoryQuery,
  productsQuery,
  categoriesQuery,
  categoryBySlugQuery,
} from '@/lib/sanity/queries'
import type { SanityProduct, SanityCategory } from '@/lib/sanity/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') ?? 'all'

  try {
    const [products, categories, currentCategory] = await Promise.all([
      sanityFetch<SanityProduct[]>({
        query: slug === 'all' ? productsQuery : productsByCategoryQuery,
        params: slug === 'all' ? {} : { categorySlug: slug },
        revalidate: 60,
      }),
      sanityFetch<SanityCategory[]>({
        query: categoriesQuery,
        revalidate: 3600,
      }),
      slug !== 'all'
        ? sanityFetch<SanityCategory | null>({
            query: categoryBySlugQuery,
            params: { slug },
            revalidate: 3600,
          })
        : Promise.resolve(null),
    ])

    return NextResponse.json(
      { products: products ?? [], categories: categories ?? [], currentCategory },
      {
        headers: {
          // Browser/CDN ko 60s cache karne do
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('[/api/sanity/category] fetch error:', error)
    return NextResponse.json(
      { products: [], categories: [], currentCategory: null },
      { status: 500 }
    )
  }
}
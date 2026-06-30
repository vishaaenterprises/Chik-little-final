import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const SEARCH_QUERY = `*[
  _type == "product" &&
  (
    productName match $q ||
    shortDescription match $q ||
    productType match $q
  )
] | order(_createdAt desc)[0...8]{
  _id,
  productName,
  "slug": slug.current,
  price,
  mainImage,
  productType,
  shortDescription
}`

const ALL_PRODUCTS_QUERY = `*[
  _type == "product"
] | order(_createdAt desc)[0...8]{
  _id,
  productName,
  "slug": slug.current,
  price,
  mainImage,
  productType,
  shortDescription
}`

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query === 'all') {
      const allProducts = await client.fetch(
        ALL_PRODUCTS_QUERY,
        {},
        { cache: 'no-store' }
      )
      return NextResponse.json(allProducts ?? [], {
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    const products = await client.fetch(
      SEARCH_QUERY,
      { q: `${query}*` },
      { cache: 'no-store' }
    )

    return NextResponse.json(products ?? [], {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('SEARCH API ERROR:', error)
    return NextResponse.json(
      { error: 'Search failed', message: (error as Error)?.message ?? 'Unknown error' },
      { status: 500 }
    )
  }
}
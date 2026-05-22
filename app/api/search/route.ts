import { NextResponse } from 'next/server'

import { client } from '@/lib/sanity/client'

// ─────────────────────────────────────────────
// Search Query
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// All Products
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// GET
// ─────────────────────────────────────────────

export async function GET(
  request: Request
) {

  try {

    const { searchParams } =
      new URL(request.url)

    const query =
      searchParams.get('q')

    // ALL PRODUCTS

    if (
      !query ||
      query === 'all'
    ) {

      const allProducts =
        await client.fetch(
          ALL_PRODUCTS_QUERY
        )

      return NextResponse.json(
        allProducts || []
      )
    }

    // SEARCH PRODUCTS

    const products =
      await client.fetch(
        SEARCH_QUERY,
        {
          q: `${query}*`,
        }
      )

    return NextResponse.json(
      products || []
    )

  } catch (error) {

    console.error(
      'SEARCH API ERROR:',
      error
    )

    return NextResponse.json(
      {
        error: 'Search failed',
      },
      {
        status: 500,
      }
    )
  }
}
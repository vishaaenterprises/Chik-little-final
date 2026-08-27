import { NextRequest, NextResponse } from 'next/server'
import {
  sanityFetch,
  reviewsListQuery,
  reviewsCountQuery,
  reviewsStatsQuery,
  type SanityTestimonial,
  type ReviewStats,
} from '@/lib/sanity'

const DEFAULT_LIMIT = 12
const MAX_LIMIT = 48

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
  )
  const productSlug = searchParams.get('product') || ''

  const start = (page - 1) * limit
  const end = start + limit

  try {
    const [reviews, total, stats] = await Promise.all([
      sanityFetch<SanityTestimonial[]>({
        query: reviewsListQuery,
        params: { productSlug, start, end },
        revalidate: 60,
      }),
      sanityFetch<number>({
        query: reviewsCountQuery,
        params: { productSlug },
        revalidate: 60,
      }),
      sanityFetch<ReviewStats>({
        query: reviewsStatsQuery,
        params: { productSlug },
        revalidate: 60,
      }),
    ])

    const totalCount = total || 0

    return NextResponse.json({
      reviews: reviews || [],
      total: totalCount,
      page,
      limit,
      hasMore: end < totalCount,
      stats: stats || null,
    })
  } catch (error) {
    console.error('Error fetching reviews from Sanity:', error)
    return NextResponse.json({ reviews: [], total: 0, page, limit, hasMore: false, stats: null })
  }
}
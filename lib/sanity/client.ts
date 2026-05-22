// lib/sanity/client.ts

import { createClient } from 'next-sanity'

// ─────────────────────────────────────────────
// Environment Variables
// ─────────────────────────────────────────────

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rapjrk3z'

const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01'

// ─────────────────────────────────────────────
// Sanity Client
// ─────────────────────────────────────────────

export const client = createClient({
  projectId,
  dataset,
  apiVersion,

  // false for fresh search results
  useCdn: false,

  perspective: 'published',

  stega: false,
})

// ─────────────────────────────────────────────
// Universal Fetch Helper
// ─────────────────────────────────────────────

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
}: {
  query: string
  params?: Record<string, unknown>
  revalidate?: number | false
}): Promise<T> {

  try {

    // ─────────────────────────────────────────
    // NO CACHE
    // ─────────────────────────────────────────

    if (revalidate === false) {

      return await client.fetch<T>(
        query,
        params,
        {
          cache: 'no-store',
        }
      )
    }

    // ─────────────────────────────────────────
    // WITH REVALIDATE CACHE
    // ─────────────────────────────────────────

    return await client.fetch<T>(
      query,
      params,
      {
        next: {
          revalidate,
        },
      }
    )

  } catch (error) {

    console.error(
      'SANITY FETCH ERROR:',
      error
    )

    throw error
  }
}
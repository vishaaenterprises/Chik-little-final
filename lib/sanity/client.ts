// lib/sanity/client.ts

import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './env'

// ── Server-side client (SSR / API routes / RSC) ───────────────
// useCdn: true is fine on the server
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: typeof window === 'undefined', // true on server, false on browser
  perspective: 'published',
  stega: false,
})

// ── Universal fetch helper ────────────────────────────────────
// Works on both server and client components
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
}: {
  query: string
  params?: Record<string, unknown>
  revalidate?: number | false
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: revalidate === false ? false : revalidate,
    },
  })
}
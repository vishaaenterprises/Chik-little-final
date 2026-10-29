// lib/sanity/image.ts

import { createImageUrlBuilder } from '@sanity/image-url'

import type {
  SanityImageSource,
} from '@sanity/image-url'

import { client } from './client'

// ─────────────────────────────────────────────
// Builder
// ─────────────────────────────────────────────

const builder = createImageUrlBuilder(client)

// ─────────────────────────────────────────────
// Base URL generator
// ─────────────────────────────────────────────

export function urlFor(
  source: SanityImageSource
) {
  return builder.image(source)
}

// ─────────────────────────────────────────────
// Default image URL
// ─────────────────────────────────────────────

export function getImageUrl(
  source:
    | SanityImageSource
    | null
    | undefined
): string {

  if (!source) {
    return '/placeholder.jpg'
  }

  try {

    return urlFor(source)
      .auto('format')
      .fit('max')
      .url()

  } catch (error) {

    console.error(
      'SANITY IMAGE ERROR:',
      error
    )

    return '/placeholder.jpg'
  }
}

// ─────────────────────────────────────────────
// Cap the width of an already-built Sanity CDN URL
// ─────────────────────────────────────────────
//
// getImageUrl() returns the full-resolution asset (up to ~1500px). Cards only
// display ~300px, so request a smaller rendition from the Sanity image CDN.
// Non-Sanity URLs (local /public files, placeholders) are returned untouched.

export function withWidth(url: string, width: number): string {
  if (!url || !url.includes('cdn.sanity.io/images/')) return url
  try {
    const parsed = new URL(url)
    parsed.searchParams.set('w', String(width))
    return parsed.toString()
  } catch {
    return url
  }
}

// ─────────────────────────────────────────────
// Sized image URL
// ─────────────────────────────────────────────

export function getImageUrlWithSize(
  source:
    | SanityImageSource
    | null
    | undefined,

  width: number,

  height?: number
): string {

  if (!source) {
    return '/placeholder.jpg'
  }

  try {

    let imageBuilder =
      urlFor(source).width(width)

    if (height) {
      imageBuilder =
        imageBuilder.height(height)
    }

    return imageBuilder
      .auto('format')
      .fit('crop')
      .url()

  } catch (error) {

    console.error(
      'SANITY IMAGE SIZE ERROR:',
      error
    )

    return '/placeholder.jpg'
  }
}
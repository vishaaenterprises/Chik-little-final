import imageUrlBuilder from '@sanity/image-url'

import type {
  SanityImageSource,
} from '@sanity/image-url'

import { client } from './client'

// ─────────────────────────────────────────────
// Builder
// ─────────────────────────────────────────────

const builder = imageUrlBuilder(client)

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

  return urlFor(source)
    .auto('format')
    .fit('max')
    .url()
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
}
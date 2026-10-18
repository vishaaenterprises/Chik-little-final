// lib/sanity/gift.ts
//
// Helpers for the Gifts section (/category/return-gifts).
//
// Products flagged with `showInGifts` in Sanity also appear on the Gifts page.
// Every product keeps its gift-box photo at a fixed position in its image list
// (default: 6th). In the Gifts section that photo is shown FIRST; the remaining
// images keep their original order after it. Everywhere else the order is
// untouched.

import type { SanityImageAsset, SanityProduct, SanityProductCard } from './types'

export const GIFT_CATEGORY_SLUG = 'return-gifts'
export const DEFAULT_GIFT_IMAGE_INDEX = 6

/**
 * Returns a copy of `items` with the gift-box image moved to the front.
 * `giftImageIndex` is 1-based (6 = sixth image). If the list is shorter than
 * that position, or the image is already first, the list is returned as-is.
 */
export function giftFirst<T>(
  items: T[] | null | undefined,
  giftImageIndex?: number | null
): T[] {
  const list = items ?? []
  const position =
    (giftImageIndex && giftImageIndex > 0
      ? Math.floor(giftImageIndex)
      : DEFAULT_GIFT_IMAGE_INDEX) - 1

  if (position <= 0 || position >= list.length) return list
  return [list[position], ...list.filter((_, i) => i !== position)]
}

/**
 * The image that should represent a gift product on the Gifts listing card:
 * the gift-box photo of the first variant (or of mainImage + gallery when the
 * product has no variants).
 */
export function giftCardImageSource(
  product: SanityProduct | SanityProductCard
): SanityImageAsset | undefined {
  const firstVariantImages = product.variants?.[0]?.images
  if (firstVariantImages && firstVariantImages.length > 0) {
    return giftFirst(firstVariantImages, product.giftImageIndex)[0]
  }

  const all = [product.mainImage, ...(product.galleryImages ?? [])].filter(
    Boolean
  ) as SanityImageAsset[]
  return giftFirst(all, product.giftImageIndex)[0] ?? product.mainImage
}

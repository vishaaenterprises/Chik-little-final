// lib/sanity/types.ts
import type { PortableTextBlock } from '@portabletext/types'

// ── Sanity image reference ────────────────────────────────────

export interface SanityImageAsset {
  _type: 'image'
  asset?: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

// ── Category ──────────────────────────────────────────────────

export interface SanityCategory {
  _id: string
  title: string
  slug: string
  image?: SanityImageAsset
  description?: string
  color?: string
  accentColor?: string
  bgColor?: string
  subcategories?: string[]
  order?: number
}

// ── Material item (Tab 2) ─────────────────────────────────────

export interface ProductMaterial {
  _key?: string
  title: string
  description?: string
}

// ── Legacy color (product-level, no variant) ──────────────────

export interface ProductColor {
  _key?: string
  name: string
  hex: string
}

// ── Product Variant ───────────────────────────────────────────
// One entry per color. When variants exist on a product, all
// detail-page display (images, price, stock, description, etc.)
// is driven from the currently selected variant.

export interface ProductVariant {
  /** Sanity internal key — used as React key */
  _key: string

  // Color identity
  colorName: string
  colorCode: string  // hex string, e.g. "#7E8B5B"

  // Pricing
  price: number
  originalPrice?: number

  // Inventory
  stock: number
  sku?: string

  // Variant-specific details
  size?: string
  shortDescription?: string

  // Ratings (per-variant)
  rating?: number
  reviews?: number

  // Images — first image is the main display image
  images: SanityImageAsset[]
}

// ── Minimal product shape used inside alsoLike[] ─────────────

export interface SanityProductCard {
  _id: string
  productName: string
  slug: string
  shortDescription?: string
  price: number
  originalPrice?: number
  badge?: 'new' | 'bestseller' | 'sale' | 'limited'
  featuredProduct?: boolean
  newArrival?: boolean
  /** When true, Add to Cart and purchase actions are disabled */
  outOfStock?: boolean
  mainImage: SanityImageAsset
  /** Legacy color dots — used on cards when no variants present */
  colors?: ProductColor[]
  sizes?: string[]
  rating?: number
  reviewsCount?: number
  productType?: string
  /** Plain string matching one entry in category.subcategories */
  subcategory?: string
  category?: {
    _id: string
    title: string
    slug: string
  }
  /** Full variant data — drives color dots and hover image on cards */
  variants?: ProductVariant[]
}

// ── Core Sanity product (full document) ───────────────────────

export interface SanityProduct {
  _id: string
  _type?: 'product'
  _createdAt?: string

  productName: string
  slug: string
  shortDescription?: string
  fullDescription?: PortableTextBlock[]

  category?: {
    _id: string
    title: string
    slug: string
  }
  productType?: string
  /** Plain string matching one entry in category.subcategories */
  subcategory?: string
  tags?: string[]

  // Product-level pricing fallback (used when no variants)
  price: number
  originalPrice?: number
  discountPercentage?: number

  badge?: 'new' | 'bestseller' | 'sale' | 'limited'
  featuredProduct?: boolean
  newArrival?: boolean
  /** When true, Add to Cart and purchase actions are disabled */
  outOfStock?: boolean

  // Product-level image fallback (used when no variants)
  mainImage: SanityImageAsset
  galleryImages?: SanityImageAsset[]

  // ── NEW: Color variants — the primary source of truth ────────
  // When variants is non-empty, the product detail page uses
  // selectedVariant for all display values.
  variants?: ProductVariant[]

  // Legacy color/size (used for cards when no variants present)
  colors?: ProductColor[]
  sizes?: string[]

  // Product-level inventory fallback
  stock?: number
  sku?: string

  // Product-level ratings fallback
  rating?: number
  reviewsCount?: number

  storyTitle?: string
  storyDescription?: string
  dimensions?: string
  features?: string[]

  materials?: ProductMaterial[]
  careInstructions?: string[]

  alsoLike?: SanityProductCard[]

  brandStory?: string
}

// ── Legacy product shape used by ProductCard / cart ──────────

export interface LegacyProduct {
  id: string
  slug?: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  image: string
  /** First variant's image URL — for hover swap on cards */
  hoverImage?: string
  category: string
  categorySlug?: string
  /** Matches category.subcategories entry — used for frontend filtering */
  subcategory?: string
  isNew?: boolean
  isBestseller?: boolean
  /** When true, Add to Cart and purchase actions are disabled */
  outOfStock?: boolean
  shortDescription?: string
  /** Legacy color dots (used when no variants) */
  colors?: ProductColor[]
  sizes?: string[]
  reviewsCount?: number
  stock?: number
  /** Full variants array — passed through so ProductCard can render color dots + hover images */
  variants?: ProductVariant[]
}

export type Product = LegacyProduct

// ── Adapter: SanityProduct → LegacyProduct ───────────────────

export function sanityProductToLegacy(
  product: SanityProduct | SanityProductCard,
  imageUrl: string
): LegacyProduct {
  // When variants exist, the first variant's first image is used as the
  // card hover image (second color swap target); the main product image
  // stays as the primary card image.
  const firstVariant = product.variants?.[0]
  const secondVariant = product.variants?.[1]

  return {
    id:             product._id,
    slug:           product.slug,
    name:           product.productName,
    price:          firstVariant?.price ?? product.price,
    originalPrice:  firstVariant?.originalPrice ?? product.originalPrice,
    rating:         firstVariant?.rating ?? product.rating ?? 4.5,
    image:          imageUrl,
    hoverImage:     secondVariant
                      ? undefined   // card handles hover via variants array
                      : undefined,
    category:       product.category?.title ?? 'Products',
    categorySlug:   product.category?.slug ?? 'all',
    subcategory:    product.subcategory,
    isNew:          (product as SanityProduct).newArrival ?? product.badge === 'new',
    isBestseller:   product.badge === 'bestseller',
    outOfStock:     product.outOfStock ?? false,
    shortDescription: firstVariant?.shortDescription ?? product.shortDescription,
    colors:         product.colors,
    sizes:          product.sizes,
    reviewsCount:   firstVariant?.reviews ?? product.reviewsCount ?? 0,
    stock:          firstVariant?.stock ?? (product as SanityProduct).stock ?? 0,
    variants:       product.variants,
  }
}

// ── Helpers ───────────────────────────────────────────────────

/**
 * Compute discount percentage from price + originalPrice.
 * Returns 0 if originalPrice is not set or price >= originalPrice.
 */
export function computeDiscount(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

/**
 * Returns true if a variant is out of stock.
 */
export function isVariantOOS(variant: ProductVariant): boolean {
  return variant.stock === 0
}

// ── Banner ────────────────────────────────────────────────────

export interface SanityBanner {
  _id: string
  title?: string
  subtitle?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  image?: SanityImageAsset
  bannerType?: string
}

// ── Testimonial ───────────────────────────────────────────────

export interface SanityTestimonial {
  _id: string
  customerName: string
  review: string
  rating?: number
  customerImage?: SanityImageAsset
  location?: string
  productPurchased?: {
    productName: string
    slug: string
  }
}

// ── Brand ─────────────────────────────────────────────────────

export interface SanityBrand {
  _id: string
  name: string
  logo?: SanityImageAsset
  description?: string
  website?: string
}

// ── Homepage combined query result ───────────────────────────

export interface HomepageData {
  heroBanner?: SanityBanner
  categories?: SanityCategory[]
  featuredProducts?: SanityProduct[]
  newArrivals?: SanityProduct[]
  testimonials?: SanityTestimonial[]
  brands?: SanityBrand[]
  allProducts?: SanityProduct[]
}
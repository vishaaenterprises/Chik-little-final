// lib/sanity/types.ts
// ─────────────────────────────────────────────────────────────
//  Full TypeScript interfaces for all Sanity document types.
// ─────────────────────────────────────────────────────────────

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

// ── Color variant ─────────────────────────────────────────────

export interface ProductColor {
  _key?: string
  name: string
  hex: string
}

// ── Minimal product shape used inside alsoLike[] ─────────────
// (resolved references return card-level fields only)

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
  mainImage: SanityImageAsset
  colors?: ProductColor[]
  sizes?: string[]
  rating?: number
  reviewsCount?: number
  productType?: string
  category?: {
    _id: string
    title: string
    slug: string
  }
}

// ── Core Sanity product (full document) ───────────────────────

export interface SanityProduct {
  // Identifiers
  _id: string
  _type?: 'product'
  _createdAt?: string

  // Core Info
  productName: string
  slug: string
  shortDescription?: string
  fullDescription?: PortableTextBlock[]

  // Category
  category?: {
    _id: string
    title: string
    slug: string
  }
  productType?: string
  tags?: string[]

  // Pricing
  price: number
  originalPrice?: number
  discountPercentage?: number

  // Flags
  badge?: 'new' | 'bestseller' | 'sale' | 'limited'
  featuredProduct?: boolean
  newArrival?: boolean

  // Images
  mainImage: SanityImageAsset
  galleryImages?: SanityImageAsset[]

  // Variants
  colors?: ProductColor[]
  sizes?: string[]

  // Inventory
  stock?: number
  sku?: string

  // Reviews
  rating?: number
  reviewsCount?: number

  // ── Tab 1: Details & Story ──────────────────────────────────
  storyTitle?: string
  storyDescription?: string
  dimensions?: string
  features?: string[]

  // ── Tab 2: Materials ────────────────────────────────────────
  materials?: ProductMaterial[]

  // ── Tab 3: Care Instructions ────────────────────────────────
  careInstructions?: string[]

  // ── Curated "You May Also Like" section ────────────────────
  // Admin manually selects these in Sanity Studio.
  // Resolved references — already expanded to card-level fields.
  alsoLike?: SanityProductCard[]

  // Legacy
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
  category: string
  subcategory?: string
  isNew?: boolean
  isBestseller?: boolean
  shortDescription?: string
  colors?: ProductColor[]
  sizes?: string[]
  reviewsCount?: number
  stock?: number
}

// ── Adapter: SanityProduct → LegacyProduct ───────────────────

export function sanityProductToLegacy(
  product: SanityProduct | SanityProductCard,
  imageUrl: string
): LegacyProduct {
  return {
    id: product._id,
    slug: product.slug,
    name: product.productName,
    price: product.price,
    originalPrice: product.originalPrice,
    rating: product.rating ?? 4.5,
    image: imageUrl,
    category: product.category?.title ?? 'Products',
    subcategory: product.productType,
    isNew:
      (product as SanityProduct).newArrival ?? product.badge === 'new',
    isBestseller: product.badge === 'bestseller',
    shortDescription: product.shortDescription,
    colors: product.colors,
    sizes: product.sizes,
    reviewsCount: product.reviewsCount ?? 0,
    stock: (product as SanityProduct).stock ?? 0,
  }
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
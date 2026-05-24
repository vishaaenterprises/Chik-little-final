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

// ── Color variant ─────────────────────────────────────────────

export interface ProductColor {
  _key?: string
  name: string
  hex: string
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

  price: number
  originalPrice?: number
  discountPercentage?: number

  badge?: 'new' | 'bestseller' | 'sale' | 'limited'
  featuredProduct?: boolean
  newArrival?: boolean
  /** When true, Add to Cart and purchase actions are disabled */
  outOfStock?: boolean

  mainImage: SanityImageAsset
  galleryImages?: SanityImageAsset[]

  colors?: ProductColor[]
  sizes?: string[]

  stock?: number
  sku?: string

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
  category: string
  categorySlug?: string
  /** Matches category.subcategories entry — used for frontend filtering */
  subcategory?: string
  isNew?: boolean
  isBestseller?: boolean
  /** When true, Add to Cart and purchase actions are disabled */
  outOfStock?: boolean
  shortDescription?: string
  colors?: ProductColor[]
  sizes?: string[]
  reviewsCount?: number
  stock?: number
}

export type Product = LegacyProduct

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
    categorySlug: product.category?.slug ?? 'all',
    subcategory: product.subcategory,
    isNew: (product as SanityProduct).newArrival ?? product.badge === 'new',
    isBestseller: product.badge === 'bestseller',
    outOfStock: product.outOfStock ?? false,
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
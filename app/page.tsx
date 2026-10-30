import type { Metadata } from 'next'

import MainLayout from '@/components/layout/MainLayout'
import Home from '@/components/home/Home'

import {
  sanityFetch,
  homepageDataQuery,
  type HomepageData,
} from '@/lib/sanity'

import { getImageUrl } from '@/lib/sanity/image'
import { giftCardImageSource } from '@/lib/sanity/gift'

import type { LegacyProduct } from '@/lib/sanity/types'

// Homepage owns its canonical + OG url. The root layout no longer sets a
// site-wide canonical (it was leaking onto every page without its own).
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://littlechiku.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://littlechiku.com',
    siteName: 'Little Chiku',
    title: "Little Chiku | Kids Towels, Bathrobes & Gift Sets India",
    description:
      "Kids bath towels, hand towels, bathrobes, bedding, bags, Diwali and return gift sets, and Mom's Corner bags — handcrafted cotton by Little Chiku.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Little Chiku handcrafted cotton kids products',
      },
    ],
  },
}

// ─────────────────────────────────────────────
// Helper to convert Sanity products
// ─────────────────────────────────────────────

type HomeProduct = NonNullable<HomepageData['allProducts']>[number]

function toLegacyProduct(
  product: HomeProduct,
  useGiftImage = false
): LegacyProduct {
  return {
    id: product._id,

    slug: product.slug || '',

    name: product.productName || 'Untitled Product',

    price: product.price || 0,

    originalPrice:
      typeof product.originalPrice === 'number'
        ? product.originalPrice
        : undefined,

    // On the Gifts row, products flagged "Show in Gifts section" use their
    // gift-box photo — same behaviour as /category/return-gifts.
    image: getImageUrl(
      useGiftImage && product.showInGifts === true
        ? giftCardImageSource(product)
        : product.mainImage
    ),

    category: product.category?.title || '',

    categorySlug: product.category?.slug || 'all',

    subcategory: product.productType || '',

    rating: product.rating || 0,

    isNew: product.newArrival === true || product.badge === 'new',

    isBestseller: product.badge === 'bestseller',

    // Previously dropped here, so "OUT OF STOCK" never showed on the homepage.
    outOfStock: product.outOfStock ?? false,

    shortDescription: product.shortDescription || '',

    sizes: product.sizes || [],

    colors: product.colors || [],

    reviewsCount: product.reviewsCount || 0,

    stock: product.stock || 0,

    variants: product.variants ?? [],
  }
}

function convertToLegacyProducts(
  sanityProducts: HomepageData['allProducts']
): LegacyProduct[] {
  return (sanityProducts || []).map((p) => toLegacyProduct(p))
}

// Return Gifts = products in the "Return Gifts" category + any product
// flagged `showInGifts` in Sanity (matches giftProductsQuery used by the
// /category/return-gifts page).
function buildGiftProducts(
  sanityProducts: HomepageData['allProducts']
): LegacyProduct[] {
  return (sanityProducts || [])
    .filter(
      (p) =>
        p.showInGifts === true ||
        p.category?.title?.toLowerCase() === 'return gifts'
    )
    .map((p) => toLegacyProduct(p, true))
}

// ─────────────────────────────────────────────
// Helper to convert Sanity categories
// ─────────────────────────────────────────────

function convertToLegacyCategories(
  sanityCategories: HomepageData['categories']
) {
  return (sanityCategories || []).map((cat) => ({
    name: cat.title,

    href: `/category/${cat.slug}`,

    image: getImageUrl(cat.image),

    color:
      cat.bgColor || 'bg-[#EAF8F7]',

    accent:
      cat.accentColor || 'text-[#2F7F7C]',

    slug: cat.slug,

    description:
      cat.description || '',

    subcategories:
      cat.subcategories || [],
  }))
}

// ─────────────────────────────────────────────
// Homepage
// ─────────────────────────────────────────────

export default async function HomePage() {
  const homepageData =
    await sanityFetch<HomepageData>({
      query: homepageDataQuery,
      revalidate: 60,
    })

  // Products
  const products =
    homepageData?.allProducts?.length
      ? convertToLegacyProducts(
          homepageData.allProducts
        )
      : []

  const giftProducts = buildGiftProducts(homepageData?.allProducts)

  // Categories
  const categories =
    homepageData?.categories?.length
      ? convertToLegacyCategories(
          homepageData.categories
        )
      : []

  // Other content
  const testimonials =
    homepageData?.testimonials || []

  const heroBanner =
    homepageData?.heroBanner || null

  return (
    <MainLayout>
      <Home
        products={products}
        giftProducts={giftProducts}
        categories={categories}
        testimonials={testimonials}
        heroBanner={heroBanner}
      />
    </MainLayout>
  )
}
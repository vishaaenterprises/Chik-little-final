import MainLayout from '@/components/layout/MainLayout'
import Home from '@/components/home/Home'

import {
  sanityFetch,
  homepageDataQuery,
  type HomepageData,
} from '@/lib/sanity'

import { getImageUrl } from '@/lib/sanity/image'

import type { LegacyProduct } from '@/lib/sanity/types'

// ─────────────────────────────────────────────
// Helper to convert Sanity products
// ─────────────────────────────────────────────

function convertToLegacyProducts(
  sanityProducts: HomepageData['allProducts']
): LegacyProduct[] {
 return (sanityProducts || []).map((product) => ({
    id: product._id,

    slug: product.slug || '',

    name:
      product.productName ||
      'Untitled Product',

    price: product.price || 0,

    originalPrice:
      typeof product.originalPrice ===
      'number'
        ? product.originalPrice
        : undefined,

    image: getImageUrl(
      product.mainImage
    ),

    category:
      product.category?.title || '',

    subcategory:
      product.productType || '',

    rating:
      product.rating || 4.5,

    isNew:
      product.newArrival === true ||
      product.badge === 'new',

    isBestseller:
      product.badge ===
      'bestseller',

    shortDescription:
      product.shortDescription || '',

    sizes: product.sizes || [],

    colors: product.colors || [],

    reviewsCount:
      product.reviewsCount || 0,

    stock: product.stock || 0,
  }))
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
        categories={categories}
        testimonials={testimonials}
        heroBanner={heroBanner}
      />
    </MainLayout>
  )
}
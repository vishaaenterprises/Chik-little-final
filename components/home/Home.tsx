'use client'

import HeroSection from './HeroSection'
import FeaturedCategories from './FeaturedCategories'
import CategorySection from './CategorySection'
import MomSection from './MomSection'
import TrustSection from './TrustSection'
import InstagramSection from './InstagramSection'
import TestimonialsSection from './TestimonialsSection'

import type { LegacyProduct } from '@/lib/sanity/types'
import type { SanityTestimonial, SanityBanner } from '@/lib/sanity'

interface CategoryData {
  name: string
  href: string
  image: string
  color: string
  accent: string
  slug: string
  description: string
  subcategories: string[]
}

interface HomeProps {
  products: LegacyProduct[]
  /** Products for the Return Gifts row (category + `showInGifts` products) */
  giftProducts?: LegacyProduct[]
  categories: CategoryData[]
  testimonials: SanityTestimonial[]
  heroBanner: SanityBanner | null
}

// Get products by category
const getProductsByCategory = (
  products: LegacyProduct[],
  category: string
) => {
  return products.filter(
    (p) => p.category?.toLowerCase() === category.toLowerCase()
  )
}

export default function Home({
  products,
  giftProducts: giftProductsProp,
  categories,
  testimonials,
  heroBanner,
}: HomeProps) {
  const bathLinenProducts = getProductsByCategory(
    products,
    'Bath Linen'
  )

  const beddingProducts = getProductsByCategory(
    products,
    'Bedding'
  )

  const bagsProducts = getProductsByCategory(
    products,
    'Bags'
  )

  const accessoriesProducts = getProductsByCategory(
    products,
    'Kids Accessories'
  )

  const clothingProducts = getProductsByCategory(
    products,
    'Clothing'
  )

  // ONLY Mom's Corner products
  const momProducts = getProductsByCategory(
    products,
    "Mom's Corner"
  )

  const giftProducts =
    giftProductsProp && giftProductsProp.length > 0
      ? giftProductsProp
      : getProductsByCategory(products, 'Return Gifts')

  return (
    <main className="bg-[#F6FBFB] overflow-hidden">
      {/* Hero */}
      <HeroSection banner={heroBanner} />

      {/* Featured Categories */}
      <FeaturedCategories categories={categories} />

      {/* Bath Linen */}
      <CategorySection
        title="Bath Linen"
        subtitle="Soft & Fresh"
        description="Breathable, absorbent towels and robes crafted from the finest organic cotton"
        products={bathLinenProducts}
        href="/category/bath-linen"
        bgColor="bg-[#F3FAFA]"
        accentColor="text-[#4FBDBA]"
      />

      {/* Bedding */}
      <CategorySection
        title="Bedding"
        subtitle="Comfort & Warmth"
        description="Handcrafted quilts and dohars for peaceful slumber and cozy moments"
        products={beddingProducts}
        href="/category/bedding"
        bgColor="bg-[#FFFDF7]"
        accentColor="text-[#2F7F7C]"
      />

      {/* Bags */}
      <CategorySection
        title="Bags"
        subtitle="Playful Utility"
        description="Quilted cotton bags with charming prints for everyday adventures"
        products={bagsProducts}
        href="/category/bags"
        bgColor="bg-[#F6FBFB]"
        accentColor="text-[#F6C453]"
      />

      {/* Kids Accessories */}
      <CategorySection
        title="Kids Accessories"
        subtitle="Creative Curiosity"
        description="Thoughtfully designed accessories for play, rest, and creative exploration"
        products={accessoriesProducts}
        href="/category/kids-accessories"
        bgColor="bg-[#FFF8EA]"
        accentColor="text-[#D89B1D]"
      />

      {/* Clothing */}
      <CategorySection
        title="Clothing"
        subtitle="Premium Kids Fashion"
        description="Hand block printed dresses and comfortable cotton wear for little ones"
        products={clothingProducts}
        href="/category/clothing"
        bgColor="bg-white"
        accentColor="text-[#4FBDBA]"
      />

      {/* Mom's Corner */}
      <MomSection products={momProducts} />

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}

      {/* Return Gifts */}
      <CategorySection
        title="Return Gifts"
        subtitle="Celebrate in Style"
        description="Premium gift hampers and curated boxes for every special celebration"
        products={giftProducts}
        href="/category/return-gifts"
        bgColor="bg-[#F3FAFA]"
        accentColor="text-[#F6C453]"
      />

      {/* Brand summary — plain, quotable text for search + AI answer engines */}
      <section
        aria-label="About Little Chiku"
        className="bg-white py-12 md:py-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#2B2B2B] mb-4">
            What is Little Chiku?
          </h2>
          <p className="text-[#4B5563] leading-relaxed text-base md:text-lg">
            Little Chiku is an Indian brand from Jaipur that sells handcrafted,
            hand block printed cotton products for kids and mothers: bath towels,
            hand towels, face towels and kids bathrobes, towel and gift sets for
            birthdays and Diwali, bedding, clothing, kids bags and Mom&apos;s
            Corner bags. Orders ship across India, free above Rs. 1,499, and
            unused items can be returned within 7 days of delivery.
          </p>
        </div>
      </section>

      {/* Trust */}
      <TrustSection />

      {/* Instagram */}
      <InstagramSection />
    </main>
  )
}
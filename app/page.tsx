import MainLayout from '@/components/layout/MainLayout'
import Home from '@/components/home/Home'
import { sanityFetch, homepageDataQuery, type HomepageData } from '@/lib/sanity'
import { getImageUrl } from '@/lib/sanity/image'
import type { LegacyProduct } from '@/lib/sanity/types'

// Helper to convert Sanity products to legacy format
function convertToLegacyProducts(sanityProducts: HomepageData['allProducts']): LegacyProduct[] {
  return sanityProducts.map((product) => ({
    id: product._id,
    slug: product.slug,
    name: product.productName,
    price: product.price,
    originalPrice: product.originalPrice,
    image: getImageUrl(product.mainImage),
    category: product.category?.title || '',
    subcategory: product.productType || '',
    rating: product.rating || 4.5,
    isNew: product.newArrival || product.badge === 'new',
    isBestseller: product.badge === 'bestseller',
    description: product.shortDescription,
    sizes: product.sizes,
    colors: product.colors,
  }))
}

// Helper to convert Sanity categories
function convertToLegacyCategories(sanityCategories: HomepageData['categories']) {
  return sanityCategories.map((cat) => ({
    name: cat.title,
    href: `/category/${cat.slug}`,
    image: getImageUrl(cat.image),
    color: cat.bgColor || 'bg-[#EAF8F7]',
    accent: cat.accentColor || 'text-[#2F7F7C]',
    slug: cat.slug,
    description: cat.description || '',
    subcategories: cat.subcategories || [],
  }))
}

export default async function HomePage() {
  const homepageData = await sanityFetch<HomepageData>({
    query: homepageDataQuery,
    revalidate: 60,
  })

  // Convert Sanity data to legacy format - no fallback to static data
  const products = homepageData?.allProducts?.length 
    ? convertToLegacyProducts(homepageData.allProducts)
    : []

  const categories = homepageData?.categories?.length
    ? convertToLegacyCategories(homepageData.categories)
    : []

  const testimonials = homepageData?.testimonials || []
  const heroBanner = homepageData?.heroBanner || null

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

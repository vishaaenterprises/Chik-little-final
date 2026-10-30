// app/category/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity/client'
import { categoryBySlugQuery, productsByCategoryQuery, productsQuery, categoriesQuery, giftProductsQuery } from '@/lib/sanity/queries'
import { GIFT_CATEGORY_SLUG, giftCardImageSource } from '@/lib/sanity/gift'
import { getImageUrl, getImageUrlWithSize } from '@/lib/sanity/image'
import MainLayout from '@/components/layout/MainLayout'
import CategoryBanner from '@/components/banners/CategoryBanner'
import CategoryPageClient from '@/components/category/CategoryPageClient'
import { CategoryFaqs } from '@/components/category/CategoryIntro'
import { getCategoryContent } from '@/lib/category-content'
import type { SanityProduct, SanityCategory, LegacyProduct } from '@/lib/sanity/types'

// ─────────────────────────────────────────────────────────────
// Revalidation: Har 60 seconds mein page regenerate hoga
// ISR (Incremental Static Regeneration) use kar rahe hain
// ─────────────────────────────────────────────────────────────
export const revalidate = 60

// ─────────────────────────────────────────────────────────────
// generateStaticParams: Build time pe known categories
// pre-render hogi — zero cold start, instant TTFB
// ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const categories = await sanityFetch<SanityCategory[]>({
    query: categoriesQuery,
    revalidate: 3600,
  })

  const slugs = categories.map((cat) => ({ slug: cat.slug }))
  // /category/all bhi pre-render karo
  return [{ slug: 'all' }, ...slugs]
}

// ─────────────────────────────────────────────────────────────
// generateMetadata: Dynamic SEO metadata per category
// Google ko proper title, description, og:image milta hai
// ─────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const category =
    slug !== 'all'
      ? await sanityFetch<SanityCategory | null>({
          query: categoryBySlugQuery,
          params: { slug },
          revalidate: 3600,
        })
      : null

  // Invalid category slug — don't generate fake metadata for it, 404 instead
  if (slug !== 'all' && !category) {
    notFound()
  }

  const title = category?.title ?? (slug === 'all' ? 'All Products' : slugToTitle(slug))
  // Curated, keyword-rich meta (lib/category-content.ts) wins over the short
  // one-liner stored in Sanity; unknown/new categories fall back to the old logic.
  const seo = getCategoryContent(slug)
  const fullTitle = seo?.metaTitle ?? `${title} | Little Chiku`
  const description = seo?.metaDescription ?? buildMetaDescription(title, category?.description)

  // Real 1200×630 rendition so the declared og:image size is accurate
  // (the raw category image is e.g. 1024×796).
  const ogImageUrl = category?.image
    ? getImageUrlWithSize(category.image, 1200, 630)
    : undefined

  const canonicalUrl = `https://littlechiku.com/category/${slug}`

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      type: 'website',
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  }
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

// Category descriptions entered in Sanity are often one short line
// ("Soft towels, robes & premium bath essentials", ~45 chars). Pad those up to
// a proper snippet length; leave already-good descriptions alone.
function buildMetaDescription(title: string, raw?: string | null): string {
  const clip = (s: string) => (s.length > 160 ? `${s.slice(0, 157).trim()}...` : s)

  const base =
    raw?.trim() || `Shop our curated ${title} collection — handcrafted with love.`
  if (base.length >= 90) return clip(base)

  const sentence = /[.!?]$/.test(base) ? base : `${base}.`
  return clip(`${sentence} Handcrafted by Little Chiku — shop online with pan-India delivery.`)
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function toLegacy(product: SanityProduct, isGiftPage = false): LegacyProduct {
  // On the Gifts page, products flagged "Show in Gifts section" show their
  // Gift Image on the card. The product page itself is not affected.
  const isGiftFlagged = isGiftPage && product.showInGifts === true

  return {
    id:               product._id,
    slug:             product.slug ?? '',
    name:             product.productName ?? 'Untitled Product',
    price:            product.price ?? 0,
    originalPrice:    product.originalPrice,
    image:            getImageUrl(
                        isGiftFlagged ? giftCardImageSource(product) : product.mainImage
                      ),
    category:         product.category?.title ?? '',
    categorySlug:     product.category?.slug  ?? 'all',
    subcategory:      product.subcategory ?? '',
    rating:           product.rating  ?? 0,
    isNew:            product.newArrival === true || product.badge === 'new',
    isBestseller:     product.badge === 'bestseller',
    shortDescription: product.shortDescription ?? '',
    sizes:            product.sizes  ?? [],
    colors:           product.colors ?? [],
    reviewsCount:     product.reviewsCount ?? 0,
    stock:            product.stock ?? 0,
    variants:         product.variants ?? [],
    outOfStock:       product.outOfStock ?? false,
  }
}

// ─────────────────────────────────────────────────────────────
// JSON-LD Structured Data
// Google Shopping + BreadcrumbList ke liye
// ─────────────────────────────────────────────────────────────

function buildJsonLd(
  slug: string,
  title: string,
  description: string,
  products: LegacyProduct[]
) {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://littlechiku.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: 'https://littlechiku.com/category/all',
      },
      ...(slug !== 'all'
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: title,
              item: `https://littlechiku.com/category/${slug}`,
            },
          ]
        : []),
    ],
  }

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        description: p.shortDescription,
        url: `https://littlechiku.com/product/${p.slug}`,
        image: p.image,
        offers: {
          '@type': 'Offer',
          price: p.price,
          priceCurrency: 'INR',
          availability:
            p.stock && p.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
        },
        aggregateRating: p.reviewsCount
          ? {
              '@type': 'AggregateRating',
              ratingValue: p.rating,
              reviewCount: p.reviewsCount,
            }
          : undefined,
      },
    })),
  }

  return [breadcrumb, itemList]
}

// ─────────────────────────────────────────────────────────────
// Page — SERVER COMPONENT
// Data server pe fetch hoti hai, HTML mein embedded aati hai
// Google ko full content milta hai on first request
// ─────────────────────────────────────────────────────────────

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const isGiftPage = slug === GIFT_CATEGORY_SLUG

  // ── Parallel server-side fetches ─────────────────────────────
  // Promise.all = dono ek saath chalte hain, sequential nahi
  // Total time = max(categoriesTime, productsTime) instead of sum
  const [sanityProducts, sanityCategories, currentCategory] = await Promise.all([
    sanityFetch<SanityProduct[]>({
      query:
        slug === 'all'
          ? productsQuery
          : isGiftPage
          ? giftProductsQuery
          : productsByCategoryQuery,
      params: slug === 'all' ? {} : { categorySlug: slug },
      revalidate: 60,
    }),
    sanityFetch<SanityCategory[]>({
      query: categoriesQuery,
      revalidate: 3600, // Categories rarely change, longer cache
    }),
    slug !== 'all'
      ? sanityFetch<SanityCategory | null>({
          query: categoryBySlugQuery,
          params: { slug },
          revalidate: 3600,
        })
      : Promise.resolve(null),
  ])

  // ── 404 for unknown slugs ────────────────────────────────────
  // Agar category Sanity mein exist nahi karti (aur 'all' bhi nahi), to 404
  // Product count pe depend nahi karte — ek valid category ke 0 products
  // hone se 404 nahi hona chahiye, lekin invalid slug hamesha 404 hona chahiye
  if (slug !== 'all' && !currentCategory) {
    notFound()
  }

  // ── Server-side adapter ──────────────────────────────────────
  // Convert once on server, client ko raw Sanity data nahi milta
  const baseProducts = sanityProducts.map((p) => toLegacy(p, isGiftPage))

  const seoContent = getCategoryContent(slug)

  const bannerTitle =
    currentCategory?.title ?? (slug === 'all' ? 'All Products' : slugToTitle(slug))
  // The curated, answer-first intro (SEO / AEO / GEO) lives in the banner
  // tagline slot, so there is one clean description instead of a second block.
  const bannerDesc =
    seoContent?.intro ??
    currentCategory?.description ??
    `Explore our curated ${bannerTitle} collection`

  const categoryList = sanityCategories.map((cat) => ({
    slug:          cat.slug,
    name:          cat.title,
    subcategories: cat.subcategories ?? [],
  }))

  // Gifts page mixes products from many categories, so its "Type" filter is
  // built from the subcategories of the products actually shown.
  const currentCategorySubcategories = isGiftPage
    ? Array.from(
        new Set(baseProducts.map((p) => p.subcategory).filter((s): s is string => !!s))
      )
    : currentCategory?.subcategories ??
      categoryList.find((c) => c.slug === slug)?.subcategories ??
      []

  // ── JSON-LD ──────────────────────────────────────────────────
  const jsonLd = buildJsonLd(slug, bannerTitle, bannerDesc, baseProducts)

  return (
    <MainLayout>
      {/* Structured Data — Google ke liye invisible, lekin crawl hota hai */}
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* 
        CategoryBanner mein proper H1 hona chahiye.
        title prop ko <h1> tag mein render karo CategoryBanner ke andar.
        Ye SEO ke liye critical hai — Google H1 se page topic samajhta hai.
      */}
      <CategoryBanner
        title={bannerTitle}
        description={bannerDesc}
        productCount={baseProducts.length}
        color='#4FBDBA'
      />


      {/* 
        CategoryPageClient = thin client shell
        Sirf filter state aur interactions handle karta hai
        Initial products server se already rendered aate hain
      */}
      <CategoryPageClient
        slug={slug}
        initialProducts={baseProducts}
        categoryList={categoryList}
        currentCategorySubcategories={currentCategorySubcategories}
        bannerTitle={bannerTitle}
      />

      {seoContent && <CategoryFaqs title={bannerTitle} content={seoContent} />}
    </MainLayout>
  )
}
import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  sanityFetch,
  productBySlugQuery,
  relatedProductsQuery,
  reviewsListQuery,
  getImageUrl,
  type SanityProduct,
  type SanityTestimonial,
} from '@/lib/sanity'
import { getImageUrlWithSize } from '@/lib/sanity/image'
import ProductPageClient from './ProductPageClient'

const SITE_URL = 'https://littlechiku.com'

interface Props {
  params: Promise<{ slug: string }>
}

// ─────────────────────────────────────────────────────────────
// Data — `cache()` dedupes the Sanity call between generateMetadata()
// and the page itself, so each request hits Sanity once.
// ─────────────────────────────────────────────────────────────

const getProduct = cache(async (slug: string): Promise<SanityProduct | null> => {
  return sanityFetch<SanityProduct | null>({
    query: productBySlugQuery,
    params: { slug },
    revalidate: 60,
  })
})

async function getProductPageData(slug: string, product: SanityProduct) {
  // Related products + site-wide reviews (same data /api/sanity/product
  // returns). If either secondary fetch fails the product still renders.
  const [relatedProducts, reviews] = await Promise.all([
    sanityFetch<SanityProduct[]>({
      query: relatedProductsQuery,
      params: {
        categorySlug: product.category?.slug || '',
        currentSlug: slug,
      },
      revalidate: 60,
    }).catch(() => [] as SanityProduct[]),
    sanityFetch<SanityTestimonial[]>({
      query: reviewsListQuery,
      params: { productSlug: '', start: 0, end: 8 },
      revalidate: 60,
    }).catch(() => [] as SanityTestimonial[]),
  ])

  return {
    product,
    relatedProducts: relatedProducts || [],
    reviews: reviews || [],
  }
}

// ─────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: 'Product Not Found | Little Chiku',
      robots: { index: false, follow: false },
    }
  }

  // Product names carry long keyword tails after a "|" (~100 chars), which
  // Google truncates. Use the lead segment and trim on a word boundary so the
  // full title stays near 60 characters.
  const lead = product.productName.split('|')[0].trim()
  const maxLead = 60 - ' | Little Chiku'.length
  const shortName =
    lead.length > maxLead ? lead.slice(0, maxLead).replace(/\s+\S*$/, '').trim() : lead
  const title = `${shortName} | Little Chiku`
  const rawDescription =
    product.shortDescription || `${product.productName} — handcrafted by Little Chiku.`
  const description =
    rawDescription.length > 157 ? `${rawDescription.slice(0, 154).trim()}...` : rawDescription
  const canonicalUrl = `${SITE_URL}/product/${slug}`

  // Request a real 1200×1200 rendition so the declared OG dimensions are true.
  const imageUrl = product.mainImage
    ? getImageUrlWithSize(product.mainImage, 1200, 1200)
    : getImageUrl(product.mainImage)

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 1200, height: 1200, alt: product.productName }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

// ─────────────────────────────────────────────────────────────
// Page — SERVER component.
//
// The product is fetched here and handed to the client component as
// `initialData`, so the H1, price, description and Product JSON-LD are in the
// first HTML response. Before, the client component fetched everything in a
// useEffect and crawlers only saw a "Loading product..." spinner.
// ─────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const initialData = await getProductPageData(slug, product)

  const crumbs = [
    { name: 'Home', url: SITE_URL },
    { name: 'Shop', url: `${SITE_URL}/category/all` },
    ...(product.category?.slug
      ? [{ name: product.category.title, url: `${SITE_URL}/category/${product.category.slug}` }]
      : []),
    { name: product.productName, url: `${SITE_URL}/product/${slug}` },
  ]
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  }

  // `key` resets client state when navigating between two product pages.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductPageClient key={slug} initialData={initialData} />
    </>
  )
}

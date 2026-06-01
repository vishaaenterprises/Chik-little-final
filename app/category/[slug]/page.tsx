// // app/category/[slug]/page.tsx
// 'use client'

// import { useState, use, useMemo, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import MainLayout from '@/components/layout/MainLayout'
// import ProductGrid from '@/components/products/ProductGrid'
// import CategoryBanner from '@/components/banners/CategoryBanner'
// import { getImageUrl } from '@/lib/sanity/image'
// import type {
//   SanityProduct,
//   SanityCategory,
//   LegacyProduct,
// } from '@/lib/sanity/types'
// import {
//   SlidersHorizontal,
//   X,
//   ChevronDown,
//   Grid3X3,
//   LayoutGrid,
//   Sparkles,
//   Loader2,
// } from 'lucide-react'

// // ─────────────────────────────────────────────────────────────
// // Helpers
// // ─────────────────────────────────────────────────────────────

// function slugToTitle(slug: string): string {
//   return slug
//     .split('-')
//     .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//     .join(' ')
// }

// // ─────────────────────────────────────────────────────────────
// // Constants
// // ─────────────────────────────────────────────────────────────

// const SORT_OPTIONS = [
//   { label: 'Featured',           value: 'featured'   },
//   { label: 'Price: Low to High', value: 'price-asc'  },
//   { label: 'Price: High to Low', value: 'price-desc' },
//   { label: 'Newest',             value: 'newest'     },
//   { label: 'Best Rated',         value: 'rating'     },
// ]

// const PRICE_RANGES = [
//   { label: 'Under Rs.500',          min: 0,    max: 500      },
//   { label: 'Rs.500 – Rs.1,000',     min: 500,  max: 1000     },
//   { label: 'Rs.1,000 – Rs.2,000',   min: 1000, max: 2000     },
//   { label: 'Rs.2,000 – Rs.5,000',   min: 2000, max: 5000     },
//   { label: 'Above Rs.5,000',        min: 5000, max: Infinity  },
// ]

// // ─────────────────────────────────────────────────────────────
// // Adapter: Sanity → LegacyProduct
// // ─────────────────────────────────────────────────────────────

// function toLegacy(product: SanityProduct): LegacyProduct {
//   return {
//     id:               product._id,
//     slug:             product.slug ?? '',
//     name:             product.productName ?? 'Untitled Product',
//     price:            product.price ?? 0,
//     originalPrice:    product.originalPrice,
//     image:            getImageUrl(product.mainImage),
//     category:         product.category?.title ?? '',
//     categorySlug:     product.category?.slug  ?? 'all',
//     // ← This is the critical line — carries the subcategory string through
//     subcategory:      product.subcategory ?? '',
//     rating:           product.rating  ?? 4.5,
//     isNew:            product.newArrival === true || product.badge === 'new',
//     isBestseller:     product.badge === 'bestseller',
//     shortDescription: product.shortDescription ?? '',
//     sizes:            product.sizes  ?? [],
//     colors:           product.colors ?? [],
//     reviewsCount:     product.reviewsCount ?? 0,
//     stock:            product.stock ?? 0,
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // Page
// // ─────────────────────────────────────────────────────────────

// export default function CategoryPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>
// }) {
//   const { slug } = use(params)

//   // ── Remote data ─────────────────────────────────────────────
//   const [sanityProducts,   setSanityProducts]   = useState<SanityProduct[]>([])
//   const [sanityCategories, setSanityCategories] = useState<SanityCategory[]>([])
//   const [currentCategory,  setCurrentCategory]  = useState<SanityCategory | null>(null)
//   const [loading,    setLoading]    = useState(true)
//   const [fetchError, setFetchError] = useState<string | null>(null)

//   // ── Filter / sort state ─────────────────────────────────────
//   const [sortBy,               setSortBy]               = useState('featured')
//   const [showFilters,          setShowFilters]          = useState(false)
//   const [gridView,             setGridView]             = useState<'default' | 'compact'>('default')
//   const [selectedPriceRange,   setSelectedPriceRange]   = useState<number | null>(null)
//   // On /all pages the user first picks a category, then a subcategory.
//   // On /category/[specific] pages the category is already fixed by the slug;
//   // we only need the subcategory selector.
//   const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null)
//   const [selectedSubcategory,  setSelectedSubcategory]  = useState<string | null>(null)
//   const [showOnlyNew,          setShowOnlyNew]          = useState(false)
//   const [showOnlyBestseller,   setShowOnlyBestseller]   = useState(false)

//   // ── Fetch ────────────────────────────────────────────────────
//   useEffect(() => {
//     let cancelled = false
//     setLoading(true)
//     setFetchError(null)

//     fetch(`/api/sanity/category?slug=${encodeURIComponent(slug)}`)
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`)
//         return res.json()
//       })
//       .then((data) => {
//         if (cancelled) return
//         setSanityProducts(data.products ?? [])
//         setSanityCategories(data.categories ?? [])
//         setCurrentCategory(data.currentCategory ?? null)
//       })
//       .catch((err) => {
//         console.error('[CategoryPage] fetch error:', err)
//         if (!cancelled) setFetchError('Failed to load products. Please try again.')
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false)
//       })

//     return () => { cancelled = true }
//   }, [slug])

//   // ── Base products (converted once) ──────────────────────────
//   const baseProducts = useMemo(
//     () => sanityProducts.map(toLegacy),
//     [sanityProducts]
//   )

//   // ── Category list for the filter panel ──────────────────────
//   // Used only on the /all route.
//   const categoryList = useMemo(
//     () =>
//       sanityCategories.map((cat) => ({
//         slug:           cat.slug,
//         name:           cat.title,
//         subcategories:  cat.subcategories ?? [],
//       })),
//     [sanityCategories]
//   )

//   // ── Subcategories available for the current context ─────────
//   //
//   // On /all:     driven by which category the user clicked in the filter panel.
//   // On /[slug]:  always the subcategories of the current category page.
//   //
//   const availableSubcategories = useMemo<string[]>(() => {
//     if (slug === 'all') {
//       if (!selectedCategoryName) return []
//       return categoryList.find((c) => c.name === selectedCategoryName)?.subcategories ?? []
//     }
//     // Specific category page — use the current category's subs.
//     // Prefer live Sanity data; fall back to scanning the category list.
//     const subs =
//       currentCategory?.subcategories ??
//       categoryList.find((c) => c.slug === slug)?.subcategories ??
//       []
//     return subs
//   }, [slug, selectedCategoryName, categoryList, currentCategory])

//   // ── Reset subcategory when category changes ──────────────────
//   useEffect(() => {
//     setSelectedSubcategory(null)
//   }, [selectedCategoryName])

//   // ── Filtered + sorted products ───────────────────────────────
//   const filteredProducts = useMemo<LegacyProduct[]>(() => {
//     let list = [...baseProducts]

//     // — Category filter (only meaningful on /all) —
//     if (slug === 'all' && selectedCategoryName) {
//       list = list.filter((p) => p.category === selectedCategoryName)
//     }

//     // — Subcategory filter —
//     // Product's subcategory field is a plain string (e.g. "Bath Towel").
//     // We compare it directly — case-sensitive, matching Sanity values.
//     if (selectedSubcategory) {
//       list = list.filter((p) => p.subcategory === selectedSubcategory)
//     }

//     // — Price range —
//     if (selectedPriceRange !== null) {
//       const { min, max } = PRICE_RANGES[selectedPriceRange]
//       list = list.filter((p) => p.price >= min && p.price < max)
//     }

//     // — Quick filters —
//     if (showOnlyNew)        list = list.filter((p) => p.isNew)
//     if (showOnlyBestseller) list = list.filter((p) => p.isBestseller)

//     // — Sort —
//     switch (sortBy) {
//       case 'price-asc':  list.sort((a, b) => a.price - b.price);  break
//       case 'price-desc': list.sort((a, b) => b.price - a.price);  break
//       case 'rating':     list.sort((a, b) => b.rating - a.rating); break
//       case 'newest':
//         list = [
//           ...list.filter((p) => p.isNew),
//           ...list.filter((p) => !p.isNew),
//         ]
//         break
//       // 'featured' → no reorder (Sanity already returns desc by _createdAt)
//     }

//     return list
//   }, [
//     baseProducts,
//     slug,
//     selectedCategoryName,
//     selectedSubcategory,
//     selectedPriceRange,
//     showOnlyNew,
//     showOnlyBestseller,
//     sortBy,
//   ])

//   // ── Banner metadata ──────────────────────────────────────────
//   const bannerTitle = currentCategory?.title ?? (slug === 'all' ? 'All Products' : slugToTitle(slug))
//   const bannerDesc  = currentCategory?.description ?? `Explore our curated ${bannerTitle} collection`

//   // ── Helpers ──────────────────────────────────────────────────
//   const clearFilters = () => {
//     setSelectedPriceRange(null)
//     setSelectedCategoryName(null)
//     setSelectedSubcategory(null)
//     setShowOnlyNew(false)
//     setShowOnlyBestseller(false)
//   }

//   const activeFilterCount = [
//     selectedPriceRange !== null,
//     selectedCategoryName !== null,
//     selectedSubcategory  !== null,
//     showOnlyNew,
//     showOnlyBestseller,
//   ].filter(Boolean).length

//   const hasActiveFilters = activeFilterCount > 0

//   const pillStyle = (active: boolean, accent: 'teal' | 'yellow' = 'teal') => ({
//     background:   active ? (accent === 'yellow' ? '#F6C453' : '#4FBDBA') : 'white',
//     color:        active ? (accent === 'yellow' ? '#2B2B2B' : 'white')   : '#6B6B6B',
//     borderColor:  active ? (accent === 'yellow' ? '#F6C453' : '#4FBDBA') : '#E7EEEE',
//   })

//   const pillClass =
//     'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border'

//   // ─────────────────────────────────────────────────────────────
//   // Render
//   // ─────────────────────────────────────────────────────────────
//   return (
//     <MainLayout>
//       <CategoryBanner
//         title={bannerTitle}
//         description={bannerDesc}
//         productCount={filteredProducts.length}
//         color='#4FBDBA'
//       />

//       <div style={{ background: '#F6FBFB', minHeight: '60vh' }}>
//         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>

//           {/* ── Toolbar ──────────────────────────────────────── */}
//           <div
//             className='flex flex-wrap items-center justify-between gap-4 mb-8 px-5 py-4 rounded-[1.5rem]'
//             style={{
//               background:  'white',
//               border:      '1px solid #E7EEEE',
//               boxShadow:   '0 8px 24px rgba(79,189,186,0.07)',
//             }}
//           >
//             {/* Left: filter toggle + count */}
//             <div className='flex items-center gap-3'>
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className='flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200'
//                 style={{
//                   background:  showFilters || hasActiveFilters ? '#4FBDBA' : 'white',
//                   color:       showFilters || hasActiveFilters ? 'white'   : '#2B2B2B',
//                   border:      `1.5px solid ${showFilters || hasActiveFilters ? '#4FBDBA' : '#E7EEEE'}`,
//                   boxShadow:   showFilters || hasActiveFilters ? '0 8px 20px rgba(79,189,186,0.25)' : 'none',
//                 }}
//               >
//                 <SlidersHorizontal className='w-4 h-4' />
//                 <span>Filters</span>
//                 {hasActiveFilters && (
//                   <span
//                     className='w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center'
//                     style={{ background: '#F6C453', color: '#2B2B2B' }}
//                   >
//                     {activeFilterCount}
//                   </span>
//                 )}
//               </button>

//               {hasActiveFilters && (
//                 <button
//                   onClick={clearFilters}
//                   className='flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl transition-colors'
//                   style={{ color: '#6B6B6B', background: '#F6FBFB' }}
//                 >
//                   <X className='w-4 h-4' />
//                   Clear All
//                 </button>
//               )}

//               <span className='text-sm hidden sm:inline' style={{ color: '#6B6B6B' }}>
//                 {loading
//                   ? 'Loading…'
//                   : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
//               </span>
//             </div>

//             {/* Right: grid toggle + sort */}
//             <div className='flex items-center gap-3'>
//               <div
//                 className='hidden sm:flex items-center gap-1 p-1 rounded-xl'
//                 style={{ background: '#F6FBFB', border: '1px solid #E7EEEE' }}
//               >
//                 {(
//                   [
//                     { view: 'default' as const, Icon: LayoutGrid },
//                     { view: 'compact' as const, Icon: Grid3X3   },
//                   ] as const
//                 ).map(({ view, Icon }) => (
//                   <button
//                     key={view}
//                     onClick={() => setGridView(view)}
//                     className='p-2 rounded-lg transition-all'
//                     style={{
//                       background: gridView === view ? 'white'       : 'transparent',
//                       color:      gridView === view ? '#4FBDBA'     : '#6B6B6B',
//                       boxShadow:  gridView === view ? '0 2px 8px rgba(79,189,186,0.15)' : 'none',
//                     }}
//                   >
//                     <Icon className='w-4 h-4' />
//                   </button>
//                 ))}
//               </div>

//               <div className='relative'>
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className='appearance-none pl-4 pr-10 py-2.5 rounded-xl font-medium cursor-pointer outline-none transition-all'
//                   style={{
//                     background: 'white',
//                     border:     '1.5px solid #E7EEEE',
//                     color:      '#2B2B2B',
//                     fontSize:   '0.875rem',
//                   }}
//                 >
//                   {SORT_OPTIONS.map((opt) => (
//                     <option key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown
//                   className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none'
//                   style={{ color: '#6B6B6B' }}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* ── Filter Panel ─────────────────────────────────── */}
//           <AnimatePresence>
//             {showFilters && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 transition={{ duration: 0.25, ease: 'easeInOut' }}
//                 className='overflow-hidden mb-8'
//               >
//                 <div
//                   className='p-6 rounded-[2rem] space-y-6'
//                   style={{
//                     background: 'white',
//                     border:     '1px solid #E7EEEE',
//                     boxShadow:  '0 10px 30px rgba(79,189,186,0.07)',
//                   }}
//                 >
//                   {/* — Category (only on /all) — */}
//                   {slug === 'all' && categoryList.length > 0 && (
//                     <div>
//                       <h3
//                         className='font-semibold text-sm mb-3 uppercase tracking-wide'
//                         style={{ color: '#6B6B6B' }}
//                       >
//                         Category
//                       </h3>
//                       <div className='flex flex-wrap gap-2'>
//                         <button
//                           onClick={() => setSelectedCategoryName(null)}
//                           className={pillClass}
//                           style={pillStyle(selectedCategoryName === null)}
//                         >
//                           All
//                         </button>
//                         {categoryList.map((cat) => (
//                           <button
//                             key={cat.slug}
//                             onClick={() => setSelectedCategoryName(cat.name)}
//                             className={pillClass}
//                             style={pillStyle(selectedCategoryName === cat.name)}
//                           >
//                             {cat.name}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* — Subcategory — */}
//                   {availableSubcategories.length > 0 && (
//                     <div>
//                       <h3
//                         className='font-semibold text-sm mb-3 uppercase tracking-wide'
//                         style={{ color: '#6B6B6B' }}
//                       >
//                         Type
//                       </h3>
//                       <div className='flex flex-wrap gap-2'>
//                         <button
//                           onClick={() => setSelectedSubcategory(null)}
//                           className={pillClass}
//                           style={pillStyle(selectedSubcategory === null)}
//                         >
//                           All
//                         </button>
//                         {availableSubcategories.map((sub) => (
//                           <button
//                             key={sub}
//                             onClick={() =>
//                               setSelectedSubcategory(
//                                 selectedSubcategory === sub ? null : sub
//                               )
//                             }
//                             className={pillClass}
//                             style={pillStyle(selectedSubcategory === sub)}
//                           >
//                             {sub}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* — Price Range — */}
//                   <div>
//                     <h3
//                       className='font-semibold text-sm mb-3 uppercase tracking-wide'
//                       style={{ color: '#6B6B6B' }}
//                     >
//                       Price Range
//                     </h3>
//                     <div className='flex flex-wrap gap-2'>
//                       {PRICE_RANGES.map((range, idx) => (
//                         <button
//                           key={idx}
//                           onClick={() =>
//                             setSelectedPriceRange(
//                               selectedPriceRange === idx ? null : idx
//                             )
//                           }
//                           className={pillClass}
//                           style={pillStyle(selectedPriceRange === idx, 'yellow')}
//                         >
//                           {range.label}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* — Quick Filters — */}
//                   <div>
//                     <h3
//                       className='font-semibold text-sm mb-3 uppercase tracking-wide'
//                       style={{ color: '#6B6B6B' }}
//                     >
//                       Quick Filters
//                     </h3>
//                     <div className='flex flex-wrap gap-2'>
//                       {[
//                         {
//                           label:  'New Arrivals',
//                           active:  showOnlyNew,
//                           toggle: () => setShowOnlyNew((v) => !v),
//                         },
//                         {
//                           label:  'Bestsellers',
//                           active:  showOnlyBestseller,
//                           toggle: () => setShowOnlyBestseller((v) => !v),
//                         },
//                       ].map(({ label, active, toggle }) => (
//                         <button
//                           key={label}
//                           onClick={toggle}
//                           className={pillClass}
//                           style={{
//                             background:  active ? '#DDF5F4' : 'white',
//                             color:       active ? '#2F7F7C' : '#6B6B6B',
//                             borderColor: active ? '#4FBDBA' : '#E7EEEE',
//                           }}
//                         >
//                           {label}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* ── Content ──────────────────────────────────────── */}
//           {loading ? (
//             <div className='flex items-center justify-center py-20'>
//               <div className='text-center'>
//                 <Loader2
//                   className='w-12 h-12 animate-spin mx-auto mb-4'
//                   style={{ color: '#4FBDBA' }}
//                 />
//                 <p style={{ color: '#6B6B6B' }}>Loading products…</p>
//               </div>
//             </div>
//           ) : fetchError ? (
//             <div className='text-center py-20'>
//               <p className='mb-4' style={{ color: '#E57373' }}>
//                 {fetchError}
//               </p>
//               <button
//                 onClick={() => window.location.reload()}
//                 className='px-6 py-2 rounded-xl text-white font-medium'
//                 style={{ background: '#4FBDBA' }}
//               >
//                 Retry
//               </button>
//             </div>
//           ) : filteredProducts.length > 0 ? (
//             <ProductGrid products={filteredProducts} columns={gridView} />
//           ) : (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className='text-center py-20'
//             >
//               <div
//                 className='w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6'
//                 style={{
//                   background: 'white',
//                   border:     '1px solid #E7EEEE',
//                   boxShadow:  '0 10px 30px rgba(79,189,186,0.10)',
//                 }}
//               >
//                 <Sparkles className='w-10 h-10' style={{ color: '#4FBDBA' }} />
//               </div>
//               <h3
//                 className='text-2xl font-bold mb-2'
//                 style={{ color: '#2B2B2B', fontFamily: 'Georgia, serif' }}
//               >
//                 No Products Found
//               </h3>
//               <p className='mb-6' style={{ color: '#6B6B6B' }}>
//                 Try adjusting your filters to discover more handcrafted treasures.
//               </p>
//               <button
//                 onClick={clearFilters}
//                 className='px-8 py-3 text-white font-semibold rounded-2xl transition-all'
//                 style={{
//                   background: '#4FBDBA',
//                   boxShadow:  '0 12px 30px rgba(79,189,186,0.25)',
//                 }}
//               >
//                 Clear All Filters
//               </button>
//             </motion.div>
//           )}
//         </div>
//       </div>
//     </MainLayout>
//   )
// }


// app/category/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity/client'
import { categoryBySlugQuery, productsByCategoryQuery, productsQuery, categoriesQuery } from '@/lib/sanity/queries'
import { getImageUrl } from '@/lib/sanity/image'
import MainLayout from '@/components/layout/MainLayout'
import CategoryBanner from '@/components/banners/CategoryBanner'
import CategoryPageClient from '@/components/category/CategoryPageClient'
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

  const [category, categories] = await Promise.all([
    slug !== 'all'
      ? sanityFetch<SanityCategory | null>({
          query: categoryBySlugQuery,
          params: { slug },
          revalidate: 3600,
        })
      : null,
    sanityFetch<SanityCategory[]>({ query: categoriesQuery, revalidate: 3600 }),
  ])

  const title = category?.title ?? (slug === 'all' ? 'All Products' : slugToTitle(slug))
  const description =
    category?.description ??
    `Shop our curated ${title} collection — handcrafted with love.`

  const ogImageUrl = category?.image ? getImageUrl(category.image) : undefined

  const canonicalUrl = `https://yourdomain.com/category/${slug}`

  return {
    title: `${title} | Your Store Name`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Your Store Name`,
      description,
      url: canonicalUrl,
      type: 'website',
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Your Store Name`,
      description,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  }
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function toLegacy(product: SanityProduct): LegacyProduct {
  return {
    id:               product._id,
    slug:             product.slug ?? '',
    name:             product.productName ?? 'Untitled Product',
    price:            product.price ?? 0,
    originalPrice:    product.originalPrice,
    image:            getImageUrl(product.mainImage),
    category:         product.category?.title ?? '',
    categorySlug:     product.category?.slug  ?? 'all',
    subcategory:      product.subcategory ?? '',
    rating:           product.rating  ?? 4.5,
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
        item: 'https://yourdomain.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: 'https://yourdomain.com/category/all',
      },
      ...(slug !== 'all'
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: title,
              item: `https://yourdomain.com/category/${slug}`,
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
        url: `https://yourdomain.com/products/${p.slug}`,
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

  // ── Parallel server-side fetches ─────────────────────────────
  // Promise.all = dono ek saath chalte hain, sequential nahi
  // Total time = max(categoriesTime, productsTime) instead of sum
  const [sanityProducts, sanityCategories, currentCategory] = await Promise.all([
    sanityFetch<SanityProduct[]>({
      query: slug === 'all' ? productsQuery : productsByCategoryQuery,
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
  // Agar slug exist nahi karta aur 'all' bhi nahi, to 404
  if (slug !== 'all' && !currentCategory && sanityProducts.length === 0) {
    notFound()
  }

  // ── Server-side adapter ──────────────────────────────────────
  // Convert once on server, client ko raw Sanity data nahi milta
  const baseProducts = sanityProducts.map(toLegacy)

  const bannerTitle =
    currentCategory?.title ?? (slug === 'all' ? 'All Products' : slugToTitle(slug))
  const bannerDesc =
    currentCategory?.description ?? `Explore our curated ${bannerTitle} collection`

  const categoryList = sanityCategories.map((cat) => ({
    slug:          cat.slug,
    name:          cat.title,
    subcategories: cat.subcategories ?? [],
  }))

  const currentCategorySubcategories =
    currentCategory?.subcategories ??
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
    </MainLayout>
  )
}
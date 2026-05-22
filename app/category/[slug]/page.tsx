'use client'

import { useState, use, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainLayout from '@/components/layout/MainLayout'
import ProductGrid from '@/components/products/ProductGrid'
import CategoryBanner from '@/components/banners/CategoryBanner'
import { getImageUrl } from '@/lib/sanity/image'
import type { SanityProduct, SanityCategory, LegacyProduct } from '@/lib/sanity/types'
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutGrid, Sparkles, Loader2 } from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Replaces the deleted @/data/categories import.
// Derives display metadata purely from the slug string.
// When Sanity returns a currentCategory, the banner component
// will receive the real title/description instead.
// ─────────────────────────────────────────────────────────────
function getCategoryMeta(slug: string) {
  if (!slug) return null

  const title =
    slug === 'all'
      ? 'All Products'
      : slug
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')

  return {
    title,
    description: `Explore our curated ${title} collection`,
    color: '#4FBDBA',
  }
}

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const sortOptions = [
  { label: 'Featured',           value: 'featured'   },
  { label: 'Price: Low to High', value: 'price-asc'  },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest',             value: 'newest'     },
  { label: 'Best Rated',         value: 'rating'     },
]

const priceRanges = [
  { label: 'Under Rs.500',        min: 0,    max: 500      },
  { label: 'Rs.500 - Rs.1,000',   min: 500,  max: 1000     },
  { label: 'Rs.1,000 - Rs.2,000', min: 1000, max: 2000     },
  { label: 'Rs.2,000 - Rs.5,000', min: 2000, max: 5000     },
  { label: 'Above Rs.5,000',      min: 5000, max: Infinity },
]

// ─────────────────────────────────────────────────────────────
// Sanity → LegacyProduct adapter
// Maps Sanity field names (productName, mainImage, shortDescription)
// to the shape ProductGrid expects.
// ─────────────────────────────────────────────────────────────
function convertToLegacyProduct(product: SanityProduct): LegacyProduct {
  const originalPrice =
    typeof product.originalPrice === 'number' ? product.originalPrice : undefined

  return {
    id:            product._id,
    slug:          product.slug ?? '',
    name:          product.productName ?? 'Untitled Product',   // productName → name
    price:         product.price ?? 0,
    originalPrice,
    image:         getImageUrl(product.mainImage),              // mainImage → image URL
    category:      product.category?.title ?? '',
    subcategory:   product.productType ?? '',
    rating:        product.rating ?? 4.5,
    isNew:         product.newArrival === true || product.badge === 'new',
    isBestseller:  product.badge === 'bestseller',
    description:   product.shortDescription ?? '',              // shortDescription → description
    sizes:         product.sizes ?? [],
    colors:        product.colors ?? [],
  }
}

// ─────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────
export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug

  // Derive fallback meta from slug — overridden by Sanity data once loaded
  const fallbackMeta = getCategoryMeta(slug)

  // ── Data state ──────────────────────────────────────────────
  const [sanityProducts,   setSanityProducts]   = useState<SanityProduct[]>([])
  const [sanityCategories, setSanityCategories] = useState<SanityCategory[]>([])
  const [currentCategory,  setCurrentCategory]  = useState<SanityCategory | null>(null)
  const [loading,          setLoading]          = useState(true)
  const [fetchError,       setFetchError]       = useState<string | null>(null)

  // ── UI state ────────────────────────────────────────────────
  const [sortBy,               setSortBy]              = useState('featured')
  const [showFilters,          setShowFilters]         = useState(false)
  const [gridView,             setGridView]            = useState<'default' | 'compact'>('default')
  const [selectedPriceRange,   setSelectedPriceRange]  = useState<number | null>(null)
  const [selectedCategory,     setSelectedCategory]    = useState<string | null>(null)
  const [selectedSubcategory,  setSelectedSubcategory] = useState<string | null>(null)
  const [showOnlyNew,          setShowOnlyNew]         = useState(false)
  const [showOnlyBestseller,   setShowOnlyBestseller]  = useState(false)

  // ── Fetch from Sanity via API route ─────────────────────────
  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setFetchError(null)

      try {
        const res = await fetch(`/api/sanity/category?slug=${encodeURIComponent(slug)}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        if (!cancelled) {
          setSanityProducts(data.products   ?? [])
          setSanityCategories(data.categories ?? [])
          setCurrentCategory(data.currentCategory ?? null)
        }
      } catch (err) {
        console.error('[CategoryPage] fetch error:', err)
        if (!cancelled) setFetchError('Failed to load products. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [slug])

  // ── Derived: convert Sanity products → LegacyProduct ────────
  const baseProducts = useMemo(
    () => sanityProducts.map(convertToLegacyProduct),
    [sanityProducts]
  )

  // ── Derived: category list for filter panel ──────────────────
  const categories = useMemo(
    () =>
      sanityCategories.map((cat) => ({
        slug:          cat.slug,
        name:          cat.title,            // Sanity "title" field
        subcategories: cat.subcategories ?? [],
      })),
    [sanityCategories]
  )

  // ── Derived: filtered + sorted products ─────────────────────
  const filteredProducts = useMemo(() => {
    let products = [...baseProducts]

    if (selectedCategory)
      products = products.filter((p) => p.category === selectedCategory)

    if (selectedSubcategory)
      products = products.filter((p) => p.subcategory === selectedSubcategory)

    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange]
      products = products.filter((p) => p.price >= range.min && p.price < range.max)
    }

    if (showOnlyNew)        products = products.filter((p) => p.isNew)
    if (showOnlyBestseller) products = products.filter((p) => p.isBestseller)

    switch (sortBy) {
      case 'price-asc':  products.sort((a, b) => a.price - b.price);  break
      case 'price-desc': products.sort((a, b) => b.price - a.price);  break
      case 'rating':     products.sort((a, b) => b.rating - a.rating); break
      case 'newest':
        products = [
          ...products.filter((p) => p.isNew),
          ...products.filter((p) => !p.isNew),
        ]
        break
    }

    return products
  }, [baseProducts, selectedCategory, selectedSubcategory, selectedPriceRange, showOnlyNew, showOnlyBestseller, sortBy])

  // ── Derived: subcategories available for current selection ───
  const availableSubcategories = useMemo(() => {
    if (slug === 'all') {
      if (!selectedCategory) return []
      const cat = categories.find((c) => c.name === selectedCategory)
      return cat?.subcategories ?? []
    }
    const cat = categories.find((c) => c.slug === slug)
    return cat?.subcategories ?? []
  }, [slug, selectedCategory, categories])

  // ── Banner metadata: prefer live Sanity data, fall back to slug ──
  const meta = {
    title:       currentCategory?.title       ?? fallbackMeta?.title       ?? 'Products',
    description: currentCategory?.description ?? fallbackMeta?.description ?? '',
    color:       '#4FBDBA',
  }

  // ── Helpers ──────────────────────────────────────────────────
  const clearFilters = () => {
    setSelectedPriceRange(null)
    setSelectedCategory(null)
    setSelectedSubcategory(null)
    setShowOnlyNew(false)
    setShowOnlyBestseller(false)
  }

  const activeFilterCount = [
    selectedPriceRange !== null,
    selectedCategory !== null,
    selectedSubcategory !== null,
    showOnlyNew,
    showOnlyBestseller,
  ].filter(Boolean).length

  const hasActiveFilters = activeFilterCount > 0

  const pillClass = () =>
    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border'

  // ── Render ───────────────────────────────────────────────────
  return (
    <MainLayout>
      <CategoryBanner
        title={meta.title}
        description={meta.description}
        productCount={filteredProducts.length}
        color={meta.color}
      />

      <div style={{ background: '#F6FBFB', minHeight: '60vh' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ── Toolbar ─────────────────────────────────────── */}
          <div
            className="flex flex-wrap items-center justify-between gap-4 mb-8 px-5 py-4 rounded-[1.5rem]"
            style={{
              background:  'white',
              border:      '1px solid #E7EEEE',
              boxShadow:   '0 8px 24px rgba(79,189,186,0.07)',
            }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
                style={{
                  background:  showFilters || hasActiveFilters ? '#4FBDBA' : 'white',
                  color:       showFilters || hasActiveFilters ? 'white'   : '#2B2B2B',
                  border:      `1.5px solid ${showFilters || hasActiveFilters ? '#4FBDBA' : '#E7EEEE'}`,
                  boxShadow:   showFilters || hasActiveFilters ? '0 8px 20px rgba(79,189,186,0.25)' : 'none',
                }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span
                    className="w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center"
                    style={{ background: '#F6C453', color: '#2B2B2B' }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl transition-colors"
                  style={{ color: '#6B6B6B', background: '#F6FBFB' }}
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}

              <span className="text-sm hidden sm:inline" style={{ color: '#6B6B6B' }}>
                {loading
                  ? 'Loading...'
                  : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Grid Toggle */}
              <div
                className="hidden sm:flex items-center gap-1 p-1 rounded-xl"
                style={{ background: '#F6FBFB', border: '1px solid #E7EEEE' }}
              >
                {([
                  { view: 'default' as const, Icon: LayoutGrid },
                  { view: 'compact' as const, Icon: Grid3X3   },
                ]).map(({ view, Icon }) => (
                  <button
                    key={view}
                    onClick={() => setGridView(view)}
                    className="p-2 rounded-lg transition-all"
                    style={{
                      background: gridView === view ? 'white'       : 'transparent',
                      color:      gridView === view ? '#4FBDBA'     : '#6B6B6B',
                      boxShadow:  gridView === view ? '0 2px 8px rgba(79,189,186,0.15)' : 'none',
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-xl font-medium cursor-pointer outline-none transition-all"
                  style={{
                    background: 'white',
                    border:     '1.5px solid #E7EEEE',
                    color:      '#2B2B2B',
                    fontSize:   '0.875rem',
                  }}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: '#6B6B6B' }}
                />
              </div>
            </div>
          </div>

          {/* ── Filter Panel ─────────────────────────────────── */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden mb-8"
              >
                <div
                  className="p-6 rounded-[2rem] space-y-6"
                  style={{
                    background: 'white',
                    border:     '1px solid #E7EEEE',
                    boxShadow:  '0 10px 30px rgba(79,189,186,0.07)',
                  }}
                >
                  {/* Category (only on /all) */}
                  {slug === 'all' && categories.length > 0 && (
                    <div>
                      <h3
                        className="font-semibold text-sm mb-3 uppercase tracking-wide"
                        style={{ color: '#6B6B6B' }}
                      >
                        Category
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null) }}
                          className={pillClass()}
                          style={{
                            background:  selectedCategory === null ? '#4FBDBA' : 'white',
                            color:       selectedCategory === null ? 'white'   : '#6B6B6B',
                            borderColor: selectedCategory === null ? '#4FBDBA' : '#E7EEEE',
                          }}
                        >
                          All
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat.slug}
                            onClick={() => { setSelectedCategory(cat.name); setSelectedSubcategory(null) }}
                            className={pillClass()}
                            style={{
                              background:  selectedCategory === cat.name ? '#4FBDBA' : 'white',
                              color:       selectedCategory === cat.name ? 'white'   : '#6B6B6B',
                              borderColor: selectedCategory === cat.name ? '#4FBDBA' : '#E7EEEE',
                            }}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subcategory */}
                  {availableSubcategories.length > 0 && (
                    <div>
                      <h3
                        className="font-semibold text-sm mb-3 uppercase tracking-wide"
                        style={{ color: '#6B6B6B' }}
                      >
                        Type
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedSubcategory(null)}
                          className={pillClass()}
                          style={{
                            background:  selectedSubcategory === null ? '#4FBDBA' : 'white',
                            color:       selectedSubcategory === null ? 'white'   : '#6B6B6B',
                            borderColor: selectedSubcategory === null ? '#4FBDBA' : '#E7EEEE',
                          }}
                        >
                          All
                        </button>
                        {availableSubcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => setSelectedSubcategory(sub)}
                            className={pillClass()}
                            style={{
                              background:  selectedSubcategory === sub ? '#4FBDBA' : 'white',
                              color:       selectedSubcategory === sub ? 'white'   : '#6B6B6B',
                              borderColor: selectedSubcategory === sub ? '#4FBDBA' : '#E7EEEE',
                            }}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  <div>
                    <h3
                      className="font-semibold text-sm mb-3 uppercase tracking-wide"
                      style={{ color: '#6B6B6B' }}
                    >
                      Price Range
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {priceRanges.map((range, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setSelectedPriceRange(
                              selectedPriceRange === index ? null : index
                            )
                          }
                          className={pillClass()}
                          style={{
                            background:  selectedPriceRange === index ? '#F6C453' : 'white',
                            color:       selectedPriceRange === index ? '#2B2B2B' : '#6B6B6B',
                            borderColor: selectedPriceRange === index ? '#F6C453' : '#E7EEEE',
                          }}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Filters */}
                  <div>
                    <h3
                      className="font-semibold text-sm mb-3 uppercase tracking-wide"
                      style={{ color: '#6B6B6B' }}
                    >
                      Quick Filters
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        {
                          label:  'New Arrivals',
                          active: showOnlyNew,
                          toggle: () => setShowOnlyNew(!showOnlyNew),
                        },
                        {
                          label:  'Bestsellers',
                          active: showOnlyBestseller,
                          toggle: () => setShowOnlyBestseller(!showOnlyBestseller),
                        },
                      ].map(({ label, active, toggle }) => (
                        <button
                          key={label}
                          onClick={toggle}
                          className={pillClass()}
                          style={{
                            background:  active ? '#DDF5F4' : 'white',
                            color:       active ? '#2F7F7C' : '#6B6B6B',
                            borderColor: active ? '#4FBDBA' : '#E7EEEE',
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Content ──────────────────────────────────────── */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2
                  className="w-12 h-12 animate-spin mx-auto mb-4"
                  style={{ color: '#4FBDBA' }}
                />
                <p style={{ color: '#6B6B6B' }}>Loading products...</p>
              </div>
            </div>
          ) : fetchError ? (
            <div className="text-center py-20">
              <p className="mb-4" style={{ color: '#E57373' }}>{fetchError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 rounded-xl text-white font-medium"
                style={{ background: '#4FBDBA' }}
              >
                Retry
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} columns={gridView} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div
                className="w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6"
                style={{
                  background: 'white',
                  border:     '1px solid #E7EEEE',
                  boxShadow:  '0 10px 30px rgba(79,189,186,0.10)',
                }}
              >
                <Sparkles className="w-10 h-10" style={{ color: '#4FBDBA' }} />
              </div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: '#2B2B2B', fontFamily: 'Georgia, serif' }}
              >
                No Products Found
              </h3>
              <p className="mb-6" style={{ color: '#6B6B6B' }}>
                Try adjusting your filters to discover more handcrafted treasures.
              </p>
              <button
                onClick={clearFilters}
                className="px-8 py-3 text-white font-semibold rounded-2xl transition-all"
                style={{
                  background: '#4FBDBA',
                  boxShadow:  '0 12px 30px rgba(79,189,186,0.25)',
                }}
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
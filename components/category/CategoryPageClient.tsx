// components/category/CategoryPageClient.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductGrid from '@/components/products/ProductGrid'
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  LayoutGrid,
  Sparkles,
} from 'lucide-react'
import type { LegacyProduct } from '@/lib/sanity/types'

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { label: 'Featured',           value: 'featured'   },
  { label: 'Price: Low to High', value: 'price-asc'  },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest',             value: 'newest'     },
  { label: 'Best Rated',         value: 'rating'     },
]

const PRICE_RANGES = [
  { label: 'Under Rs.500',        min: 0,    max: 500      },
  { label: 'Rs.500 – Rs.1,000',   min: 500,  max: 1000     },
  { label: 'Rs.1,000 – Rs.2,000', min: 1000, max: 2000     },
  { label: 'Rs.2,000 – Rs.5,000', min: 2000, max: 5000     },
  { label: 'Above Rs.5,000',      min: 5000, max: Infinity  },
]

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface CategoryPageClientProps {
  slug: string
  initialProducts: LegacyProduct[]   // Server se pre-rendered products
  categoryList: {
    slug: string
    name: string
    subcategories: string[]
  }[]
  currentCategorySubcategories: string[]
  bannerTitle: string
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function CategoryPageClient({
  slug,
  initialProducts,
  categoryList,
  currentCategorySubcategories,
  bannerTitle,
}: CategoryPageClientProps) {

  // ── Filter / sort state ─────────────────────────────────────
  // initialProducts = server se aaye, no loading needed
  const [sortBy,               setSortBy]               = useState('featured')
  const [showFilters,          setShowFilters]          = useState(false)
  const [gridView,             setGridView]             = useState<'default' | 'compact'>('default')
  const [selectedPriceRange,   setSelectedPriceRange]   = useState<number | null>(null)
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null)
  const [selectedSubcategory,  setSelectedSubcategory]  = useState<string | null>(null)
  const [showOnlyNew,          setShowOnlyNew]          = useState(false)
  const [showOnlyBestseller,   setShowOnlyBestseller]   = useState(false)

  // ── Subcategories for current context ───────────────────────
  const availableSubcategories = useMemo<string[]>(() => {
    if (slug === 'all') {
      if (!selectedCategoryName) return []
      return categoryList.find((c) => c.name === selectedCategoryName)?.subcategories ?? []
    }
    return currentCategorySubcategories
  }, [slug, selectedCategoryName, categoryList, currentCategorySubcategories])

  // ── Reset subcategory when category changes ──────────────────
  useEffect(() => {
    setSelectedSubcategory(null)
  }, [selectedCategoryName])

  // ── Client-side filter + sort ────────────────────────────────
  // initialProducts server se hain — yahan sirf filter apply hota hai
  const filteredProducts = useMemo<LegacyProduct[]>(() => {
    let list = [...initialProducts]

    if (slug === 'all' && selectedCategoryName) {
      list = list.filter((p) => p.category === selectedCategoryName)
    }

    if (selectedSubcategory) {
      list = list.filter((p) => p.subcategory === selectedSubcategory)
    }

    if (selectedPriceRange !== null) {
      const { min, max } = PRICE_RANGES[selectedPriceRange]
      list = list.filter((p) => p.price >= min && p.price < max)
    }

    if (showOnlyNew)        list = list.filter((p) => p.isNew)
    if (showOnlyBestseller) list = list.filter((p) => p.isBestseller)

    switch (sortBy) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price);  break
      case 'price-desc': list.sort((a, b) => b.price - a.price);  break
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break
      case 'newest':
        list = [
          ...list.filter((p) => p.isNew),
          ...list.filter((p) => !p.isNew),
        ]
        break
    }

    return list
  }, [
    initialProducts,
    slug,
    selectedCategoryName,
    selectedSubcategory,
    selectedPriceRange,
    showOnlyNew,
    showOnlyBestseller,
    sortBy,
  ])

  // ── Helpers ──────────────────────────────────────────────────
  const clearFilters = () => {
    setSelectedPriceRange(null)
    setSelectedCategoryName(null)
    setSelectedSubcategory(null)
    setShowOnlyNew(false)
    setShowOnlyBestseller(false)
  }

  const activeFilterCount = [
    selectedPriceRange !== null,
    selectedCategoryName !== null,
    selectedSubcategory  !== null,
    showOnlyNew,
    showOnlyBestseller,
  ].filter(Boolean).length

  const hasActiveFilters = activeFilterCount > 0

  const pillStyle = (active: boolean, accent: 'teal' | 'yellow' = 'teal') => ({
    background:  active ? (accent === 'yellow' ? '#F6C453' : '#4FBDBA') : 'white',
    color:       active ? (accent === 'yellow' ? '#2B2B2B' : 'white')   : '#6B6B6B',
    borderColor: active ? (accent === 'yellow' ? '#F6C453' : '#4FBDBA') : '#E7EEEE',
  })

  const pillClass =
    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border'

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{ background: '#F6FBFB', minHeight: '60vh' }}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>

        {/* ── Toolbar ──────────────────────────────────────── */}
        <div
          className='flex flex-wrap items-center justify-between gap-4 mb-8 px-5 py-4 rounded-[1.5rem]'
          style={{
            background: 'white',
            border:     '1px solid #E7EEEE',
            boxShadow:  '0 8px 24px rgba(79,189,186,0.07)',
          }}
        >
          {/* Left: filter toggle + count */}
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200'
              style={{
                background: showFilters || hasActiveFilters ? '#4FBDBA' : 'white',
                color:      showFilters || hasActiveFilters ? 'white'   : '#2B2B2B',
                border:     `1.5px solid ${showFilters || hasActiveFilters ? '#4FBDBA' : '#E7EEEE'}`,
                boxShadow:  showFilters || hasActiveFilters ? '0 8px 20px rgba(79,189,186,0.25)' : 'none',
              }}
            >
              <SlidersHorizontal className='w-4 h-4' />
              <span>Filters</span>
              {hasActiveFilters && (
                <span
                  className='w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center'
                  style={{ background: '#F6C453', color: '#2B2B2B' }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className='flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl transition-colors'
                style={{ color: '#6B6B6B', background: '#F6FBFB' }}
              >
                <X className='w-4 h-4' />
                Clear All
              </button>
            )}

            {/* 
              Ab yahan "Loading..." nahi aayega
              Server se product count already pata hai
            */}
            <span className='text-sm hidden sm:inline' style={{ color: '#6B6B6B' }}>
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Right: grid toggle + sort */}
          <div className='flex items-center gap-3'>
            <div
              className='hidden sm:flex items-center gap-1 p-1 rounded-xl'
              style={{ background: '#F6FBFB', border: '1px solid #E7EEEE' }}
            >
              {(
                [
                  { view: 'default' as const, Icon: LayoutGrid },
                  { view: 'compact' as const, Icon: Grid3X3   },
                ] as const
              ).map(({ view, Icon }) => (
                <button
                  key={view}
                  onClick={() => setGridView(view)}
                  className='p-2 rounded-lg transition-all'
                  style={{
                    background: gridView === view ? 'white'   : 'transparent',
                    color:      gridView === view ? '#4FBDBA' : '#6B6B6B',
                    boxShadow:  gridView === view ? '0 2px 8px rgba(79,189,186,0.15)' : 'none',
                  }}
                >
                  <Icon className='w-4 h-4' />
                </button>
              ))}
            </div>

            <div className='relative'>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='appearance-none pl-4 pr-10 py-2.5 rounded-xl font-medium cursor-pointer outline-none transition-all'
                style={{
                  background: 'white',
                  border:     '1.5px solid #E7EEEE',
                  color:      '#2B2B2B',
                  fontSize:   '0.875rem',
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none'
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
              className='overflow-hidden mb-8'
            >
              <div
                className='p-6 rounded-[2rem] space-y-6'
                style={{
                  background: 'white',
                  border:     '1px solid #E7EEEE',
                  boxShadow:  '0 10px 30px rgba(79,189,186,0.07)',
                }}
              >
                {/* — Category (only on /all) — */}
                {slug === 'all' && categoryList.length > 0 && (
                  <div>
                    <h3
                      className='font-semibold text-sm mb-3 uppercase tracking-wide'
                      style={{ color: '#6B6B6B' }}
                    >
                      Category
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      <button
                        onClick={() => setSelectedCategoryName(null)}
                        className={pillClass}
                        style={pillStyle(selectedCategoryName === null)}
                      >
                        All
                      </button>
                      {categoryList.map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => setSelectedCategoryName(cat.name)}
                          className={pillClass}
                          style={pillStyle(selectedCategoryName === cat.name)}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* — Subcategory — */}
                {availableSubcategories.length > 0 && (
                  <div>
                    <h3
                      className='font-semibold text-sm mb-3 uppercase tracking-wide'
                      style={{ color: '#6B6B6B' }}
                    >
                      Type
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      <button
                        onClick={() => setSelectedSubcategory(null)}
                        className={pillClass}
                        style={pillStyle(selectedSubcategory === null)}
                      >
                        All
                      </button>
                      {availableSubcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() =>
                            setSelectedSubcategory(
                              selectedSubcategory === sub ? null : sub
                            )
                          }
                          className={pillClass}
                          style={pillStyle(selectedSubcategory === sub)}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* — Price Range — */}
                <div>
                  <h3
                    className='font-semibold text-sm mb-3 uppercase tracking-wide'
                    style={{ color: '#6B6B6B' }}
                  >
                    Price Range
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {PRICE_RANGES.map((range, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          setSelectedPriceRange(
                            selectedPriceRange === idx ? null : idx
                          )
                        }
                        className={pillClass}
                        style={pillStyle(selectedPriceRange === idx, 'yellow')}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* — Quick Filters — */}
                <div>
                  <h3
                    className='font-semibold text-sm mb-3 uppercase tracking-wide'
                    style={{ color: '#6B6B6B' }}
                  >
                    Quick Filters
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {[
                      {
                        label:  'New Arrivals',
                        active:  showOnlyNew,
                        toggle: () => setShowOnlyNew((v) => !v),
                      },
                      {
                        label:  'Bestsellers',
                        active:  showOnlyBestseller,
                        toggle: () => setShowOnlyBestseller((v) => !v),
                      },
                    ].map(({ label, active, toggle }) => (
                      <button
                        key={label}
                        onClick={toggle}
                        className={pillClass}
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

        {/* ── Products ─────────────────────────────────────── */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} columns={gridView} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center py-20'
          >
            <div
              className='w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6'
              style={{
                background: 'white',
                border:     '1px solid #E7EEEE',
                boxShadow:  '0 10px 30px rgba(79,189,186,0.10)',
              }}
            >
              <Sparkles className='w-10 h-10' style={{ color: '#4FBDBA' }} />
            </div>
            <h3
              className='text-2xl font-bold mb-2'
              style={{ color: '#2B2B2B', fontFamily: 'Georgia, serif' }}
            >
              No Products Found
            </h3>
            <p className='mb-6' style={{ color: '#6B6B6B' }}>
              Try adjusting your filters to discover more handcrafted treasures.
            </p>
            <button
              onClick={clearFilters}
              className='px-8 py-3 text-white font-semibold rounded-2xl transition-all'
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
  )
}
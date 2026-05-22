'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight, TrendingUp, Loader2 } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// ─── Image builder using existing client ──────────────────────
const builder = imageUrlBuilder(client)

function resolveImage(mainImage: unknown): string {
  try {
    if (!mainImage || typeof mainImage !== 'object') return '/placeholder-product.jpg'
    const img = mainImage as Record<string, unknown>
    if (!img.asset) return '/placeholder-product.jpg'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return builder.image(img as any).width(120).height(120).auto('format').fit('crop').url()
  } catch {
    return '/placeholder-product.jpg'
  }
}

// ─── GROQ ─────────────────────────────────────────────────────
const SEARCH_QUERY = `*[
  _type == "product"
  && (
    productName match $q
    || shortDescription match $q
    || productType match $q
    || category->title match $q
  )
] | order(_createdAt desc) [0..5] {
  _id,
  productName,
  "slug": slug.current,
  price,
  "mainImage": mainImage { _type, asset, hotspot, crop, alt },
  "categoryTitle": category->title,
  productType,
  shortDescription
}`

interface SearchResult {
  _id: string
  productName: string
  slug: string
  price: number
  mainImage: unknown
  categoryTitle: string
  productType: string
  shortDescription: string
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const popularSearches = ['Baby Towels', 'Quilts', 'Backpacks', 'Gift Sets', 'Rompers', 'Bath Robes']

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const inputRef              = useRef<HTMLInputElement>(null)
  const debouncedQuery        = useDebounce(query, 350)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery(''); setResults([]); setError(null)
    }
  }, [isOpen])

  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    if (trimmed.length < 2) { setResults([]); setError(null); return }

    let cancelled = false

    async function runSearch() {
      setLoading(true)
      setError(null)
      try {
        const data = await client.fetch<SearchResult[]>(
          SEARCH_QUERY,
          { q: trimmed + '*' }
        )
        if (!cancelled) setResults(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('[SearchModal]', err)
        if (!cancelled) { setError('Search failed. Please try again.'); setResults([]) }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    runSearch()
    return () => { cancelled = true }
  }, [debouncedQuery])

  const handleClose = useCallback(() => {
    setQuery(''); setResults([]); setError(null); onClose()
  }, [onClose])

  const showPopular = query.trim().length < 2
  const showLoading = loading && query.trim().length >= 2
  const showResults = !loading && !error && results.length > 0
  const showEmpty   = !loading && !error && query.trim().length >= 2 && results.length === 0
  const showError   = !loading && !!error

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 p-4 pt-16 md:pt-20"
          >
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#EAEAEA]">

              {/* Input */}
              <div className="relative p-4 border-b border-[#EAEAEA]">
                {showLoading
                  ? <Loader2 className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6EC1C3] animate-spin" />
                  : <Search  className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                }
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-20 py-3 bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B] focus:outline-none text-lg"
                />
                {query.length > 0 && (
                  <button
                    onClick={() => { setQuery(''); setResults([]) }}
                    className="absolute right-16 top-1/2 -translate-y-1/2 p-1.5 hover:bg-[#F5F5F5] rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-[#6B6B6B]" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#6B6B6B]" />
                </button>
              </div>

              {/* Body */}
              <div className="max-h-[60vh] overflow-y-auto">

                {/* Skeleton */}
                {showLoading && (
                  <div className="p-4 space-y-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-3">
                        <div className="w-16 h-16 rounded-xl bg-[#F0F0F0] animate-pulse flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-[#F0F0F0] rounded animate-pulse w-3/4" />
                          <div className="h-3 bg-[#F0F0F0] rounded animate-pulse w-1/2" />
                        </div>
                        <div className="h-4 w-16 bg-[#F0F0F0] rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Results */}
                {showResults && (
                  <div className="p-4">
                    <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Products</p>
                    <div className="space-y-2">
                      {results.map((product) => (
                        <Link
                          key={product._id}
                          href={`/product/${product.slug}`}
                          onClick={handleClose}
                          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#F8F8F8] transition-all duration-300 group"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F5F5F5] flex-shrink-0 relative">
                            <Image
                              src={resolveImage(product.mainImage)}
                              alt={product.productName ?? 'Product'}
                              fill sizes="64px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#2B2B2B] group-hover:text-[#6EC1C3] transition-colors line-clamp-1">
                              {product.productName ?? 'Untitled'}
                            </h4>
                            <p className="text-sm text-[#6B6B6B] capitalize">
                              {product.categoryTitle ?? 'Little Chiku'}
                            </p>
                          </div>
                          <span className="font-bold text-[#2B2B2B] whitespace-nowrap">
                            Rs.&nbsp;{(product.price ?? 0).toLocaleString()}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/category/all?search=${encodeURIComponent(query.trim())}`}
                      onClick={handleClose}
                      className="flex items-center justify-center gap-2 mt-4 py-3 bg-[#F5F5F5] rounded-2xl text-sm font-medium text-[#2B2B2B] hover:bg-[#6EC1C3] hover:text-white transition-colors"
                    >
                      View all results for &quot;{query.trim()}&quot;
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                {/* No results */}
                {showEmpty && (
                  <div className="p-8 text-center">
                    <Search className="w-10 h-10 mx-auto mb-3 text-[#DADADA]" />
                    <p className="font-semibold text-[#2B2B2B] mb-1">No results for &quot;{query.trim()}&quot;</p>
                    <p className="text-sm text-[#6B6B6B]">Try a different keyword or browse our categories.</p>
                  </div>
                )}

                {/* Error */}
                {showError && (
                  <div className="p-6 text-center">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Popular searches */}
                {showPopular && (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-[#6EC1C3]" />
                      <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Popular Searches</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 bg-[#F5F5F5] rounded-full text-sm font-medium text-[#2B2B2B] hover:bg-[#6EC1C3] hover:text-white transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
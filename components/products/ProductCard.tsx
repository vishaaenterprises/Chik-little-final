'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Eye, ShoppingBag, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useCallback } from 'react'
import Link from 'next/link'

import { useCart } from '@/context/cart-context'
import type { LegacyProduct } from '@/lib/sanity/types'

interface ProductCardProps {
  product: LegacyProduct
  compact?: boolean
}

export default function ProductCard({
  product,
  compact = false,
}: ProductCardProps) {
  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isInCart,
  } = useCart()

  const [isHovered, setIsHovered] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const {
    id,
    name,
    price,
    originalPrice,
    image,
    category,
    rating = 4.5,
    isNew,
    isBestseller,
    outOfStock = false,
  } = product

  // Collect all images: mainImage + any extras stored in product
  // ProductCard receives a single `image` string; multi-image is only on detail page.
  // We keep the array pattern ready for future gallery support.
  const images: string[] = [image].filter(Boolean)
  const hasMultipleImages = images.length > 1

  const slugStr =
    typeof product.slug === 'string'
      ? product.slug
      : (product.slug as any)?.current ?? ''

  const wishlisted = isInWishlist(id)
  const inCart = isInCart(id)

  // Discount is only shown when there's a genuine compare-at price above
  // the selling price. Computed dynamically, never hardcoded.
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (wishlisted) {
      removeFromWishlist(id)
    } else {
      addToWishlist({
        id,
        name,
        price,
        originalPrice,
        image,
        category,
        rating,
        isNew,
        isBestseller,
      })
    }
  }

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock) return
    addToCart({
      id,
      slug: slugStr,
      name,
      price,
      originalPrice,
      image,
      category,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handlePrevImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    },
    [images.length]
  )

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    },
    [images.length]
  )

  return (
    <motion.div
      className="group h-full"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card shell — flex-col + h-full ensures uniform height across the grid */}
      <div className="relative h-full overflow-hidden rounded-[1.8rem] border border-[#E7EEEE] bg-white shadow-[0_10px_30px_rgba(79,189,186,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(79,189,186,0.16)] flex flex-col">

        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#DDF5F4]/20 via-transparent to-[#FFF4D6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

        {/* ── Image area ─────────────────────────────────────────── */}
        {/*
          Images are 1000×1200 px (5:6 ratio).
          We use aspect-[5/6] so the container always matches the natural ratio,
          then object-contain inside so nothing is cropped or stretched.
        */}
        <div className="relative w-full overflow-hidden bg-white flex-shrink-0" style={{ aspectRatio: '5 / 6' }}>

          {/* Image with smooth crossfade */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex] ?? image}
              alt={name}
              className="absolute inset-0 w-full h-full object-contain p-3"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: isHovered ? 1.03 : 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            />
          </AnimatePresence>

          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2F7F7C]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* ── Left / Right Arrows (only if multiple images) ──── */}
          {hasMultipleImages && (
            <>
              <motion.button
                onClick={handlePrevImage}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-md text-[#2B2B2B] hover:bg-white hover:shadow-lg transition-all duration-200"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -4 }}
                transition={{ duration: 0.2 }}
                whileTap={{ scale: 0.92 }}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={handleNextImage}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-md text-[#2B2B2B] hover:bg-white hover:shadow-lg transition-all duration-200"
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 4 }}
                transition={{ duration: 0.2 }}
                whileTap={{ scale: 0.92 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </>
          )}

          {/* ── Badges (top-left) ─────────────────────────────── */}
          {/*
            Priority stack (top → bottom):
              1. OUT OF STOCK  — always wins, nothing else renders alongside it
              2. FLAT XX% OFF  — premium red gradient pill, only when a real discount exists
              3. NEW
              4. BEST
            All badges share the same pill sizing/spacing so they stack cleanly.
          */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {outOfStock ? (
              <span
                role="status"
                className="px-2.5 py-1 bg-red-500 text-white text-[10px] md:text-xs font-bold rounded-full shadow-sm"
              >
                OUT OF STOCK
              </span>
            ) : (
              <>
                {discount > 0 && (
                  <span
                    role="status"
                    aria-label={`Flat ${discount} percent off`}
                    className="px-3 md:px-3.5 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] md:text-xs font-bold rounded-full shadow-lg shadow-red-500/30 tracking-wide transition-transform duration-200 ease-out hover:scale-105"
                  >
                    FLAT {discount}% OFF
                  </span>
                )}
                {isNew && (
                  <span className="px-2.5 md:px-3 py-1 bg-[#4FBDBA] text-white text-[10px] md:text-xs font-bold rounded-full shadow-sm">
                    NEW
                  </span>
                )}
                {isBestseller && (
                  <span className="px-2.5 md:px-3 py-1 bg-[#2F7F7C] text-white text-[10px] md:text-xs font-bold rounded-full shadow-sm">
                    BEST
                  </span>
                )}
              </>
            )}
          </div>

          {/* ── Quick Actions (top-right) ─────────────────────── */}
          <motion.div
            className="absolute top-3 right-3 flex flex-col gap-2 z-10"
            initial={{ opacity: 0, x: 10 }}
            animate={{
              opacity: isHovered || wishlisted ? 1 : 0,
              x: isHovered || wishlisted ? 0 : 10,
            }}
            transition={{ duration: 0.25 }}
          >
            {/* Wishlist — always available even when out of stock */}
            <motion.button
              onClick={handleWishlistToggle}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`p-2.5 rounded-xl backdrop-blur-md border border-white/40 shadow-md transition-all ${
                wishlisted
                  ? 'bg-[#4FBDBA] text-white'
                  : 'bg-white/90 text-[#2B2B2B] hover:bg-white'
              }`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} />
            </motion.button>

            {/* View detail — always navigable */}
            <Link href={`/product/${slugStr}`}>
              <motion.div
                className="p-2.5 rounded-xl bg-white/90 text-[#2B2B2B] hover:bg-white backdrop-blur-md border border-white/40 shadow-md transition-all cursor-pointer"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-4 h-4" />
              </motion.div>
            </Link>
          </motion.div>

          {/* ── Desktop Quick Add (bottom, on hover) ─────────── */}
          <motion.div
            className="absolute bottom-3 left-3 right-3 hidden md:block z-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 12 }}
            transition={{ duration: 0.25 }}
          >
            {outOfStock ? (
              <div className="w-full py-3 font-semibold rounded-xl flex items-center justify-center gap-2 text-sm bg-[#F6FBFB] border border-[#E7EEEE] text-[#9B9B9B] cursor-not-allowed select-none">
                Currently Unavailable
              </div>
            ) : (
              <motion.button
                className={`w-full py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg ${
                  addedToCart || inCart
                    ? 'bg-[#2F7F7C] text-white'
                    : 'bg-[#4FBDBA] hover:bg-[#2F7F7C] text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleQuickAdd}
              >
                <ShoppingBag className="w-4 h-4" />
                {addedToCart ? 'Added!' : inCart ? 'Add More' : 'Quick Add'}
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* ── Content area (fills remaining height) ──────────── */}
        <Link href={`/product/${slugStr}`} className="flex flex-1 flex-col min-h-0">
          <div className="flex flex-1 flex-col p-4 md:p-5">

            {/* Category + name — name clamped to exactly 2 lines */}
            <div className="flex-1">
              <p className="mb-1.5 text-[10px] md:text-xs font-semibold uppercase tracking-[0.18em] text-[#6B6B6B] truncate">
                {category}
              </p>
              <h3 className="font-heading text-sm md:text-base font-bold leading-snug text-[#2B2B2B] transition-colors duration-300 group-hover:text-[#2F7F7C] line-clamp-2 min-h-[2.6em]">
                {name}
              </h3>
            </div>

            {/* Bottom block — rating + price + mobile CTA always pinned */}
            <div className="mt-3 md:mt-4 space-y-2.5">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#F6C453] text-[#F6C453]" />
                  <span className="text-xs md:text-sm font-semibold text-[#2B2B2B]">{rating}</span>
                </div>
                <span className="hidden sm:inline text-[11px] md:text-xs text-[#6B6B6B]">
                  ({product.reviewsCount ?? 128} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-heading text-lg md:text-xl font-bold text-[#2B2B2B]">
                  Rs. {price.toLocaleString()}
                </span>
                {originalPrice && (
                  <span className="text-xs md:text-sm text-[#8B8B8B] line-through">
                    Rs. {originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Mobile CTA — pinned at bottom, respects outOfStock */}
              {outOfStock ? (
                <div className="md:hidden w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 bg-[#F6FBFB] border border-[#E7EEEE] text-[#9B9B9B] cursor-not-allowed select-none">
                  Currently Unavailable
                </div>
              ) : (
                <button
                  onClick={handleQuickAdd}
                  className={`md:hidden w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                    addedToCart || inCart
                      ? 'bg-[#2F7F7C] text-white'
                      : 'bg-[#4FBDBA] text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {addedToCart ? 'Added!' : 'Add to Cart'}
                </button>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  )
}
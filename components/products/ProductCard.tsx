'use client'

import { motion } from 'framer-motion'
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/cart-context'
import type { Product } from '@/data/products'
import type { LegacyProduct } from '@/lib/sanity/types'

interface ProductCardProps {
  product: Product | LegacyProduct
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
  } = product

  const wishlisted = isInWishlist(id)
  const inCart = isInCart(id)

  const discount = originalPrice
    ? Math.round(
        ((originalPrice - price) / originalPrice) * 100
      )
    : null

  const handleWishlistToggle = (
    e: React.MouseEvent
  ) => {
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

  const handleQuickAdd = (
  e: React.MouseEvent
) => {
  e.preventDefault()
  e.stopPropagation()

  addToCart({
    id,
    slug: product.slug,
    name,
    price,
    originalPrice,
    image,
    category,
  })

  setAddedToCart(true)

  setTimeout(() => {
    setAddedToCart(false)
  }, 2000)
}

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
      <div className="relative h-full overflow-hidden rounded-[1.8rem] border border-[#E7EEEE] bg-white shadow-[0_10px_30px_rgba(79,189,186,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(79,189,186,0.16)] flex flex-col">
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#DDF5F4]/20 via-transparent to-[#FFF4D6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Image Container */}
        <div className="relative overflow-hidden bg-[#F6FBFB] aspect-[4/5]">
          <Link href={`/product/slug/${product.slug}`}>
            <motion.img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              animate={{
                scale: isHovered ? 1.08 : 1,
              }}
              transition={{
                duration: 0.45,
                ease: 'easeOut',
              }}
            />
          </Link>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2F7F7C]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-3 md:top-4 left-3 md:left-4 flex flex-col gap-2">
            {discount && (
              <span className="px-2.5 md:px-3 py-1 bg-[#F6C453] text-[#2B2B2B] text-[10px] md:text-xs font-bold rounded-full shadow-sm">
                {discount}% OFF
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
          </div>

          {/* Quick Actions */}
          <motion.div
            className="absolute top-3 md:top-4 right-3 md:right-4 flex flex-col gap-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{
              opacity: isHovered || wishlisted ? 1 : 0,
              x: isHovered || wishlisted ? 0 : 10,
            }}
            transition={{ duration: 0.25 }}
          >
            {/* Wishlist */}
            <motion.button
              onClick={handleWishlistToggle}
              className={`p-2.5 rounded-xl backdrop-blur-md border border-white/40 shadow-md transition-all ${
                wishlisted
                  ? 'bg-[#4FBDBA] text-white'
                  : 'bg-white/90 text-[#2B2B2B] hover:bg-white'
              }`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart
                className="w-4 h-4"
                fill={
                  wishlisted ? 'currentColor' : 'none'
                }
              />
            </motion.button>

            {/* Preview */}
            <Link href={`/product/slug/${product.slug}`}>
              <motion.div
                className="p-2.5 rounded-xl bg-white/90 text-[#2B2B2B] hover:bg-white backdrop-blur-md border border-white/40 shadow-md transition-all"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-4 h-4" />
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Quick Add */}
          <motion.div
            className="absolute bottom-4 left-4 right-4 hidden md:block"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 20,
            }}
            transition={{ duration: 0.25 }}
          >
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

              {addedToCart
                ? 'Added!'
                : inCart
                ? 'Add More'
                : 'Quick Add'}
            </motion.button>
          </motion.div>
        </div>

        {/* Content */}
        <Link
          href={`/product/slug/${product.slug}`}
          className="flex flex-1 flex-col"
        >
          <div className="flex flex-1 flex-col p-4 md:p-5">
            <div className="flex-1">
              {/* Category */}
              <p className="mb-2 text-[10px] md:text-xs font-semibold uppercase tracking-[0.18em] text-[#6B6B6B] line-clamp-1">
                {category}
              </p>

              {/* Product Name */}
              <h3 className="font-heading text-sm md:text-base font-bold leading-snug text-[#2B2B2B] transition-colors duration-300 group-hover:text-[#2F7F7C] line-clamp-2">
                {name}
              </h3>
            </div>

            <div className="mt-3 md:mt-4 space-y-3">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#F6C453] text-[#F6C453]" />

                  <span className="text-xs md:text-sm font-semibold text-[#2B2B2B]">
                    {rating}
                  </span>
                </div>

                <span className="hidden sm:inline text-[11px] md:text-xs text-[#6B6B6B]">
                  (128 reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-heading text-lg md:text-xl font-bold text-[#2B2B2B]">
                  Rs. {price.toLocaleString()}
                </span>

                {originalPrice && (
                  <span className="text-xs md:text-sm text-[#8B8B8B] line-through">
                    Rs.{' '}
                    {originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Mobile Add To Cart */}
              <button
                onClick={handleQuickAdd}
                className={`md:hidden w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                  addedToCart || inCart
                    ? 'bg-[#2F7F7C] text-white'
                    : 'bg-[#4FBDBA] text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />

                {addedToCart
                  ? 'Added!'
                  : 'Add to Cart'}
              </button>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  )
}

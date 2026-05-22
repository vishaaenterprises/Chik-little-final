'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, X, Heart } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import type { WishlistItem as WishlistItemType } from '@/context/cart-context'

interface WishlistItemProps {
  item: WishlistItemType
}

export default function WishlistItem({
  item,
}: WishlistItemProps) {
  const {
    addToCart,
    removeFromWishlist,
  } = useCart()

  const handleMoveToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      category: item.category,
    })

    removeFromWishlist(item.id)
  }

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        scale: 0.96,
        y: 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.96,
      }}
      transition={{ duration: 0.35 }}
      className="group relative overflow-hidden rounded-[2rem] border border-[#E7EEEE] bg-white shadow-[0_10px_30px_rgba(79,189,186,0.08)] hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(79,189,186,0.14)] transition-all duration-500"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        
        <div className="absolute top-0 left-0 w-28 h-28 bg-[#DDF5F4]/40 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#FFF4D6]/40 rounded-full blur-3xl" />
      </div>

      {/* Remove Button */}
      <motion.button
        onClick={() =>
          removeFromWishlist(item.id)
        }
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md border border-[#E7EEEE] flex items-center justify-center shadow-md hover:bg-[#FFF1F1] hover:text-red-500 transition-all duration-300"
      >
        <X className="w-4 h-4" />
      </motion.button>

      {/* Image */}
      <Link
        href={`/product/${item.id}`}
        className="block relative aspect-[4/4.8] overflow-hidden bg-[#F6FBFB]"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2F7F7C]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          
          {item.isNew && (
            <span className="px-3 py-1 bg-[#4FBDBA] text-white text-[10px] sm:text-xs font-bold rounded-full shadow-sm">
              NEW
            </span>
          )}

          {item.isBestseller && (
            <span className="px-3 py-1 bg-[#F6C453] text-[#2B2B2B] text-[10px] sm:text-xs font-bold rounded-full shadow-sm">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        <div className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-md">
          <Heart className="w-4 h-4 text-[#4FBDBA] fill-[#4FBDBA]" />
        </div>
      </Link>

      {/* Content */}
      <div className="relative p-4 sm:p-5">
        
        {/* Category */}
        <p className="text-[10px] sm:text-xs text-[#6B6B6B] uppercase tracking-[0.18em] mb-2 font-semibold">
          {item.category}
        </p>

        {/* Product Name */}
        <Link href={`/product/${item.id}`}>
          <h3 className="font-heading font-bold text-sm sm:text-xl text-[#2B2B2B] group-hover:text-[#2F7F7C] transition-colors line-clamp-2 min-h-[52px] leading-snug">
            {item.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex flex-wrap items-center gap-2 mt-3 mb-5">
          
          <span className="font-heading font-bold text-lg sm:text-2xl text-[#2B2B2B]">
            Rs. {item.price.toLocaleString()}
          </span>

          {item.originalPrice && (
            <span className="text-xs sm:text-sm text-[#8B8B8B] line-through">
              Rs.{' '}
              {item.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add To Cart */}
        <motion.button
          onClick={handleMoveToCart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-12 sm:h-14 rounded-2xl bg-[#4FBDBA] hover:bg-[#2F7F7C] text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-[0_12px_30px_rgba(79,189,186,0.22)] hover:shadow-[0_18px_40px_rgba(79,189,186,0.3)]"
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />

          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  )
}
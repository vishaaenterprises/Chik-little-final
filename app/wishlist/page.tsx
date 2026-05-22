'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import WishlistItem from '@/components/wishlist/WishlistItem'
import { useCart } from '@/context/cart-context'
import { Heart, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react'

export default function WishlistPage() {
  const { wishlistItems } = useCart()

  if (wishlistItems.length === 0) {
    return (
      <MainLayout>
        {/* Soft ambient background */}
        <div className="min-h-[70vh] relative overflow-hidden flex items-center justify-center px-4 py-20">
          {/* Background glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4FBDBA]/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#F6C453]/10 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            className="relative text-center max-w-md mx-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Icon container */}
            <div className="relative w-28 h-28 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#DDF5F4] to-[#FFF4D6] rounded-[2rem] shadow-[0_10px_40px_rgba(79,189,186,0.15)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-12 h-12 text-[#4FBDBA]/40" strokeWidth={1.5} />
              </div>
              {/* Floating hearts */}
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-[#F6C453]/30 rounded-full flex items-center justify-center"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart className="w-3 h-3 text-[#F6C453]" fill="currentColor" />
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -left-3 w-5 h-5 bg-[#4FBDBA]/20 rounded-full flex items-center justify-center"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
              >
                <Heart className="w-2.5 h-2.5 text-[#4FBDBA]" fill="currentColor" />
              </motion.div>
            </div>

            <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#2B2B2B] mb-3 tracking-tight">
              Your Wishlist is Empty
            </h1>
            <p className="text-[#6B6B6B] text-base leading-relaxed mb-8">
              Save items you love by clicking the{' '}
              <Heart className="inline w-4 h-4 text-red-400 mx-0.5" fill="currentColor" />
              icon on any product.
            </p>

            <Link
              href="/category/all"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#4FBDBA] text-white font-semibold rounded-2xl shadow-[0_12px_30px_rgba(79,189,186,0.28)] hover:bg-[#2F7F7C] hover:shadow-[0_16px_40px_rgba(79,189,186,0.34)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </Link>
          </motion.div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {/* Soft page background */}
      <div className="min-h-screen bg-[#F6FBFB] relative">
        {/* Top ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-[#4FBDBA]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-0 w-80 h-80 bg-[#F6C453]/6 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          >
            <div>
              {/* Pill label */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DDF5F4] rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#4FBDBA]" />
                <span className="text-[#2F7F7C] text-xs font-semibold tracking-wide uppercase">
                  Your Collection
                </span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="font-heading text-3xl md:text-5xl font-bold text-[#2B2B2B] tracking-tight">
                  My Wishlist
                </h1>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                  className="w-10 h-10 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center shadow-sm"
                >
                  <Heart className="w-5 h-5 text-red-400" fill="currentColor" />
                </motion.div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-[#6B6B6B] font-medium">
                <span className="text-[#2B2B2B] font-bold text-lg">{wishlistItems.length}</span>{' '}
                {wishlistItems.length === 1 ? 'item saved' : 'items saved'}
              </span>
              {/* Decorative count bar */}
              <div className="hidden sm:flex gap-1">
                {Array.from({ length: Math.min(wishlistItems.length, 8) }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-5 bg-[#4FBDBA] rounded-full"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.06 + 0.2, duration: 0.4 }}
                    style={{ opacity: 0.3 + (i / 8) * 0.7 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Subtle divider */}
          <div className="h-px bg-gradient-to-r from-[#E7EEEE] via-[#4FBDBA]/20 to-transparent mb-10" />

          {/* Wishlist grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <WishlistItem item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Bottom continue shopping */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between mt-12 pt-8 border-t border-[#E7EEEE]"
          >
            <Link
              href="/category/all"
              className="inline-flex items-center gap-2 text-[#4FBDBA] hover:text-[#2F7F7C] font-semibold transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Continue Shopping
            </Link>

            <Link
              href="/cart"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#F6C453] text-[#2B2B2B] font-semibold rounded-2xl shadow-[0_8px_24px_rgba(246,196,83,0.28)] hover:bg-[#e8b63e] hover:shadow-[0_12px_32px_rgba(246,196,83,0.36)] transition-all duration-300 hover:-translate-y-0.5 text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Go to Cart
            </Link>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}
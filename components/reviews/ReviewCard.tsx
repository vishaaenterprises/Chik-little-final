'use client'

// components/reviews/ReviewCard.tsx
// ─────────────────────────────────────────────────────────────
//  Single review / testimonial card. Shared by the home page
//  slider, the product-detail slider, and the full "/reviews"
//  listing page so the look stays consistent everywhere.
// ─────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, Quote, BadgeCheck } from 'lucide-react'
import type { SanityTestimonial } from '@/lib/sanity/types'

interface ReviewCardProps {
  testimonial: SanityTestimonial
  index?: number
  /** Show a small "Purchased: <product>" link when available */
  showProductLink?: boolean
  className?: string
}

export default function ReviewCard({
  testimonial,
  index = 0,
  showProductLink = true,
  className = '',
}: ReviewCardProps) {
  return (
    <motion.div
      className={`group relative bg-white border border-[#E7EEEE] rounded-[2rem] p-7 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(79,189,186,0.12)] h-full flex flex-col ${className}`}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 4) * 0.08, duration: 0.45 }}
    >
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#DDF5F4]/20 via-transparent to-[#FFF4D6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Quote Icon */}
      <div className="relative z-10 mb-5">
        <Quote className="w-10 h-10 text-[#4FBDBA]/30" />
      </div>

      {/* Review */}
      <p className="relative z-10 text-[#6B6B6B] text-[15px] leading-relaxed mb-6 line-clamp-4 flex-1">
        &ldquo;{testimonial.review}&rdquo;
      </p>

      {/* Rating + Verified badge */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-5 flex-wrap">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < (testimonial.rating || 5)
                  ? 'fill-[#F6C453] text-[#F6C453]'
                  : 'text-[#E7EEEE] fill-[#E7EEEE]'
              }`}
            />
          ))}
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#DDF5F4] rounded-full text-[10.5px] font-bold uppercase tracking-wide text-[#2F7F7C]">
          <BadgeCheck className="w-3.5 h-3.5" />
          Verified Review
        </span>
      </div>

      {/* Customer Info */}
      <div className="relative z-10 flex items-center gap-4 pt-5 border-t border-[#E7EEEE]">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#DDF5F4] border-2 border-[#DDF5F4] shadow-sm flex items-center justify-center">
            <span className="font-heading font-bold text-[#2F7F7C] text-lg">
              {testimonial.customerName?.trim()?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#4FBDBA] border-2 border-white flex items-center justify-center">
            <BadgeCheck className="w-3 h-3 text-white" strokeWidth={2.5} />
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-[#2B2B2B] truncate">{testimonial.customerName}</p>
          {testimonial.location && (
            <p className="text-sm text-[#6B6B6B] truncate">{testimonial.location}</p>
          )}
        </div>
      </div>

      {/* Purchased product link */}
      {showProductLink && testimonial.productPurchased?.slug && (
        <Link
          href={`/product/${testimonial.productPurchased.slug}`}
          className="relative z-10 mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#4FBDBA] hover:text-[#2F7F7C] transition-colors"
        >
          Purchased: {testimonial.productPurchased.productName}
        </Link>
      )}
    </motion.div>
  )
}
'use client'

// components/reviews/ReviewsCarousel.tsx
// ─────────────────────────────────────────────────────────────
//  Left/right sliding reviews carousel. Used on:
//   - Home page  → all active testimonials
//   - Product page → reviews for that product (or a fallback)
//  Both drop a "View More Reviews" button that links to the
//  full "/reviews" listing page.
// ─────────────────────────────────────────────────────────────

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import ReviewCard from './ReviewCard'
import type { SanityTestimonial } from '@/lib/sanity/types'

interface ReviewsCarouselProps {
  reviews: SanityTestimonial[]
  eyebrow?: string
  title?: string
  description?: string
  viewMoreHref?: string
  viewMoreLabel?: string
  /** Show the "Purchased: <product>" link on each card */
  showProductLink?: boolean
  className?: string
}

// Neutralises the default absolute positioning on CarouselPrevious/Next
// so they can sit inline in a normal flex row instead of floating
// outside the section on smaller screens.
const NAV_BUTTON_CLASSES =
  'static translate-x-0 translate-y-0 top-auto left-auto right-auto bottom-auto ' +
  'w-10 h-10 bg-white border-[#E7EEEE] text-[#2B2B2B] shadow-sm hover:bg-[#4FBDBA] hover:text-white hover:border-[#4FBDBA] disabled:opacity-40'

export default function ReviewsCarousel({
  reviews,
  eyebrow = 'Customer Stories',
  title = 'Loved by Families Everywhere',
  description = 'Hear from parents who have experienced the Little Chiku difference',
  viewMoreHref = '/reviews',
  viewMoreLabel = 'View More Reviews',
  showProductLink = false,
  className = '',
}: ReviewsCarouselProps) {
  if (!reviews || reviews.length === 0) return null

  return (
    <section className={`relative overflow-hidden py-20 md:py-28 bg-[#FFFDF7] ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-[#DDF5F4]/40 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[380px] h-[380px] bg-[#FFF4D6]/50 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DDF5F4] border border-[#BFE9E7] mb-5">
            <span className="w-2 h-2 rounded-full bg-[#4FBDBA]" />
            <span className="text-sm font-semibold uppercase tracking-wide text-[#2F7F7C]">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#2B2B2B] mb-4 text-balance">
            {title}
          </h2>

          {description && (
            <p className="max-w-2xl mx-auto text-[#6B6B6B] text-lg leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>

        {/* Slider */}
        <Carousel
          opts={{ align: 'start', loop: reviews.length > 4 }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {reviews.map((testimonial, idx) => (
              <CarouselItem
                key={testimonial._id}
                className="pl-4 md:pl-6 basis-[82%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <ReviewCard
                  testimonial={testimonial}
                  index={idx}
                  showProductLink={showProductLink}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Controls: prev · view more · next */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-10 flex-wrap">
            <CarouselPrevious className={NAV_BUTTON_CLASSES} />

            {viewMoreHref && (
              <Link
                href={viewMoreHref}
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#4FBDBA] text-white rounded-full font-bold text-sm shadow-[0_10px_24px_rgba(79,189,186,0.28)] hover:bg-[#2F7F7C] hover:shadow-[0_14px_32px_rgba(79,189,186,0.35)] hover:-translate-y-0.5 transition-all duration-300"
              >
                {viewMoreLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <CarouselNext className={NAV_BUTTON_CLASSES} />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
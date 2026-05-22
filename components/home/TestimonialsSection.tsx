'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import type { SanityTestimonial } from '@/lib/sanity'
import { getImageUrl } from '@/lib/sanity/image'

interface TestimonialsSectionProps {
  testimonials: SanityTestimonial[]
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-[#FFFDF7]">
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
              Customer Stories
            </span>
          </div>

          <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#2B2B2B] mb-4 text-balance">
            Loved by Families
            <br className="hidden sm:block" />
            Everywhere
          </h2>

          <p className="max-w-2xl mx-auto text-[#6B6B6B] text-lg leading-relaxed">
            Hear from parents who have experienced the Little Chiku difference
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.slice(0, 6).map((testimonial, idx) => (
            <motion.div
              key={testimonial._id}
              className="group relative bg-white border border-[#E7EEEE] rounded-[2rem] p-7 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(79,189,186,0.12)]"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.45 }}
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#DDF5F4]/20 via-transparent to-[#FFF4D6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Quote Icon */}
              <div className="relative z-10 mb-5">
                <Quote className="w-10 h-10 text-[#4FBDBA]/30" />
              </div>

              {/* Review */}
              <p className="relative z-10 text-[#6B6B6B] text-[15px] leading-relaxed mb-6 line-clamp-4">
                &ldquo;{testimonial.review}&rdquo;
              </p>

              {/* Rating */}
              <div className="relative z-10 flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'fill-[#F6C453] text-[#F6C453]'
                        : 'text-[#E7EEEE] fill-[#E7EEEE]'
                    }`}
                  />
                ))}
              </div>

              {/* Customer Info */}
              <div className="relative z-10 flex items-center gap-4 pt-5 border-t border-[#E7EEEE]">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#DDF5F4] shadow-sm">
                  <img
                    src={testimonial.customerImage ? getImageUrl(testimonial.customerImage) : '/placeholder-user.jpg'}
                    alt={testimonial.customerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-[#2B2B2B]">{testimonial.customerName}</p>
                  {testimonial.location && (
                    <p className="text-sm text-[#6B6B6B]">{testimonial.location}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

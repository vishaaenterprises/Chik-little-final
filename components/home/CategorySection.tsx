'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import type { LegacyProduct } from '@/lib/sanity/types'

interface CategorySectionProps {
  title: string
  subtitle: string
  description: string
  products: LegacyProduct[]
  href: string
  bgColor: string
  accentColor: string
  reversed?: boolean
}

export default function CategorySection({
  title,
  subtitle,
  description,
  products,
  href,
  bgColor,
  accentColor,
  reversed = false,
}: CategorySectionProps) {
  return (
    <section
      className={`relative overflow-hidden py-20 md:py-28 ${bgColor}`}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#DDF5F4]/30 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />

        <div className="absolute bottom-0 right-0 w-[320px] h-[320px] bg-[#FFF4D6]/40 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14 ${
            reversed ? 'md:flex-row-reverse text-right' : ''
          }`}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Left Content */}
          <div className={reversed ? 'md:text-right' : ''}>
            {/* Subtitle Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#E7EEEE] mb-5`}
            >
              <span className="w-2 h-2 rounded-full bg-[#F6C453]" />

              <span
                className={`text-sm font-semibold uppercase tracking-wide ${accentColor}`}
              >
                {subtitle}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#2B2B2B] mb-4 text-balance">
              {title}
            </h2>

            {/* Description */}
            <p className="text-[#6B6B6B] text-lg leading-relaxed max-w-xl">
              {description}
            </p>
          </div>

          {/* CTA */}
          <Link href={href}>
            <motion.button
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#4FBDBA] hover:bg-[#2F7F7C] text-white font-semibold tracking-wide shadow-[0_12px_30px_rgba(79,189,186,0.18)] hover:shadow-[0_18px_40px_rgba(79,189,186,0.28)] transition-all duration-300 whitespace-nowrap"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              View All

              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: idx * 0.08,
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

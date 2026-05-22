'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, Grid2X2 } from 'lucide-react'

interface CategoryItem {
  slug: string
  name: string
  image: string
}

interface CategorySidebarProps {
  categories?: CategoryItem[]
  currentSlug?: string
  onCategoryClick?: () => void
}

export default function CategorySidebar({
  categories = [],
  currentSlug,
  onCategoryClick,
}: CategorySidebarProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#E7EEEE] bg-white p-5 shadow-[0_10px_35px_rgba(79,189,186,0.08)]">
      
      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#DDF5F4]/40 rounded-full blur-3xl" />

        <div className="absolute bottom-0 left-0 w-28 h-28 bg-[#FFF4D6]/40 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative mb-6 flex items-center gap-3 px-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#BFE9E7] bg-[#DDF5F4]">
          <Grid2X2 className="h-5 w-5 text-[#2F7F7C]" />
        </div>

        <div>
          <h3 className="font-heading text-xl font-bold text-[#2B2B2B]">
            Categories
          </h3>

          <p className="mt-0.5 text-xs text-[#6B6B6B]">
            Explore collections
          </p>
        </div>
      </div>

      {/* Category List */}
      <div className="relative space-y-2">

        {/* All Products */}
        <Link
          href="/category/all"
          onClick={onCategoryClick}
          className={`group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${
            currentSlug === 'all'
              ? 'bg-[#4FBDBA] text-white shadow-[0_12px_30px_rgba(79,189,186,0.25)]'
              : 'bg-[#F8FBFB] text-[#2B2B2B] hover:bg-[#DDF5F4]'
          }`}
        >
          <div>
            <span className="text-sm font-semibold">
              All Products
            </span>

            <p
              className={`mt-1 text-xs ${
                currentSlug === 'all'
                  ? 'text-white/70'
                  : 'text-[#6B6B6B]'
              }`}
            >
              Browse everything
            </p>
          </div>

          <ChevronRight
            className={`h-4 w-4 transition-transform duration-300 ${
              currentSlug === 'all'
                ? 'text-white'
                : 'text-[#6B6B6B] group-hover:translate-x-1 group-hover:text-[#2F7F7C]'
            }`}
          />
        </Link>

        {/* Categories */}
        {(categories || []).map((cat, idx) => (
          <motion.div
            key={cat.slug || idx}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: idx * 0.05,
              duration: 0.35,
            }}
          >
            <Link
              href={`/category/${cat.slug}`}
              onClick={onCategoryClick}
              className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-300 ${
                currentSlug === cat.slug
                  ? 'bg-[#4FBDBA] text-white shadow-[0_12px_30px_rgba(79,189,186,0.25)]'
                  : 'bg-white text-[#2B2B2B] hover:bg-[#F6FBFB]'
              }`}
            >

              {/* Image */}
              <div
                className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border transition-all duration-300 ${
                  currentSlug === cat.slug
                    ? 'border-white/30'
                    : 'border-[#E7EEEE]'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <h4
                  className={`truncate text-sm font-semibold ${
                    currentSlug === cat.slug
                      ? 'text-white'
                      : 'text-[#2B2B2B]'
                  }`}
                >
                  {cat.name}
                </h4>

                <p
                  className={`mt-0.5 text-xs ${
                    currentSlug === cat.slug
                      ? 'text-white/70'
                      : 'text-[#6B6B6B]'
                  }`}
                >
                  Explore collection
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight
                className={`h-4 w-4 transition-all duration-300 ${
                  currentSlug === cat.slug
                    ? 'text-white'
                    : 'text-[#A0A0A0] group-hover:translate-x-1 group-hover:text-[#2F7F7C]'
                }`}
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, Grid2X2 } from 'lucide-react'
import { categories } from '@/data/categories'

interface CategorySidebarProps {
  currentSlug?: string
  onCategoryClick?: () => void
}

export default function CategorySidebar({
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
      <div className="relative flex items-center gap-3 mb-6 px-1">
        <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#DDF5F4] border border-[#BFE9E7]">
          <Grid2X2 className="w-5 h-5 text-[#2F7F7C]" />
        </div>

        <div>
          <h3 className="font-heading text-xl font-bold text-[#2B2B2B]">
            Categories
          </h3>

          <p className="text-xs text-[#6B6B6B] mt-0.5">
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
              : 'bg-[#F8FBFB] hover:bg-[#DDF5F4] text-[#2B2B2B]'
          }`}
        >
          <div>
            <span className="font-semibold text-sm">
              All Products
            </span>

            <p
              className={`text-xs mt-1 ${
                currentSlug === 'all'
                  ? 'text-white/70'
                  : 'text-[#6B6B6B]'
              }`}
            >
              Browse everything
            </p>
          </div>

          <ChevronRight
            className={`w-4 h-4 transition-transform duration-300 ${
              currentSlug === 'all'
                ? 'text-white'
                : 'text-[#6B6B6B] group-hover:translate-x-1 group-hover:text-[#2F7F7C]'
            }`}
          />
        </Link>

        {/* Categories */}
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.slug}
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
                  : 'bg-white hover:bg-[#F6FBFB] text-[#2B2B2B]'
              }`}
            >
              {/* Image */}
              <div
                className={`relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border transition-all duration-300 ${
                  currentSlug === cat.slug
                    ? 'border-white/30'
                    : 'border-[#E7EEEE]'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <span className="block font-semibold text-sm truncate">
                  {cat.name}
                </span>

                <p
                  className={`text-xs mt-1 truncate ${
                    currentSlug === cat.slug
                      ? 'text-white/70'
                      : 'text-[#6B6B6B]'
                  }`}
                >
                  {cat.subcategories.length} subcategories
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight
                className={`w-4 h-4 transition-all duration-300 ${
                  currentSlug === cat.slug
                    ? 'text-white'
                    : 'text-[#6B6B6B] group-hover:text-[#2F7F7C] group-hover:translate-x-1'
                }`}
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
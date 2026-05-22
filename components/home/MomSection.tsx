'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import type { LegacyProduct } from '@/lib/sanity/types'

interface MomSectionProps {
  products: LegacyProduct[]
}

export default function MomSection({
  products,
}: MomSectionProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-[#FFFDF7]">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Turquoise Glow */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#DDF5F4]/40 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />

        {/* Yellow Glow */}
        <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-[#FFF4D6]/50 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

        {/* Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(79,189,186,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,189,186,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center mb-20">
          
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-[#E7EEEE] shadow-[0_20px_50px_rgba(79,189,186,0.12)]">
              <img
                src="/mom-1.jpg"
                alt="Mother and child moment"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2F7F7C]/10 via-transparent to-transparent" />
            </div>

            {/* Floating Image */}
            <div className="absolute -bottom-7 -right-7 hidden md:block w-36 h-36 rounded-[1.75rem] overflow-hidden border-4 border-white bg-white shadow-[0_15px_35px_rgba(0,0,0,0.08)]">
              <img
                src="/mom-2.jpg"
                alt="Motherhood detail"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Decorative Badge */}
            <div className="absolute top-5 left-5 hidden sm:flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#E7EEEE] shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F6C453]" />

              <span className="text-sm font-semibold text-[#2F7F7C]">
                Crafted with Love
              </span>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            className="space-y-7"
          >
            {/* Label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DDF5F4] border border-[#BFE9E7]">
              <span className="w-2 h-2 rounded-full bg-[#4FBDBA]" />

              <span className="text-sm font-semibold tracking-wide uppercase text-[#2F7F7C]">
                For the Heart of Home
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-heading text-4xl md:text-5xl xl:text-6xl font-bold leading-tight text-[#2B2B2B] text-balance">
              Mom&apos;s Corner
            </h2>

            {/* Description */}
            <p className="max-w-xl text-lg leading-relaxed text-[#6B6B6B]">
              Celebrate the beautiful journey of motherhood with our
              thoughtfully curated collection. Every piece is designed
              to bring warmth, comfort, and timeless elegance into
              everyday moments.
            </p>

            {/* Quote */}
            <blockquote className="relative max-w-xl border-l-4 border-[#F6C453] pl-6 py-3 italic text-[#2B2B2B] bg-white/70 backdrop-blur-sm rounded-r-2xl shadow-sm">
              <span className="absolute -left-[10px] top-5 w-4 h-4 rounded-full bg-[#F6C453]" />

              &ldquo;The smallest things take up the most room in your
              heart.&rdquo;
            </blockquote>

            {/* CTA */}
            <Link href="/category/moms-corner">
              <motion.button
                className="group mt-3 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#4FBDBA] hover:bg-[#2F7F7C] text-white font-semibold tracking-wide shadow-[0_12px_30px_rgba(79,189,186,0.22)] hover:shadow-[0_18px_40px_rgba(79,189,186,0.3)] transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Collection

                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>

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

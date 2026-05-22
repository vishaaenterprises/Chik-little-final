'use client'

import { motion } from 'framer-motion'

interface CategoryBannerProps {
  title: string
  description: string
  productCount: number
  color: string
}

export default function CategoryBanner({
  title,
  description,
  productCount,
  color,
}: CategoryBannerProps) {
  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${color}`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30" />

        {/* Turquoise Glow */}
        <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-[#DDF5F4]/50 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />

        {/* Sunflower Glow */}
        <div className="absolute bottom-0 right-0 w-[320px] h-[320px] bg-[#FFF4D6]/50 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

        {/* Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(79,189,186,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,189,186,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="max-w-3xl">
          
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DDF5F4] border border-[#BFE9E7] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#4FBDBA]" />

              <span className="text-xs font-semibold uppercase tracking-wide text-[#2F7F7C]">
                Premium Collection
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-heading text-4xl md:text-6xl lg:text-6xl font-bold text-[#2B2B2B] mb-5 leading-tight text-balance">
              {title}
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-[#6B6B6B] max-w-2xl leading-relaxed">
              {description}
            </p>

            {/* Product Count */}
            <div className="mt-7 flex items-center gap-4 flex-wrap">
              
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-[#E7EEEE] shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F6C453]" />

                <span className="text-sm font-semibold text-[#2B2B2B]">
                  {productCount} Products
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-sm text-[#6B6B6B]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4FBDBA]" />
                Handcrafted with love
              </div>

              <div className="hidden sm:flex items-center gap-2 text-sm text-[#6B6B6B]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F6C453]" />
                Premium organic fabrics
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
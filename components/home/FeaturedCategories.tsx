'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface CategoryData {
  name: string
  href: string
  image: string
  color: string
  accent: string
}

interface FeaturedCategoriesProps {
  categories?: CategoryData[]
}

const defaultCategories: CategoryData[] = [
  {
    name: 'Bath Linen',
    href: '/category/bath-linen',
    image: '/home-1.jpg',
    color: 'bg-[#EAF8F7]',
    accent: 'text-[#2F7F7C]',
  },
  {
    name: 'Bedding',
    href: '/category/bedding',
    image: '/home-2.jpg',
    color: 'bg-[#FFF8EA]',
    accent: 'text-[#D89B1D]',
  },
  {
    name: 'Bags',
    href: '/category/bags',
    image: '/kids-1.jpg',
    color: 'bg-[#F3FAFA]',
    accent: 'text-[#4FBDBA]',
  },
  {
    name: 'Accessories',
    href: '/category/kids-accessories',
    image: '/kids-2.jpg',
    color: 'bg-[#FFFDF7]',
    accent: 'text-[#D89B1D]',
  },
  {
    name: 'Clothing',
    href: '/category/clothing',
    image: '/kids-3.jpg',
    color: 'bg-[#EDF9F8]',
    accent: 'text-[#2F7F7C]',
  },
  {
    name: 'Gifts',
    href: '/category/return-gifts',
    image: '/gift-1.jpg',
    color: 'bg-[#FFF4D6]',
    accent: 'text-[#B88214]',
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export default function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories

  return (
    <section className="relative overflow-hidden py-18 md:py-20 bg-white">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[380px] h-[380px] bg-[#DDF5F4]/35 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />

        <div className="absolute bottom-0 right-0 w-[320px] h-[320px] bg-[#FFF4D6]/40 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DDF5F4] border border-[#BFE9E7] mb-5">
            <span className="w-2 h-2 rounded-full bg-[#4FBDBA]" />

            <span className="text-sm font-semibold uppercase tracking-wide text-[#2F7F7C]">
              Explore Collections
            </span>
          </div>

          <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#2B2B2B] mb-4">
            Crafted for Every
            <br className="hidden sm:block" />
            Little Moment
          </h2>

          <p className="max-w-2xl mx-auto text-[#6B6B6B] text-lg leading-relaxed">
            Discover thoughtfully designed collections blending comfort,
            elegance, and handcrafted charm for growing families.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {displayCategories.slice(0, 6).map((cat) => (
            <motion.div key={cat.name} variants={fadeInUp}>
              <Link href={cat.href}>
                <motion.div
                  className={`group relative overflow-hidden rounded-[1.75rem] border border-[#E7EEEE] ${cat.color} p-5 text-center cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_18px_45px_rgba(79,189,186,0.14)]`}
                  whileHover={{ y: -4 }}
                >
                  {/* Decorative Glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Image */}
                  <div className="relative w-20 h-20 mx-auto mb-5 rounded-2xl overflow-hidden border border-white/70 shadow-md">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Name */}
                  <p
                    className={`relative text-sm md:text-[15px] font-bold tracking-wide ${cat.accent}`}
                  >
                    {cat.name}
                  </p>

                  {/* Bottom Accent */}
                  <div className="mt-4 flex justify-center">
                    <div className="w-10 h-1 rounded-full bg-gradient-to-r from-[#4FBDBA] to-[#F6C453]" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'

const images = [
  '/kids-1.jpg',
  '/mom-1.jpg',
  '/home-1.jpg',
  '/gift-1.jpg',
  '/kids-2.jpg',
  '/mom-2.jpg',
]

export default function InstagramSection() {
  return (
    <section className="py-20 bg-[#F6FBFB] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#DDF5F4]/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#FFF4D6]/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DDF5F4] border border-[#BFE9E7] mb-5">
            <Instagram className="w-4 h-4 text-[#2F7F7C]" />
            <span className="text-sm font-semibold tracking-wide text-[#2F7F7C] uppercase">
              Follow Our Journey
            </span>
          </div>

          <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#2B2B2B] mb-4">
            @littlechiku.store
          </h2>

          <p className="max-w-2xl mx-auto text-[#6B6B6B] text-base md:text-lg leading-relaxed">
            Discover handcrafted moments, premium baby essentials,
            cozy corners, and everyday joy from our world to yours.
          </p>
        </motion.div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer bg-white border border-[#E7EEEE] shadow-[0_10px_30px_rgba(79,189,186,0.08)]"
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: idx * 0.05,
                duration: 0.45,
              }}
              whileHover={{
                y: -6,
              }}
            >
              {/* Image */}
              <img
                src={img}
                alt="Little Chiku Instagram"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2F7F7C]/70 via-[#2F7F7C]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

              {/* Instagram Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 shadow-lg">
                  <Instagram className="w-6 h-6 text-[#F6C453]" />
                </div>
              </div>

              {/* Decorative Border */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 group-hover:ring-[#F6C453]/50 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="flex justify-center mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a
            href="https://www.instagram.com/littlechikukids/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-7 py-3 rounded-full bg-[#4FBDBA] hover:bg-[#2F7F7C] text-white font-semibold tracking-wide transition-all duration-300 shadow-[0_12px_30px_rgba(79,189,186,0.22)] hover:shadow-[0_16px_40px_rgba(79,189,186,0.3)]"
          >
            <Instagram className="w-5 h-5" />
            Follow on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'
import { Heart, Shield, Truck } from 'lucide-react'

const features = [
  {
    icon: Heart,
    title: 'Handcrafted with Love',
    description:
      'Each piece is carefully made by skilled artisans using traditional techniques passed down through generations.',
    iconBg: 'bg-[#DDF5F4]',
    iconColor: 'text-[#2F7F7C]',
    glow: 'shadow-[0_12px_30px_rgba(79,189,186,0.18)]',
  },
  {
    icon: Shield,
    title: '100% Organic Cotton',
    description:
      'We use only certified organic cotton that is gentle on delicate skin and kind to our planet.',
    iconBg: 'bg-[#FFF4D6]',
    iconColor: 'text-[#D89B1D]',
    glow: 'shadow-[0_12px_30px_rgba(246,196,83,0.18)]',
  },
  {
    icon: Truck,
    title: 'Thoughtful Packaging',
    description:
      'Every order arrives in eco-friendly packaging, ready to gift or keep as a treasured keepsake.',
    iconBg: 'bg-[#EAF8F7]',
    iconColor: 'text-[#4FBDBA]',
    glow: 'shadow-[0_12px_30px_rgba(79,189,186,0.15)]',
  },
]

export default function TrustSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-white">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-[#DDF5F4]/40 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />

        <div className="absolute bottom-0 right-0 w-[380px] h-[380px] bg-[#FFF4D6]/50 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(79,189,186,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,189,186,0.03)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DDF5F4] border border-[#BFE9E7] mb-5">
            <span className="w-2 h-2 rounded-full bg-[#4FBDBA]" />

            <span className="text-sm font-semibold uppercase tracking-wide text-[#2F7F7C]">
              Why Parents Trust Us
            </span>
          </div>

          <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#2B2B2B] mb-5 text-balance">
            Crafted for Comfort,
            <br className="hidden sm:block" />
            Designed with Care
          </h2>

          <p className="text-[#6B6B6B] text-lg leading-relaxed max-w-2xl mx-auto">
            Every Little Chiku product reflects our commitment to
            premium craftsmanship, sustainability, and timeless comfort
            for growing families.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon

            return (
              <motion.div
                key={idx}
                className="group relative bg-white border border-[#E7EEEE] rounded-[2rem] p-8 md:p-10 text-center overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(79,189,186,0.12)]"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: idx * 0.12,
                  duration: 0.45,
                }}
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#DDF5F4]/20 via-transparent to-[#FFF4D6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon */}
                <div
                  className={`relative z-10 w-20 h-20 rounded-[1.75rem] ${feature.iconBg} ${feature.glow} flex items-center justify-center mx-auto mb-7 transition-transform duration-500 group-hover:scale-105`}
                >
                  <Icon
                    className={`w-9 h-9 ${feature.iconColor}`}
                  />
                </div>

                {/* Title */}
                <h3 className="relative z-10 font-heading text-2xl font-bold mb-4 text-[#2B2B2B]">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="relative z-10 text-[#6B6B6B] text-[15px] leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Bottom Line */}
                <div className="relative z-10 mt-8 flex justify-center">
                  <div className="w-14 h-1 rounded-full bg-gradient-to-r from-[#4FBDBA] to-[#F6C453]" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
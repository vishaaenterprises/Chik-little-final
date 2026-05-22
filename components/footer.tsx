'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Instagram,
  Facebook,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

const footerLinks = {
  shop: [
    { label: 'Bath Linen', href: '/category/bath-linen' },
    { label: 'Bedding', href: '/category/bedding' },
    { label: 'Bags', href: '/category/bags' },
    {
      label: 'Kids Accessories',
      href: '/category/kids-accessories',
    },
    { label: 'Clothing', href: '/category/clothing' },
    {
      label: "Mom's Corner",
      href: '/category/moms-corner',
    },
    {
      label: 'Return Gifts',
      href: '/category/return-gifts',
    },
  ],

  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Info', href: '/shipping' },
    {
      label: 'Returns & Exchanges',
      href: '/returns',
    },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'FAQ', href: '/contact#faq' },
    { label: 'Track Order', href: '/track-order' },
  ],

  company: [
    { label: 'Our Story', href: '/about' },
    {
      label: 'Sustainability',
      href: '/sustainability',
    },
    {
      label: 'Artisan Partners',
      href: '/artisans',
    },
    { label: 'Blog', href: '/blog' },
    { label: 'Privacy Policy', href: '/privacy' },
    {
      label: 'Terms & Conditions',
      href: '/terms',
    },
  ],
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] =
    useState(false)

  const handleSubscribe = (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    if (email) {
      setIsSubscribed(true)
      setEmail('')

      setTimeout(() => {
        setIsSubscribed(false)
      }, 3000)
    }
  }

  return (
    <footer className="relative overflow-hidden bg-[#1F4F4D] text-white pt-14 pb-5 mt-auto">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[380px] h-[380px] bg-[#4FBDBA]/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />

        <div className="absolute bottom-0 right-0 w-[260px] h-[260px] bg-[#F6C453]/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center mb-4"
            >
              <div className="relative w-[170px] h-[65px]">
                <Image
                  src="/logo1.png"
                  alt="Little Chiku"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="text-white/65 leading-relaxed mb-5 max-w-md text-[15px]">
              Handcrafted with love in Jaipur, India.
              We create premium organic cotton
              essentials that nurture your little ones
              while supporting traditional artisans.
            </p>

            {/* Contact */}
            <div className="space-y-3">
              <a
                href="mailto:hello@littlechiku.in"
                className="flex items-center gap-3 text-white/65 hover:text-[#F6C453] transition-colors"
              >
                <Mail className="w-4 h-4" />

                <span className="text-sm">
                  hello@littlechiku.in
                </span>
              </a>

              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 text-white/65 hover:text-[#F6C453] transition-colors"
              >
                <Phone className="w-4 h-4" />

                <span className="text-sm">
                  +91 98765 43210
                </span>
              </a>

              <div className="flex items-center gap-3 text-white/65">
                <MapPin className="w-4 h-4" />

                <span className="text-sm">
                  Jaipur, Rajasthan, India
                </span>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-5">
              {[
                {
                  icon: Instagram,
                  href: '#',
                },
                {
                  icon: Facebook,
                  href: '#',
                },
              ].map((social, idx) => {
                const Icon = social.icon

                return (
                  <motion.a
                    key={idx}
                    href={social.href}
                    className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#4FBDBA] hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(
            ([section, links]) => (
              <div key={section}>
                <h3 className="font-heading text-lg font-bold text-white mb-5 capitalize">
                  {section}
                </h3>

                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-white/65 hover:text-[#F6C453] text-sm transition-all duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* Bottom */}
        <div className="pt-5 border-t border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <p className="text-sm text-white/50 text-center md:text-left">
            © {new Date().getFullYear()} Little
            Chiku. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-sm text-white/50">
            <Link
              href="/privacy"
              className="hover:text-[#F6C453] transition-colors"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="hover:text-[#F6C453] transition-colors"
            >
              Terms
            </Link>

            <Link
              href="/returns"
              className="hover:text-[#F6C453] transition-colors"
            >
              Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Heart,
  ShoppingCart,
  Search,
  Menu,
  ChevronDown,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useCart } from '@/context/cart-context'
import MobileMenu from './MobileMenu'
import SearchModal from './SearchModal'
import BottomNav from './BottomNav'
import Image from 'next/image'

const shopCategories = [
  {
    name: 'Bath Linen',
    href: '/category/bath-linen',
    description: 'Towels, Robes & Sets',
    image: '/home-1.jpg',
  },
  {
    name: 'Bedding',
    href: '/category/bedding',
    description: 'Quilts, Dohars & Sets',
    image: '/home-2.jpg',
  },
  {
    name: 'Bags',
    href: '/category/bags',
    description: 'Backpacks & Totes',
    image: '/kids-1.jpg',
  },
  {
    name: 'Kids Accessories',
    href: '/category/kids-accessories',
    description: 'Aprons, Mats & More',
    image: '/kids-2.jpg',
  },
  {
    name: 'Clothing',
    href: '/category/clothing',
    description: 'Rompers & Dresses',
    image: '/kids-3.jpg',
  },
  {
    name: "Mom's Corner",
    href: '/category/moms-corner',
    description: 'Just for Mom',
    image: '/mom-1.jpg',
  },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { cartCount, wishlistCount } = useCart()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setShopOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShopOpen(false), 150)
  }

  return (
    <>
      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-300 border-b border-[#E7EEEE] ${
          isScrolled
            ? 'bg-[#F6FBFB]/95 backdrop-blur-lg shadow-[0_2px_20px_rgba(79,189,186,0.08)]'
            : 'bg-[#F6FBFB]'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* NAVBAR */}
          <div className="h-[82px] flex items-center justify-between">

            {/* LOGO */}
            <Link href="/" className="flex items-center shrink-0">
              <div className="relative w-[170px] sm:w-[210px] lg:w-[250px] h-[70px]">
                <Image
                  src="/logo1.png"
                  alt="Little Chiku"
                  fill
                  priority
                  className="object-contain object-left scale-[1.35] lg:scale-[1.45] origin-left"
                />
              </div>
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-10">
              <Link
                href="/"
                className="text-[15px] font-medium text-[#2B2B2B] hover:text-[#4FBDBA] transition-colors"
              >
                Home
              </Link>

              {/* SHOP DROPDOWN */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-1 text-[15px] font-medium text-[#2B2B2B] hover:text-[#4FBDBA] transition-colors">
                  Shop
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      shopOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {shopOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(79,189,186,0.14)] border border-[#E7EEEE] overflow-hidden"
                    >
                      <div className="p-4 grid grid-cols-2 gap-2">
                        {shopCategories.map((cat) => (
                          <Link
                            key={cat.name}
                            href={cat.href}
                            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[#EDF6F6] transition-colors"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#DDF5F4] flex-shrink-0">
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-[#2B2B2B] group-hover:text-[#4FBDBA] transition-colors">
                                {cat.name}
                              </span>
                              <p className="text-xs text-[#6B6B6B]">
                                {cat.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="px-4 pb-4">
                        <Link
                          href="/category/all"
                          className="block w-full py-2.5 text-center text-sm font-medium bg-[#4FBDBA] text-white hover:bg-[#2F7F7C] rounded-xl transition-colors"
                        >
                          Shop All Products
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/category/return-gifts"
                className="text-[15px] font-medium text-[#2B2B2B] hover:text-[#4FBDBA] transition-colors"
              >
                Gifts
              </Link>

              <Link
                href="/contact"
                className="text-[15px] font-medium text-[#2B2B2B] hover:text-[#4FBDBA] transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* SEARCH */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-[#EDF6F6] rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-[#2B2B2B]" />
              </button>

              {/* WISHLIST */}
              <Link
                href="/wishlist"
                className="p-2 hover:bg-[#EDF6F6] rounded-full transition-colors relative hidden sm:flex"
              >
                <Heart className="w-5 h-5 text-[#2B2B2B]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#E07070] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* CART */}
              <Link
                href="/cart"
                className="p-2 hover:bg-[#EDF6F6] rounded-full transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5 text-[#2B2B2B]" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#F6C453] text-[#2B2B2B] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* MOBILE MENU */}
              <button
                className="md:hidden p-2 hover:bg-[#EDF6F6] rounded-full transition-colors"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="w-5 h-5 text-[#2B2B2B]" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        categories={shopCategories}
      />

      {/* SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* MOBILE BOTTOM NAV */}
      <BottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </>
  )
}
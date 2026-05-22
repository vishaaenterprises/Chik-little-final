"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Heart, ShoppingCart, ChevronRight, Sparkles } from "lucide-react";
import { useCart } from "@/context/cart-context";
import Image from "next/image";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{
    name: string;
    href: string;
    description: string;
    image: string;
  }>;
}

export default function MobileMenu({ isOpen, onClose, categories }: MobileMenuProps) {
  const { cartCount, wishlistCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#2B2B2B]/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[85%] max-w-[380px] bg-[#F6FBFB] z-50 shadow-2xl flex flex-col rounded-l-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E7EEEE]">
              <Link href="/" className="flex items-center shrink-0">
                <div className="relative w-[180px] h-[70px]">
                  <Image
                    src="/logo1.png"
                    alt="Little Chiku"
                    fill
                    priority
                    className="object-contain object-left scale-[1.35] origin-left"
                  />
                </div>
              </Link>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-[#EDF6F6] rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-[#2B2B2B]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Featured Banner */}
              <div className="p-4">
                <div className="bg-gradient-to-r from-[#DDF5F4] to-[#FFF8E8] rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4FBDBA]/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#4FBDBA]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2B2B2B]">New Arrivals</p>
                    <p className="text-xs text-[#6B6B6B]">Explore latest collection</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#6B6B6B] ml-auto" />
                </div>
              </div>

              {/* Navigation Links */}
              <div className="px-4 pb-2">
                <Link
                  href="/"
                  className="flex items-center justify-between px-4 py-4 rounded-xl hover:bg-[#EDF6F6] text-[#2B2B2B] font-medium transition-colors"
                  onClick={onClose}
                >
                  Home
                  <ChevronRight className="w-4 h-4 text-[#6B6B6B]" />
                </Link>
              </div>

              {/* Shop Categories */}
              <div className="px-4 pb-4">
                <div className="px-4 py-2 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                  Shop Categories
                </div>

                <div className="space-y-1 mt-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#EDF6F6] text-[#2B2B2B] transition-colors group"
                      onClick={onClose}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#DDF5F4] flex-shrink-0 ring-2 ring-transparent group-hover:ring-[#4FBDBA]/30 transition-all">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-[#2B2B2B] group-hover:text-[#4FBDBA] transition-colors">
                          {cat.name}
                        </span>
                        <p className="text-xs text-[#6B6B6B] mt-0.5">{cat.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#6B6B6B] group-hover:text-[#4FBDBA] group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Other Links */}
              <div className="px-4 pb-4">
                <Link
                  href="/category/return-gifts"
                  className="flex items-center justify-between px-4 py-4 rounded-xl hover:bg-[#EDF6F6] text-[#2B2B2B] font-medium transition-colors"
                  onClick={onClose}
                >
                  Gifts
                  <ChevronRight className="w-4 h-4 text-[#6B6B6B]" />
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center justify-between px-4 py-4 rounded-xl hover:bg-[#EDF6F6] text-[#2B2B2B] font-medium transition-colors"
                  onClick={onClose}
                >
                  Contact Us
                  <ChevronRight className="w-4 h-4 text-[#6B6B6B]" />
                </Link>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[#E7EEEE] bg-[#EDF6F6]/50">
              <div className="flex gap-3">
                <Link
                  href="/wishlist"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white border border-[#E7EEEE] text-[#2B2B2B] font-semibold hover:border-[#4FBDBA]/50 transition-colors"
                  onClick={onClose}
                >
                  <Heart className="w-5 h-5" />
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="w-5 h-5 bg-[#E07070] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/cart"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#4FBDBA] text-white font-semibold hover:bg-[#2F7F7C] transition-colors"
                  onClick={onClose}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Cart
                  {cartCount > 0 && (
                    <span className="w-5 h-5 bg-[#F6C453] text-[#2B2B2B] text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import type { CartItem as CartItemType } from '@/context/cart-context'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({
  item,
}: CartItemProps) {
  const {
    updateQuantity,
    removeFromCart,
  } = useCart()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.35 }}
      className="group relative overflow-hidden rounded-[2rem] border border-[#E7EEEE] bg-white p-4 md:p-5 shadow-[0_10px_30px_rgba(79,189,186,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(79,189,186,0.14)]"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#DDF5F4]/40 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 w-28 h-28 bg-[#FFF4D6]/40 rounded-full blur-3xl" />
      </div>

      <div className="relative flex gap-4">
        
        {/* Product Image */}
        <Link
          href={`/product/${item.id}`}
          className="flex-shrink-0"
        >
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-[#E7EEEE] bg-[#F6FBFB] shadow-sm">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2F7F7C]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          
          {/* Top */}
          <div className="flex justify-between gap-3">
            
            <div className="min-w-0">
              <Link href={`/product/${item.id}`}>
                <h3 className="font-heading font-bold text-[#2B2B2B] hover:text-[#2F7F7C] transition-colors line-clamp-2 text-sm md:text-lg leading-snug">
                  {item.name}
                </h3>
              </Link>

              <p className="text-xs md:text-sm text-[#6B6B6B] mt-2 line-clamp-1">
                {item.category}
                {item.color && ` | ${item.color}`}
                {item.size && ` | ${item.size}`}
              </p>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <p className="font-heading font-bold text-base md:text-xl text-[#2B2B2B]">
                Rs.{' '}
                {(
                  item.price * item.quantity
                ).toLocaleString()}
              </p>

              {item.originalPrice && (
                <p className="text-xs md:text-sm text-[#8B8B8B] line-through mt-1">
                  Rs.{' '}
                  {(
                    item.originalPrice *
                    item.quantity
                  ).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between mt-5 gap-4 flex-wrap">
            
            {/* Quantity Controls */}
            <div className="flex items-center rounded-2xl border border-[#E7EEEE] bg-[#F6FBFB] overflow-hidden shadow-sm">
              
              <button
                onClick={() =>
                  updateQuantity(
                    item.id,
                    item.quantity - 1,
                  )
                }
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center hover:bg-[#DDF5F4] transition-colors"
              >
                <Minus className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#2B2B2B]" />
              </button>

              <span className="w-10 md:w-12 text-center font-semibold text-[#2B2B2B] text-sm md:text-base">
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  updateQuantity(
                    item.id,
                    item.quantity + 1,
                  )
                }
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center hover:bg-[#DDF5F4] transition-colors"
              >
                <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#2B2B2B]" />
              </button>
            </div>

            {/* Remove Button */}
            <motion.button
              onClick={() =>
                removeFromCart(item.id)
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#F3DADA] bg-[#FFF5F5] text-[#D96B6B] hover:bg-[#FFECEC] transition-all duration-300"
            >
              <Trash2 className="w-4 h-4" />

              <span className="text-sm font-medium hidden sm:inline">
                Remove
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
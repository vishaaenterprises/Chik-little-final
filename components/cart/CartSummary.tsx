'use client'

import { Truck, Shield, CheckCircle2, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/context/cart-context'

export default function CartSummary() {
  const { cartItems, cartTotal } = useCart()

  const shipping = cartTotal > 999 ? 0 : 99

  // GST Removed
  const total = cartTotal + shipping

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#E7EEEE] bg-white p-6 md:p-7 shadow-[0_12px_35px_rgba(79,189,186,0.08)]">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[#DDF5F4]/40 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-[#FFF4D6]/40 blur-3xl" />
      </div>

      <div className="relative">
        {/* Heading */}
        <div className="mb-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#BFE9E7] bg-[#DDF5F4] px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#4FBDBA]" />

            <span className="text-xs font-semibold uppercase tracking-wide text-[#2F7F7C]">
              Secure Checkout
            </span>
          </div>

          <h2 className="font-heading text-2xl font-bold text-[#2B2B2B] md:text-3xl">
            Order Summary
          </h2>
        </div>

        {/* Summary Items */}
        <div className="mb-7 space-y-4">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-[#2B2B2B]">
            <span className="text-sm md:text-base">
              Subtotal ({totalItems} items)
            </span>

            <span className="text-sm font-semibold md:text-base">
              Rs. {cartTotal.toLocaleString()}
            </span>
          </div>

          {/* Shipping */}
          <div className="flex items-center justify-between text-[#2B2B2B]">
            <span className="text-sm md:text-base">Shipping</span>

            <span
              className={`text-sm font-semibold md:text-base ${
                shipping === 0 ? 'text-[#2F7F7C]' : 'text-[#2B2B2B]'
              }`}
            >
              {shipping === 0 ? 'FREE' : `Rs. ${shipping}`}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E7EEEE] pt-5">
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg font-bold text-[#2B2B2B] md:text-xl">
                Total
              </span>

              <span className="font-heading text-2xl font-bold text-[#2F7F7C]">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Free Shipping Banner */}
        {shipping > 0 && (
          <div className="mb-7 rounded-2xl border border-[#F6E3AF] bg-[#FFF9EA] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#F6C453]">
                <Truck className="h-4 w-4 text-[#2B2B2B]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#B88214]">
                  Free Shipping Available
                </p>

                <p className="mt-1 text-sm leading-relaxed text-[#6B6B6B]">
                  Add Rs. {(1000 - cartTotal).toLocaleString()} more to unlock
                  FREE delivery.
                </p>
              </div>
            </div>
          </div>
        )}

        

        {/* Trust Badges */}
        <div className="mt-7 space-y-4 border-t border-[#E7EEEE] pt-7">
          <div className="flex items-center gap-3 text-sm text-[#6B6B6B]">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#DDF5F4]">
              <Truck className="h-5 w-5 text-[#2F7F7C]" />
            </div>

            <span>Free delivery on orders above Rs. 999</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-[#6B6B6B]">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#DDF5F4]">
              <Shield className="h-5 w-5 text-[#2F7F7C]" />
            </div>

            <span>100% secure checkout guarantee</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-[#6B6B6B]">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#FFF4D6]">
              <CheckCircle2 className="h-5 w-5 text-[#D89B1D]" />
            </div>

            <span>Trusted by 10,000+ happy families</span>
          </div>
        </div>
      </div>
    </div>
  )
}

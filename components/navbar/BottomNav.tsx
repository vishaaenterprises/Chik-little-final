'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/cart-context'

interface BottomNavProps {
  onSearchClick: () => void
}

export default function BottomNav({ onSearchClick }: BottomNavProps) {
  const pathname = usePathname()
  const { cartCount, wishlistCount } = useCart()

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '#', onClick: onSearchClick },
    { icon: Heart, label: 'Wishlist', href: '/wishlist', badge: wishlistCount },
    { icon: ShoppingBag, label: 'Cart', href: '/cart', badge: cartCount },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#F6FBFB]/95 backdrop-blur-lg border-t border-[#E7EEEE] safe-area-bottom shadow-[0_-2px_20px_rgba(79,189,186,0.08)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 relative"
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#4FBDBA]' : 'text-[#6B6B6B]'}`} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-[#4FBDBA]' : 'text-[#6B6B6B]'}`}>
                  {item.label}
                </span>
              </button>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 relative"
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#4FBDBA]' : 'text-[#6B6B6B]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#F6C453] text-[#2B2B2B] text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-[#4FBDBA]' : 'text-[#6B6B6B]'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
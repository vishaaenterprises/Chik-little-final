import type { Metadata } from 'next'

// Wishlist is per-user (localStorage) — nothing for search engines to index.
export const metadata: Metadata = {
  title: 'Your Wishlist | Little Chiku',
  robots: {
    index: false,
    follow: false,
  },
}

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

import type { Metadata } from 'next'

// Cart is per-user, thin content — keep it out of search results.
export const metadata: Metadata = {
  title: 'Your Cart | Little Chiku',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

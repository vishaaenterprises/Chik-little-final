import type { Metadata } from 'next'

// Payment status pages are transactional and per-order — never index them.
export const metadata: Metadata = {
  title: 'Payment Status | Little Chiku',
  robots: {
    index: false,
    follow: false,
  },
}

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

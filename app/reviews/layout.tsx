import type { Metadata } from 'next'

// /reviews is a client component, so its metadata lives here. The optional
// `?product=<slug>` filter intentionally shares this canonical so filtered
// views don't create duplicate URLs in search results.
export const metadata: Metadata = {
  title: 'Customer Reviews | Little Chiku',
  description:
    'Read what parents across India say about Little Chiku handcrafted organic cotton baby towels, bedding, bags and gift hampers.',
  alternates: {
    canonical: 'https://littlechiku.com/reviews',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Little Chiku',
    url: 'https://littlechiku.com/reviews',
    title: 'Customer Reviews | Little Chiku',
    description:
      'Read what parents across India say about Little Chiku handcrafted organic cotton baby essentials.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Little Chiku Organic Baby Products',
      },
    ],
  },
}

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

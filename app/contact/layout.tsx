import type { Metadata } from 'next'

// The contact page is a client component ('use client'), so it cannot export
// `metadata` itself. This layout gives it its own title / description /
// canonical — before this, /contact inherited the homepage's canonical.
export const metadata: Metadata = {
  title: 'Contact Us | Little Chiku',
  description:
    'Order help, bulk orders or product questions? WhatsApp, call or email Little Chiku — we reply within 24 hours (Mon–Sat, 10am–7pm).',
  alternates: {
    canonical: 'https://littlechiku.com/contact',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Little Chiku',
    url: 'https://littlechiku.com/contact',
    title: 'Contact Us | Little Chiku',
    description:
      'Order help, bulk orders or product questions? WhatsApp, call or email Little Chiku — we reply within 24 hours.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Little Chiku Organic Baby Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Little Chiku',
    description:
      'Order help, bulk orders or product questions? WhatsApp, call or email Little Chiku.',
    images: ['/og-image.png'],
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

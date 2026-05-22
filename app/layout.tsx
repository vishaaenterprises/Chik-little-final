import type { Metadata, Viewport } from 'next'
import { Baloo_2, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import { CartProvider } from '@/context/cart-context'

import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer'

import './globals.css'

const baloo = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Little Chiku — Premium Baby & Kids Essentials',
    template: '%s | Little Chiku',
  },

  description:
    'Premium baby essentials, bath linen, kids lifestyle products, and handcrafted collections for your little ones.',

  keywords: [
    'baby products',
    'kids lifestyle',
    'bath linen',
    'organic cotton',
    'Little Chiku',
  ],

  authors: [{ name: 'Little Chiku' }],

  creator: 'Little Chiku',

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Little Chiku',
    title:
      'Little Chiku — Premium Baby & Kids Essentials',

    description:
      'Premium baby essentials crafted with love.',
  },

  twitter: {
    card: 'summary_large_image',

    title:
      'Little Chiku — Premium Baby & Kids Essentials',

    description:
      'Premium baby essentials crafted with love.',
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#4FBDBA',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${baloo.variable} ${dmSans.variable}`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>

      <body
        className={[
          'bg-[#F6FBFB]',
          'text-[#2B2B2B]',
          'font-sans',
          'antialiased',
          'scroll-smooth',
          'overflow-x-hidden',
          'min-h-screen',
          'flex',
          'flex-col',
        ].join(' ')}
      >
        {/* Top Gradient Line */}
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 h-[2px] z-[9999] pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, #4FBDBA 0%, #F6C453 50%, #4FBDBA 100%)',

            opacity: 0.7,
          }}
        />

        <CartProvider>

          {/* Global Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Global Footer */}
          <Footer />

        </CartProvider>

        {process.env.NODE_ENV === 'production' && (
          <Analytics />
        )}
      </body>
    </html>
  )
}
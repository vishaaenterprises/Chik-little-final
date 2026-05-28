import type { Metadata, Viewport } from 'next'
import { Baloo_2, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer'

import { CartProvider } from '@/context/cart-context'

import './globals.css'

/* ---------------- Fonts ---------------- */

const baloo = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
})

/* ---------------- SEO Metadata ---------------- */

export const metadata: Metadata = {
  metadataBase: new URL('https://littlechiku.com'),

  title: {
    default:
      'Little Chiku | Premium Baby & Kids Essentials India',

    template: '%s | Little Chiku',
  },

  description:
    'Shop premium baby essentials, handcrafted kids products, bath linen, organic cotton towels, and lifestyle accessories for babies and kids at Little Chiku.',

  keywords: [
    'Little Chiku',
    'baby products',
    'kids products',
    'baby essentials india',
    'kids lifestyle',
    'organic cotton baby products',
    'baby towels',
    'kids towels',
    'bath linen',
    'newborn products',
    'premium baby brand',
    'baby accessories',
    'baby shopping india',
    'handcrafted baby products',
  ],

  authors: [{ name: 'Little Chiku' }],

  creator: 'Little Chiku',

  publisher: 'Little Chiku',

  category: 'Ecommerce',

  alternates: {
    canonical: 'https://littlechiku.com',
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  /* ---------------- Icons ---------------- */

  icons: {
    icon: [
      {
        url: '/icon.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],

    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },

  /* ---------------- Open Graph ---------------- */

  openGraph: {
    type: 'website',

    locale: 'en_IN',

    url: 'https://littlechiku.com',

    siteName: 'Little Chiku',

    title:
      'Little Chiku | Premium Baby & Kids Essentials',

    description:
      'Premium handcrafted baby essentials, bath linen, kids towels, and cute lifestyle products crafted with love.',

    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Little Chiku',
      },
    ],
  },

  /* ---------------- Twitter ---------------- */

  twitter: {
    card: 'summary_large_image',

    title:
      'Little Chiku | Premium Baby & Kids Essentials',

    description:
      'Premium handcrafted baby essentials crafted with love.',

    images: ['/og-image.png'],
  },

  /* ---------------- Verification ---------------- */

  verification: {
    google: 'YOUR_GOOGLE_SEARCH_CONSOLE_CODE',
  },
}

/* ---------------- Viewport ---------------- */

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4FBDBA',
}

/* ---------------- Root Layout ---------------- */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${baloo.variable} ${dmSans.variable}`}
    >
      <head>
        {/* Preconnect Fonts */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon */}
        <link
          rel="icon"
          href="/icon.png"
          sizes="32x32"
        />

        {/* Apple Icon */}
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
        />

        {/* Theme Color */}
        <meta
          name="theme-color"
          content="#4FBDBA"
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

        {/* Store Provider */}
        <CartProvider>
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </CartProvider>

        {/* Analytics */}
        {process.env.NODE_ENV === 'production' && (
          <Analytics />
        )}
      </body>
    </html>
  )
}

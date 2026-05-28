import type { Metadata, Viewport } from 'next'
import { Baloo_2, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'

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
      'Little Chiku | Organic Handmade Baby Products India',

    template: '%s | Little Chiku',
  },

  description:
    'Discover handcrafted organic cotton baby products including baby towels, baby bedding, gift hampers, blankets, bibs, and premium baby essentials made with love in India by Little Chiku.',

  keywords: [
    'Little Chiku',
    'organic baby products',
    'handmade baby products',
    'organic cotton baby products',
    'baby towels India',
    'baby gift hampers',
    'baby bedding India',
    'newborn essentials',
    'premium baby essentials',
    'baby accessories India',
    'baby blankets',
    'hooded baby towels',
    'kids bath linen',
    'Jaipur baby brand',
    'baby products online India',
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

    shortcut: ['/icon.png'],

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
      'Little Chiku | Organic Handmade Baby Products India',

    description:
      'Premium handcrafted organic baby essentials including towels, blankets, bedding, and baby gift hampers crafted with love.',

    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Little Chiku Organic Baby Products',
      },
    ],
  },

  /* ---------------- Twitter ---------------- */

  twitter: {
    card: 'summary_large_image',

    title:
      'Little Chiku | Organic Handmade Baby Products',

    description:
      'Premium handcrafted organic cotton baby essentials crafted with love in India.',

    images: ['/og-image.png'],
  },
}

/* ---------------- Viewport ---------------- */

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#7CC9C5',
}

/* ---------------- JSON-LD Schema ---------------- */

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Little Chiku',
  url: 'https://littlechiku.com',
  logo: 'https://littlechiku.com/icon.png',
  description:
    'Little Chiku is an Indian baby brand offering handcrafted organic cotton baby essentials and premium kids products.',

  sameAs: [
    'https://instagram.com/',
    'https://facebook.com/',
  ],

  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
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
        {/* Meta Pixel Code */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
        >
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(
              window,
              document,
              'script',
              'https://connect.facebook.net/en_US/fbevents.js'
            );

            fbq('init', '1837748180844681');
            fbq('track', 'PageView');
          `}
        </Script>

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

        {/* Theme */}
        <meta
          name="theme-color"
          content="#7CC9C5"
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>

      <body className="bg-[#fffdf8] font-sans text-neutral-800 antialiased">
        {/* Meta Pixel NoScript */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1837748180844681&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <CartProvider>
          <Navbar />

          <main className="min-h-screen overflow-hidden">
            {children}
          </main>

          <Footer />
        </CartProvider>

        <Analytics />
      </body>
    </html>
  )
}
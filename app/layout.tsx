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

// DM Sans is a variable font: no `weight` array needed.
// All weights (100–1000) are available automatically.
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

/* ---------------- SEO Metadata ---------------- */

export const metadata: Metadata = {
  metadataBase: new URL('https://littlechiku.com'),

  // Note: no `template` here on purpose — every page sets its own full
  // title including " | Little Chiku" itself. A template here would
  // double the suffix on pages that already append it.
  title: 'Little Chiku | Kids Towels, Bathrobes & Gift Sets India',

  description:
    "Buy kids bath towels, hand towels, face towels, bathrobes, bedding, bags, clothing, Diwali & return gift sets and Mom's Corner bags — handcrafted cotton by Little Chiku, delivered across India.",

  // `keywords` meta removed on purpose: Google ignores it, and the same
  // list on every page only adds noise.

  authors: [{ name: 'Little Chiku' }],

  creator: 'Little Chiku',

  publisher: 'Little Chiku',

  category: 'Ecommerce',

  // NOTE: no site-wide `alternates.canonical` here. A static canonical in the
  // root layout is inherited by every page that doesn't define its own and
  // makes Google treat those pages as duplicates of the homepage. Each route
  // sets its own canonical (home: app/page.tsx).

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

    siteName: 'Little Chiku',

    title: 'Little Chiku | Kids Towels, Bathrobes & Gift Sets India',

    description:
      "Kids bath towels, hand towels, bathrobes, bedding, bags, Diwali and return gift sets, and Mom's Corner bags — handcrafted cotton by Little Chiku.",

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

    title: 'Little Chiku | Kids Towels, Bathrobes & Gift Sets',

    description:
      'Handcrafted cotton towels, bathrobes, bedding, bags and gift sets for kids and moms, made in India.',

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
  // Stable @id so the Organization on /about and every other page resolve to
  // ONE entity — this is what AI engines and Google use to connect facts.
  '@id': 'https://littlechiku.com/#organization',
  name: 'Little Chiku',
  legalName: 'Vishaa Enterprises',
  url: 'https://littlechiku.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://littlechiku.com/icon.png',
  },
  foundingLocation: { '@type': 'Place', name: 'Jaipur, Rajasthan, India' },
  knowsAbout: [
    'kids bath towels, hand towels and face towels',
    'kids bathrobes',
    'hand block print cotton bath linen',
    'kids bedding',
    'Diwali and return gift sets',
    "mom's bags and pouches",
  ],
  description:
    "Little Chiku is an Indian brand from Jaipur selling handcrafted cotton essentials for babies, kids and mothers: bath towels, hand towels, face towels, bathrobes, bedding, bags, clothing, Diwali and return gift sets, and Mom's Corner bags.",

  sameAs: [
    'https://www.instagram.com/littlechikukids/',
    'https://www.facebook.com/profile.php?id=61581014138999',
  ],

  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    telephone: '+91-7728009522',
    email: 'vishaaenterprises@gmail.com',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://littlechiku.com/#website',
  publisher: { '@id': 'https://littlechiku.com/#organization' },
  name: 'Little Chiku',
  url: 'https://littlechiku.com',
  inLanguage: 'en-IN',
}

/* ---------------- Root Layout ---------------- */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${baloo.variable} ${dmSans.variable}`}
    >
      <head>
        {/*
          Meta Pixel Code
          Pixel ID 1837748180844681 = "Kids essential" dataset in Events Manager.
          The queue mechanism below (n.queue.push) means any fbq() call made by
          other components BEFORE this script line has finished parsing is safely
          buffered and fired the moment the real pixel script loads — so there's
          no race condition with ViewContent/AddToCart/InitiateCheckout/Purchase
          calls elsewhere in the app, even though this uses "afterInteractive".
        */}
        <Script id="facebook-pixel" strategy="afterInteractive">
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

        {/*
          Google tag (gtag.js) — Google Ads account AW-18508267296
          Powers Performance Max conversion tracking. Script tag loads
          the library, inline config tag below initializes it.
        */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18508267296"
          strategy="afterInteractive"
        />
        <Script id="google-tag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18508267296');
          `}
        </Script>

        {/* Favicon + theme-color come from `metadata.icons` / `viewport`
            above — no duplicate <link>/<meta> tags needed here. */}

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
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

          <main className="min-h-screen overflow-hidden">{children}</main>

          <Footer />
        </CartProvider>

        <Analytics />
      </body>
    </html>
  )
}
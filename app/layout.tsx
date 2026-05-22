import type { Metadata, Viewport } from "next";
import { Baloo_2, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/context/cart-context";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Replacing Poppins with DM Sans — a refined humanist sans that pairs
// beautifully with Baloo 2 and carries that soft-organic premium feel
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Little Chiku — Premium Baby & Kids Essentials",
    template: "%s | Little Chiku",
  },
  description:
    "Premium baby essentials, bath linen, kids lifestyle products, and handcrafted collections for your little ones. Crafted with love from organic cotton.",
  keywords: [
    "baby products",
    "kids lifestyle",
    "bath linen",
    "premium kids products",
    "organic cotton",
    "Little Chiku",
    "baby gifts",
    "newborn essentials",
  ],
  authors: [{ name: "Little Chiku" }],
  creator: "Little Chiku",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Little Chiku",
    title: "Little Chiku — Premium Baby & Kids Essentials",
    description:
      "Premium baby essentials, bath linen, kids lifestyle products, and handcrafted collections for your little ones.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Little Chiku — Premium Baby & Kids Essentials",
    description:
      "Premium baby essentials crafted with love from organic cotton.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  // Brand turquoise as the browser chrome accent
  themeColor: "#4FBDBA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${baloo.variable} ${dmSans.variable}`}
    >
      <head>
        {/*
          Preconnect to Google Fonts CDN for faster font loading.
          Next/font handles the actual requests; this just warms the connection.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>

      <body
        className={[
          // Base colour — soft off-white, not pure white; feels warm and premium
          "bg-[#F6FBFB]",
          "text-[#2B2B2B]",

          // Font stack: DM Sans as body default, Baloo 2 via --font-baloo for headings
          "font-sans antialiased",

          // Smooth scroll throughout the app
          "scroll-smooth",

          // Prevent layout shift from scrollbar appearing/disappearing
          "overflow-x-hidden",
        ].join(" ")}
      >
        {/*
          Thin ambient top-of-page gradient bar — a subtle brand signature
          that doesn't compete with the navbar but adds premium polish.
        */}
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 h-[2px] z-[9999] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, #4FBDBA 0%, #F6C453 50%, #4FBDBA 100%)",
            opacity: 0.7,
          }}
        />

        <CartProvider>{children}</CartProvider>

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
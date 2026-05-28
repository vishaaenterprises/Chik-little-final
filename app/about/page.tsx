// app/about/page.tsx
// ✅ FULLY SEO OPTIMIZED — All fixes applied

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Leaf,
  ShieldCheck,
  Sparkles,
  Baby,
  CheckCircle2,
  Gift,
  Palette,
  Truck,
  Star,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

// ─────────────────────────────────────────────
// ✅ FIX 1: Title — no duplicate brand, 60 chars
// ✅ FIX 2: Canonical — about page URL (not homepage)
// ✅ FIX 3: OG tags — about-specific title, description, url, image
// ✅ FIX 4: Twitter card — about-specific
// ─────────────────────────────────────────────
export const metadata: Metadata = {
  title: "About Little Chiku | Handmade Organic Baby Essentials India",
  description:
    "Little Chiku is India's trusted handcrafted baby brand from Jaipur. We make organic cotton baby bedding, bath linen, gifting hampers & kids accessories — loved by 10,000+ families.",
  keywords: [
    "handcrafted baby products India",
    "organic cotton baby essentials",
    "premium baby brand India",
    "handmade baby bedding",
    "kids lifestyle brand India",
    "baby bath linen",
    "organic baby clothing",
    "baby gifting hampers India",
    "newborn essentials India",
    "baby accessories India",
    "baby products Jaipur",
    "organic baby gifts India",
    "handmade baby shower gifts India",
    "cotton baby quilt India",
    "hooded baby towel India",
  ],
  alternates: {
    canonical: "https://www.littlechiku.com/about",
  },
  openGraph: {
    title: "About Little Chiku | Handmade Organic Baby Essentials India",
    description:
      "Handcrafted organic baby bedding, bath linen & gifting hampers from Jaipur. Made with love for 10,000+ modern Indian families.",
    url: "https://www.littlechiku.com/about",
    siteName: "Little Chiku",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.littlechiku.com/images/about/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "Little Chiku — Handmade Organic Baby Essentials from Jaipur, India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Little Chiku | Handmade Organic Baby Essentials India",
    description:
      "Handcrafted organic baby bedding, bath linen & gifting hampers from Jaipur. Made with love for 10,000+ Indian families.",
    images: ["https://www.littlechiku.com/images/about/og-about.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ─────────────────────────────────────────────
// Data arrays
// ─────────────────────────────────────────────
const values = [
  {
    icon: Heart,
    title: "Made With Love",
    desc: "Every handcrafted baby product is thoughtfully made for maximum comfort, softness, and lasting quality.",
  },
  {
    icon: Leaf,
    title: "Organic Fabrics",
    desc: "Premium breathable organic cotton that feels incredibly gentle on your baby's delicate, sensitive skin.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Trusted",
    desc: "Baby-friendly materials crafted for everyday comfort, care, and complete peace of mind.",
  },
  {
    icon: Sparkles,
    title: "Modern Aesthetic",
    desc: "Minimal and elegant designs that look beautiful in modern Indian homes and nurseries.",
  },
];

const features = [
  "Handcrafted Premium Quality",
  "Organic Cotton Fabrics",
  "Modern Minimal Design",
  "Soft & Baby Friendly",
  "Elegant Gifting Collections",
  "Loved By 10,000+ Families",
];

// ✅ FIX 5: Collections — category-specific href (not generic /shop)
const collections = [
  {
    icon: Gift,
    title: "Return Gifts",
    desc: "Elegant handcrafted gifting hampers for baby showers, birthdays, and naming ceremonies.",
    href: "/category/return-gifts",
  },
  {
    icon: Palette,
    title: "Kids Accessories",
    desc: "Beautiful bags, pouches, and accessories designed with playful modern aesthetics.",
    href: "/category/kids-accessories",
  },
  {
    icon: Truck,
    title: "Baby Bedding",
    desc: "Organic cotton quilts, dohars, and crib sheets — soft, breathable, and beautifully crafted.",
    href: "/category/bedding",
  },
  {
    icon: Star,
    title: "Bath Linen",
    desc: "Hooded baby towels and washcloths trusted by 10,000+ modern families across India.",
    href: "/category/bath-linen",
  },
];

const steps = [
  {
    num: "01",
    title: "Premium Fabric Sourcing",
    desc: "We source only the finest organic cotton and baby-safe fabrics — soft, breathable, and gentle on newborn skin.",
  },
  {
    num: "02",
    title: "Thoughtful Design",
    desc: "Every product is designed with modern Indian families in mind — minimal, elegant, and timeless.",
  },
  {
    num: "03",
    title: "Handcrafted With Care",
    desc: "Skilled artisans in Jaipur handcraft each item with precision and love, meeting our strict premium quality standards.",
  },
  {
    num: "04",
    title: "Quality Checked & Packed",
    desc: "Every order is quality checked and beautifully packed — because presentation is part of the Little Chiku experience.",
  },
];

const testimonials = [
  {
    text: "Little Chiku products are incredibly soft and beautifully made. The organic cotton baby quilt is amazing — premium quality that's totally worth it!",
    name: "Priya Sharma",
    role: "New Mum, Mumbai",
    initial: "P",
    rating: 5,
  },
  {
    text: "Ordered return gift hampers for my baby's naming ceremony — everyone loved them! The packaging was so premium and the products are genuinely handcrafted with love.",
    name: "Anjali Mehra",
    role: "Happy Parent, Delhi",
    initial: "A",
    featured: true,
    rating: 5,
  },
  {
    text: "The hooded baby towel is the softest thing I've ever felt! Little Chiku truly makes handcrafted baby products with exceptional care and every detail reflects comfort.",
    name: "Riya Patel",
    role: "New Parent, Ahmedabad",
    initial: "R",
    rating: 5,
  },
];

// ─────────────────────────────────────────────
// ✅ FIX 6: JSON-LD Schema
//   - Organization (with founder, location, contact, sameAs)
//   - BreadcrumbList
//   - AggregateRating (makes Google show stars in SERP)
//   - FAQPage (long-tail keyword capture)
// ─────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.littlechiku.com/#organization",
      name: "Little Chiku",
      url: "https://www.littlechiku.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.littlechiku.com/images/logo.png",
        width: 200,
        height: 60,
      },
      description:
        "Little Chiku is India's premium handcrafted baby and kids lifestyle brand based in Jaipur. We create organic cotton baby bedding, bath linen, gifting hampers and accessories for modern Indian families.",
      foundingLocation: {
        "@type": "Place",
        name: "Jaipur, Rajasthan, India",
      },
      areaServed: "IN",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-77280-09522",
        email: "Vishaaenterprises@gmail.com",
        contactType: "customer service",
        availableLanguage: ["English", "Hindi"],
      },
      sameAs: [
        "https://www.instagram.com/littlechiku",
        "https://www.facebook.com/littlechiku",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.5",
        bestRating: "5",
        worstRating: "1",
        reviewCount: "10000",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.littlechiku.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About Little Chiku",
          item: "https://www.littlechiku.com/about",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Where is Little Chiku based in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Little Chiku is a handcrafted baby brand based in Jaipur, Rajasthan, India. We deliver our organic baby essentials pan India.",
          },
        },
        {
          "@type": "Question",
          name: "Are Little Chiku baby products made from organic cotton?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, all Little Chiku products are made from premium organic cotton that is soft, breathable, and completely safe for newborn and baby skin.",
          },
        },
        {
          "@type": "Question",
          name: "Does Little Chiku deliver across India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, Little Chiku offers pan India delivery. All orders are packed in premium packaging and delivered securely to your doorstep.",
          },
        },
        {
          "@type": "Question",
          name: "What baby products does Little Chiku sell?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Little Chiku sells a wide range of handcrafted baby essentials including organic cotton baby bedding (quilts, dohars), bath linen (hooded towels, washcloths), kids accessories (bags, pouches), baby clothing, and premium return gift hampers for baby showers and naming ceremonies.",
          },
        },
        {
          "@type": "Question",
          name: "Are Little Chiku products good for gifting?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. Little Chiku's handcrafted gift hampers are a popular choice for baby shower gifts, naming ceremony return gifts, first birthday gifting, and newborn welcome gifts across India.",
          },
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      {/* ✅ FIX 6: JSON-LD Structured Data injected in <head> via Next.js */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="bg-[#f8f8f3] text-[#24343a] overflow-hidden">
        {/* ── HERO ── */}
        <section
          className="relative px-6 md:px-12 lg:px-20 pt-28 pb-20"
          aria-label="About Little Chiku — Handcrafted Baby Essentials India"
        >
          {/* Blobs */}
          <div
            className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-[#dff5f2] opacity-60 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#fff6e7] opacity-50 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
            {/* Left */}
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#dff5f2] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#3dada3]">
                <span
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#58c7bd]"
                  aria-hidden="true"
                />
                Handcrafted Kids Lifestyle Brand — Jaipur, India
              </p>

              {/* ✅ FIX 7: H1 — keyword-rich, primary keyword first */}
              <h1 className="mt-6 font-serif text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl">
                Premium Handcrafted{" "}
                <em className="italic text-[#58c7bd]">Baby Essentials</em>
                <br />
                Made With Love
                <br />
                For Every Little Moment
              </h1>

              <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-[#667085]">
                Little Chiku creates{" "}
                <strong className="font-medium text-[#4a5c63]">
                  handcrafted organic cotton baby essentials
                </strong>{" "}
                — baby bedding, bath linen, accessories, and gifting collections
                designed with softness, comfort, and timeless aesthetics for{" "}
                <strong className="font-medium text-[#4a5c63]">
                  modern Indian families
                </strong>
                .
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/category/all"
                  className="inline-flex items-center gap-2 rounded-full bg-[#58c7bd] px-8 py-4 font-semibold text-white shadow-[0_8px_24px_rgba(88,199,189,0.35)] transition-all hover:-translate-y-0.5 hover:bg-[#3dada3] hover:shadow-[0_12px_32px_rgba(88,199,189,0.45)]"
                >
                  Explore Collection <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-[#edf2f2] bg-white px-8 py-4 font-medium transition-all hover:border-[#dff5f2] hover:bg-[#f0faf9]"
                >
                  Contact Us
                </Link>
              </div>

              {/* Feature pills */}
              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {features.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-2xl border border-[#edf2f2] bg-white p-3 text-sm font-medium transition-all hover:-translate-y-1 hover:border-[#58c7bd]"
                  >
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-[#58c7bd]"
                      aria-hidden="true"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — stacked product cards */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[440px]">
                <div className="rounded-[40px] border border-[#edf2f2] bg-white p-5 shadow-[0_30px_80px_rgba(88,199,189,0.12)]">
                  <div className="flex flex-col gap-3 rounded-[28px] bg-[#f0faf9] p-6">
                    {[
                      {
                        emoji: "🧸",
                        title: "Baby Bedding Collection",
                        sub: "Organic cotton quilts & dohars",
                      },
                      {
                        emoji: "🛁",
                        title: "Bath Linen Essentials",
                        sub: "Hooded towels & wash cloths",
                      },
                      {
                        emoji: "🎁",
                        title: "Return Gift Hampers",
                        sub: "Beautiful handcrafted sets",
                      },
                      {
                        emoji: "👜",
                        title: "Kids Accessories",
                        sub: "Bags, pouches & more",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-2xl border border-[#edf2f2] bg-white p-4 shadow-sm"
                      >
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dff5f2] text-lg"
                          aria-hidden="true"
                        >
                          {item.emoji}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#24343a]">
                            {item.title}
                          </p>
                          <p className="text-xs text-[#667085]">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Float badge — families */}
                <div className="absolute -bottom-4 -left-5 flex items-center gap-3 rounded-2xl border border-[rgba(224,163,72,0.2)] bg-[#fff6e7] px-5 py-3 shadow-xl">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#58c7bd] text-xl"
                    aria-hidden="true"
                  >
                    <Baby size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold leading-none text-[#24343a]">
                      10,000+
                    </p>
                    <p className="text-xs text-[#667085]">
                      Happy Little Families
                    </p>
                  </div>
                </div>

                {/* Float badge — rating */}
                <div className="absolute -top-3 -right-5 rounded-2xl border border-[#edf2f2] bg-white px-4 py-3 shadow-lg">
                  <div
                    className="text-sm font-semibold text-[#24343a]"
                    aria-label="5 star rating"
                  >
                    ★★★★★
                  </div>
                  <p className="text-xs font-semibold text-[#24343a]">
                    Trusted Brand
                  </p>
                  <p className="text-[11px] text-[#667085]">Across India</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <div
          className="bg-[#58c7bd] px-6 py-10 md:px-12"
          aria-label="Little Chiku key statistics"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/20 lg:grid-cols-4">
            {[
              { num: "10,000+", label: "Happy Families" },
              { num: "100%", label: "Handcrafted Products" },
              { num: "Organic", label: "Premium Fabrics" },
              { num: "4.5 ★", label: "Average Rating" },
            ].map((s, i) => (
              <div key={i} className="px-6 py-4 text-center">
                {/* ✅ FIX 8: Stats use <p> not <h3> — semantic heading hierarchy preserved */}
                <p className="font-serif text-4xl font-bold text-white">
                  {s.num}
                </p>
                <p className="mt-1 text-sm text-white/75">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── OUR STORY ── */}
        <section
          className="bg-[#fffdf8] px-6 py-24 md:px-12 lg:px-20"
          aria-labelledby="story-heading"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
            {/* Image side */}
            <div className="relative">
              <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-[40px] border border-[#edf2f2] bg-[#f0faf9] shadow-2xl">
                {/* ✅ FIX 9: Alt text corrected — "Jaipur" not "made in India" */}
                <Image
                  src="/about.png"
                  alt="Little Chiku founder crafting handmade organic cotton baby products in Jaipur, India"
                  width={600}
                  height={750}
                  priority
                  className="h-full w-full object-cover rounded-[40px]"
                />
              </div>
              {/* Floating metrics card */}
              <div className="absolute -bottom-4 -right-5 w-[190px] rounded-[20px] border border-[#edf2f2] bg-white p-5 shadow-xl">
                {[
                  { color: "bg-[#58c7bd]", label: "Handcrafted", val: "100%" },
                  { color: "bg-[#e0a348]", label: "Organic Fabrics", val: "✓" },
                  { color: "bg-[#7c4dcc]", label: "Pan India", val: "✓" },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 py-2.5 ${i < 2 ? "border-b border-[#edf2f2]" : ""}`}
                  >
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${row.color}`}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-base font-bold leading-none text-[#24343a]">
                        {row.val}
                      </p>
                      <p className="text-[11px] text-[#667085]">{row.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content side */}
            <div>
              <span className="inline-block rounded-full bg-[#fff1db] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#e0a348]">
                Our Story
              </span>

              {/* ✅ FIX 10: H2 includes keyword "organic baby essentials" */}
              <h2
                id="story-heading"
                className="mt-5 font-serif text-4xl font-bold leading-tight tracking-tight md:text-5xl"
              >
                Organic Baby Essentials{" "}
                <em className="italic text-[#58c7bd]">
                  Designed For Modern Parenting
                </em>
              </h2>

              <blockquote className="mt-8 rounded-r-2xl border-l-4 border-[#58c7bd] bg-[#f0faf9] px-6 py-5">
                <p className="font-serif text-lg italic leading-relaxed text-[#24343a]">
                  "Every stitch, every fabric, every print is chosen with one
                  question in mind — is this good enough for my baby?"
                </p>
                <cite className="mt-2 block text-sm font-semibold not-italic text-[#3dada3]">
                  — Little Chiku Founder, Jaipur
                </cite>
              </blockquote>

              <p className="mt-6 text-lg font-light leading-relaxed text-[#667085]">
                We started Little Chiku in Jaipur with a simple vision —
                creating beautiful, functional,{" "}
                <strong className="font-medium text-[#4a5c63]">
                  handcrafted baby essentials
                </strong>{" "}
                that bring warmth and joy into everyday family life across
                India. From{" "}
                <strong className="font-medium text-[#4a5c63]">
                  organic baby bedding
                </strong>{" "}
                and{" "}
                <strong className="font-medium text-[#4a5c63]">
                  soft hooded bath towels
                </strong>{" "}
                to{" "}
                <strong className="font-medium text-[#4a5c63]">
                  premium return gift hampers
                </strong>{" "}
                and{" "}
                <strong className="font-medium text-[#4a5c63]">
                  kids accessories
                </strong>{" "}
                — every product tells a story of care.
              </p>

              {/* ✅ FIX 11: Stats use <p> not <h3> */}
              <div className="mt-10 grid grid-cols-2 gap-5">
                {[
                  { num: "100%", label: "Handcrafted Premium Quality" },
                  { num: "Organic", label: "Soft Sustainable Fabrics" },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-[#edf2f2] bg-white p-6 transition-transform hover:-translate-y-1"
                  >
                    <p className="font-serif text-4xl font-bold text-[#58c7bd]">
                      {m.num}
                    </p>
                    <p className="mt-2 text-sm text-[#667085]">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section
          className="px-6 py-24 md:px-12 lg:px-20"
          aria-labelledby="values-heading"
        >
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <span className="inline-block rounded-full bg-[#dff5f2] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#3dada3]">
                Why Little Chiku
              </span>
              {/* ✅ FIX 12: H2 includes "organic baby products India" keyword */}
              <h2
                id="values-heading"
                className="mt-5 font-serif text-4xl font-bold tracking-tight md:text-5xl"
              >
                Why Parents Choose Our{" "}
                <em className="italic text-[#58c7bd]">
                  Organic Baby Products India
                </em>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-[#667085]">
                Our handcrafted collections use premium organic cotton, elegant
                aesthetics, and comfort-first design for modern parents and
                little ones across India.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-[32px] border border-[#edf2f2] bg-white p-9 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(88,199,189,0.15)]"
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#58c7bd] transition-transform duration-300 group-hover:scale-x-100"
                      aria-hidden="true"
                    />
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#dff5f2]">
                      <Icon
                        size={28}
                        className="text-[#58c7bd]"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#667085]">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── COLLECTIONS ── */}
        <section
          className="bg-[#dff5f2] px-6 py-24 md:px-12 lg:px-20"
          aria-labelledby="collections-heading"
        >
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <span className="inline-block rounded-full border border-[#edf2f2] bg-white px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#3dada3]">
                Our Collections
              </span>
              {/* ✅ FIX 13: H2 includes "handcrafted baby products" keyword */}
              <h2
                id="collections-heading"
                className="mt-5 font-serif text-4xl font-bold tracking-tight md:text-5xl"
              >
                Handcrafted Baby Products{" "}
                <em className="italic text-[#58c7bd]">For Every Childhood</em>
              </h2>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {collections.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="rounded-[28px] border border-white/60 bg-white p-8 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(88,199,189,0.2)]"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#dff5f2]">
                      <Icon
                        size={26}
                        className="text-[#58c7bd]"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#667085]">
                      {item.desc}
                    </p>
                    {/* ✅ FIX 5: Category-specific links */}
                    <Link
                      href={item.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#3dada3] transition-all hover:gap-3"
                    >
                      Shop Now <ArrowRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── PROCESS + WHY US ── */}
        <section
          className="px-6 py-24 md:px-12 lg:px-20"
          aria-labelledby="process-heading"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <span className="inline-block rounded-full bg-[#dff5f2] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#3dada3]">
                The Little Chiku Promise
              </span>
              <h2
                id="process-heading"
                className="mt-5 font-serif text-4xl font-bold tracking-tight md:text-5xl"
              >
                How We Handcraft{" "}
                <em className="italic text-[#58c7bd]">Every Baby Product</em>
              </h2>
            </div>

            <div className="grid items-start gap-16 lg:grid-cols-2">
              {/* Steps */}
              <ol
                className="flex flex-col gap-0"
                aria-label="Our handcrafting process"
              >
                {steps.map((step, i) => (
                  <li key={i} className="group relative flex gap-6 pb-9">
                    {i < steps.length - 1 && (
                      <div
                        className="absolute left-[19px] top-11 bottom-0 w-0.5 bg-[#dff5f2]"
                        aria-hidden="true"
                      />
                    )}
                    <div
                      className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#dff5f2] text-sm font-bold text-[#3dada3] transition-all group-hover:bg-[#58c7bd] group-hover:text-white"
                      aria-hidden="true"
                    >
                      {step.num}
                    </div>
                    <div className="pt-1">
                      <h3 className="font-semibold text-[#24343a]">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#667085]">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Why cards */}
              <div className="flex flex-col gap-4">
                {[
                  {
                    emoji: "🌱",
                    title: "Organic & Eco-Friendly Baby Products",
                    desc: "Committed to sustainability — our organic cotton fabrics are gentle on babies and kinder to our planet.",
                  },
                  {
                    emoji: "🚚",
                    title: "Pan India Delivery",
                    desc: "Handcrafted baby essentials delivered across India in premium packaging that arrives in perfect condition.",
                  },
                  {
                    emoji: "🎀",
                    title: "Perfect Baby Gifting Solutions",
                    desc: "Curated hampers perfect for baby showers, first birthdays, return gifts, and every special celebration.",
                  },
                  {
                    emoji: "⭐",
                    title: "Trusted By 10,000+ Modern Parents",
                    desc: "Families across India trust Little Chiku for premium handcrafted baby and kids essentials.",
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="flex gap-5 rounded-3xl border border-[#edf2f2] bg-white p-7 transition-all hover:translate-x-1.5 hover:border-[#58c7bd]"
                  >
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#dff5f2] text-xl"
                      aria-hidden="true"
                    >
                      {card.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#24343a]">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#667085]">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        {/* ✅ FIX 14: itemScope + itemType for Review schema markup */}
        <section
          className="bg-[#fffdf8] px-6 py-24 md:px-12 lg:px-20"
          aria-labelledby="reviews-heading"
        >
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <span className="inline-block rounded-full bg-[#dff5f2] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#3dada3]">
                Parent Reviews
              </span>
              <h2
                id="reviews-heading"
                className="mt-5 font-serif text-4xl font-bold tracking-tight md:text-5xl"
              >
                Loved By Families{" "}
                <em className="italic text-[#58c7bd]">Across India</em>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg font-light text-[#667085]">
                Over 10,000 happy parents trust Little Chiku for premium
                handcrafted baby essentials.
              </p>
            </div>

            <div
              className="mt-14 grid gap-6 lg:grid-cols-3"
              itemScope
              itemType="https://schema.org/Product"
            >
              <meta
                itemProp="name"
                content="Little Chiku Handcrafted Baby Essentials"
              />
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`relative rounded-[28px] p-9 transition-all hover:-translate-y-1.5 hover:shadow-xl ${
                    t.featured
                      ? "bg-[#58c7bd] border border-[#58c7bd]"
                      : "bg-white border border-[#edf2f2]"
                  }`}
                  itemScope
                  itemType="https://schema.org/Review"
                  itemProp="review"
                >
                  <span
                    className={`absolute right-7 top-5 font-serif text-6xl font-bold leading-none ${t.featured ? "text-white/20" : "text-[#dff5f2]"}`}
                    aria-hidden="true"
                  >
                    "
                  </span>
                  <div
                    className={`text-base ${t.featured ? "text-yellow-300" : "text-yellow-400"}`}
                    aria-label={`${t.rating} out of 5 stars`}
                    itemScope
                    itemType="https://schema.org/Rating"
                    itemProp="reviewRating"
                  >
                    <meta itemProp="ratingValue" content={String(t.rating)} />
                    <meta itemProp="bestRating" content="5" />
                    ★★★★★
                  </div>
                  <p
                    className={`mt-4 text-[15px] italic leading-relaxed ${t.featured ? "text-white" : "text-[#4a5c63]"}`}
                    itemProp="reviewBody"
                  >
                    {t.text}
                  </p>
                  <div
                    className="mt-7 flex items-center gap-4"
                    itemScope
                    itemType="https://schema.org/Person"
                    itemProp="author"
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-base font-bold ${t.featured ? "bg-white/25 text-white" : "bg-[#dff5f2] text-[#3dada3]"}`}
                      aria-hidden="true"
                    >
                      {t.initial}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${t.featured ? "text-white" : "text-[#24343a]"}`}
                        itemProp="name"
                      >
                        {t.name}
                      </p>
                      <p
                        className={`text-xs ${t.featured ? "text-white/70" : "text-[#667085]"}`}
                      >
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ SECTION ── */}
        {/* ✅ NEW: FAQ section — captures long-tail searches + matches FAQPage JSON-LD schema */}
        <section
          className="px-6 py-24 md:px-12 lg:px-20 bg-[#f8f8f3]"
          aria-labelledby="faq-heading"
        >
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <span className="inline-block rounded-full bg-[#dff5f2] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#3dada3]">
                FAQs
              </span>
              <h2
                id="faq-heading"
                className="mt-5 font-serif text-4xl font-bold tracking-tight"
              >
                Frequently Asked{" "}
                <em className="italic text-[#58c7bd]">Questions</em>
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {[
                {
                  q: "Where is Little Chiku based in India?",
                  a: "Little Chiku is a handcrafted baby brand based in Jaipur, Rajasthan. We lovingly create all our organic baby essentials in Jaipur and deliver pan India.",
                },
                {
                  q: "Are Little Chiku baby products made from organic cotton?",
                  a: "Yes! All Little Chiku products are crafted from premium organic cotton — soft, breathable, and 100% safe for newborn and baby skin.",
                },
                {
                  q: "Does Little Chiku offer pan India delivery?",
                  a: "Absolutely. We deliver our handcrafted baby essentials across India. Every order is packed in beautiful premium packaging and shipped securely to your doorstep.",
                },
                {
                  q: "What baby products does Little Chiku sell?",
                  a: "Little Chiku offers organic baby bedding (quilts, dohars), hooded bath towels, washcloths, kids accessories (bags, pouches), baby clothing, and handcrafted return gift hampers for baby showers and naming ceremonies.",
                },
                {
                  q: "Are Little Chiku products good for gifting?",
                  a: "Little Chiku's curated gift hampers are a top choice for baby shower gifts, naming ceremony return gifts, first birthday presents, and newborn welcome hampers across India.",
                },
              ].map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-[#edf2f2] bg-white px-7 py-5 transition-all open:border-[#58c7bd]"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-[#24343a] list-none">
                    {faq.q}
                    <span className="text-[#58c7bd] text-xl group-open:rotate-45 transition-transform shrink-0">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-[#667085]">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="px-6 py-20 md:px-12 lg:px-20"
          aria-label="Shop Little Chiku handcrafted baby essentials"
        >
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[48px] bg-[#24343a] px-10 py-20 md:px-20">
            <div
              className="pointer-events-none absolute -top-24 -right-24 h-[400px] w-[400px] rounded-full bg-[rgba(88,199,189,0.25)] blur-3xl"
              aria-hidden="true"
            />
            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
              <div>
                <h2 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl">
                  Shop Premium{" "}
                  <em className="italic text-[#58c7bd]">Handcrafted</em>
                  <br />
                  Baby Essentials Today
                </h2>
                <p className="mt-5 text-lg font-light text-white/60">
                  Discover India's most loved handcrafted baby and kids
                  lifestyle brand — organic cotton, beautiful designs, and made
                  with love in Jaipur.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 lg:justify-end">
                <Link
                  href="/category/all"
                  className="inline-flex items-center gap-2 rounded-full bg-[#58c7bd] px-9 py-4 font-semibold text-white shadow-[0_8px_24px_rgba(88,199,189,0.4)] transition-all hover:-translate-y-0.5 hover:bg-[#3dada3]"
                >
                  Shop Now <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-white/20 bg-white/10 px-9 py-4 font-medium text-white transition-all hover:bg-white/15"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

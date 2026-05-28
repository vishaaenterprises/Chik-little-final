// app/about/page.tsx

import Image from "next/image";
import Link from "next/link";
import {
  Heart, Leaf, ShieldCheck, Sparkles, Baby, CheckCircle2,
  Gift, Palette, Truck, Star, Quote, ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "About Little Chiku | Handmade Baby Essentials & Kids Lifestyle Brand India",
  description:
    "Little Chiku is India's premium handcrafted baby and kids lifestyle brand. We create organic cotton baby bedding, bath linen, bags, clothing, gifting collections, and accessories designed with love for modern families.",
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
  ],
};

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

const collections = [
  {
    icon: Gift,
    title: "Return Gifts",
    desc: "Elegant handcrafted gifting hampers for baby showers, birthdays, and naming ceremonies.",
  },
  {
    icon: Palette,
    title: "Kids Accessories",
    desc: "Beautiful bags, pouches, and accessories designed with playful modern aesthetics.",
  },
  {
    icon: Truck,
    title: "Pan India Delivery",
    desc: "Premium packaging delivered securely across India, arriving in perfect condition.",
  },
  {
    icon: Star,
    title: "Loved By Parents",
    desc: "Trusted by over 10,000 happy modern families across India.",
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
    desc: "Skilled artisans handcraft each item with precision and love, meeting our strict premium quality standards.",
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
  },
  {
    text: "Ordered return gift hampers for my baby's naming ceremony — everyone loved them! The packaging was so premium and the products are genuinely handcrafted with love.",
    name: "Anjali Mehra",
    role: "Happy Parent, Delhi",
    initial: "A",
    featured: true,
  },
  {
    text: "The hooded baby towel is the softest thing I've ever felt! Little Chiku truly makes handcrafted baby products with exceptional care and every detail reflects comfort.",
    name: "Riya Patel",
    role: "New Parent, Ahmedabad",
    initial: "R",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#f8f8f3] text-[#24343a] overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative px-6 md:px-12 lg:px-20 pt-28 pb-20">
        {/* Blobs */}
        <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-[#dff5f2] opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#fff6e7] opacity-50 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <div>
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full bg-[#dff5f2] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#3dada3]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#58c7bd]" />
              Handcrafted Kids Lifestyle Brand
            </span>

            <h1 className="mt-6 font-serif text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              Crafted With{" "}
              <em className="italic text-[#58c7bd]">Love</em>
              <br />
              For Every Little
              <br />
              Moment
            </h1>

            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-[#667085]">
              Little Chiku creates{" "}
              <strong className="font-medium text-[#4a5c63]">premium handcrafted baby and kids essentials</strong>{" "}
              — organic cotton bedding, bath linen, accessories, and gifting collections designed with softness, comfort, and timeless aesthetics for{" "}
              <strong className="font-medium text-[#4a5c63]">modern Indian families</strong>.
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
                  <CheckCircle2 size={16} className="shrink-0 text-[#58c7bd]" />
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
                    { emoji: "🧸", title: "Baby Bedding Collection", sub: "Organic cotton quilts & dohars" },
                    { emoji: "🛁", title: "Bath Linen Essentials", sub: "Hooded towels & wash cloths" },
                    { emoji: "🎁", title: "Return Gift Hampers", sub: "Beautiful handcrafted sets" },
                    { emoji: "👜", title: "Kids Accessories", sub: "Bags, pouches & more" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl border border-[#edf2f2] bg-white p-4 shadow-sm">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dff5f2] text-lg">
                        {item.emoji}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#24343a]">{item.title}</p>
                        <p className="text-xs text-[#667085]">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Float badge — families */}
              <div className="absolute -bottom-4 -left-5 flex items-center gap-3 rounded-2xl border border-[rgba(224,163,72,0.2)] bg-[#fff6e7] px-5 py-3 shadow-xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#58c7bd] text-xl">
                  <Baby size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold leading-none text-[#24343a]">10,000+</p>
                  <p className="text-xs text-[#667085]">Happy Little Families</p>
                </div>
              </div>

              {/* Float badge — rating */}
              <div className="absolute -top-3 -right-5 rounded-2xl border border-[#edf2f2] bg-white px-4 py-3 shadow-lg">
                <div className="text-sm font-semibold text-[#24343a]">★★★★★</div>
                <p className="text-xs font-semibold text-[#24343a]">Trusted Brand</p>
                <p className="text-[11px] text-[#667085]">Across India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="bg-[#58c7bd] px-6 py-10 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/20 lg:grid-cols-4">
          {[
            { num: "10,000+", label: "Happy Families" },
            { num: "100%", label: "Handcrafted Products" },
            { num: "Organic", label: "Premium Fabrics" },
            { num: "4.5 ★", label: "Average Rating" },
          ].map((s, i) => (
            <div key={i} className="px-6 py-4 text-center">
              <p className="font-serif text-4xl font-bold text-white">{s.num}</p>
              <p className="mt-1 text-sm text-white/75">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── OUR STORY ── */}
      <section className="bg-[#fffdf8] px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          {/* Image side */}
          <div className="relative">
            <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-[40px] border border-[#edf2f2] bg-[#f0faf9] shadow-2xl">
              <Image
                src="/images/about/story.jpg"
                alt="Little Chiku handcrafted baby products story — organic cotton baby essentials made in India"
                width={600}
                height={750}
                className="h-full w-full rounded-[40px] object-cover"
              />
            </div>
            {/* Floating metrics card */}
            <div className="absolute -bottom-4 -right-5 w-[190px] rounded-[20px] border border-[#edf2f2] bg-white p-5 shadow-xl">
              {[
                { color: "bg-[#58c7bd]", label: "Handcrafted", val: "100%" },
                { color: "bg-[#e0a348]", label: "Organic Fabrics", val: "✓" },
                { color: "bg-[#7c4dcc]", label: "Pan India", val: "✓" },
              ].map((row, i) => (
                <div key={i} className={`flex items-center gap-3 py-2.5 ${i < 2 ? "border-b border-[#edf2f2]" : ""}`}>
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${row.color}`} />
                  <div>
                    <p className="text-base font-bold leading-none text-[#24343a]">{row.val}</p>
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

            <h2 className="mt-5 font-serif text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Designed For <em className="italic text-[#58c7bd]">Modern Parenting</em>
            </h2>

            <blockquote className="mt-8 rounded-r-2xl border-l-4 border-[#58c7bd] bg-[#f0faf9] px-6 py-5">
              <p className="font-serif text-lg italic leading-relaxed text-[#24343a]">
                "Every stitch, every fabric, every print is chosen with one question in mind — is this good enough for my baby?"
              </p>
              <cite className="mt-2 block text-sm font-semibold not-italic text-[#3dada3]">
                — Little Chiku Founder
              </cite>
            </blockquote>

            <p className="mt-6 text-lg font-light leading-relaxed text-[#667085]">
              We started Little Chiku with a simple vision — creating beautiful, functional, and{" "}
              <strong className="font-medium text-[#4a5c63]">handcrafted baby essentials</strong> that bring warmth and joy into everyday family life across India. From{" "}
              <strong className="font-medium text-[#4a5c63]">organic baby bedding</strong> and{" "}
              <strong className="font-medium text-[#4a5c63]">soft bath linen</strong> to{" "}
              <strong className="font-medium text-[#4a5c63]">premium gifting hampers</strong> and{" "}
              <strong className="font-medium text-[#4a5c63]">kids accessories</strong>.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-5">
              {[
                { num: "100%", label: "Handcrafted Premium Quality" },
                { num: "Organic", label: "Soft Sustainable Fabrics" },
              ].map((m, i) => (
                <div key={i} className="rounded-3xl border border-[#edf2f2] bg-white p-6 transition-transform hover:-translate-y-1">
                  <h3 className="font-serif text-4xl font-bold text-[#58c7bd]">{m.num}</h3>
                  <p className="mt-2 text-sm text-[#667085]">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-[#dff5f2] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#3dada3]">
              Why Little Chiku
            </span>
            <h2 className="mt-5 font-serif text-4xl font-bold tracking-tight md:text-5xl">
              Crafted For Comfort,{" "}
              <em className="italic text-[#58c7bd]">Designed With Care</em>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-[#667085]">
              Our handcrafted collections use premium organic materials, elegant aesthetics, and comfort-first design principles for modern parents and little ones across India.
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
                  {/* Top accent bar on hover */}
                  <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#58c7bd] transition-transform duration-300 group-hover:scale-x-100" />
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#dff5f2]">
                    <Icon size={28} className="text-[#58c7bd]" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#667085]">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ── */}
      <section className="bg-[#dff5f2] px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-block rounded-full border border-[#edf2f2] bg-white px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#3dada3]">
              Our Collections
            </span>
            <h2 className="mt-5 font-serif text-4xl font-bold tracking-tight md:text-5xl">
              Beautiful Essentials{" "}
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
                    <Icon size={26} className="text-[#58c7bd]" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#667085]">{item.desc}</p>
                  <Link
                    href="/shop"
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
      <section className="px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full bg-[#dff5f2] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#3dada3]">
              The Little Chiku Promise
            </span>
            <h2 className="mt-5 font-serif text-4xl font-bold tracking-tight md:text-5xl">
              How We Make <em className="italic text-[#58c7bd]">Every Product</em>
            </h2>
          </div>

          <div className="grid items-start gap-16 lg:grid-cols-2">
            {/* Steps */}
            <div className="flex flex-col gap-0">
              {steps.map((step, i) => (
                <div key={i} className="group relative flex gap-6 pb-9">
                  {i < steps.length - 1 && (
                    <div className="absolute left-[19px] top-11 bottom-0 w-0.5 bg-[#dff5f2]" />
                  )}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#dff5f2] text-sm font-bold text-[#3dada3] transition-all group-hover:bg-[#58c7bd] group-hover:text-white">
                    {step.num}
                  </div>
                  <div className="pt-1">
                    <h4 className="font-semibold text-[#24343a]">{step.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#667085]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Why cards */}
            <div className="flex flex-col gap-4">
              {[
                { emoji: "🌱", title: "Organic & Eco-Friendly Baby Products", desc: "Committed to sustainability — our organic cotton fabrics are gentle on babies and kinder to our planet." },
                { emoji: "🚚", title: "Pan India Delivery", desc: "Handcrafted baby essentials delivered across India in premium packaging that arrives in perfect condition." },
                { emoji: "🎀", title: "Perfect Baby Gifting Solutions", desc: "Curated hampers perfect for baby showers, first birthdays, return gifts, and every special celebration." },
                { emoji: "⭐", title: "Trusted By 10,000+ Modern Parents", desc: "Families across India trust Little Chiku for premium handcrafted baby and kids essentials." },
              ].map((card, i) => (
                <div
                  key={i}
                  className="flex gap-5 rounded-3xl border border-[#edf2f2] bg-white p-7 transition-all hover:translate-x-1.5 hover:border-[#58c7bd]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#dff5f2] text-xl">
                    {card.emoji}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#24343a]">{card.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-[#667085]">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-[#fffdf8] px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-[#dff5f2] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#3dada3]">
              Parent Reviews
            </span>
            <h2 className="mt-5 font-serif text-4xl font-bold tracking-tight md:text-5xl">
              Loved By Families <em className="italic text-[#58c7bd]">Across India</em>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg font-light text-[#667085]">
              Over 10,000 happy parents trust Little Chiku for premium handcrafted baby essentials.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`relative rounded-[28px] p-9 transition-all hover:-translate-y-1.5 hover:shadow-xl ${
                  t.featured
                    ? "bg-[#58c7bd] border border-[#58c7bd]"
                    : "bg-white border border-[#edf2f2]"
                }`}
              >
                <span className={`absolute right-7 top-5 font-serif text-6xl font-bold leading-none ${t.featured ? "text-white/20" : "text-[#dff5f2]"}`}>
                  "
                </span>
                <div className={`text-base ${t.featured ? "text-yellow-300" : "text-yellow-400"}`}>★★★★★</div>
                <p className={`mt-4 text-[15px] italic leading-relaxed ${t.featured ? "text-white" : "text-[#4a5c63]"}`}>
                  {t.text}
                </p>
                <div className="mt-7 flex items-center gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full text-base font-bold ${t.featured ? "bg-white/25 text-white" : "bg-[#dff5f2] text-[#3dada3]"}`}>
                    {t.initial}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${t.featured ? "text-white" : "text-[#24343a]"}`}>{t.name}</p>
                    <p className={`text-xs ${t.featured ? "text-white/70" : "text-[#667085]"}`}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-20 md:px-12 lg:px-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[48px] bg-[#24343a] px-10 py-20 md:px-20">
          <div className="pointer-events-none absolute -top-24 -right-24 h-[400px] w-[400px] rounded-full bg-[rgba(88,199,189,0.25)] blur-3xl" />
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl">
                Shop Premium{" "}
                <em className="italic text-[#58c7bd]">Handcrafted</em>
                <br />
                Baby Essentials Today
              </h2>
              <p className="mt-5 text-lg font-light text-white/60">
                Discover India's most loved handcrafted baby and kids lifestyle brand — organic, beautiful, and made with love.
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
  );
}
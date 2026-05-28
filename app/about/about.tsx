// app/about/page.jsx

import Image from "next/image";
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Leaf,
  Baby,
  Star,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="bg-[#f7f7f2] text-[#24343a] overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative px-6 md:px-14 lg:px-24 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <span className="bg-[#dff5f2] text-[#4db6ac] px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
              ABOUT LITTLE CHIKU
            </span>

            <h1 className="mt-6 text-5xl md:text-6xl leading-tight font-bold text-[#263238]">
              Crafted With Love
              <br />
              For Every Little Moment
            </h1>

            <p className="mt-7 text-[#667085] leading-8 text-lg max-w-xl">
              At Little Chiku, we create soft, safe, and thoughtfully designed
              products for babies and kids. From cozy bedding to adorable
              accessories, every piece is made with comfort, care, and modern
              style in mind.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">
              <button className="bg-[#58c7bd] hover:bg-[#49b7ad] transition-all text-white px-8 py-4 rounded-full font-medium shadow-lg">
                Explore Collection
              </button>

              <button className="border border-[#d5dede] hover:bg-white transition-all px-8 py-4 rounded-full font-medium">
                Learn More
              </button>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-5 mt-14">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#eef2f2]">
                <Heart className="text-[#58c7bd]" size={28} />
                <h3 className="font-semibold mt-4">Made With Care</h3>
                <p className="text-sm text-[#6b7280] mt-2 leading-6">
                  Designed thoughtfully for your little one’s everyday comfort.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#eef2f2]">
                <Leaf className="text-[#58c7bd]" size={28} />
                <h3 className="font-semibold mt-4">Organic Fabrics</h3>
                <p className="text-sm text-[#6b7280] mt-2 leading-6">
                  Premium soft cotton and baby-friendly materials only.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center">
            <div className="absolute w-[420px] h-[420px] bg-[#dff5f2] rounded-full blur-3xl opacity-70"></div>

            <div className="relative bg-white p-6 rounded-[40px] shadow-2xl border border-[#edf2f2]">
              <Image
                src="/about/about-main.jpg"
                alt="Baby Products"
                width={520}
                height={620}
                className="rounded-[30px] object-cover"
              />

              <div className="absolute -bottom-6 -left-6 bg-[#fff7e9] p-5 rounded-3xl shadow-lg w-[220px]">
                <div className="flex items-center gap-3">
                  <div className="bg-[#58c7bd] p-3 rounded-full">
                    <Baby className="text-white" size={22} />
                  </div>

                  <div>
                    <h4 className="font-bold text-lg">10K+</h4>
                    <p className="text-sm text-[#667085]">
                      Happy Little Families
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="px-6 md:px-14 lg:px-24 py-24 bg-[#fffdf9]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <Image
              src="/about/story.jpg"
              alt="Our Story"
              width={600}
              height={700}
              className="rounded-[40px] object-cover shadow-xl"
            />
          </div>

          <div>
            <span className="bg-[#fff1db] text-[#e3a54b] px-5 py-2 rounded-full text-sm font-semibold">
              OUR STORY
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mt-6 leading-tight">
              Thoughtfully Designed
              <br />
              For Modern Parents
            </h2>

            <p className="text-[#667085] mt-7 leading-8 text-lg">
              We started Little Chiku with a simple vision — to bring together
              comfort, aesthetics, and functionality into baby essentials that
              parents truly love.
            </p>

            <p className="text-[#667085] mt-5 leading-8 text-lg">
              Every collection is carefully curated with soft textures,
              beautiful patterns, and child-safe materials to create products
              that feel warm, cozy, and timeless.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h3 className="text-3xl font-bold text-[#58c7bd]">100%</h3>
                <p className="mt-2 text-[#667085]">Premium Quality Products</p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h3 className="text-3xl font-bold text-[#58c7bd]">24/7</h3>
                <p className="mt-2 text-[#667085]">Friendly Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="px-6 md:px-14 lg:px-24 py-24">
        <div className="max-w-7xl mx-auto text-center">
          <span className="bg-[#dff5f2] text-[#58c7bd] px-5 py-2 rounded-full text-sm font-semibold">
            WHY CHOOSE US
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-6">
            Crafted For Comfort,
            <br />
            Designed With Care
          </h2>

          <p className="text-[#667085] mt-6 max-w-2xl mx-auto leading-8 text-lg">
            We believe every child deserves the softest and safest experience.
            That’s why quality and comfort remain at the heart of everything we
            create.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#eef2f2]">
              <div className="w-16 h-16 bg-[#dff5f2] rounded-2xl flex items-center justify-center mx-auto">
                <ShieldCheck className="text-[#58c7bd]" size={30} />
              </div>

              <h3 className="text-xl font-semibold mt-6">
                Safe & Skin Friendly
              </h3>

              <p className="text-[#667085] mt-4 leading-7">
                Gentle fabrics and child-safe materials designed for delicate
                skin.
              </p>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#eef2f2]">
              <div className="w-16 h-16 bg-[#fff1db] rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="text-[#e3a54b]" size={30} />
              </div>

              <h3 className="text-xl font-semibold mt-6">
                Premium Aesthetic
              </h3>

              <p className="text-[#667085] mt-4 leading-7">
                Modern colors and elegant designs that blend beautifully into
                every home.
              </p>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#eef2f2]">
              <div className="w-16 h-16 bg-[#e8f2ff] rounded-2xl flex items-center justify-center mx-auto">
                <Star className="text-[#6ba7ff]" size={30} />
              </div>

              <h3 className="text-xl font-semibold mt-6">
                Loved By Parents
              </h3>

              <p className="text-[#667085] mt-4 leading-7">
                Thousands of happy families trust Little Chiku for baby
                essentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-6 md:px-14 lg:px-24 pb-24">
        <div className="max-w-7xl mx-auto bg-[#0f4f52] rounded-[40px] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f4f52] to-[#1d696b]"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center p-10 md:p-16">
            <div>
              <span className="bg-white/10 text-[#d8f7f4] px-5 py-2 rounded-full text-sm font-medium">
                LITTLE CHIKU
              </span>

              <h2 className="text-4xl md:text-5xl font-bold text-white mt-6 leading-tight">
                Making Childhood
                <br />
                More Comfortable
              </h2>

              <p className="text-[#cde7e5] mt-6 leading-8 text-lg max-w-xl">
                Discover beautifully designed essentials that combine softness,
                comfort, and functionality for every little moment.
              </p>

              <button className="mt-8 bg-[#58c7bd] hover:bg-[#49b7ad] transition-all text-white px-8 py-4 rounded-full font-medium shadow-xl">
                Shop Now
              </button>
            </div>

            <div className="flex justify-center">
              <Image
                src="/about/cta.jpg"
                alt="CTA"
                width={500}
                height={500}
                className="rounded-[32px] object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
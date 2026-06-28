'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, Tag, Leaf } from 'lucide-react'
import type { SanityBanner } from '@/lib/sanity'
import { getImageUrl } from '@/lib/sanity/image'

interface HeroSectionProps {
  banner?: SanityBanner | null
}

export default function HeroSection({ banner }: HeroSectionProps) {
  // Use banner data if available, otherwise use defaults
  const heroImage = banner?.image ? getImageUrl(banner.image) : '/home-bg.png'
  const buttonLink = banner?.buttonLink || '/category/all'
  const buttonText = banner?.buttonText || 'Shop Now'

  return (
    <section className="relative overflow-hidden bg-[#F6FBFB]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-2 items-center min-h-[78vh]">
          {/* LEFT CONTENT */}
          <div className="max-w-[540px] mx-auto lg:mx-0 text-center lg:text-left">
            {/* LOGO */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-full flex justify-center lg:justify-start lg:pl-16">
                <Image
                  src="/logo1.png"
                  alt="Little Chiku"
                  width={210}
                  height={120}
                  priority
                  className="object-contain w-[160px] sm:w-[180px] lg:w-[210px] h-auto"
                />
              </div>

              {/* HANDMADE */}
              <div className="flex items-center gap-3 mt-1 justify-center lg:justify-start">
                <div className="w-10 sm:w-14 h-[1px] bg-[#A8D8D6]" />
                <p className="text-[#4FBDBA] text-[12px] sm:text-[14px] font-medium tracking-[0.18em] uppercase whitespace-nowrap">
                  {banner?.subtitle || 'Handmade with Love'}
                </p>
                <div className="w-10 sm:w-14 h-[1px] bg-[#A8D8D6]" />
              </div>
            </div>

            {/* HEADING */}
            <div className="mt-4">
              <h1 className="text-[#2B2B2B] text-[34px] sm:text-[42px] lg:text-[60px] leading-[1.02] font-black tracking-[-1px] lg:tracking-[-2px]">
                {banner?.title || 'Premium Quality.'}
                <br />
                
              </h1>

               <p className="mt-5 text-[15px] sm:text-[17px] leading-8 text-[#5C5C5C] max-w-full sm:max-w-xl mx-auto lg:mx-0 px-2 sm:px-0 break-words">
              Thoughtfully made for Kids, Babies & Moms at
              <span className="text-[#D79B2D] font-bold italic">
                {" "}
                made with care & value{" "}
              </span>
              crafted with love and care.
            </p>

            {/* FEATURES */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-8 border-y border-[#ECECEC] py-5">

              {/* FEATURE 1 */}
              <div className="flex flex-col items-center px-2">
                <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-[#79C7C5] mb-2" />

                <h3 className="text-[12px] sm:text-[15px] font-semibold text-center text-[#2D2A26] leading-5">
                  Premium
                  <br />
                  Quality
                </h3>
              </div>

              {/* FEATURE 2 */}
              <div className="flex flex-col items-center border-x border-[#ECECEC] px-2">
                <Tag className="w-6 h-6 sm:w-7 sm:h-7 text-[#D79B2D] mb-2" />

                <h3 className="text-[12px] sm:text-[15px] font-semibold text-center text-[#2D2A26] leading-5">
                  Affordable 
                  <br />
                  Luxury
                </h3>
              </div>

              {/* FEATURE 3 */}
              <div className="flex flex-col items-center px-2">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-[#D79B2D] mb-2" />

                <h3 className="text-[12px] sm:text-[15px] font-semibold text-center text-[#2D2A26] leading-5">
                  Made for
                  <br />
                  Moms & Babies
                </h3>
              </div>
            </div>
            </div>

            {/* BUTTON */}
            <div className="mt-7 flex justify-center lg:justify-start">
              <Link href={buttonLink}>
                <button className="group bg-[#4FBDBA] hover:bg-[#2F7F7C] transition-all duration-300 text-white text-[15px] sm:text-[16px] font-semibold px-8 py-3 rounded-full flex items-center gap-3 shadow-[0_8px_25px_rgba(79,189,186,0.3)] hover:scale-[1.02]">
                  {buttonText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all duration-300" />
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden lg:flex relative justify-end">
            {/* BG CIRCLE */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <div className="w-[620px] h-[620px] rounded-full bg-[#DDF5F4]" />
            </div>
            {/* IMAGE */}
            <div className="relative z-10 scale-[1.35] translate-x-6">
              <Image
                src={heroImage}
                alt="Kids Products"
                width={1100}
                height={1100}
                priority
                className="object-contain w-full max-w-[1050px] h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


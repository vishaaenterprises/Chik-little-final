'use client'

// components/products/ProductTabs.tsx
// ─────────────────────────────────────────────────────────────
//  Renders the three product detail tabs (Details & Story,
//  Materials, Care Instructions) using data fetched from
//  Sanity. Fallbacks are shown only when a field is empty so
//  the UI never crashes on partially filled products.
// ─────────────────────────────────────────────────────────────

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Check } from 'lucide-react'
import type { SanityProduct, ProductMaterial } from '@/lib/sanity/types'

// ── Fallback content (shown only when CMS field is empty) ─────

const FALLBACK_STORY =
  'Each product is lovingly crafted by skilled artisans using traditional techniques. The organic cotton is sourced from certified farms, ensuring the softest, purest fabric for your little one.'

const FALLBACK_FEATURES: string[] = [
  '100% GOTS certified organic cotton',
  'Extra absorbent and quick-drying',
  'Adorable animal-inspired designs',
  'Generous size that grows with your child',
  'Pre-washed for ultimate softness',
  'Hypoallergenic and gentle on sensitive skin',
]

const FALLBACK_MATERIALS: ProductMaterial[] = [
  {
    title: '100% Organic Cotton',
    description: 'GOTS certified, sustainably grown',
  },
  {
    title: 'Natural Plant-Based Dyes',
    description: 'Free from AZO and harmful chemicals',
  },
  {
    title: 'Eco-Friendly Packaging',
    description: 'Recyclable, plastic-free materials',
  },
]

const FALLBACK_CARE: string[] = [
  'Machine wash cold with like colors',
  'Use mild detergent only',
  'Do not bleach',
  'Tumble dry low',
  'Iron on low heat if needed',
]

// ── Tab definitions ───────────────────────────────────────────

type TabId = 'description' | 'materials' | 'care'

interface TabDef {
  id: TabId
  label: string
}

const TABS: TabDef[] = [
  { id: 'description', label: 'Details & Story' },
  { id: 'materials', label: 'Materials' },
  { id: 'care', label: 'Care' },
]

// ── Props ─────────────────────────────────────────────────────

interface ProductTabsProps {
  /** Full Sanity product document, including all tab fields */
  product: SanityProduct
}

// ── Component ─────────────────────────────────────────────────

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('description')

  // ── Resolve content from Sanity, fall back if empty ─────────

  const storyTitle: string =
    product.storyTitle?.trim() || 'Our Story'

  const storyDescription: string =
    product.storyDescription?.trim() || FALLBACK_STORY

  const dimensions: string | null =
    product.dimensions?.trim() || null

  const features: string[] =
    Array.isArray(product.features) && product.features.length > 0
      ? product.features
      : FALLBACK_FEATURES

  const materials: ProductMaterial[] =
    Array.isArray(product.materials) && product.materials.length > 0
      ? product.materials
      : FALLBACK_MATERIALS

  const careInstructions: string[] =
    Array.isArray(product.careInstructions) &&
    product.careInstructions.length > 0
      ? product.careInstructions
      : FALLBACK_CARE

  // ── Render ───────────────────────────────────────────────────

  return (
    <section className="py-14 bg-[#F6FBFB] border-y border-[#E7EEEE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Tab Navigation ── */}
        <div className="mb-8 max-w-lg">
          <div className="flex gap-1 bg-white border border-[#E7EEEE] rounded-2xl p-1.5 shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#4FBDBA] text-white shadow-[0_4px_14px_rgba(79,189,186,0.25)]'
                    : 'text-[#6B6B6B] hover:text-[#2B2B2B] hover:bg-[#F6FBFB]'
                }`}
              >
                <span className="block truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="bg-white rounded-[2rem] p-6 sm:p-10 border border-[#E7EEEE] shadow-[0_10px_30px_rgba(79,189,186,0.06)]"
          >

            {/* ── Tab 1: Details & Story ── */}
            {activeTab === 'description' && (
              <div className="grid md:grid-cols-2 gap-10 md:gap-16">

                {/* Left — Brand story */}
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#2B2B2B] mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#4FBDBA] rounded-full inline-block" />
                    {storyTitle}
                  </h3>
                  <p className="text-[#6B6B6B] leading-relaxed mb-5 text-[15px]">
                    {storyDescription}
                  </p>
                  {dimensions !== null && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F6FBFB] border border-[#E7EEEE] rounded-2xl text-sm text-[#6B6B6B]">
                      <span className="font-semibold text-[#2B2B2B]">
                        Dimensions:
                      </span>{' '}
                      {dimensions}
                    </div>
                  )}
                </div>

                {/* Right — Key Features */}
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#2B2B2B] mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#F6C453] rounded-full inline-block" />
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-lg bg-[#DDF5F4] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#4FBDBA]" />
                        </span>
                        <span className="text-[15px] text-[#6B6B6B]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ── Tab 2: Materials ── */}
            {activeTab === 'materials' && (
              <div className="max-w-lg">
                <h3 className="font-heading text-xl font-bold text-[#2B2B2B] mb-6 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#4FBDBA] rounded-full inline-block" />
                  Materials Used
                </h3>
                <ul className="space-y-4">
                  {materials.map((item, idx) => (
                    <li
                      key={item._key ?? String(idx)}
                      className="flex items-start gap-4 p-4 bg-[#F6FBFB] rounded-2xl border border-[#E7EEEE]"
                    >
                      <span className="w-8 h-8 rounded-xl bg-[#DDF5F4] flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-[#4FBDBA]" />
                      </span>
                      <div>
                        <p className="font-semibold text-[#2B2B2B] text-sm">
                          {item.title}
                        </p>
                        {item.description ? (
                          <p className="text-xs text-[#6B6B6B] mt-0.5">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Tab 3: Care Instructions ── */}
            {activeTab === 'care' && (
              <div className="max-w-lg">
                <h3 className="font-heading text-xl font-bold text-[#2B2B2B] mb-6 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#F6C453] rounded-full inline-block" />
                  Care Instructions
                </h3>
                <ul className="space-y-3">
                  {careInstructions.map((instruction, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-lg bg-[#FFF4D6] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#F6C453]" />
                      </span>
                      <span className="text-[15px] text-[#6B6B6B]">
                        {instruction}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
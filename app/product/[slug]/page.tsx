'use client'


import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import ProductCard from '@/components/products/ProductCard'
import ProductTabs from '@/components/products/Producttabs'
import { useCart } from '@/context/cart-context'
import {
  type SanityProduct,
  type SanityProductCard,
  sanityProductToLegacy,
} from '@/lib/sanity/types'
import { getImageUrl } from '@/lib/sanity/image'
import {
  Heart,
  Check,
  Truck,
  Shield,
  RefreshCw,
  Star,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Share2,
  Ruler,
  Package,
  Sparkles,
  Leaf,
  Loader2,
} from 'lucide-react'

// ── UI-only defaults 

const DEFAULT_COLORS = [
  { name: 'Sage Green', hex: '#7E8B5B' },
  { name: 'Dusty Blue', hex: '#AFC8D6' },
  { name: 'Warm Cream', hex: '#F8F2E8' },
  { name: 'Soft Terracotta', hex: '#C9876B' },
]

const DEFAULT_SIZES = ['0-12 months', '1-3 years', '3-5 years']

// ── Page 

export default function ProductPage() {
  const params = useParams()
  // params.slug comes from the [slug] folder name
  const slug = params.slug as string

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useCart()

  // ── Server state ──────────────────────────────────────────
  const [sanityProduct, setSanityProduct] = useState<SanityProduct | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<SanityProduct[]>([])
  const [loading, setLoading] = useState(true)

  // ── UI state ──────────────────────────────────────────────
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)

  // ── Fetch by slug ─────────────────────────────────────────
useEffect(() => {

  if (!slug) return

  async function fetchProduct() {

    setLoading(true)

    try {

      // IMPORTANT
      const res = await fetch(
        `http://localhost:3000/api/sanity/product?slug=${slug}`,
        {
          cache: 'no-store',
        }
      )

      // RESPONSE CHECK
      if (!res.ok) {

        throw new Error(
          'Failed to fetch product'
        )
      }

      // CONTENT TYPE CHECK
      const contentType =
        res.headers.get(
          'content-type'
        )

      if (
        !contentType ||
        !contentType.includes(
          'application/json'
        )
      ) {

        throw new Error(
          'Invalid JSON response'
        )
      }

      const data =
        await res.json()

      // PRODUCT EXISTS

      if (data?.product) {

        setSanityProduct(
          data.product
        )

        setRelatedProducts(
          data.relatedProducts ?? []
        )

        setSelectedSize(
          data.product.sizes?.[0]
            ?? DEFAULT_SIZES[0]
        )

      } else {

        console.error(
          '[ProductPage] Product not found'
        )
      }

    } catch (err) {

      console.error(
        '[ProductPage] fetch error:',
        err
      )

    } finally {

      setLoading(false)
    }
  }

  fetchProduct()

}, [slug])

  // ── Derived 
  const displayProduct = sanityProduct
    ? {
        id: sanityProduct._id,
        // Always resolve to a plain string — GROQ returns "slug": slug.current
        slug:
          typeof sanityProduct.slug === 'string'
            ? sanityProduct.slug
            : (sanityProduct.slug as any)?.current ?? '',
        name: sanityProduct.productName,
        price: sanityProduct.price,
        originalPrice: sanityProduct.originalPrice,
        rating: sanityProduct.rating ?? 4.9,
        image: getImageUrl(sanityProduct.mainImage),
        category: sanityProduct.category?.title ?? 'Products',
        categorySlug: sanityProduct.category?.slug ?? 'all',
        subcategory: sanityProduct.productType ?? '',
        isNew: sanityProduct.newArrival ?? sanityProduct.badge === 'new',
        isBestseller: sanityProduct.badge === 'bestseller',
        shortDescription: sanityProduct.shortDescription,
        colors:
          sanityProduct.colors && sanityProduct.colors.length > 0
            ? sanityProduct.colors
            : DEFAULT_COLORS,
        sizes:
          sanityProduct.sizes && sanityProduct.sizes.length > 0
            ? sanityProduct.sizes
            : DEFAULT_SIZES,
        reviewsCount: sanityProduct.reviewsCount ?? 0,
        stock: sanityProduct.stock ?? 0,
      }
    : null

  const images: string[] = sanityProduct
    ? [
        getImageUrl(sanityProduct.mainImage),
        ...(sanityProduct.galleryImages?.map((img) => getImageUrl(img)) ?? []),
      ].filter(Boolean)
    : []

  // "You May Also Like" — admin-curated via alsoLike[] in Sanity
  const alsoLikeProducts = (sanityProduct?.alsoLike ?? []).map(
    (p: SanityProductCard) => sanityProductToLegacy(p, getImageUrl(p.mainImage))
  )

  // Related products — same category, auto-fetched
  const displayRelatedProducts = relatedProducts.map((p) =>
    sanityProductToLegacy(p, getImageUrl(p.mainImage))
  )

  const isWishlisted = displayProduct ? isInWishlist(displayProduct.id) : false

  const discount = displayProduct?.originalPrice
    ? Math.round(
        ((displayProduct.originalPrice - displayProduct.price) /
          displayProduct.originalPrice) *
          100
      )
    : 0

  // ── Image navigation ──────────────────────────────────────
  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)

 
  const handleAddToCart = () => {
    if (!displayProduct) return
    const colorObj = displayProduct.colors[selectedColorIndex] as {
      name: string
      hex: string
    }
    addToCart(
      {
        id: displayProduct.id,
    
        slug: displayProduct.slug,
        name: displayProduct.name,
        price: displayProduct.price,
        originalPrice: displayProduct.originalPrice,
        image: displayProduct.image,
        category: displayProduct.category,
        size: selectedSize,
        color: colorObj?.name ?? 'Default',
      },
      quantity
    )
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  // ── Wishlist
  const handleWishlistToggle = () => {
    if (!displayProduct) return
    if (isWishlisted) {
      removeFromWishlist(displayProduct.id)
    } else {
      addToWishlist({
        id: displayProduct.id,
        slug: displayProduct.slug,
        name: displayProduct.name,
        price: displayProduct.price,
        originalPrice: displayProduct.originalPrice,
        image: displayProduct.image,
        category: displayProduct.category,
        rating: displayProduct.rating,
        isNew: displayProduct.isNew,
        isBestseller: displayProduct.isBestseller,
      })
    }
  }

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#4FBDBA] mx-auto mb-4" />
            <p className="text-[#6B6B6B]">Loading product...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  // ── Not found ─────────────────────────────────────────────
  if (!displayProduct || !sanityProduct) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#2B2B2B] mb-4">
              Product Not Found
            </h1>
            <p className="text-[#6B6B6B] mb-6">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/category/all"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4FBDBA] text-white rounded-2xl font-semibold hover:bg-[#2F7F7C] transition-all"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  const currentColor = displayProduct.colors[selectedColorIndex] as {
    name: string
    hex: string
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <MainLayout>
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-[#4FBDBA]/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-40 left-0 w-80 h-80 bg-[#F6C453]/6 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2 relative z-10">
        <nav className="flex items-center gap-1.5 text-sm text-[#6B6B6B] overflow-hidden whitespace-nowrap text-ellipsis">
          <Link href="/" className="hover:text-[#4FBDBA] transition-colors duration-200">
            Home
          </Link>
          <span className="text-[#E7EEEE]">/</span>
          <Link
            href={`/category/${displayProduct.categorySlug}`}
            className="hover:text-[#4FBDBA] transition-colors duration-200"
          >
            {displayProduct.category}
          </Link>
          <span className="text-[#E7EEEE]">/</span>
          <span className="text-[#2B2B2B] font-medium truncate">
            {displayProduct.name}
          </span>
        </nav>
      </div>

      {/* ── Product Section ── */}
      <section className="pb-16 md:pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

            {/* ── Image Gallery ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative bg-[#DDF5F4]/40 rounded-[2rem] overflow-hidden aspect-square group shadow-[0_10px_40px_rgba(79,189,186,0.1)] border border-[#E7EEEE]">
                {images.length > 0 && (
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={images[currentImageIndex]}
                      alt={displayProduct.name}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.35 }}
                    />
                  </AnimatePresence>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:shadow-[0_6px_24px_rgba(79,189,186,0.2)] hover:scale-110"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#2B2B2B]" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:shadow-[0_6px_24px_rgba(79,189,186,0.2)] hover:scale-110"
                    >
                      <ChevronRight className="w-5 h-5 text-[#2B2B2B]" />
                    </button>
                  </>
                )}
                {discount > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-[#F6C453] text-[#2B2B2B] text-sm font-bold rounded-2xl shadow-[0_4px_12px_rgba(246,196,83,0.35)]">
                      {discount}% OFF
                    </span>
                  </div>
                )}
                {displayProduct.isBestseller && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#4FBDBA] text-xs font-bold rounded-2xl shadow-sm border border-[#E7EEEE]">
                      <Sparkles className="w-3 h-3" />
                      Bestseller
                    </span>
                  </div>
                )}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`rounded-full transition-all duration-200 ${
                          i === currentImageIndex
                            ? 'w-5 h-2 bg-[#4FBDBA]'
                            : 'w-2 h-2 bg-[#E7EEEE] hover:bg-[#4FBDBA]/40'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                        idx === currentImageIndex
                          ? 'border-[#4FBDBA] shadow-[0_0_0_3px_rgba(79,189,186,0.15)]'
                          : 'border-[#E7EEEE] hover:border-[#4FBDBA]/50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ── Product Info ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6 lg:pt-2"
            >
              {/* Category pill + Share */}
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DDF5F4] text-[#2F7F7C] text-xs font-semibold rounded-full uppercase tracking-wider">
                  <Leaf className="w-3 h-3" />
                  {displayProduct.category}
                  {displayProduct.subcategory ? ` · ${displayProduct.subcategory}` : ''}
                </span>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href)
                      alert('Product link copied!')
                    } catch { /* unavailable */ }
                  }}
                  className="p-2.5 border border-[#E7EEEE] bg-white rounded-2xl hover:bg-[#DDF5F4] hover:border-[#4FBDBA]/40 transition-all duration-200 flex-shrink-0 shadow-sm"
                  aria-label="Copy product link"
                >
                  <Share2 className="w-4 h-4 text-[#6B6B6B]" />
                </button>
              </div>

              {/* Title */}
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#2B2B2B] leading-tight tracking-tight">
                {displayProduct.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 bg-[#FFF4D6] px-3 py-1.5 rounded-2xl">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(displayProduct.rating)
                            ? 'fill-[#F6C453] text-[#F6C453]'
                            : 'text-[#E7EEEE] fill-[#E7EEEE]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-sm text-[#2B2B2B]">{displayProduct.rating}</span>
                </div>
                <span className="text-sm text-[#6B6B6B]">{displayProduct.reviewsCount} reviews</span>
                <span className="inline-flex items-center gap-1 text-sm text-[#2F7F7C] font-semibold">
                  <span className="w-2 h-2 bg-[#4FBDBA] rounded-full inline-block" />
                  {displayProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 py-5 border-y border-[#E7EEEE] flex-wrap">
                <span className="text-4xl font-heading font-bold text-[#2B2B2B]">
                  Rs. {displayProduct.price.toLocaleString()}
                </span>
                {displayProduct.originalPrice && (
                  <>
                    <span className="text-xl text-[#6B6B6B] line-through">
                      Rs. {displayProduct.originalPrice.toLocaleString()}
                    </span>
                    <span className="px-3 py-1 bg-[#FFF4D6] text-[#2B2B2B] font-semibold rounded-2xl text-sm border border-[#F6C453]/30">
                      Save Rs. {(displayProduct.originalPrice - displayProduct.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Short description */}
              {displayProduct.shortDescription && (
                <p className="text-[#6B6B6B] leading-relaxed text-[15px]">
                  {displayProduct.shortDescription}
                </p>
              )}

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-semibold text-[#2B2B2B] mb-3">
                  Color: <span className="font-normal text-[#6B6B6B]">{currentColor?.name ?? 'Default'}</span>
                </label>
                <div className="flex gap-3 flex-wrap">
                  {displayProduct.colors.map((color, idx) => {
                    const c = color as { name: string; hex: string }
                    return (
                      <button
                        key={c.name ?? idx}
                        onClick={() => setSelectedColorIndex(idx)}
                        className={`w-11 h-11 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center ${
                          selectedColorIndex === idx
                            ? 'border-[#4FBDBA] shadow-[0_0_0_3px_rgba(79,189,186,0.2)] scale-110'
                            : 'border-[#E7EEEE] hover:border-[#4FBDBA]/50 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {selectedColorIndex === idx && (
                          <Check className={`w-4 h-4 ${c.hex === '#F8F2E8' ? 'text-[#2B2B2B]' : 'text-white'}`} />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-[#2B2B2B]">
                    Size: <span className="font-normal text-[#6B6B6B]">{selectedSize}</span>
                  </label>
                  <button className="text-sm text-[#4FBDBA] hover:text-[#2F7F7C] font-semibold flex items-center gap-1 transition-colors duration-200">
                    <Ruler className="w-3.5 h-3.5" />
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {displayProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 rounded-2xl border-2 text-sm font-semibold transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-[#4FBDBA] bg-[#4FBDBA] text-white shadow-[0_6px_20px_rgba(79,189,186,0.28)]'
                          : 'border-[#E7EEEE] bg-white text-[#2B2B2B] hover:border-[#4FBDBA]/60 hover:bg-[#DDF5F4]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="flex items-center gap-1 bg-[#F6FBFB] border border-[#E7EEEE] rounded-2xl p-1.5 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center transition-colors duration-200 text-[#2B2B2B] disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-[#2B2B2B] text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center transition-colors duration-200 text-[#2B2B2B]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <motion.button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-[15px] ${
                    addedToCart
                      ? 'bg-[#2F7F7C] text-white shadow-[0_12px_30px_rgba(47,127,124,0.3)]'
                      : 'bg-[#4FBDBA] text-white shadow-[0_12px_30px_rgba(79,189,186,0.28)] hover:bg-[#2F7F7C] hover:shadow-[0_16px_40px_rgba(79,189,186,0.38)] hover:-translate-y-0.5'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.span key="added" className="flex items-center gap-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                        <Check className="w-5 h-5" />
                        Added to Cart!
                      </motion.span>
                    ) : (
                      <motion.span key="add" className="flex items-center gap-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                        <Package className="w-5 h-5" />
                        Add to Cart · Rs. {(displayProduct.price * quantity).toLocaleString()}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  onClick={handleWishlistToggle}
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    isWishlisted
                      ? 'bg-red-50 text-red-500 border-red-200 shadow-[0_4px_16px_rgba(239,68,68,0.15)]'
                      : 'bg-white border-[#E7EEEE] text-[#6B6B6B] hover:border-[#4FBDBA]/50 hover:bg-[#DDF5F4] hover:text-[#4FBDBA] shadow-sm'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                >
                  <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-[#E7EEEE]">
                {[
                  { icon: Truck,     title: 'Free Delivery',  desc: 'On orders above Rs. 499', color: 'bg-[#DDF5F4] text-[#4FBDBA]' },
                  { icon: RefreshCw, title: 'Easy Returns',   desc: '30-day return policy',    color: 'bg-[#FFF4D6] text-[#F6C453]' },
                  { icon: Shield,    title: 'Secure Payment', desc: '100% secure checkout',    color: 'bg-[#DDF5F4] text-[#2F7F7C]' },
                ].map((badge) => {
                  const Icon = badge.icon
                  return (
                    <div key={badge.title} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E7EEEE] shadow-sm">
                      <div className={`w-10 h-10 rounded-xl ${badge.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#2B2B2B] leading-tight">{badge.title}</p>
                        <p className="text-xs text-[#6B6B6B] mt-0.5">{badge.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Product Tabs (Details, Materials, Care) ── */}
      <ProductTabs product={sanityProduct} />

      {/* ── "You May Also Like" — admin-curated ── */}
      {alsoLikeProducts.length > 0 && (
        <section className="py-16 bg-[#F6FBFB] border-t border-[#E7EEEE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#DDF5F4] rounded-full mb-2">
                  <Sparkles className="w-3 h-3 text-[#4FBDBA]" />
                  <span className="text-xs font-semibold text-[#2F7F7C] uppercase tracking-wide">
                    Curated For You
                  </span>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#2B2B2B]">
                  You May Also Like
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {alsoLikeProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related Products — same category, auto ── */}
      {displayRelatedProducts.length > 0 && (
        <section className="py-16 bg-[#FFFDF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF4D6] rounded-full mb-2">
                  <Sparkles className="w-3 h-3 text-[#F6C453]" />
                  <span className="text-xs font-semibold text-[#2B2B2B] uppercase tracking-wide">
                    From The Same Collection
                  </span>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#2B2B2B]">
                  Related Products
                </h2>
              </div>
              <Link
                href={`/category/${displayProduct.categorySlug}`}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#4FBDBA] hover:text-[#2F7F7C] font-semibold transition-colors duration-200"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {displayRelatedProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  )
}
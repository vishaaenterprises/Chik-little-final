"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/products/ProductCard";
import ProductTabs from "@/components/products/Producttabs";
import ProductJsonLd from "@/components/seo/ProductJsonLd"; // ← NEW
import { useCart } from "@/context/cart-context";
import {
  type SanityProduct,
  type SanityProductCard,
  type ProductVariant,
  sanityProductToLegacy,
  computeDiscount,
} from "@/lib/sanity/types";
import { getImageUrl } from "@/lib/sanity/image";
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
  AlertCircle,
} from "lucide-react";

// ── Fallback data when Sanity has no variants ─────────────────

const DEFAULT_COLORS = [
  { name: "Sage Green", hex: "#7E8B5B" },
  { name: "Dusty Blue", hex: "#AFC8D6" },
  { name: "Warm Cream", hex: "#F8F2E8" },
  { name: "Soft Terracotta", hex: "#C9876B" },
];

const DEFAULT_SIZES = ["0-12 months", "1-3 years", "3-5 years"];

// ── Helper: resolve image URLs from a variant's images array ──

function variantImageUrls(variant: ProductVariant): string[] {
  return (variant.images ?? [])
    .map((img) => getImageUrl(img))
    .filter(Boolean);
}

// ── Helper: typed fbq accessor (avoids `any` sprinkled everywhere) ──

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function ProductPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : (params.slug as string);

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useCart();

  const [sanityProduct, setSanityProduct] = useState<SanityProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<SanityProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Variant state ─────────────────────────────────────────────
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Non-variant state
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/sanity/product?slug=${encodeURIComponent(slug)}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`API responded with status ${res.status}`);
        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json"))
          throw new Error("Expected JSON response from API");
        const data = await res.json();
        if (data?.product) {
          const product: SanityProduct = data.product;
          setSanityProduct(product);
          setRelatedProducts(data.relatedProducts ?? []);

          const firstVariant = product.variants?.[0] ?? null;
          setSelectedVariant(firstVariant);
          setSelectedImage(0);

          setSelectedSize(
            firstVariant?.size ??
            product.sizes?.[0] ??
            DEFAULT_SIZES[0]
          );
        } else {
          console.warn("[ProductPage] Product not found for slug:", slug);
        }
      } catch (err) {
        console.error("[ProductPage] fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  // ── Handle variant change ─────────────────────────────────────
  const handleVariantChange = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedImage(0);
    if (variant.size) setSelectedSize(variant.size);
  }, []);

  // ── Derived: resolved display images ──────────────────────────
  const images = useMemo<string[]>(() => {
    if (!sanityProduct) return [];
    if (selectedVariant) {
      return variantImageUrls(selectedVariant);
    }
    return [
      getImageUrl(sanityProduct.mainImage),
      ...(sanityProduct.galleryImages?.map((img) => getImageUrl(img)) ?? []),
    ].filter(Boolean);
  }, [sanityProduct, selectedVariant]);

  // ── Derived: display values (variant-first, product fallback) ──
  const displayPrice         = selectedVariant?.price         ?? sanityProduct?.price         ?? 0;
  const displayOriginalPrice = selectedVariant?.originalPrice ?? sanityProduct?.originalPrice;
  const displayStock         = selectedVariant?.stock         ?? sanityProduct?.stock         ?? 0;
  const displayRating        = selectedVariant?.rating        ?? sanityProduct?.rating        ?? 4.9;
  const displayReviews       = selectedVariant?.reviews       ?? sanityProduct?.reviewsCount  ?? 0;
  const displayDescription   = selectedVariant?.shortDescription ?? sanityProduct?.shortDescription;
  const displayColorName     = selectedVariant?.colorName;

  const discount = useMemo(
    () => computeDiscount(displayPrice, displayOriginalPrice),
    [displayPrice, displayOriginalPrice]
  );

  const isOOS = useMemo(
    () => sanityProduct?.outOfStock === true || displayStock === 0,
    [sanityProduct?.outOfStock, displayStock]
  );

  // ── Derived: legacy displayProduct ────────────────────────────
  const displayProduct = useMemo(() => {
    if (!sanityProduct) return null;
    return {
      id: sanityProduct._id,
      slug:
        typeof sanityProduct.slug === "string"
          ? sanityProduct.slug
          : ((sanityProduct.slug as any)?.current ?? ""),
      name: sanityProduct.productName,
      price:         displayPrice,
      originalPrice: displayOriginalPrice,
      rating:        displayRating,
      image: getImageUrl(sanityProduct.mainImage),
      category:    sanityProduct.category?.title ?? "Products",
      categorySlug:
        typeof sanityProduct.category?.slug === "string"
          ? sanityProduct.category.slug
          : ((sanityProduct.category?.slug as any)?.current ?? "all"),
      subcategory: sanityProduct.productType ?? "",
      isNew:       sanityProduct.newArrival ?? sanityProduct.badge === "new",
      isBestseller: sanityProduct.badge === "bestseller",
      outOfStock:  isOOS,
      shortDescription: displayDescription,
      colors:
        sanityProduct.variants && sanityProduct.variants.length > 0
          ? sanityProduct.variants.map((v) => ({ name: v.colorName, hex: v.colorCode }))
          : sanityProduct.colors && sanityProduct.colors.length > 0
          ? sanityProduct.colors
          : DEFAULT_COLORS,
      sizes:
        sanityProduct.sizes && sanityProduct.sizes.length > 0
          ? sanityProduct.sizes
          : DEFAULT_SIZES,
      reviewsCount: displayReviews,
      stock:        displayStock,
    };
  }, [
    sanityProduct,
    displayPrice,
    displayOriginalPrice,
    displayRating,
    displayReviews,
    displayDescription,
    displayStock,
    isOOS,
  ]);

  // ── Meta Pixel: ViewContent ─────────────────────────────────
  // Fires once per product load (and whenever the product identity changes).
  // Uses displayProduct.id as the dependency so it doesn't refire on every
  // unrelated re-render (e.g. quantity or size changes).
  useEffect(() => {
    if (!displayProduct || typeof window === "undefined") return;
    if (!window.fbq) return;

    window.fbq("track", "ViewContent", {
      content_name: displayProduct.name,
      content_ids: [displayProduct.id],
      content_type: "product",
      value: displayPrice,
      currency: "INR",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayProduct?.id]);

  // ── Gallery navigation ────────────────────────────────────────
  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    setSelectedImage((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // ── Add to Cart ───────────────────────────────────────────────
  // Note: the AddToCart Meta Pixel event itself is fired centrally inside
  // context/cart-context.tsx's addToCart() function, so it fires consistently
  // no matter where "Add to Cart" is triggered from (this page, ProductCard, etc).
  const handleAddToCart = useCallback(() => {
    if (!displayProduct || isOOS) return;
    addToCart(
      {
        id:            displayProduct.id,
        slug:          displayProduct.slug,
        name:          displayProduct.name,
        price:         displayPrice,
        originalPrice: displayOriginalPrice,
        image:         images[0] ?? displayProduct.image,
        category:      displayProduct.category,
        size:          selectedSize,
        color:         displayColorName ?? selectedVariant?.colorName ?? "Default",
        ...(selectedVariant?.sku ? { sku: selectedVariant.sku } : {}),
      },
      quantity
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [
    displayProduct,
    isOOS,
    displayPrice,
    displayOriginalPrice,
    images,
    selectedSize,
    displayColorName,
    selectedVariant,
    quantity,
    addToCart,
  ]);

  // ── Wishlist toggle ───────────────────────────────────────────
  const isWishlisted = displayProduct ? isInWishlist(displayProduct.id) : false;

  const handleWishlistToggle = useCallback(() => {
    if (!displayProduct) return;
    if (isWishlisted) {
      removeFromWishlist(displayProduct.id);
    } else {
      addToWishlist({
        id:           displayProduct.id,
        slug:         displayProduct.slug,
        name:         displayProduct.name,
        price:        displayProduct.price,
        originalPrice:displayProduct.originalPrice,
        image:        displayProduct.image,
        category:     displayProduct.category,
        rating:       displayProduct.rating,
        isNew:        displayProduct.isNew,
        isBestseller: displayProduct.isBestseller,
      });
    }
  }, [displayProduct, isWishlisted, addToWishlist, removeFromWishlist]);

  // ── Also-like / related ───────────────────────────────────────
  const alsoLikeProducts = useMemo(
    () =>
      (sanityProduct?.alsoLike ?? []).map((p: SanityProductCard) =>
        sanityProductToLegacy(p, getImageUrl(p.mainImage))
      ),
    [sanityProduct?.alsoLike]
  );

  const displayRelatedProducts = useMemo(
    () => relatedProducts.map((p) => sanityProductToLegacy(p, getImageUrl(p.mainImage))),
    [relatedProducts]
  );

  // ── Loading ───────────────────────────────────────────────────
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
    );
  }

  // ── Not found ─────────────────────────────────────────────────
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
    );
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <MainLayout>
      {/* Google Product Rich Results JSON-LD */}
      {displayProduct && (
        <ProductJsonLd
          name={displayProduct.name}
          description={displayDescription}
          images={images}
          sku={selectedVariant?.sku}
          price={displayPrice}
          originalPrice={displayOriginalPrice}
          availability={isOOS ? "OutOfStock" : "InStock"}
          rating={displayRating}
          reviewCount={displayReviews}
          slug={displayProduct.slug}
        />
      )}

      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-[#4FBDBA]/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-40 left-0 w-80 h-80 bg-[#F6C453]/6 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Breadcrumb + Back Arrow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 relative z-10">
        <div className="flex items-center gap-3">
          <Link
            href={`/category/${displayProduct.categorySlug}`}
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#ECEFEF] shadow-sm hover:bg-[#DDF5F4] hover:border-[#4FBDBA]/40 hover:text-[#4FBDBA] text-[#6B6B6B] transition-all duration-200"
            aria-label="Go back"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <nav className="flex items-center gap-1.5 text-[13px] text-[#8A8A8A] overflow-hidden whitespace-nowrap min-w-0 tracking-wide">
            <Link href="/" className="hover:text-[#4FBDBA] transition-colors duration-200 flex-shrink-0">
              Home
            </Link>
            <span className="text-[#E2E8E8] flex-shrink-0">/</span>
            <Link
              href={`/category/${displayProduct.categorySlug}`}
              className="hover:text-[#4FBDBA] transition-colors duration-200 flex-shrink-0"
            >
              {displayProduct.category}
            </Link>
            <span className="text-[#E2E8E8] flex-shrink-0">/</span>
            <span className="text-[#2B2B2B] font-medium truncate">
              {displayProduct.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="pb-16 md:pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

            {/* ── Image Gallery ────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5"
            >
              <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-b from-[#FBFDFD] to-[#F3F8F8] rounded-[2rem] overflow-hidden border border-[#ECEFEF] shadow-[0_20px_60px_-15px_rgba(79,189,186,0.18)]">
                {images.length > 0 && (
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${selectedVariant?._key ?? 'base'}-${selectedImage}`}
                      src={images[selectedImage]}
                      alt={`${displayProduct.name}${displayColorName ? ` – ${displayColorName}` : ''}`}
                      className="absolute inset-0 w-full h-full object-contain p-10 sm:p-14"
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </AnimatePresence>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md border border-white shadow-[0_8px_24px_rgba(20,40,40,0.14)] text-[#2B2B2B] transition-all duration-200 hover:bg-white hover:shadow-[0_10px_30px_rgba(79,189,186,0.30)] hover:scale-110 active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md border border-white shadow-[0_8px_24px_rgba(20,40,40,0.14)] text-[#2B2B2B] transition-all duration-200 hover:bg-white hover:shadow-[0_10px_30px_rgba(79,189,186,0.30)] hover:scale-110 active:scale-95"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-5 left-5 z-10 flex flex-col gap-2 items-start">
                  {isOOS ? (
                    <span className="px-4 py-1.5 bg-[#3A3A3A] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
                      Out of Stock
                    </span>
                  ) : (
                    discount > 0 && (
                      <span className="px-4 py-1.5 bg-gradient-to-r from-[#E2434E] to-[#C92E3C] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-[0_8px_18px_rgba(201,46,60,0.35)]">
                        Flat {discount}% Off
                      </span>
                    )
                  )}
                </div>

                {displayProduct.isBestseller && (
                  <div className="absolute top-5 right-5 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-[#B9882E] text-[11px] font-bold uppercase tracking-wider rounded-full shadow-[0_6px_16px_rgba(0,0,0,0.08)] border border-[#F3E4C1]">
                      <Sparkles className="w-3 h-3 fill-[#F6C453] text-[#F6C453]" />
                      Bestseller
                    </span>
                  </div>
                )}

                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-3 py-1 bg-black/30 backdrop-blur-md text-white text-[11px] font-semibold rounded-full tracking-wide">
                      {selectedImage + 1} / {images.length}
                    </span>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={`${selectedVariant?._key ?? 'base'}-thumb-${idx}`}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-[88px] md:h-[88px] rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-[#FBFDFD] ${
                        idx === selectedImage
                          ? "border-[#4FBDBA] shadow-[0_0_0_3px_rgba(79,189,186,0.15)]"
                          : "border-[#ECEFEF] hover:border-[#4FBDBA]/50 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${displayColorName ?? ''} view ${idx + 1}`}
                        className="w-full h-full object-contain p-2"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ── Product Info ─────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:pt-2"
            >
              {/* Category row */}
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#DDF5F4] text-[#2F7F7C] text-[11px] font-semibold rounded-full uppercase tracking-wider">
                  <Leaf className="w-3 h-3" />
                  {displayProduct.category}
                  {displayProduct.subcategory ? ` · ${displayProduct.subcategory}` : ""}
                </span>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      alert("Product link copied!");
                    } catch {
                      // clipboard unavailable
                    }
                  }}
                  className="p-2.5 border border-[#ECEFEF] bg-white rounded-full hover:bg-[#DDF5F4] hover:border-[#4FBDBA]/40 transition-all duration-200 flex-shrink-0 shadow-sm"
                  aria-label="Copy product link"
                >
                  <Share2 className="w-4 h-4 text-[#6B6B6B]" />
                </button>
              </div>

              {/* Title */}
              <h1 className="font-heading text-[28px] sm:text-[34px] md:text-[38px] font-bold text-[#1F2424] leading-[1.15] tracking-tight mt-4 max-w-[26ch]">
                {displayProduct.name}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-3 flex-wrap mt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-[15px] h-[15px] ${
                        i < Math.floor(displayRating)
                          ? "fill-[#F6C453] text-[#F6C453]"
                          : "text-[#E7EEEE] fill-[#E7EEEE]"
                      }`}
                    />
                  ))}
                  <span className="font-bold text-sm text-[#2B2B2B] ml-1">
                    {displayRating}
                  </span>
                </div>
                <span className="text-sm text-[#8A8A8A]">
                  ({displayReviews} {displayReviews === 1 ? "Review" : "Reviews"})
                </span>
                <span className="w-1 h-1 rounded-full bg-[#DADFDF]" />
                <span
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
                  style={{ color: isOOS ? "#EF4444" : "#2F7F7C" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ background: isOOS ? "#EF4444" : "#4FBDBA" }}
                  />
                  {isOOS ? "Out of Stock" : "In Stock"}
                </span>
              </div>

              {isOOS && (
                <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl mt-5">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-red-600">Currently Unavailable</p>
                    <p className="text-xs text-red-400 mt-0.5">
                      This color is out of stock. Try another color or add to your wishlist.
                    </p>
                  </div>
                </div>
              )}

              {/* Price block */}
              <div className="mt-6 py-6 border-y border-[#EDF1F1]">
                <div className="flex items-end gap-3 flex-wrap">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`price-${displayPrice}`}
                      className="text-[36px] sm:text-[42px] font-heading font-bold text-[#1F2424] leading-none"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      ₹{displayPrice.toLocaleString()}
                    </motion.span>
                  </AnimatePresence>
                  {displayOriginalPrice && (
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`op-${displayOriginalPrice}`}
                        className="text-base sm:text-lg text-[#B5B5B5] line-through font-medium mb-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ₹{displayOriginalPrice.toLocaleString()}
                      </motion.span>
                    </AnimatePresence>
                  )}
                </div>
                {displayOriginalPrice && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-[#E2434E] to-[#C92E3C] text-white font-bold rounded-full text-[11px] uppercase tracking-wider shadow-[0_4px_12px_rgba(201,46,60,0.25)]">
                      Flat {discount}% Off
                    </span>
                    <span className="text-[13px] font-semibold text-[#2F7F7C]">
                      You save ₹{(displayOriginalPrice - displayPrice).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <AnimatePresence mode="wait">
                {displayDescription && (
                  <motion.p
                    key={`desc-${selectedVariant?._key ?? 'base'}`}
                    className="text-[#6B6B6B] leading-[1.8] text-[15px] mt-6 max-w-[58ch]"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {displayDescription}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* ── Color Selector ─────────────────────────────── */}
              <div className="mt-7">
                <label className="block text-sm font-semibold text-[#2B2B2B] mb-3">
                  Color:{" "}
                  <span className="font-normal text-[#8A8A8A]">
                    {displayColorName ?? "Default"}
                  </span>
                </label>
                <div className="flex gap-3 flex-wrap">
                  {sanityProduct.variants && sanityProduct.variants.length > 0 ? (
                    sanityProduct.variants.map((variant) => {
                      const isSelected = selectedVariant?._key === variant._key;
                      const variantOOS = variant.stock === 0;
                      return (
                        <button
                          key={variant._key}
                          onClick={() => !variantOOS && handleVariantChange(variant)}
                          disabled={variantOOS}
                          className={`relative w-11 h-11 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                            variantOOS
                              ? "opacity-40 cursor-not-allowed"
                              : isSelected
                              ? "border-[#4FBDBA] shadow-[0_0_0_3px_rgba(79,189,186,0.2)] scale-110"
                              : "border-[#ECEFEF] hover:border-[#4FBDBA]/50 hover:scale-105"
                          }`}
                          style={{ backgroundColor: variant.colorCode }}
                          title={`${variant.colorName}${variantOOS ? " (Out of Stock)" : ""}`}
                        >
                          {isSelected && !variantOOS && (
                            <Check
                              className={`w-4 h-4 ${
                                variant.colorCode === "#F8F2E8" ||
                                variant.colorCode === "#FFFFFF"
                                  ? "text-[#2B2B2B]"
                                  : "text-white"
                              }`}
                            />
                          )}
                          {variantOOS && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="w-full h-0.5 bg-white/70 rotate-45 block absolute" />
                            </span>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    displayProduct.colors.map((color, idx) => {
                      const c = color as { name: string; hex: string };
                      return (
                        <button
                          key={c.name ?? idx}
                          onClick={() => !isOOS && void 0}
                          className={`w-11 h-11 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                            isOOS
                              ? "opacity-40 cursor-not-allowed"
                              : idx === 0
                              ? "border-[#4FBDBA] shadow-[0_0_0_3px_rgba(79,189,186,0.2)] scale-110"
                              : "border-[#ECEFEF] hover:border-[#4FBDBA]/50 hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                          disabled={isOOS}
                        >
                          {idx === 0 && !isOOS && (
                            <Check
                              className={`w-4 h-4 ${
                                c.hex === "#F8F2E8" ? "text-[#2B2B2B]" : "text-white"
                              }`}
                            />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-7">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-[#2B2B2B]">
                    Size:{" "}
                    <span className="font-normal text-[#8A8A8A]">{selectedSize}</span>
                  </label>
                  <button className="text-[13px] text-[#4FBDBA] hover:text-[#2F7F7C] font-semibold flex items-center gap-1 transition-colors duration-200">
                    <Ruler className="w-3.5 h-3.5" />
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {displayProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => !isOOS && setSelectedSize(size)}
                      disabled={isOOS}
                      className={`px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all duration-200 ${
                        isOOS
                          ? "border-[#ECEFEF] bg-white text-[#C0C0C0] cursor-not-allowed opacity-50"
                          : selectedSize === size
                          ? "border-[#4FBDBA] bg-[#4FBDBA] text-white shadow-[0_8px_20px_rgba(79,189,186,0.28)]"
                          : "border-[#ECEFEF] bg-white text-[#2B2B2B] hover:border-[#4FBDBA]/60 hover:bg-[#DDF5F4]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <div
                  className={`flex items-center gap-1 bg-[#F6FBFB] border border-[#ECEFEF] rounded-full p-1.5 shadow-sm ${
                    isOOS ? "opacity-40 pointer-events-none" : ""
                  }`}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOOS}
                    className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center transition-colors duration-200 text-[#2B2B2B] disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-[#2B2B2B] text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      !isOOS &&
                      setQuantity((q) => Math.min(q + 1, displayStock || Infinity))
                    }
                    disabled={isOOS || quantity >= displayStock}
                    className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center transition-colors duration-200 text-[#2B2B2B] disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {isOOS ? (
                  <div className="flex-1 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 text-[15px] bg-[#F6FBFB] border-2 border-[#ECEFEF] text-[#9B9B9B] cursor-not-allowed select-none">
                    <AlertCircle className="w-5 h-5" />
                    Currently Unavailable
                  </div>
                ) : (
                  <motion.button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 text-[15px] ${
                      addedToCart
                        ? "bg-[#2F7F7C] text-white shadow-[0_14px_32px_rgba(47,127,124,0.32)]"
                        : "bg-[#4FBDBA] text-white shadow-[0_14px_32px_rgba(79,189,186,0.30)] hover:bg-[#2F7F7C] hover:shadow-[0_18px_42px_rgba(79,189,186,0.40)] hover:-translate-y-0.5"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AnimatePresence mode="wait">
                      {addedToCart ? (
                        <motion.span
                          key="added"
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                        >
                          <Check className="w-5 h-5" />
                          Added to Cart!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="add"
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                        >
                          <Package className="w-5 h-5" />
                          Add to Cart · ₹{(displayPrice * quantity).toLocaleString()}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}

                <motion.button
                  onClick={handleWishlistToggle}
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    isWishlisted
                      ? "bg-red-50 text-red-500 border-red-200 shadow-[0_4px_16px_rgba(239,68,68,0.15)]"
                      : "bg-white border-[#ECEFEF] text-[#6B6B6B] hover:border-[#4FBDBA]/50 hover:bg-[#DDF5F4] hover:text-[#4FBDBA] shadow-sm"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                >
                  <Heart className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} />
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7 pt-6 border-t border-[#EDF1F1]">
                {[
                  {
                    icon: Truck,
                    title: "Free Delivery",
                    desc: "On orders above Rs. 499",
                    color: "bg-[#DDF5F4] text-[#4FBDBA]",
                  },
                  {
                    icon: RefreshCw,
                    title: "Easy Returns",
                    desc: "3-day return policy",
                    color: "bg-[#FFF4D6] text-[#F6C453]",
                  },
                  {
                    icon: Shield,
                    title: "Secure Payment",
                    desc: "100% secure checkout",
                    color: "bg-[#DDF5F4] text-[#2F7F7C]",
                  },
                ].map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.title}
                      className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-[#ECEFEF] shadow-sm"
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${badge.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-[#2B2B2B] leading-tight">
                          {badge.title}
                        </p>
                        <p className="text-[11px] text-[#8A8A8A] mt-0.5">{badge.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <ProductTabs product={sanityProduct} />

      {/* You May Also Like */}
      {alsoLikeProducts.length > 0 && (
        <section className="py-16 bg-[#F6FBFB] border-t border-[#ECEFEF]">
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

      {/* Related Products */}
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
  );
}
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/products/ProductCard";
import ProductTabs from "@/components/products/Producttabs";
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
  // selectedVariant drives ALL display values on the detail page.
  // When the product has no variants, we fall back to product-level fields.
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // selectedImage is the index within selectedVariant.images (or the
  // flat fallback images array for products without variants).
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

          // Initialise variant state from the first variant (if any)
          const firstVariant = product.variants?.[0] ?? null;
          setSelectedVariant(firstVariant);
          setSelectedImage(0);

          // Initialise size from variant or product level
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
  // Reset image index to 0 whenever the user picks a different color.
  const handleVariantChange = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedImage(0);
    // Keep size in sync with the new variant's size if available
    if (variant.size) setSelectedSize(variant.size);
  }, []);

  // ── Derived: resolved display images ──────────────────────────
  // If we have a selected variant use its images; otherwise fall back
  // to mainImage + galleryImages at the product level.
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

  // Discount % — computed dynamically from whichever prices are active
  const discount = useMemo(
    () => computeDiscount(displayPrice, displayOriginalPrice),
    [displayPrice, displayOriginalPrice]
  );

  // Out-of-stock: variant-level stock === 0, or product-level toggle
  const isOOS = useMemo(
    () => sanityProduct?.outOfStock === true || displayStock === 0,
    [sanityProduct?.outOfStock, displayStock]
  );

  // ── Derived: legacy displayProduct (still needed for cart/wishlist) ──
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
      // Color dots — from variants if available, else legacy colors
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
        // Pass SKU if available (useful for order management)
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
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-[#4FBDBA]/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-40 left-0 w-80 h-80 bg-[#F6C453]/6 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Breadcrumb + Back Arrow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2 relative z-10">
        <div className="flex items-center gap-3">
          <Link
            href={`/category/${displayProduct.categorySlug}`}
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[#E7EEEE] shadow-sm hover:bg-[#DDF5F4] hover:border-[#4FBDBA]/40 hover:text-[#4FBDBA] text-[#6B6B6B] transition-all duration-200"
            aria-label="Go back"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <nav className="flex items-center gap-1.5 text-sm text-[#6B6B6B] overflow-hidden whitespace-nowrap min-w-0">
            <Link href="/" className="hover:text-[#4FBDBA] transition-colors duration-200 flex-shrink-0">
              Home
            </Link>
            <span className="text-[#E7EEEE] flex-shrink-0">/</span>
            <Link
              href={`/category/${displayProduct.categorySlug}`}
              className="hover:text-[#4FBDBA] transition-colors duration-200 flex-shrink-0"
            >
              {displayProduct.category}
            </Link>
            <span className="text-[#E7EEEE] flex-shrink-0">/</span>
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
              className="space-y-4"
            >
              {/* Main image container */}
              <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[560px] bg-white rounded-[2rem] overflow-hidden border border-[#E7EEEE] shadow-[0_10px_40px_rgba(79,189,186,0.1)]">

                {/* Main image — crossfades when selectedVariant or selectedImage changes */}
                {images.length > 0 && (
                  <AnimatePresence mode="wait">
                    <motion.img
                      // Key includes variant _key so changing color also triggers crossfade
                      key={`${selectedVariant?._key ?? 'base'}-${selectedImage}`}
                      src={images[selectedImage]}
                      alt={`${displayProduct.name}${displayColorName ? ` – ${displayColorName}` : ''}`}
                      className="absolute inset-0 w-full h-full object-contain p-4"
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.35 }}
                    />
                  </AnimatePresence>
                )}

                {/* Left / Right arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/90 backdrop-blur-sm border border-[#E7EEEE] shadow-[0_4px_16px_rgba(0,0,0,0.10)] text-[#2B2B2B] transition-all duration-200 hover:bg-white hover:border-[#4FBDBA]/50 hover:shadow-[0_6px_24px_rgba(79,189,186,0.20)] hover:scale-105 active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/90 backdrop-blur-sm border border-[#E7EEEE] shadow-[0_4px_16px_rgba(0,0,0,0.10)] text-[#2B2B2B] transition-all duration-200 hover:bg-white hover:border-[#4FBDBA]/50 hover:shadow-[0_6px_24px_rgba(79,189,186,0.20)] hover:scale-105 active:scale-95"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </>
                )}

                {/* OOS / Discount badge */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {isOOS ? (
                    <span className="px-4 py-1.5 bg-red-500 text-white text-sm font-bold rounded-2xl shadow-[0_4px_12px_rgba(239,68,68,0.35)]">
                      Out of Stock
                    </span>
                  ) : (
                    discount > 0 && (
                      <span className="px-4 py-1.5 bg-[#F6C453] text-[#2B2B2B] text-sm font-bold rounded-2xl shadow-[0_4px_12px_rgba(246,196,83,0.35)]">
                        {discount}% OFF
                      </span>
                    )
                  )}
                </div>

                {/* Bestseller badge */}
                {displayProduct.isBestseller && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#4FBDBA] text-xs font-bold rounded-2xl shadow-sm border border-[#E7EEEE]">
                      <Sparkles className="w-3 h-3" />
                      Bestseller
                    </span>
                  </div>
                )}

                {/* Image counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-3 py-1 bg-black/25 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      {selectedImage + 1} / {images.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail strip — rerenders when variant changes */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={`${selectedVariant?._key ?? 'base'}-thumb-${idx}`}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-white ${
                        idx === selectedImage
                          ? "border-[#4FBDBA] shadow-[0_0_0_3px_rgba(79,189,186,0.15)]"
                          : "border-[#E7EEEE] hover:border-[#4FBDBA]/50 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${displayColorName ?? ''} view ${idx + 1}`}
                        className="w-full h-full object-contain p-1"
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
              className="space-y-6 lg:pt-2"
            >
              {/* Category pill + Share */}
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DDF5F4] text-[#2F7F7C] text-xs font-semibold rounded-full uppercase tracking-wider">
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

              {/* OOS alert */}
              {isOOS && (
                <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-red-600">Currently Unavailable</p>
                    <p className="text-xs text-red-400 mt-0.5">
                      This color is out of stock. Try another color or add to your wishlist.
                    </p>
                  </div>
                </div>
              )}

              {/* Rating — updates from selected variant */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 bg-[#FFF4D6] px-3 py-1.5 rounded-2xl">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(displayRating)
                            ? "fill-[#F6C453] text-[#F6C453]"
                            : "text-[#E7EEEE] fill-[#E7EEEE]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-sm text-[#2B2B2B]">
                    {displayRating}
                  </span>
                </div>
                <span className="text-sm text-[#6B6B6B]">
                  {displayReviews} reviews
                </span>
                <span
                  className="inline-flex items-center gap-1 text-sm font-semibold"
                  style={{ color: isOOS ? "#EF4444" : "#2F7F7C" }}
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ background: isOOS ? "#EF4444" : "#4FBDBA" }}
                  />
                  {isOOS ? "Out of Stock" : `In Stock · ${displayStock} left`}
                </span>
              </div>

              {/* Price — updates from selected variant */}
              <div className="flex items-baseline gap-4 py-5 border-y border-[#E7EEEE] flex-wrap">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`price-${displayPrice}`}
                    className="text-4xl font-heading font-bold text-[#2B2B2B]"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    Rs. {displayPrice.toLocaleString()}
                  </motion.span>
                </AnimatePresence>
                {displayOriginalPrice && (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`op-${displayOriginalPrice}`}
                        className="text-xl text-[#6B6B6B] line-through"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        Rs. {displayOriginalPrice.toLocaleString()}
                      </motion.span>
                    </AnimatePresence>
                    <span className="px-3 py-1 bg-[#FFF4D6] text-[#2B2B2B] font-semibold rounded-2xl text-sm border border-[#F6C453]/30">
                      Save Rs.{" "}
                      {(displayOriginalPrice - displayPrice).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Short description — updates from selected variant */}
              <AnimatePresence mode="wait">
                {displayDescription && (
                  <motion.p
                    key={`desc-${selectedVariant?._key ?? 'base'}`}
                    className="text-[#6B6B6B] leading-relaxed text-[15px]"
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
              {/* When variants exist, clicking a color calls handleVariantChange
                  which updates selectedVariant → all display values cascade. */}
              <div>
                <label className="block text-sm font-semibold text-[#2B2B2B] mb-3">
                  Color:{" "}
                  <span className="font-normal text-[#6B6B6B]">
                    {displayColorName ?? "Default"}
                  </span>
                </label>
                <div className="flex gap-3 flex-wrap">
                  {sanityProduct.variants && sanityProduct.variants.length > 0 ? (
                    // Variant-based color buttons
                    sanityProduct.variants.map((variant) => {
                      const isSelected = selectedVariant?._key === variant._key;
                      const variantOOS = variant.stock === 0;
                      return (
                        <button
                          key={variant._key}
                          onClick={() => !variantOOS && handleVariantChange(variant)}
                          disabled={variantOOS}
                          className={`relative w-11 h-11 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center ${
                            variantOOS
                              ? "opacity-40 cursor-not-allowed"
                              : isSelected
                              ? "border-[#4FBDBA] shadow-[0_0_0_3px_rgba(79,189,186,0.2)] scale-110"
                              : "border-[#E7EEEE] hover:border-[#4FBDBA]/50 hover:scale-105"
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
                          {/* OOS strikethrough indicator */}
                          {variantOOS && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="w-full h-0.5 bg-white/70 rotate-45 block absolute" />
                            </span>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    // Legacy color buttons (no variant data)
                    displayProduct.colors.map((color, idx) => {
                      const c = color as { name: string; hex: string };
                      const isSelected = selectedVariant === null;
                      return (
                        <button
                          key={c.name ?? idx}
                          onClick={() => !isOOS && void 0}
                          className={`w-11 h-11 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center ${
                            isOOS
                              ? "opacity-40 cursor-not-allowed"
                              : idx === 0
                              ? "border-[#4FBDBA] shadow-[0_0_0_3px_rgba(79,189,186,0.2)] scale-110"
                              : "border-[#E7EEEE] hover:border-[#4FBDBA]/50 hover:scale-105"
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
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-[#2B2B2B]">
                    Size:{" "}
                    <span className="font-normal text-[#6B6B6B]">{selectedSize}</span>
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
                      onClick={() => !isOOS && setSelectedSize(size)}
                      disabled={isOOS}
                      className={`px-5 py-2.5 rounded-2xl border-2 text-sm font-semibold transition-all duration-200 ${
                        isOOS
                          ? "border-[#E7EEEE] bg-white text-[#C0C0C0] cursor-not-allowed opacity-50"
                          : selectedSize === size
                          ? "border-[#4FBDBA] bg-[#4FBDBA] text-white shadow-[0_6px_20px_rgba(79,189,186,0.28)]"
                          : "border-[#E7EEEE] bg-white text-[#2B2B2B] hover:border-[#4FBDBA]/60 hover:bg-[#DDF5F4]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {/* Quantity stepper */}
                <div
                  className={`flex items-center gap-1 bg-[#F6FBFB] border border-[#E7EEEE] rounded-2xl p-1.5 shadow-sm ${
                    isOOS ? "opacity-40 pointer-events-none" : ""
                  }`}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOOS}
                    className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center transition-colors duration-200 text-[#2B2B2B] disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-[#2B2B2B] text-lg">
                    {quantity}
                  </span>
                  <button
                    // Cap quantity at available stock
                    onClick={() =>
                      !isOOS &&
                      setQuantity((q) => Math.min(q + 1, displayStock || Infinity))
                    }
                    disabled={isOOS || quantity >= displayStock}
                    className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center transition-colors duration-200 text-[#2B2B2B] disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                {isOOS ? (
                  <div className="flex-1 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-[15px] bg-[#F6FBFB] border-2 border-[#E7EEEE] text-[#9B9B9B] cursor-not-allowed select-none">
                    <AlertCircle className="w-5 h-5" />
                    Currently Unavailable
                  </div>
                ) : (
                  <motion.button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-[15px] ${
                      addedToCart
                        ? "bg-[#2F7F7C] text-white shadow-[0_12px_30px_rgba(47,127,124,0.3)]"
                        : "bg-[#4FBDBA] text-white shadow-[0_12px_30px_rgba(79,189,186,0.28)] hover:bg-[#2F7F7C] hover:shadow-[0_16px_40px_rgba(79,189,186,0.38)] hover:-translate-y-0.5"
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
                          Add to Cart · Rs.{" "}
                          {(displayPrice * quantity).toLocaleString()}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}

                {/* Wishlist */}
                <motion.button
                  onClick={handleWishlistToggle}
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    isWishlisted
                      ? "bg-red-50 text-red-500 border-red-200 shadow-[0_4px_16px_rgba(239,68,68,0.15)]"
                      : "bg-white border-[#E7EEEE] text-[#6B6B6B] hover:border-[#4FBDBA]/50 hover:bg-[#DDF5F4] hover:text-[#4FBDBA] shadow-sm"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                >
                  <Heart className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} />
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-[#E7EEEE]">
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
                      className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E7EEEE] shadow-sm"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl ${badge.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#2B2B2B] leading-tight">
                          {badge.title}
                        </p>
                        <p className="text-xs text-[#6B6B6B] mt-0.5">{badge.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Tabs (passes full sanityProduct — tabs use their own fields) */}
      <ProductTabs product={sanityProduct} />

      {/* You May Also Like */}
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
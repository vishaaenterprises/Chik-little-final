// lib/sanity/queries.ts
import { groq } from 'next-sanity'

// ── Shared fragment: variant fields ───────────────────────────
// Used in both card and detail queries so variant images/prices
// are always available for color-dot rendering and hover swaps.

const VARIANT_FIELDS = groq`
  variants[]{
    _key,
    colorName,
    colorCode,
    price,
    originalPrice,
    stock,
    sku,
    size,
    shortDescription,
    rating,
    reviews,
    images[]{
      asset,
      hotspot,
      crop
    }
  }
`

// ── Shared fragment: lightweight card fields ──────────────────
// Includes variant data so ProductCard can render color dots and
// hover-image swaps without an extra network request.

const PRODUCT_CARD_FIELDS = groq`
  _id,
  productName,
  "slug": slug.current,
  shortDescription,
  price,
  originalPrice,
  badge,
  featuredProduct,
  newArrival,
  outOfStock,
  mainImage,
  colors,
  sizes,
  rating,
  reviewsCount,
  productType,
  subcategory,
  category->{
    _id,
    title,
    "slug": slug.current
  },
  ${VARIANT_FIELDS}
`

// ── Shared fragment: full detail fields ───────────────────────

const PRODUCT_DETAIL_FIELDS = groq`
  _id,
  productName,
  "slug": slug.current,
  shortDescription,
  fullDescription,
  price,
  originalPrice,
  discountPercentage,
  badge,
  featuredProduct,
  newArrival,
  outOfStock,
  mainImage,
  galleryImages,
  colors,
  sizes,
  stock,
  sku,
  rating,
  reviewsCount,
  productType,
  subcategory,
  tags,
  storyTitle,
  storyDescription,
  dimensions,
  features,
  materials[]{
    _key,
    title,
    description
  },
  careInstructions,
  category->{
    _id,
    title,
    "slug": slug.current
  },
  ${VARIANT_FIELDS},
  alsoLike[]->{
    ${PRODUCT_CARD_FIELDS}
  }
`

// ===== CATEGORY QUERIES =======================================

export const categoriesQuery = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    image,
    description,
    color,
    accentColor,
    bgColor,
    subcategories,
    order
  }
`

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    image,
    description,
    color,
    accentColor,
    bgColor,
    subcategories
  }
`

// ===== PRODUCT LIST QUERIES ===================================

export const productsQuery = groq`
  *[_type == "product"] | order(_createdAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`

export const productsByCategoryQuery = groq`
  *[_type == "product" && category->slug.current == $categorySlug] | order(_createdAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`

export const productsByCategoryAndSubcategoryQuery = groq`
  *[
    _type == "product"
    && category->slug.current == $categorySlug
    && subcategory == $subcategory
  ] | order(_createdAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`

export const featuredProductsQuery = groq`
  *[_type == "product" && featuredProduct == true] | order(_createdAt desc)[0...8] {
    ${PRODUCT_CARD_FIELDS}
  }
`

export const newArrivalsQuery = groq`
  *[_type == "product" && newArrival == true] | order(_createdAt desc)[0...8] {
    ${PRODUCT_CARD_FIELDS}
  }
`

// ===== PRODUCT DETAIL =========================================

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    ${PRODUCT_DETAIL_FIELDS}
  }
`

export const productByIdQuery = groq`
  *[_type == "product" && _id == $id][0] {
    ${PRODUCT_DETAIL_FIELDS}
  }
`

// ===== RELATED PRODUCTS =======================================

export const relatedProductsQuery = groq`
  *[
    _type == "product"
    && category->slug.current == $categorySlug
    && slug.current != $currentSlug
  ] | order(_createdAt desc) [0...4] {
    ${PRODUCT_CARD_FIELDS}
  }
`

// ===== BANNER QUERIES =========================================

export const heroBannerQuery = groq`
  *[_type == "banner" && bannerType == "hero" && isActive == true] | order(order asc)[0] {
    _id,
    title,
    subtitle,
    description,
    buttonText,
    buttonLink,
    image
  }
`

export const bannersQuery = groq`
  *[_type == "banner" && isActive == true] | order(order asc) {
    _id,
    title,
    subtitle,
    description,
    buttonText,
    buttonLink,
    image,
    bannerType
  }
`

// ===== BRAND QUERIES ==========================================

export const brandsQuery = groq`
  *[_type == "brand"] | order(order asc) {
    _id,
    name,
    logo,
    description,
    website
  }
`

// ===== TESTIMONIAL QUERIES ====================================

export const testimonialsQuery = groq`
  *[_type == "testimonial" && isActive == true] | order(order asc) {
    _id,
    customerName,
    review,
    rating,
    customerImage,
    location,
    productPurchased->{
      productName,
      "slug": slug.current
    }
  }
`

// ===== HOMEPAGE COMBINED QUERY ================================

export const homepageDataQuery = groq`{
  "heroBanner": *[_type == "banner" && bannerType == "hero" && isActive == true] | order(order asc)[0] {
    _id,
    title,
    subtitle,
    description,
    buttonText,
    buttonLink,
    image
  },
  "categories": *[_type == "category"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    image,
    description,
    color,
    accentColor,
    bgColor,
    subcategories
  },
  "featuredProducts": *[_type == "product" && featuredProduct == true] | order(_createdAt desc)[0...8] {
    ${PRODUCT_CARD_FIELDS}
  },
  "newArrivals": *[_type == "product" && newArrival == true] | order(_createdAt desc)[0...8] {
    ${PRODUCT_CARD_FIELDS}
  },
  "testimonials": *[_type == "testimonial" && isActive == true] | order(order asc)[0...6] {
    _id,
    customerName,
    review,
    rating,
    customerImage,
    location
  },
  "brands": *[_type == "brand"] | order(order asc) {
    _id,
    name,
    logo,
    description,
    website
  },
  "allProducts": *[_type == "product"] | order(_createdAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
}`
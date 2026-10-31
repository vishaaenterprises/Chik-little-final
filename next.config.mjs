/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // Baseline security headers (no CSP yet: Meta Pixel, gtag, PhonePe and
  // Vercel Analytics need a carefully tested allow-list first).
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // ── Google Search Console 404 cleanup (Oct 2026): old/removed product URLs
      // mapped to the closest live product or category. Must stay above the
      // generic /products/:slug rule so they redirect in one hop.
      { source: '/product/kids-travel-duffle-bag-cartoon-print-watermelon', destination: '/product/kids-mini-duffel-bag-blue-fish-print', permanent: true },
      { source: '/product/little-chiku-quilted-printed-tote-bag', destination: '/category/bags', permanent: true },
      { source: '/product/kids-apron-cooking-baking-painting-kitchen-art', destination: '/product/kids-cooking-baking-apron-school-activities', permanent: true },
      { source: '/products/little-chiku-quilted-printed-tote-bag-2', destination: '/category/bags', permanent: true },
      { source: '/products/floral-mini-backpack-kids-quilted-cotton-school-travel-bag', destination: '/product/kids-floral-backpack-for-school-play', permanent: true },
      { source: '/products/vintage-floral-quilted-tote-bag-multicolor-4', destination: '/product/vintage-floral-quilted-tote-bag-multicolor', permanent: true },
      { source: '/products/kids-rocket-print-waffle-bathrobe-set-yellow', destination: '/product/kids-yellow-rocket-print-waffle-bathrobe-set-with-belt-or-soft-cotton-bathrobe-for-kids', permanent: true },
      { source: '/products/baby-dohar-lightweight-cozy-cotton-blanket-4', destination: '/product/baby-dohar-cotton-blanket-crib', permanent: true },
      { source: '/products/honeybee-kids-towel-blue-rocket', destination: '/product/honeybee-kids-towel-multi-animal', permanent: true },
      { source: '/products/kids-apron-cooking-baking-painting-adjustable-child-apron-2', destination: '/product/kids-cooking-baking-apron-school-activities', permanent: true },
      { source: '/products/kids-apron-cooking-baking-painting-adjustable-child-apron-3', destination: '/product/kids-cooking-baking-apron-school-activities', permanent: true },
      { source: '/products/kids-cotton-bathrobe-design-2', destination: '/category/bath-linen', permanent: true },
      { source: '/products/kids-sling-bag-boys-girls-quilted-crossbody-backpack-3', destination: '/product/kids-floral-sling-bag-crossbody-backpack-travel', permanent: true },
      { source: '/products/kids-play-mat-forest-animals-green-3', destination: '/product/kids-play-mat-forest-animals-green', permanent: true },
      { source: '/products/little-chicken-print-kids-bath-towel', destination: '/category/bath-linen', permanent: true },
      { source: '/products/reversible-baby-quilt-soft-breathable-red-blue-1', destination: '/product/reversible-baby-quilt-red-blue-daily-use', permanent: true },
      { source: '/products/reversible-baby-quilt-soft-breathable-red-blue-5', destination: '/product/reversible-baby-quilt-red-blue-daily-use', permanent: true },
      { source: '/products/kids-travel-duffle-bag-design-4', destination: '/product/kids-mini-duffel-bag-blue-fish-print', permanent: true },
      {
        source: '/products/:slug',
        destination: '/product/:slug',
        permanent: true,
      },
      {
        source: '/product/kids-dinosaur-print-backpack',
        destination: '/product/kids-owl-bird-print-backpack',
        permanent: true,
      },
      {
        source: '/product/kids-dinosaur-print-backpack-2',
        destination: '/product/kids-owl-bird-print-backpack-gift',
        permanent: true,
      },
      // ── Slug cleanup: replaced bare duplicate-number suffixes (-2, -3...)
      // with descriptive slugs. Redirects preserve any existing backlinks
      // and Google-indexed URLs for these products.
      {
        source: '/product/3-in-1-baby-carry-nest-for-newborn-or-mulmul-cotton',
        destination: '/product/3-in-1-baby-carry-nest-glass-print',
        permanent: true,
      },
      {
        source: '/product/3-in-1-baby-carry-nest-for-newborn-or-mulmul-cotton-2',
        destination: '/product/3-in-1-baby-carry-nest-giraffe-print',
        permanent: true,
      },
      {
        source: '/product/3-in-1-baby-carry-nest-for-newborn-or-mulmul-cotton-3',
        destination: '/product/3-in-1-baby-carry-nest-cupcake-print',
        permanent: true,
      },
      {
        source: '/product/3-in-1-baby-carry-nest-for-newborn-or-mulmul-cotton-4',
        destination: '/product/3-in-1-baby-carry-nest-bunny-print',
        permanent: true,
      },
      {
        source: '/product/baby-dohar-lightweight-cozy-cotton-blanket-1',
        destination: '/product/baby-dohar-cotton-blanket-crib',
        permanent: true,
      },
      {
        source: '/product/baby-dohar-lightweight-cozy-cotton-blanket-4',
        destination: '/product/baby-dohar-travel-blanket',
        permanent: true,
      },
      {
        source: '/product/decorative-floral-photo-frame-handmade-diary-gift-set-peach-2',
        destination: '/category/return-gifts',
        permanent: true,
      },
      {
        source: '/product/decorative-floral-photo-frame-handmade-diary-gift-set-peach-3',
        destination: '/category/return-gifts',
        permanent: true,
      },
      {
        source: '/product/decorative-floral-photo-frame-handmade-diary-gift-set-peach-4',
        destination: '/category/return-gifts',
        permanent: true,
      },
      {
        source: '/product/decorative-floral-photo-frame-handmade-diary-gift-set-peach-5',
        destination: '/category/return-gifts',
        permanent: true,
      },
      {
        source: '/product/hand-block-printed-kids-comforter-blue-elephant-2',
        destination: '/product/hand-block-printed-kids-comforter-blue-elephant-gift',
        permanent: true,
      },
      {
        source: '/product/hand-block-printed-kids-comforter-blue-elephant-3',
        destination: '/product/hand-block-printed-kids-comforter-blue-elephant-travel',
        permanent: true,
      },
      {
        source: '/product/handcrafted-quilted-floral-tote-bag-12x12-inch-2',
        destination: '/product/handcrafted-quilted-floral-tote-bag-12x12-inch-gift',
        permanent: true,
      },
      {
        source: '/product/kids-apron-cooking-baking-painting-adjustable-child-apron-1',
        destination: '/product/kids-cooking-baking-apron-school-activities',
        permanent: true,
      },
      {
        source: '/product/kids-apron-cooking-baking-painting-adjustable-child-apron-2',
        destination: '/product/kids-cooking-baking-apron-school-activities',
        permanent: true,
      },
      {
        source: '/product/kids-apron-cooking-baking-painting-adjustable-child-apron-3',
        destination: '/product/kids-cooking-baking-apron-school-activities',
        permanent: true,
      },
      {
        source: '/product/kids-apron-cooking-baking-painting-adjustable-child-apron-4',
        destination: '/product/kids-cooking-baking-apron-school-activities',
        permanent: true,
      },
      {
        source: '/product/kids-play-mat-forest-animals-green-2',
        destination: '/product/kids-play-mat-forest-animals-green-nursery',
        permanent: true,
      },
      {
        source: '/product/kids-play-mat-forest-animals-green-3',
        destination: '/product/kids-play-mat-forest-animals-green-playroom',
        permanent: true,
      },
      {
        source: '/product/kids-play-mat-forest-animals-green-4',
        destination: '/product/kids-play-mat-forest-animals-green-gift',
        permanent: true,
      },
      {
        source: '/product/kids-sling-bag-boys-girls-quilted-crossbody-backpack-1',
        destination: '/product/kids-floral-sling-bag-crossbody-backpack-travel',
        permanent: true,
      },
      {
        source: '/product/kids-sling-bag-boys-girls-quilted-crossbody-backpack-2',
        destination: '/product/kids-floral-sling-bag-crossbody-backpack-travel',
        permanent: true,
      },
      {
        source: '/product/kids-sling-bag-boys-girls-quilted-crossbody-backpack-3',
        destination: '/product/kids-floral-sling-bag-crossbody-backpack-travel',
        permanent: true,
      },
      {
        source: '/product/kids-travel-duffle-bag-design-4',
        destination: '/product/kids-mini-duffel-bag-blue-fish-print',
        permanent: true,
      },
      {
        source: '/product/kids-travel-duffle-bag-design-5',
        destination: '/product/kids-mini-duffel-bag-blue-fish-print',
        permanent: true,
      },
      {
        source: '/product/kids-travel-duffle-bag-design-6',
        destination: '/product/kids-mini-duffel-bag-blue-fish-print',
        permanent: true,
      },
      {
        source: '/product/little-chiku-quilted-printed-tote-bag-2',
        destination: '/category/bags',
        permanent: true,
      },
      {
        source: '/product/premium-waffle-cotton-face-towel-set-of-3',
        destination: '/product/premium-waffle-cotton-face-towel-set-spa-edition',
        permanent: true,
      },
      {
        source: '/product/premium-waffle-cotton-face-towel-set-of-4',
        destination: '/product/premium-waffle-cotton-face-towel-set-travel-edition',
        permanent: true,
      },
      {
        source: '/product/premium-waffle-cotton-face-towel-set-of-5',
        destination: '/product/premium-waffle-cotton-face-towel-set-guest-bathroom-edition',
        permanent: true,
      },
      {
        source: '/product/quilted-cotton-multipurpose-tote-bag-15x15-handblock-print-2',
        destination: '/product/quilted-cotton-multipurpose-tote-bag-15x15-weekend-travel',
        permanent: true,
      },
      {
        source: '/product/reversible-baby-quilt-soft-breathable-red-blue-1',
        destination: '/product/reversible-baby-quilt-red-blue-daily-use',
        permanent: true,
      },
      {
        source: '/product/reversible-baby-quilt-soft-breathable-red-blue-3',
        destination: '/product/reversible-baby-quilt-red-blue-crib-stroller',
        permanent: true,
      },
      {
        source: '/product/reversible-baby-quilt-soft-breathable-red-blue-4',
        destination: '/product/reversible-baby-quilt-red-blue-travel-naps',
        permanent: true,
      },
      {
        source: '/product/reversible-baby-quilt-soft-breathable-red-blue-5',
        destination: '/product/reversible-baby-quilt-red-blue-gift-edition',
        permanent: true,
      },
      {
        source: '/product/soft-cotton-kids-backpack-beige-pink-1',
        destination: '/product/soft-cotton-kids-backpack-beige-pink-gift',
        permanent: true,
      },
      {
        source: '/product/soft-cotton-kids-backpack-beige-pink-2',
        destination: '/product/soft-cotton-kids-backpack-beige-pink-gift',
        permanent: true,
      },
      {
        source: '/product/soft-cotton-kids-backpack-beige-pink-3',
        destination: '/product/soft-cotton-kids-backpack-beige-pink-gift',
        permanent: true,
      },
      {
        source: '/product/stylish-floral-print-shoulder-bag-with-front-1',
        destination: '/product/stylish-maroon-floral-shoulder-bag-gift',
        permanent: true,
      },
      {
        source: '/product/stylish-floral-print-shoulder-bag-with-front-2',
        destination: '/product/stylish-maroon-floral-shoulder-bag-gift',
        permanent: true,
      },
      {
        source: '/product/vintage-floral-quilted-tote-bag-multicolor-2',
        destination: '/product/vintage-floral-quilted-tote-bag-classic-edition',
        permanent: true,
      },
      {
        source: '/product/vintage-floral-quilted-tote-bag-multicolor-3',
        destination: '/product/vintage-floral-quilted-tote-bag-office-edition',
        permanent: true,
      },
      {
        source: '/product/vintage-floral-quilted-tote-bag-multicolor-4',
        destination: '/product/vintage-floral-quilted-tote-bag-travel-edition',
        permanent: true,
      },
      {
        source: '/product/vintage-floral-quilted-tote-bag-multicolor-5',
        destination: '/product/vintage-floral-quilted-tote-bag-gift-edition',
        permanent: true,
      },
      {
        source: '/product/vintage-floral-quilted-tote-bag-multicolor-6',
        destination: '/product/vintage-floral-quilted-tote-bag-boho-edition',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
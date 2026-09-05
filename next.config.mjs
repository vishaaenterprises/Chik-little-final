/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
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
        destination: '/product/decorative-photo-frame-diary-gift-set-ivory-floral',
        permanent: true,
      },
      {
        source: '/product/decorative-floral-photo-frame-handmade-diary-gift-set-peach-3',
        destination: '/product/decorative-photo-frame-diary-gift-set-multi-stripe',
        permanent: true,
      },
      {
        source: '/product/decorative-floral-photo-frame-handmade-diary-gift-set-peach-4',
        destination: '/product/decorative-photo-frame-diary-gift-set-pink-floral',
        permanent: true,
      },
      {
        source: '/product/decorative-floral-photo-frame-handmade-diary-gift-set-peach-5',
        destination: '/product/decorative-photo-frame-diary-gift-set-white-blue-stripe',
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
        destination: '/product/kids-apron-cooking-baking-painting-kitchen-art',
        permanent: true,
      },
      {
        source: '/product/kids-apron-cooking-baking-painting-adjustable-child-apron-2',
        destination: '/product/kids-cooking-baking-apron-school-activities',
        permanent: true,
      },
      {
        source: '/product/kids-apron-cooking-baking-painting-adjustable-child-apron-3',
        destination: '/product/kids-apron-cooking-baking-painting-craft-time',
        permanent: true,
      },
      {
        source: '/product/kids-apron-cooking-baking-painting-adjustable-child-apron-4',
        destination: '/product/kids-chef-painting-apron-gift-edition',
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
        destination: '/product/kids-floral-sling-bag-crossbody-backpack',
        permanent: true,
      },
      {
        source: '/product/kids-sling-bag-boys-girls-quilted-crossbody-backpack-2',
        destination: '/product/kids-floral-sling-bag-crossbody-backpack-school',
        permanent: true,
      },
      {
        source: '/product/kids-sling-bag-boys-girls-quilted-crossbody-backpack-3',
        destination: '/product/kids-floral-sling-bag-crossbody-backpack-travel',
        permanent: true,
      },
      {
        source: '/product/kids-travel-duffle-bag-design-4',
        destination: '/product/kids-travel-duffle-bag-teddy-sheep-print',
        permanent: true,
      },
      {
        source: '/product/kids-travel-duffle-bag-design-5',
        destination: '/product/kids-travel-duffle-bag-cartoon-print-weekend',
        permanent: true,
      },
      {
        source: '/product/kids-travel-duffle-bag-design-6',
        destination: '/product/kids-travel-duffle-bag-cartoon-print-watermelon',
        permanent: true,
      },
      {
        source: '/product/little-chiku-quilted-printed-tote-bag-2',
        destination: '/product/little-chiku-quilted-printed-tote-bag-school',
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
        destination: '/product/soft-cotton-kids-backpack-beige-pink',
        permanent: true,
      },
      {
        source: '/product/soft-cotton-kids-backpack-beige-pink-2',
        destination: '/product/soft-cotton-kids-backpack-beige-pink-gift',
        permanent: true,
      },
      {
        source: '/product/soft-cotton-kids-backpack-beige-pink-3',
        destination: '/product/soft-cotton-kids-backpack-beige-pink-everyday',
        permanent: true,
      },
      {
        source: '/product/stylish-floral-print-shoulder-bag-with-front-1',
        destination: '/product/stylish-maroon-floral-shoulder-bag-weekend',
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
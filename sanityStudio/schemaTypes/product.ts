import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',

  fields: [
    // ── Core Info ──────────────────────────────────────────────
    defineField({
      name: 'productName',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'productName',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      description: 'Shown below the product title on the product page.',
      type: 'text',
      rows: 2,
    }),

    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),

    // ── Category ───────────────────────────────────────────────
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'productType',
      title: 'Product Type / Subcategory',
      type: 'string',
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // ── Pricing ────────────────────────────────────────────────
    defineField({
      name: 'price',
      title: 'Price (Rs.)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),

    defineField({
      name: 'originalPrice',
      title: 'Original Price (Rs.)',
      description: 'Leave empty if no discount.',
      type: 'number',
    }),

    defineField({
      name: 'discountPercentage',
      title: 'Discount Percentage',
      description: 'Auto-calculated, or override manually.',
      type: 'number',
    }),

    // ── Flags ──────────────────────────────────────────────────
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Bestseller', value: 'bestseller' },
          { title: 'Sale', value: 'sale' },
          { title: 'Limited Edition', value: 'limited' },
        ],
      },
    }),

    defineField({
      name: 'featuredProduct',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'newArrival',
      title: 'New Arrival',
      type: 'boolean',
      initialValue: false,
    }),

    // ── Images ─────────────────────────────────────────────────
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    // ── Variants ───────────────────────────────────────────────
    defineField({
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Color Name', type: 'string' },
            { name: 'hex', title: 'Hex Code', type: 'string' },
          ],
          preview: {
            select: { title: 'name', subtitle: 'hex' },
          },
        },
      ],
    }),

    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    // ── Inventory ──────────────────────────────────────────────
    defineField({
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      initialValue: 100,
    }),

    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
    }),

    // ── Reviews ────────────────────────────────────────────────
    defineField({
      name: 'rating',
      title: 'Rating (0–5)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
      initialValue: 4.5,
    }),

    defineField({
      name: 'reviewsCount',
      title: 'Reviews Count',
      type: 'number',
      initialValue: 0,
    }),

    // ══════════════════════════════════════════════════════════
    // ── TAB 1 : Details & Story ────────────────────────────────
    // ══════════════════════════════════════════════════════════

    defineField({
      name: 'storyTitle',
      title: 'Story Title',
      description: 'Heading for the "Our Story" section (Tab 1, left column).',
      type: 'string',
      initialValue: 'Our Story',
    }),

    defineField({
      name: 'storyDescription',
      title: 'Story Description',
      description: 'Brand narrative shown under the story title.',
      type: 'text',
      rows: 5,
    }),

    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      description: 'e.g. "90cm × 90cm · Newborn to 5 years"',
      type: 'string',
    }),

    defineField({
      name: 'features',
      title: 'Key Features',
      description: 'Bullet points shown in the right column of Tab 1.',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // ══════════════════════════════════════════════════════════
    // ── TAB 2 : Materials ─────────────────────────────────────
    // ══════════════════════════════════════════════════════════

    defineField({
      name: 'materials',
      title: 'Materials',
      description: 'List of materials with title + description.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'materialItem',
          title: 'Material',
          fields: [
            {
              name: 'title',
              title: 'Material Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Material Description',
              type: 'string',
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
    }),

    // ══════════════════════════════════════════════════════════
    // ── TAB 3 : Care Instructions ─────────────────────────────
    // ══════════════════════════════════════════════════════════

    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      description: 'One instruction per item.',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // ══════════════════════════════════════════════════════════
    // ── CURATED SECTION : You May Also Like ───────────────────
    // Admin manually picks products to show in this section.
    // Shown ABOVE the auto related products section.
    // ══════════════════════════════════════════════════════════

    defineField({
      name: 'alsoLike',
      title: 'You May Also Like',
      description:
        'Manually pick up to 8 products to show in the "You May Also Like" section on this product page. These are hand-curated by you.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
          options: {
            // Prevent selecting the product itself
            filter: ({ document }: { document: { _id?: string } }) => ({
              filter: '_id != $self',
              params: { self: document._id },
            }),
          },
        },
      ],
      validation: (Rule) => Rule.max(8).unique(),
    }),

    // Legacy field kept for backward compat
    defineField({
      name: 'brandStory',
      title: 'Brand Story (Legacy)',
      description: 'Deprecated — use Story Description instead.',
      type: 'text',
      rows: 4,
      hidden: true,
    }),
  ],

  preview: {
    select: {
      title: 'productName',
      media: 'mainImage',
      price: 'price',
      category: 'category.title',
    },
    prepare({ title, media, price, category }) {
      return {
        title,
        subtitle: `${category ? category + ' · ' : ''}₹${price}`,
        media,
      }
    },
  },
})
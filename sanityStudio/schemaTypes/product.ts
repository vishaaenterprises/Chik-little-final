// sanity/schemas/product.ts
import { defineField, defineType } from 'sanity'
import { SubcategoryInput } from './SubcategoryInput'

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

    // ── Subcategory ────────────────────────────────────────────
    defineField({
      name: 'subcategory',
      title: 'Subcategory',
      type: 'string',
      description: 'Category select karne ke baad yahan options aayenge.',
      components: {
        input: SubcategoryInput,
      },
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // ── Pricing (product-level fallback) ───────────────────────
    defineField({
      name: 'price',
      title: 'Price (Rs.) — Fallback',
      description: 'Used when no variants are defined.',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),

    defineField({
      name: 'originalPrice',
      title: 'Original Price (Rs.) — Fallback',
      description: 'Leave empty if no discount. Used when no variants are defined.',
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
          { title: 'New',             value: 'new'        },
          { title: 'Bestseller',      value: 'bestseller' },
          { title: 'Sale',            value: 'sale'       },
          { title: 'Limited Edition', value: 'limited'    },
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

    // ── Out of Stock Toggle (product-level fallback) ───────────
    defineField({
      name: 'outOfStock',
      title: 'Out of Stock',
      type: 'boolean',
      initialValue: false,
      description: 'Enable this to mark the entire product as unavailable. Per-variant stock is preferred.',
    }),

    // ── Main Image (product-level fallback / card image) ───────
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'galleryImages',
      title: 'Gallery Images (Fallback)',
      description: 'Used when no variants are defined.',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    // ── VARIANTS ───────────────────────────────────────────────
    // Each variant is a complete product configuration for one color.
    // When variants exist, all product detail display is driven from
    // the selected variant rather than the top-level fields.
    defineField({
      name: 'variants',
      title: 'Color Variants',
      description:
        'Add one entry per color option. Each variant has its own images, price, stock, SKU, and description.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'productVariant',
          title: 'Color Variant',

          fields: [
            // ── Color Identity ─────────────────────────────────
            defineField({
              name: 'colorName',
              title: 'Color Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'colorCode',
              title: 'Color Hex Code',
              description: 'e.g. #7E8B5B',
              type: 'string',
              validation: (Rule) =>
                Rule.required().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
                  name: 'hex color',
                  invert: false,
                }),
            }),

            // ── Pricing ────────────────────────────────────────
            defineField({
              name: 'price',
              title: 'Price (Rs.)',
              type: 'number',
              validation: (Rule) => Rule.required().positive(),
            }),

            defineField({
              name: 'originalPrice',
              title: 'Original Price (Rs.)',
              description: 'Leave empty if no discount for this variant.',
              type: 'number',
              validation: (Rule) => Rule.positive(),
            }),

            // ── Inventory ──────────────────────────────────────
            defineField({
              name: 'stock',
              title: 'Stock Quantity',
              type: 'number',
              initialValue: 100,
              validation: (Rule) => Rule.required().min(0).integer(),
            }),

            defineField({
              name: 'sku',
              title: 'SKU',
              description: 'Unique identifier for this color variant.',
              type: 'string',
            }),

            // ── Variant-Specific Details ───────────────────────
            defineField({
              name: 'size',
              title: 'Size',
              description: 'Default or available size for this color.',
              type: 'string',
            }),

            defineField({
              name: 'shortDescription',
              title: 'Short Description',
              description: 'Override the product description for this specific color.',
              type: 'text',
              rows: 2,
            }),

            // ── Ratings ────────────────────────────────────────
            defineField({
              name: 'rating',
              title: 'Rating (0–5)',
              type: 'number',
              initialValue: 4.5,
              validation: (Rule) => Rule.min(0).max(5),
            }),

            defineField({
              name: 'reviews',
              title: 'Reviews Count',
              type: 'number',
              initialValue: 0,
              validation: (Rule) => Rule.min(0).integer(),
            }),

            // ── Images ─────────────────────────────────────────
            // First image is shown as the main image; rest go in thumbnail gallery.
            defineField({
              name: 'images',
              title: 'Variant Images',
              description: 'First image = main display image. Add more for the thumbnail gallery.',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true } }],
              validation: (Rule) =>
                Rule.required().min(1).error('At least one image is required per variant.'),
            }),
          ],

          preview: {
            select: {
              colorName:  'colorName',
              colorCode:  'colorCode',
              price:      'price',
              stock:      'stock',
              media:      'images.0',
            },
            prepare({ colorName, colorCode, price, stock, media }) {
              const oos = stock === 0 ? ' · ⛔ OOS' : ''
              return {
                title:    colorName ?? 'Unnamed Variant',
                subtitle: `${colorCode ?? ''} · Rs.${price ?? 0}${oos}`,
                media,
              }
            },
          },
        },
      ],
    }),

    // ── Legacy Color / Size (kept for backward compat) ─────────
    // These drive the ProductCard color dots when no variants exist.
    // defineField({
    //   name: 'colors',
    //   title: 'Available Colors (Legacy)',
    //   description: 'Used for products without full variant support.',
    //   type: 'array',
    //   of: [
    //     {
    //       type: 'object',
    //       fields: [
    //         { name: 'name', title: 'Color Name', type: 'string' },
    //         { name: 'hex',  title: 'Hex Code',   type: 'string' },
    //       ],
    //       preview: {
    //         select: { title: 'name', subtitle: 'hex' },
    //       },
    //     },
    //   ],
    // }),

    defineField({
      name: 'sizes',
      title: 'Available Sizes (Legacy)',
      description: 'Used for products without full variant support.',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    // ── Inventory (product-level fallback) ─────────────────────
    defineField({
      name: 'stock',
      title: 'Stock Quantity — Fallback',
      description: 'Used when no variants are defined.',
      type: 'number',
      initialValue: 100,
    }),

    defineField({
      name: 'sku',
      title: 'SKU — Fallback',
      description: 'Used when no variants are defined.',
      type: 'string',
    }),

    // ── Reviews (product-level fallback) ──────────────────────
    defineField({
      name: 'rating',
      title: 'Rating (0–5) — Fallback',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
      initialValue: 4.5,
    }),

    defineField({
      name: 'reviewsCount',
      title: 'Reviews Count — Fallback',
      type: 'number',
      initialValue: 0,
    }),

    // ── TAB 1 : Details & Story ────────────────────────────────
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

    // ── TAB 2 : Materials ─────────────────────────────────────
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

    // ── TAB 3 : Care Instructions ─────────────────────────────
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      description: 'One instruction per item.',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // ── CURATED SECTION : You May Also Like ───────────────────
    defineField({
      name: 'alsoLike',
      title: 'You May Also Like',
      description:
        'Manually pick up to 8 products to show in the "You May Also Like" section on this product page.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
          options: {
            filter: ({ document }: { document: { _id?: string } }) => ({
              filter: '_id != $self',
              params: { self: document._id },
            }),
          },
        },
      ],
      validation: (Rule) => Rule.max(8).unique(),
    }),

    // Legacy
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
      title:       'productName',
      media:       'mainImage',
      price:       'price',
      category:    'category.title',
      subcategory: 'subcategory',
      outOfStock:  'outOfStock',
      variants:    'variants',
    },
    prepare({ title, media, price, category, subcategory, outOfStock, variants }) {
      const sub = subcategory ? ` › ${subcategory}` : ''
      const oos = outOfStock ? ' · ⛔ Out of Stock' : ''
      const variantCount = Array.isArray(variants) && variants.length > 0
        ? ` · ${variants.length} variant${variants.length > 1 ? 's' : ''}`
        : ''
      return {
        title,
        subtitle: `${category ? category + sub + ' · ' : ''}₹${price}${variantCount}${oos}`,
        media,
      }
    },
  },
})
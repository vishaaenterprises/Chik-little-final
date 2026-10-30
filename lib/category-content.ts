// Answer-first, crawlable copy for category pages (SEO + AEO + GEO).
//
// Category descriptions in Sanity are one short line, which gives search and
// AI answer engines almost nothing to quote. This adds, per category:
//   - metaTitle / metaDescription (what Google and AI answers show)
//   - a direct 2-3 sentence intro (visible on the page)
//   - Q&As that mirror how people actually search ("kids bathrobe online
//     India", "Diwali gift for kids", "return gifts for birthday"...)
//
// Only facts that are true for the whole store are used (delivery, returns,
// hand block print, cotton, gift wrap, bulk orders) — no certification or
// volume claims. Edit freely, or move into Sanity later.

export interface CategoryContent {
  /** Full <title>. Keep under ~60 characters. */
  metaTitle: string
  /** Search / AI snippet. Keep 120-160 characters. */
  metaDescription: string
  /** Direct answer: what is this category, who is it for. 40-70 words. */
  intro: string
  faqs: { q: string; a: string }[]
}

const SHIPPING_A =
  'Little Chiku delivers across India. Standard delivery takes 5-7 business days; shipping is free on orders above Rs. 1,499 and a flat Rs. 99 applies below that.'
const RETURNS_A =
  'Unused, unwashed items in original packaging can be returned within 7 days of delivery. Damaged or defective products should be reported within 48 hours of delivery. See the Terms & Conditions page for full details.'
const BULK_A =
  'Yes. Customised bulk orders are available from 20 pieces, including custom packaging. Message Little Chiku on WhatsApp at +91 77280 09522.'

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  'bath-linen': {
    metaTitle: 'Kids Bath Towels, Bathrobes & Hand Towels | Little Chiku',
    metaDescription:
      'Buy kids bath towels, bathrobes, hand towels, face towels and towel gift sets in soft hand block print cotton. Pan-India delivery from Little Chiku.',
    intro:
      "Little Chiku's bath linen covers the whole kids' bathroom: bath towels, hand towels, face towels, towel gift sets, hooded bath ponchos and kids bathrobes. They are made in soft cotton waffle weave with hand block prints — animals, fruits, rockets, florals — and are light, absorbent and quick to dry for babies, toddlers and school-age kids.",
    faqs: [
      {
        q: 'What bathroom products does Little Chiku have for kids?',
        a: 'Kids bath towels, hand towels, face towels, towel sets (bath towel with hand towels), hooded bath ponchos and bathrobes with belts and pockets.',
      },
      {
        q: 'Are there towel gift sets?',
        a: 'Yes. Hand block print towel gift sets of 2 and 3 pieces are available and work well as birthday, baby shower or festive gifts.',
      },
      { q: 'Do you deliver kids towels and bathrobes across India?', a: SHIPPING_A },
      { q: 'What is the return policy?', a: RETURNS_A },
    ],
  },
  bedding: {
    metaTitle: 'Kids Bedding: Bedsheet Sets, Quilts & Dohars | Little Chiku',
    metaDescription:
      'Shop hand block print cotton bedsheet sets with pillow covers, reversible baby quilts, dohars and kids comforters. Delivered across India.',
    intro:
      'Browse hand block print percale cotton bedsheet sets with pillow covers, plus quilts, dohars and comforters handcrafted by Little Chiku. The bedding is made from cotton for a breathable feel and comes in floral and printed designs for kids rooms and nurseries.',
    faqs: [
      {
        q: 'What bedding does Little Chiku sell?',
        a: 'Percale cotton bedsheet sets with pillow covers, reversible baby quilts, dohars and kids comforters in hand block prints.',
      },
      { q: 'Do you deliver bedding across India?', a: SHIPPING_A },
      { q: 'Can I return bedding?', a: RETURNS_A },
    ],
  },
  bags: {
    metaTitle: 'Kids Backpacks, Tote Bags & Pouch Sets | Little Chiku',
    metaDescription:
      'Quilted cotton kids backpacks, sling bags, tote bags, duffle bags and pouch sets in cute prints. Order online with pan-India delivery.',
    intro:
      "Little Chiku's bags are quilted cotton pieces with printed designs: kids backpacks for school and daycare, sling and crossbody bags, tote bags, travel duffles and pouch sets. They are made for everyday use and are easy to wash.",
    faqs: [
      {
        q: 'What kinds of bags are available?',
        a: 'Quilted kids backpacks, sling and crossbody bags, tote bags, pouch sets and travel duffle bags.',
      },
      { q: 'How long does delivery take?', a: SHIPPING_A },
      { q: 'What if a bag arrives damaged?', a: RETURNS_A },
    ],
  },
  'kids-accessories': {
    metaTitle: 'Kids Aprons & Play Mats | Little Chiku',
    metaDescription:
      'Cotton cooking, baking and painting aprons with pockets and anti-slip play mats for kids. Order online from Little Chiku, delivered across India.',
    intro:
      'Kids accessories from Little Chiku include cotton cooking, baking and painting aprons with pockets, and waterproof anti-slip play mats for crawling and playtime. They suit school activities, craft time and playroom floors.',
    faqs: [
      {
        q: 'What accessories are available for children?',
        a: 'Adjustable cotton aprons with pockets for cooking, baking and painting, and anti-slip play mats in forest-animal prints.',
      },
      { q: 'Do you ship kids accessories pan-India?', a: SHIPPING_A },
      { q: 'What is the return policy?', a: RETURNS_A },
    ],
  },
  clothing: {
    metaTitle: 'Kids Cotton Clothing: Night Suits, Frocks & Shorts | Little Chiku',
    metaDescription:
      'Soft cotton kids clothing: unisex night suits, baby girl frocks, shorts sets, co-ord sets and batik shirts. Shop online with delivery across India.',
    intro:
      'Little Chiku kids clothing is made from soft cotton: unisex night suits, printed shorts sets, floral frocks for baby girls, co-ord sets and batik-print casual shirts for boys. Pieces are made for everyday comfort and easy washing.',
    faqs: [
      {
        q: 'What clothing does Little Chiku offer?',
        a: 'Cotton night suits, shorts combo sets, baby girl frocks, printed co-ord sets and batik casual shirts for kids.',
      },
      { q: 'How long does delivery take?', a: SHIPPING_A },
      { q: 'Can clothing be returned?', a: RETURNS_A },
    ],
  },
  'moms-corner': {
    metaTitle: "Mom's Corner: Bags, Pouches & Everyday Essentials | Little Chiku",
    metaDescription:
      "Printed shoulder bags, tote bags, pouch and cosmetic combos made for mothers. Giftable everyday essentials from Little Chiku, delivered across India.",
    intro:
      "Mom's Corner is Little Chiku's range made for mothers: printed shoulder bags, tote bags, and pouch and cosmetic combos in gingham, stripe, floral and candy-colour designs. It is meant to be a practical, giftable companion to the baby and kids range.",
    faqs: [
      {
        q: "What is in Mom's Corner?",
        a: 'Printed shoulder bags, tote bags, pouch and cosmetic-pouch combos and other everyday essentials designed for mothers.',
      },
      { q: 'Can these be gifted?', a: 'Yes. Gift wrapping with a handwritten note card can be selected at checkout, and bulk or customised orders are available from 20 pieces.' },
      { q: 'Do you deliver across India?', a: SHIPPING_A },
      { q: 'What is the return policy?', a: RETURNS_A },
    ],
  },
  'return-gifts': {
    metaTitle: 'Return Gifts & Diwali Gift Sets for Kids | Little Chiku',
    metaDescription:
      'Handcrafted gift sets and hampers for Diwali, birthdays, baby showers and naming ceremonies. Towel gift sets, bags and more. Bulk orders from 20 pieces.',
    intro:
      'Little Chiku return gifts and gift sets suit Diwali, birthdays, baby showers and naming ceremonies. The range includes hand block print towel gift sets, gift-edition play mats and aprons, and other handcrafted hampers. Bulk and customised orders (minimum 20 pieces) can be arranged by contacting the team.',
    faqs: [
      {
        q: 'Do you have Diwali gifts?',
        a: 'Yes. Hand block print towel gift sets and other handcrafted gift sets and hampers work well as Diwali gifts for kids, families and relatives. For bulk or festive orders, message the team on WhatsApp at +91 77280 09522 well before the festival.',
      },
      { q: 'Can I order return gifts in bulk?', a: BULK_A },
      {
        q: 'Do you offer gift wrapping?',
        a: 'Yes. Eco-friendly gift wrapping with a handwritten note card can be selected at checkout for a small additional fee.',
      },
      { q: 'How long does delivery take?', a: SHIPPING_A },
    ],
  },
  all: {
    metaTitle: "All Products: Kids Towels, Bathrobes, Gift Sets & Bags | Little Chiku",
    metaDescription:
      "Shop all Little Chiku products: kids bath towels, bathrobes, hand towels, bedding, bags, clothing, Mom's Corner and Diwali & return gift sets. Ships across India.",
    intro:
      "Shop all Little Chiku products in one place: kids bath towels, hand towels, face towels and bathrobes, bedding, bags, kids accessories, clothing, Mom's Corner bags and pouches, and gift sets for Diwali and return gifts. Use the filters to narrow by category and type. Everything ships across India from Jaipur.",
    faqs: [
      { q: 'Where does Little Chiku ship?', a: SHIPPING_A },
      { q: 'What is the return policy?', a: RETURNS_A },
    ],
  },
}

export function getCategoryContent(slug: string): CategoryContent | null {
  return CATEGORY_CONTENT[slug] ?? null
}

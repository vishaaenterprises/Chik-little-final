// Answer-first, crawlable copy for category pages (SEO + AEO + GEO).
//
// Category descriptions in Sanity are one short line, which gives search and
// AI answer engines almost nothing to quote. This adds a direct 2-3 sentence
// answer plus a few Q&As per category. Only facts that are true for the whole
// store are used (delivery, returns, hand block print, cotton) — no
// certification or volume claims. Edit freely, or move into Sanity later.

export interface CategoryContent {
  /** Direct answer: what is this category, who is it for. 40-70 words. */
  intro: string
  faqs: { q: string; a: string }[]
}

const SHIPPING_A =
  'Little Chiku delivers across India. Standard delivery takes 5-7 business days; shipping is free on orders above Rs. 1,499 and a flat Rs. 99 applies below that.'
const RETURNS_A =
  'Unused, unwashed items in original packaging can be returned within 7 days of delivery. Damaged or defective products should be reported within 48 hours of delivery. See the Terms & Conditions page for full details.'

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  'bath-linen': {
    intro:
      "Little Chiku's bath linen range has soft waffle-weave cotton towels, towel gift sets, hand towels, hooded bath ponchos and kids bathrobes in hand block prints such as animals, fruits, rockets and florals. The cotton waffle weave is lightweight, absorbent and quick to dry, which makes it practical for babies, toddlers and school-age kids.",
    faqs: [
      {
        q: 'Which bath linen is available for kids?',
        a: 'Kids bath towels, towel sets with hand towels, hooded bath ponchos and quilted or waffle-cotton bathrobes with belts and pockets.',
      },
      { q: 'Do you deliver bath linen across India?', a: SHIPPING_A },
      { q: 'What is the return policy?', a: RETURNS_A },
    ],
  },
  bedding: {
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
    intro:
      "Little Chiku's bags are quilted cotton pieces with printed designs: kids backpacks for school and daycare, pouch sets, tote bags and travel duffles. They are made for everyday use and are easy to wash.",
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
    intro:
      "Mom's Corner is Little Chiku's range made for mothers: printed pouch and cosmetic combos and everyday carry essentials in gingham, stripe and candy-colour designs. It is meant to be a practical, giftable companion to the baby and kids range.",
    faqs: [
      {
        q: "What is in Mom's Corner?",
        a: 'Printed pouch and cosmetic-pouch combos and other everyday essentials designed for mothers.',
      },
      { q: 'Do you deliver across India?', a: SHIPPING_A },
      { q: 'What is the return policy?', a: RETURNS_A },
    ],
  },
  'return-gifts': {
    intro:
      'Little Chiku return gifts and gift sets suit birthdays, baby showers and naming ceremonies. The range includes hand block print towel gift sets, gift-edition play mats and aprons and other handcrafted hampers, and bulk or customised orders (minimum 20 pieces) can be arranged by contacting the team.',
    faqs: [
      {
        q: 'Can I order return gifts in bulk?',
        a: 'Yes. Customised bulk orders are available from 20 pieces, including custom packaging. Contact Little Chiku on WhatsApp at +91 77280 09522.',
      },
      { q: 'Do you offer gift wrapping?', a: 'Yes. Eco-friendly gift wrapping with a handwritten note card can be selected at checkout for a small additional fee.' },
      { q: 'How long does delivery take?', a: SHIPPING_A },
    ],
  },
  all: {
    intro:
      'Shop all Little Chiku products in one place: handcrafted cotton bath linen, bedding, bags, kids accessories, clothing, Mom\'s Corner essentials and return gifts. Use the filters to narrow by category and type. Everything ships across India from Jaipur.',
    faqs: [
      { q: 'Where does Little Chiku ship?', a: SHIPPING_A },
      { q: 'What is the return policy?', a: RETURNS_A },
    ],
  },
}

export function getCategoryContent(slug: string): CategoryContent | null {
  return CATEGORY_CONTENT[slug] ?? null
}

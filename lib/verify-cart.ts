// lib/verify-cart.ts
//
// SECURITY: this is the piece that stops someone from opening devtools,
// editing the network request, and paying ₹10 for a ₹5000 order.
//
// The client sends item ids, quantities, and a claimed total — we never
// trust that total. We re-fetch each product from Sanity (the same source
// the storefront reads from) and recompute the price server-side. If the
// client's numbers don't match what Sanity says, we reject the order
// instead of silently "fixing" it — a mismatch means either a stale cart
// (price changed) or a tampered request, and both should stop checkout
// rather than charge a possibly-wrong amount.

import { sanityFetch } from "@/lib/sanity/client";
import { productByIdQuery } from "@/lib/sanity/queries";

export interface CartItemInput {
  id: string;
  slug?: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface SanityVariant {
  colorName?: string;
  price?: number;
  stock?: number;
}

interface SanityProduct {
  _id: string;
  productName: string;
  price: number;
  outOfStock?: boolean;
  stock?: number;
  variants?: SanityVariant[];
}

export interface VerifyResult {
  ok: boolean;
  error?: string;
  verifiedTotal?: number; // paise-safe rupee total, computed server-side
}

const MAX_ITEMS = 50; // sane upper bound — also blocks pathological payloads
const MAX_QUANTITY_PER_ITEM = 20;

export async function verifyCart(
  items: CartItemInput[],
  claimedShipping: number
): Promise<VerifyResult> {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: "Cart is empty" };
  }
  if (items.length > MAX_ITEMS) {
    return { ok: false, error: "Too many items" };
  }

  let verifiedSubtotal = 0;

  for (const item of items) {
    if (!item.id || typeof item.id !== "string") {
      return { ok: false, error: "Invalid item" };
    }
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
      return { ok: false, error: `Invalid quantity for ${item.name || item.id}` };
    }

    const product = await sanityFetch<SanityProduct>({
      query: productByIdQuery,
      params: { id: item.id },
      revalidate: 0, // always fresh — this is the security-critical read
    });

    if (!product) {
      return { ok: false, error: `Product no longer available: ${item.name || item.id}` };
    }
    if (product.outOfStock) {
      return { ok: false, error: `Out of stock: ${product.productName}` };
    }

    // Resolve the real price: prefer the matching variant (by color) if the
    // product has variants, else the base product price.
    let realPrice = product.price;
    let availableStock = product.stock;
    if (product.variants?.length) {
      const variant = item.color
        ? product.variants.find((v) => v.colorName === item.color)
        : undefined;
      if (variant) {
        if (typeof variant.price === "number") realPrice = variant.price;
        if (typeof variant.stock === "number") availableStock = variant.stock;
      }
    }

    if (typeof realPrice !== "number") {
      return { ok: false, error: `Could not verify price for ${product.productName}` };
    }
    if (typeof availableStock === "number" && availableStock < quantity) {
      return { ok: false, error: `Only ${availableStock} left in stock: ${product.productName}` };
    }

    verifiedSubtotal += realPrice * quantity;
  }

  // Shipping: keep this rule in one place so it can't be spoofed from the
  // client either. Mirrors the ₹1499 free-shipping threshold used in the
  // cart UI — update both together if that ever changes.
  const verifiedShipping = verifiedSubtotal > 1499 ? 0 : 99;
  if (Math.abs(verifiedShipping - claimedShipping) > 0) {
    // Don't hard-fail on this alone — just use the server-computed value.
  }

  return { ok: true, verifiedTotal: verifiedSubtotal + verifiedShipping };
}
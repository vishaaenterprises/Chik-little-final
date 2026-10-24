import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

// Always generate at request time (never at build time) so a missing env var
// or a Sanity hiccup can't crash the Vercel build.
export const dynamic = "force-dynamic";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "at4opa5a",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Published products only (drafts excluded).
const FEED_QUERY = `*[_type == "product" && !(_id in path("drafts.**"))]{
  _id,
  productName,
  slug,
  shortDescription,
  price,
  outOfStock,
  sku,
  "categoryTitle": category->title,
  "mainImageUrl": mainImage.asset->url,
  variants[]{
    colorName,
    sku,
    price,
    stock,
    "imageUrl": images[0].asset->url
  }
}`;

const BASE_URL = "https://littlechiku.com";
const BRAND = "Little Chiku";

const HEADER = [
  "id",
  "title",
  "description",
  "link",
  "image_link",
  "price",
  "availability",
  "condition",
  "brand",
  "product_type",
  "item_group_id",
  "color",
  "identifier_exists",
];

// Tabs / newlines inside a value would break the TSV columns.
const clean = (value: unknown): string =>
  String(value ?? "")
    .replace(/[\t\r\n]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

const slugify = (value: unknown): string =>
  clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const formatPrice = (value: unknown): string | null => {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return `${n.toFixed(2)} INR`;
};

export async function GET() {
  try {
    const products = await client.fetch(FEED_QUERY);

    const rows: string[] = [];
    const usedIds = new Set<string>();
    const seenSignatures = new Set<string>();

    // Merchant Center ids must be unique and at most 50 characters.
    const makeUniqueId = (base: string, suffix: string): string => {
      const root = base.slice(0, 50 - suffix.length - 1);
      let id = `${root}-${suffix}`;
      let n = 2;
      while (usedIds.has(id)) {
        const tail = `${suffix}-${n++}`;
        id = `${base.slice(0, 50 - tail.length - 1)}-${tail}`;
      }
      usedIds.add(id);
      return id;
    };

    for (const p of products) {
      const slug = p.slug?.current;
      if (!slug || !p.productName) continue;

      const productKey = String(p._id).replace(/^drafts\./, "");
      const shortKey = productKey.slice(-6);
      const itemGroupId = productKey.slice(0, 50);
      const description = (
        clean(p.shortDescription) || clean(p.productName)
      ).slice(0, 5000);
      const link = `${BASE_URL}/product/${slug}`;
      const productType = clean(p.categoryTitle) || "Baby & Toddler";
      const variants = Array.isArray(p.variants)
        ? p.variants.filter(Boolean)
        : [];

      if (variants.length > 0) {
        for (const v of variants) {
          const price = formatPrice(v.price ?? p.price);
          const image = v.imageUrl || p.mainImageUrl || "";
          if (!price || !image) continue; // Merchant Center rejects these anyway

          const color = clean(v.colorName);
          const title = clean(
            color ? `${p.productName} - ${color}` : p.productName,
          ).slice(0, 150);
          const available = Number(v.stock) > 0 && !p.outOfStock;
          const availability = available ? "in stock" : "out of stock";

          // Skip exact duplicate variant entries inside the same product.
          const signature = [
            productKey,
            color,
            image,
            price,
            availability,
          ].join("|");
          if (seenSignatures.has(signature)) continue;
          seenSignatures.add(signature);

          const base =
            clean(v.sku) ||
            `${slugify(p.productName).slice(0, 20)}-${slugify(color)}`;
          const id = makeUniqueId(base, shortKey);

          rows.push(
            [
              id,
              title,
              description,
              link,
              image,
              price,
              availability,
              "new",
              BRAND,
              productType,
              itemGroupId,
              color,
              "no",
            ].join("\t"),
          );
        }
      } else {
        const price = formatPrice(p.price);
        const image = p.mainImageUrl || "";
        if (!price || !image) continue;

        const base = clean(p.sku) || slugify(p.productName).slice(0, 30);
        const id = makeUniqueId(base, shortKey);

        rows.push(
          [
            id,
            clean(p.productName).slice(0, 150),
            description,
            link,
            image,
            price,
            p.outOfStock ? "out of stock" : "in stock",
            "new",
            BRAND,
            productType,
            itemGroupId,
            "",
            "no",
          ].join("\t"),
        );
      }
    }

    const tsv = [HEADER.join("\t"), ...rows].join("\n");

    return new NextResponse(tsv, {
      status: 200,
      headers: {
        "Content-Type": "text/tab-separated-values; charset=utf-8",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    console.error("Google Feed Error:", err);
    return new NextResponse("Feed generation failed", { status: 500 });
  }
}

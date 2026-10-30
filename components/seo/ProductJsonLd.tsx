// Fall back to the production origin: with an empty SITE_URL the offer `url`
// became a relative "/product/..." which is invalid in Product structured data.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://littlechiku.com"
).replace(/\/$/, "");

// Must match what the cart actually charges (app/cart/page.tsx):
// free shipping above ₹1,499, flat ₹99 otherwise.
const FREE_SHIPPING_ABOVE = 1499;
const FLAT_SHIPPING_FEE = 99;

// Must match the Returns & Refunds section of /term-condition.
const RETURN_WINDOW_DAYS = 7;

export interface ProductJsonLdProps {
  name: string;
  description?: string;
  images: string[];
  sku?: string;
  mpn?: string;
  price: number;
  originalPrice?: number;
  availability: "InStock" | "OutOfStock" | "PreOrder" | "BackOrder";
  rating?: number;
  reviewCount?: number;
  slug: string;
  category?: string;
}

function compact<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export default function ProductJsonLd({
  name,
  description,
  images,
  sku,
  mpn,
  price,
  originalPrice,
  availability,
  rating,
  reviewCount,
  slug,
  category,
}: ProductJsonLdProps) {
  const productUrl = `${SITE_URL}/product/${slug}`;

  const absoluteImages = images.filter(
    (url) => typeof url === "string" && /^https?:\/\//i.test(url)
  );

  const hasStrikethrough = originalPrice !== undefined && originalPrice > price;

  const priceValidUntil = hasStrikethrough
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    : undefined;

  const hasValidRating =
    typeof rating === "number" &&
    typeof reviewCount === "number" &&
    reviewCount > 0;

  const schema = compact({
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description || undefined,
    image: absoluteImages.length > 0 ? absoluteImages : undefined,
    category: category || undefined,
    sku: sku || undefined,
    mpn: mpn || undefined,
    brand: {
      "@type": "Brand",
      name: "Little Chiku",
    },
    ...(hasValidRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating,
        reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price,
      priceValidUntil,
      availability: `https://schema.org/${availability}`,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Little Chiku",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: price > FREE_SHIPPING_ABOVE ? 0 : FLAT_SHIPPING_FEE,
          currency: "INR",
        },
        shippingDestination: [
          {
            "@type": "DefinedRegion",
            addressCountry: "IN",
          },
        ],
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
          cutoffTime: "17:00:00+05:30",
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: RETURN_WINDOW_DAYS,
        returnMethod: "https://schema.org/ReturnByMail",
        // /term-condition: return shipping is paid by the customer unless the
        // product is defective — so this is NOT a free-return policy.
        returnFees: "https://schema.org/ReturnShippingFees",
      },
    },
  });

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
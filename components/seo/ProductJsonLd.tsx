const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

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
}: ProductJsonLdProps) {
  const productUrl = `${SITE_URL}/products/${slug}`;

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
    sku: sku || undefined,
    mpn: mpn || undefined,
    brand: {
      "@type": "Brand",
      name: "LittleChiku",
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
        name: "LittleChiku",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
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
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
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
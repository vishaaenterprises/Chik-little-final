declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const GOOGLE_ADS_ID = "AW-18508267296";
export const PURCHASE_LABEL = "pF5UCL-WkZodEKD-tvlE";

type ConversionArgs = {
  value?: number;
  currency?: string;
  transactionId?: string;
};

/**
 * Fires the Google Ads Purchase conversion.
 * Called from the cart's checkout flow the moment an order is placed
 * (WhatsApp order flow) — that's the real purchase-intent moment here,
 * since there's no on-site payment confirmation page.
 */
export function fireGoogleAdsPurchase({
  value = 0,
  currency = "INR",
  transactionId,
}: ConversionArgs = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${PURCHASE_LABEL}`,
    value,
    currency,
    transaction_id: transactionId ?? `order-${Date.now()}`,
  });
}
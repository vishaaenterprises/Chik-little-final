// lib/gtag.ts

// Google Ads conversion: "Purchase" (account AW-18508267296)
const GOOGLE_ADS_SEND_TO = 'AW-18508267296/pF5UCL-WkZodEKD-tvlE'

type GtagFn = (...args: unknown[]) => void

type PurchaseParams = {
  value?: number
  currency?: string
  transactionId?: string
}

/**
 * Fires the Google Ads "Purchase" conversion.
 * - WhatsApp order flow: called from the cart page when the customer
 *   taps the WhatsApp order button.
 * - Online payment flow: called from /payment/status after PhonePe confirms.
 * transactionId lets Google de-duplicate repeat fires for the same order.
 */
export function fireGoogleAdsPurchase({
  value,
  currency = 'INR',
  transactionId,
}: PurchaseParams = {}) {
  if (typeof window === 'undefined') return

  const gtag = (window as unknown as { gtag?: GtagFn }).gtag
  if (typeof gtag !== 'function') return

  try {
    gtag('event', 'conversion', {
      send_to: GOOGLE_ADS_SEND_TO,
      value: value && value > 0 ? value : 1,
      currency,
      transaction_id:
        transactionId ??
        `wa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    })
  } catch {
    // Tracking must never block the order flow
  }
}

// Optional alias, in case any file uses the old helper name
export const trackWhatsAppOrder = (value?: number, orderId?: string) =>
  fireGoogleAdsPurchase({ value, transactionId: orderId })